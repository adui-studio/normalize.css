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
import { basename, dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args, cwd, cache, timeout = 60_000) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    timeout,
    env: {
      ...process.env,
      npm_config_cache: cache,
      npm_config_audit: "false",
      npm_config_fund: "false",
      npm_config_update_notifier: "false",
    },
  });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

function npm(args, cwd, cache) {
  if (process.platform !== "win32") {
    return run("npm", args, cwd, cache);
  }
  const fromRunner = process.env.npm_execpath;
  const cli =
    fromRunner && basename(fromRunner).toLowerCase() === "npm-cli.js" && existsSync(fromRunner)
      ? fromRunner
      : join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  assert.ok(existsSync(cli), `Cannot locate npm CLI: ${cli}`);
  return run(process.execPath, [cli, ...args], cwd, cache);
}

test("W-04: real all.css bundle survives a Vite+ production build", { timeout: 150_000 }, (t) => {
  assert.ok(existsSync(join(projectRoot, "dist", "normalize.css")), "Run 'vp pack' first");
  const viteCli = fileURLToPath(import.meta.resolve("vite-plus/bin"));
  assert.ok(existsSync(viteCli), "Install the pinned vite-plus@1.4.0 first");

  // Keep the separate consumer underneath ignored node_modules so it can resolve
  // the existing project's Vite+ toolchain without installing another copy.
  const scratchRoot = join(projectRoot, "node_modules", ".cache");
  mkdirSync(scratchRoot, { recursive: true });
  const temp = mkdtempSync(join(scratchRoot, "adui-vite-consumer-"));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  const cache = join(temp, "npm-cache");

  const packed = JSON.parse(
    npm(
      ["pack", ".", "--json", "--offline", "--ignore-scripts", "--pack-destination", temp],
      projectRoot,
      cache,
    ),
  );
  assert.equal(packed.length, 1);
  const tarball = join(temp, packed[0].filename);
  assert.ok(existsSync(tarball));

  writeFileSync(
    join(temp, "package.json"),
    '{"name":"adui-vite-consumer-smoke","private":true,"type":"module"}\n',
  );
  writeFileSync(
    join(temp, "index.html"),
    '<!doctype html><html><head><meta charset="UTF-8" /></head><body><div style="font-weight:600"><strong>Test</strong></div><script type="module" src="./entry.js"></script></body></html>\n',
  );
  writeFileSync(join(temp, "entry.js"), 'import "@adui/normalize.css/all.css";\n');
  writeFileSync(
    join(temp, "vite.config.mjs"),
    'import { defineConfig } from "vite-plus";\nexport default defineConfig({ build: { outDir: "dist" } });\n',
  );

  npm(
    [
      "install",
      "--offline",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--no-save",
      "--package-lock=false",
      tarball,
    ],
    temp,
    cache,
  );
  run(process.execPath, [viteCli, "build"], temp, cache, 90_000);
  const files = readdirSync(join(temp, "dist", "assets"));
  const cssFiles = files.filter((name) => name.endsWith(".css"));
  assert.equal(cssFiles.length, 1, `Expected one CSS file, got: ${files.join(", ")}`);
  const css = readFileSync(join(temp, "dist", "assets", cssFiles[0]), "utf8");
  assert.match(css, /\bb\s*,\s*strong\s*\{\s*font-weight:\s*bolder\s*;?\s*\}/);
  assert.match(css, /box-sizing:\s*border-box/);
  assert.match(css, /border-collapse:\s*collapse/);
  assert.match(css, /file-selector-button/);
  assert.match(css, /focus-visible/);
  assert.ok(existsSync(join(temp, "dist", "index.html")));
});
