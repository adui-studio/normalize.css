import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  resetCases,
  resetCss,
  resetHtml,
  resetModes,
  resetProbe,
  resetViteConfig,
} from "./reset-fixtures.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args, cwd, timeout = 240_000) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    timeout,
    env: {
      ...process.env,
      npm_config_audit: "false",
      npm_config_fund: "false",
      npm_config_update_notifier: "false",
    },
  });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(
    result.status,
    0,
    [command, ...args].join(" ") + " failed:\n" + (result.stderr || result.stdout),
  );
  return result.stdout;
}

function npm(args, cwd) {
  if (process.platform !== "win32") return run("npm", args, cwd);
  const fromRunner = process.env.npm_execpath;
  const cli =
    fromRunner && basename(fromRunner).toLowerCase() === "npm-cli.js" && existsSync(fromRunner)
      ? fromRunner
      : join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  assert.ok(existsSync(cli), "npm CLI not found: " + cli);
  return run(process.execPath, [cli, ...args], cwd);
}

function generatedCss(directory) {
  const assets = join(directory, "dist", "assets");
  assert.ok(existsSync(join(directory, "dist", "index.html")), "Missing built index.html");
  assert.ok(existsSync(assets), "Missing built assets");
  const cssFiles = readdirSync(assets).filter((name) => name.endsWith(".css"));
  assert.ok(cssFiles.length > 0, "CSS was not emitted by Vite+");
  const css = cssFiles.map((name) => readFileSync(join(assets, name), "utf8")).join("\n");
  assert.match(css, /box-sizing\s*:\s*border-box/, "Reset CSS missing from production output");
  return css;
}

function main() {
  const args = process.argv.slice(2);
  const caseNames = args.filter((arg) => !arg.startsWith("--"));
  const keep = args.includes("--keep");
  if (
    caseNames.length !== 1 ||
    !Object.hasOwn(resetCases, caseNames[0]) ||
    args.some((arg) => arg.startsWith("--") && arg !== "--keep")
  ) {
    throw new Error(
      "Usage: node tests/reset-consumer.mjs <tailwind-preflight|unocss-tailwind-v4|unocss-tailwind-compat> [--keep]",
    );
  }

  const caseName = caseNames[0];
  const spec = resetCases[caseName];
  const packedCssPath = join(projectRoot, "dist", "normalize.css");
  assert.ok(existsSync(packedCssPath), "Run 'vp pack' before the Reset comparison");
  const packedCss = readFileSync(packedCssPath, "utf8");
  assert.match(packedCss, /\bb\s*,\s*strong\s*\{\s*font-weight:\s*bolder\s*;?\s*\}/);

  const viteCli = fileURLToPath(import.meta.resolve("vite-plus/bin"));
  assert.ok(existsSync(viteCli), "Pinned vite-plus@1.4.0 is not installed");
  const cache = join(projectRoot, "node_modules", ".cache");
  mkdirSync(cache, { recursive: true });
  const temp = mkdtempSync(join(cache, "adui-reset-"));

  try {
    const pack = JSON.parse(
      npm(
        ["pack", ".", "--json", "--offline", "--ignore-scripts", "--pack-destination", temp],
        projectRoot,
      ),
    );
    assert.equal(pack.length, 1);
    const tarball = join(temp, pack[0].filename);
    assert.ok(existsSync(tarball), "Expected real Normalize tarball");
    writeFileSync(
      join(temp, "package.json"),
      JSON.stringify({ name: "adui-reset-consumer", private: true, type: "module" }) + "\n",
    );

    console.info("Installing isolated " + spec.title + " (npm network/cache may be needed)");
    npm(
      [
        "install",
        "--ignore-scripts",
        "--no-save",
        "--package-lock=false",
        "--no-audit",
        "--no-fund",
        "--prefer-offline",
        tarball,
        ...Object.entries(spec.packages).map(([name, version]) => name + "@" + version),
      ],
      temp,
    );

    const resolver = createRequire(pathToFileURL(join(temp, "check.cjs")));
    const resolvedCss = resolver.resolve("@adui/normalize.css");
    assert.equal(readFileSync(resolvedCss, "utf8"), packedCss, "Tarball CSS changed");
    for (const [name, version] of Object.entries(spec.packages)) {
      const installed = JSON.parse(
        readFileSync(join(temp, "node_modules", name, "package.json"), "utf8"),
      );
      assert.equal(installed.version, version, name + " version mismatch");
    }

    const report = { caseName, packages: spec.packages, modes: {} };
    for (const mode of resetModes) {
      const directory = join(temp, mode);
      mkdirSync(directory);
      writeFileSync(join(directory, "package.json"), '{"private":true,"type":"module"}\n');
      writeFileSync(join(directory, "index.html"), resetHtml());
      writeFileSync(join(directory, "style.css"), resetCss(caseName, mode));
      writeFileSync(join(directory, "probe.js"), resetProbe());
      writeFileSync(join(directory, "entry.js"), 'import "./style.css";\nimport "./probe.js";\n');
      writeFileSync(join(directory, "vite.config.mjs"), resetViteConfig(caseName));

      run(process.execPath, [viteCli, "build"], directory, 120_000);
      const css = generatedCss(directory);
      report.modes[mode] = {
        cssBytes: Buffer.byteLength(css),
        cssSha256: createHash("sha256").update(css).digest("hex"),
        hasLayer: /@layer\b/.test(css),
      };
      if (caseName === "tailwind-preflight") {
        assert.match(css, /@layer\s+base\b/, "Tailwind Preflight layer not found");
      }
      console.info(mode + ": " + JSON.stringify(report.modes[mode]));
    }

    writeFileSync(join(temp, "reset-report.json"), JSON.stringify(report, null, 2) + "\n");
    console.info("PASS: isolated Reset production builds and tarball resolution");
    console.info("Browser visual, interaction and cascade results are NOT verified by this CLI.");
    if (keep) {
      console.info("Kept consumer: " + temp);
      console.info("Run 'vp dev --port <port>' in each mode directory separately.");
      console.info("Compare window.__aduiResetEvidence and the winning CSS declarations.");
    }
  } finally {
    if (!keep) rmSync(temp, { recursive: true, force: true });
  }
}

main();
