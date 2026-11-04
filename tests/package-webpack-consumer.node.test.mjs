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
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const webpackVersion = "5.112.2";

function npm(args, cwd, timeout = 180_000) {
  const isWindows = process.platform === "win32";
  const fromRunner = process.env.npm_execpath;
  const cli =
    fromRunner && basename(fromRunner).toLowerCase() === "npm-cli.js" && existsSync(fromRunner)
      ? fromRunner
      : join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  if (isWindows) {
    assert.ok(existsSync(cli), `Cannot locate npm CLI: ${cli}`);
  }

  const result = spawnSync(isWindows ? process.execPath : "npm", isWindows ? [cli, ...args] : args, {
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
  assert.equal(result.error, undefined, `npm invocation failed: ${result.error?.message}`);
  assert.equal(result.status, 0, `npm ${args[0]} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
}

test(
  "W-04: real tarball CSS remains in a Webpack 5 production build",
  { timeout: 240_000 },
  async (t) => {
    const cssPath = join(projectRoot, "dist", "normalize.css");
    assert.ok(existsSync(cssPath), "Run 'vp pack' before 'npm run test:webpack'");
    const original = readFileSync(cssPath, "utf8");
    assert.match(original, /\bb\s*,\s*strong\s*\{\s*font-weight\s*:\s*bolder\s*;?\s*\}/);

    const temp = mkdtempSync(join(tmpdir(), "adui-webpack-consumer-"));
    t.after(() => rmSync(temp, { recursive: true, force: true }));
    const consumer = join(temp, "consumer");
    mkdirSync(consumer);

    const packed = JSON.parse(
      npm(["pack", ".", "--json", "--offline", "--ignore-scripts", "--pack-destination", temp], projectRoot),
    );
    assert.equal(packed.length, 1);
    const tarball = join(temp, packed[0].filename);
    assert.ok(existsSync(tarball));

    writeFileSync(
      join(consumer, "package.json"),
      '{"name":"adui-webpack-consumer-smoke","private":true,"type":"module"}\n',
    );
    writeFileSync(join(consumer, "entry.js"), 'import "@adui/normalize.css";\n');

    // Only this explicitly invoked test downloads Webpack. The repo's own
    // dependencies and lockfile remain untouched, and scripts are disabled.
    npm(
      [
        "install",
        "--ignore-scripts",
        "--no-save",
        "--package-lock=false",
        "--no-audit",
        "--no-fund",
        "--prefer-offline",
        `webpack@${webpackVersion}`,
        tarball,
      ],
      consumer,
    );

    const requireFromConsumer = createRequire(pathToFileURL(join(consumer, "entry.cjs")));
    const webpack = requireFromConsumer("webpack");
    const installedWebpack = requireFromConsumer("webpack/package.json");
    assert.equal(installedWebpack.version, webpackVersion);
    const resolved = requireFromConsumer.resolve("@adui/normalize.css");
    assert.match(
      resolved.replaceAll("\\", "/"),
      /node_modules\/@adui\/normalize\.css\/dist\/normalize\.css$/,
    );
    assert.equal(readFileSync(resolved, "utf8"), original);

    const outputPath = join(consumer, "build");
    const stats = await new Promise((fulfill, reject) => {
      webpack(
        {
          mode: "production",
          context: consumer,
          entry: "./entry.js",
          target: "web",
          experiments: { css: true },
          optimization: { sideEffects: true, usedExports: true, minimize: true },
          output: {
            path: outputPath,
            filename: "main.js",
            cssFilename: "main.css",
            clean: true,
          },
        },
        (error, result) => {
          if (error) reject(error);
          else if (!result) reject(new Error("Webpack returned no stats"));
          else if (result.hasErrors()) {
            reject(new Error(result.toString({ all: false, errors: true, errorDetails: true })));
          } else fulfill(result);
        },
      );
    });
    assert.ok(!stats.hasErrors());

    const cssFiles = readdirSync(outputPath).filter((file) => file.endsWith(".css"));
    assert.equal(cssFiles.length, 1, `Expected one emitted CSS file: ${readdirSync(outputPath)}`);
    const generated = readFileSync(join(outputPath, cssFiles[0]), "utf8");
    assert.match(generated, /\bb\s*,\s*strong\s*\{\s*font-weight\s*:\s*bolder\s*;?\s*\}/);
  },
);
