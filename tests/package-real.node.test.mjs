import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
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

function npm(args, cwd, cache) {
  const isWindows = process.platform === "win32";
  const fromRunner = process.env.npm_execpath;
  const cli =
    fromRunner && basename(fromRunner).toLowerCase() === "npm-cli.js" && existsSync(fromRunner)
      ? fromRunner
      : join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");

  if (isWindows) {
    assert.ok(existsSync(cli), `Cannot locate npm CLI: ${cli}`);
  }

  const result = spawnSync(
    isWindows ? process.execPath : "npm",
    isWindows ? [cli, ...args] : args,
    {
      cwd,
      encoding: "utf8",
      timeout: 45_000,
      env: {
        ...process.env,
        npm_config_cache: cache,
        npm_config_audit: "false",
        npm_config_fund: "false",
        npm_config_update_notifier: "false",
      },
    },
  );

  assert.equal(result.error, undefined, `Could not run npm: ${result.error?.message}`);
  assert.equal(result.status, 0, `npm ${args[0]} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
}

test(
  "W-04: real vp pack output survives offline npm tarball installation",
  { timeout: 120_000 },
  (t) => {
    const builtDirectory = join(projectRoot, "dist");
    const cssFile = join(builtDirectory, "normalize.css");
    assert.ok(existsSync(cssFile), "Run 'vp pack' before 'npm run test:package'");
    assert.deepEqual(readdirSync(builtDirectory), ["normalize.css"]);

    const css = readFileSync(cssFile, "utf8");
    assert.match(css, /\bb\s*,\s*strong\s*\{\s*font-weight:\s*bolder\s*;?\s*\}/);
    assert.match(
      css,
      /:where\(abbr\[title\]\)\s*\{\s*text-decoration:\s*underline\s+dotted\s*;?\s*\}/,
    );
    assert.match(css, /:where\(table\)\s*\{\s*border-color:\s*currentcolor\s*;?\s*\}/i);
    const manifest = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
    assert.deepEqual(manifest.exports, { ".": "./dist/normalize.css" });
    assert.deepEqual(manifest.sideEffects, ["**/*.css"]);
    assert.deepEqual(manifest.files, ["dist"]);
    assert.equal(Object.hasOwn(manifest, "dependencies"), false);
    assert.equal(manifest.version, "0.0.3");
    assert.equal(manifest.private, false);

    const tmp = mkdtempSync(join(tmpdir(), "adui-real-css-pack-"));
    t.after(() => rmSync(tmp, { recursive: true, force: true }));
    const consumerDir = join(tmp, "consumer");
    const npmCache = join(tmp, "npm-cache");
    mkdirSync(consumerDir);

    const packed = JSON.parse(
      npm(
        ["pack", ".", "--json", "--ignore-scripts", "--offline", "--pack-destination", tmp],
        projectRoot,
        npmCache,
      ),
    );
    assert.equal(packed.length, 1);
    assert.equal(packed[0].id, `${manifest.name}@${manifest.version}`);
    assert.equal(packed[0].name, manifest.name);
    assert.equal(packed[0].version, manifest.version);
    assert.deepEqual(packed[0].bundled, []);

    const files = packed[0].files.map(({ path }) => path).sort();
    assert.deepEqual(
      files,
      ["LICENSE", "README.en.md", "README.md", "dist/normalize.css", "package.json"],
      "The real tarball must contain exactly five required files",
    );

    const tarball = join(tmp, packed[0].filename);
    assert.ok(existsSync(tarball), "npm did not create the actual package tarball");
    writeFileSync(
      join(consumerDir, "package.json"),
      '{"name":"adui-real-css-consumer","private":true}\n',
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
      consumerDir,
      npmCache,
    );

    const fromConsumer = createRequire(pathToFileURL(join(consumerDir, "entry.cjs")));
    const resolved = fromConsumer.resolve("@adui/normalize.css");
    assert.match(
      resolved.replaceAll("\\", "/"),
      /node_modules\/@adui\/normalize\.css\/dist\/normalize\.css$/,
    );
    assert.equal(readFileSync(resolved, "utf8"), css);
    const installed = JSON.parse(
      readFileSync(
        join(consumerDir, "node_modules", "@adui", "normalize.css", "package.json"),
        "utf8",
      ),
    );
    assert.equal(installed.name, manifest.name);
    assert.equal(installed.version, manifest.version);
    assert.deepEqual(installed.keywords, manifest.keywords);
    assert.equal(installed.private, manifest.private);
    assert.equal(installed.author, manifest.author);
    assert.equal(installed.license, manifest.license);
    assert.deepEqual(installed.exports, manifest.exports);
    assert.deepEqual(installed.sideEffects, manifest.sideEffects);
    assert.equal(Object.hasOwn(installed, "dependencies"), false);

    for (const subpath of [
      "reset.css",
      "forms.css",
      "a11y.css",
      "all.css",
      "dist/normalize.css",
      "package.json",
    ]) {
      assert.throws(
        () => fromConsumer.resolve(`@adui/normalize.css/${subpath}`),
        (error) => error?.code === "ERR_PACKAGE_PATH_NOT_EXPORTED",
        `Unexpected public subpath: ${subpath}`,
      );
    }
    assert.equal(
      existsSync(join(consumerDir, "node_modules", "@adui", "normalize.css", "tests")),
      false,
    );
    assert.equal(
      existsSync(join(consumerDir, "node_modules", "@adui", "normalize.css", "index.js")),
      false,
    );
  },
);
