import assert from "node:assert/strict";
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
import { consumerHtml, consumerSource, ecosystemCases } from "./ecosystem-fixtures.mjs";

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
  if (process.platform !== "win32") {
    return run("npm", args, cwd);
  }
  const fromRunner = process.env.npm_execpath;
  const cli =
    fromRunner && basename(fromRunner).toLowerCase() === "npm-cli.js" && existsSync(fromRunner)
      ? fromRunner
      : join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  assert.ok(existsSync(cli), "npm CLI not found: " + cli);
  return run(process.execPath, [cli, ...args], cwd);
}

function generatedCss(outputDirectory) {
  const assetDir = join(outputDirectory, "dist", "assets");
  assert.ok(existsSync(join(outputDirectory, "dist", "index.html")));
  assert.ok(existsSync(assetDir), "Missing Vite+ output assets directory");
  const cssFiles = readdirSync(assetDir).filter((file) => file.endsWith(".css"));
  return cssFiles.map((file) => readFileSync(join(assetDir, file), "utf8")).join("\n");
}

function main() {
  const args = process.argv.slice(2);
  const caseNames = args.filter((arg) => !arg.startsWith("--"));
  const keep = args.includes("--keep");
  if (
    caseNames.length !== 1 ||
    !Object.hasOwn(ecosystemCases, caseNames[0]) ||
    args.some((arg) => arg.startsWith("--") && arg !== "--keep")
  ) {
    throw new Error("Usage: npm run test:ecosystem -- <vue-element|react-antd> [--keep]");
  }

  const caseName = caseNames[0];
  const config = ecosystemCases[caseName];
  const cssFile = join(projectRoot, "dist", "normalize.css");
  assert.ok(existsSync(cssFile), "Run 'vp pack' before test:ecosystem");
  const packedCss = readFileSync(cssFile, "utf8");
  assert.match(packedCss, /\bb\s*,\s*strong\s*\{\s*font-weight:\s*bolder\s*;?\s*\}/);

  const viteCli = fileURLToPath(import.meta.resolve("vite-plus/bin"));
  assert.ok(existsSync(viteCli), "Pinned vite-plus@1.4.0 is not installed");
  const scratch = join(projectRoot, "node_modules", ".cache");
  mkdirSync(scratch, { recursive: true });
  const temp = mkdtempSync(join(scratch, "adui-ecosystem-"));

  try {
    const pack = JSON.parse(
      npm(
        ["pack", ".", "--json", "--offline", "--ignore-scripts", "--pack-destination", temp],
        projectRoot,
      ),
    );
    assert.equal(pack.length, 1);
    const tarball = join(temp, pack[0].filename);
    assert.ok(existsSync(tarball));

    writeFileSync(
      join(temp, "package.json"),
      JSON.stringify({ name: "adui-ecosystem-consumer", private: true, type: "module" }) + "\n",
    );
    console.info(
      "Installing isolated " + config.title + " dependencies (npm network/cache may be needed)",
    );
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
        ...config.dependencies,
      ],
      temp,
    );

    const fromConsumer = createRequire(pathToFileURL(join(temp, "check.cjs")));
    const resolvedCss = fromConsumer.resolve("@adui/normalize.css");
    assert.equal(readFileSync(resolvedCss, "utf8"), packedCss);
    for (const [name, version] of Object.entries(config.packages)) {
      const installed = JSON.parse(
        readFileSync(join(temp, "node_modules", name, "package.json"), "utf8"),
      );
      assert.equal(installed.version, version, name + " version mismatch");
    }

    const native = consumerSource(caseName, false);
    const withPackage = consumerSource(caseName, true);
    assert.equal(withPackage.replace('import "@adui/normalize.css";\n', ""), native);

    const output = {};
    for (const [mode, entry] of [
      ["native", native],
      ["package", withPackage],
    ]) {
      const directory = join(temp, mode);
      mkdirSync(directory);
      writeFileSync(join(directory, "package.json"), '{"private":true,"type":"module"}\n');
      writeFileSync(join(directory, "index.html"), consumerHtml());
      writeFileSync(join(directory, "entry.js"), entry);
      writeFileSync(
        join(directory, "vite.config.mjs"),
        [
          'import { defineConfig } from "vite-plus";',
          'export default defineConfig({ build: { outDir: "dist", copyPublicDir: false } });',
          "",
        ].join("\n"),
      );
      const log = run(process.execPath, [viteCli, "build"], directory, 120_000);
      const css = generatedCss(directory);
      if (mode === "package") {
        assert.match(
          css,
          /\bb\s*,\s*strong\s*\{\s*font-weight:\s*bolder\s*;?\s*\}/,
          "The real Normalize CSS was dropped from the production bundle",
        );
      }
      output[mode] = { directory, cssBytes: Buffer.byteLength(css) };
      console.info(mode + " production build passed (" + output[mode].cssBytes + " CSS bytes)");
      if (process.env.ADUI_DEBUG_ECOSYSTEM === "1") console.info(log);
    }

    console.info("PASS: " + config.title + " + real @adui/normalize.css tarball");
    console.info("This checks production packaging, NOT visual or keyboard compatibility.");
    if (keep) {
      console.info("Kept isolated consumer: " + temp);
      console.info("Inspect 'native' and 'package' with 'vp dev' in separate terminals.");
      console.info("Remove this ignored directory manually after browser comparison.");
    }
  } finally {
    if (!keep) rmSync(temp, { recursive: true, force: true });
  }
}

main();
