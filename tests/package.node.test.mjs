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
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const stylesheet = readFileSync(new URL("src/normalize.css", root), "utf8");

test("W-04 development package exports only the Normalize CSS root", () => {
  assert.equal(pkg.name, "@adui/normalize.css");
  assert.equal(pkg.private, true);
  assert.equal(pkg.devDependencies["vite-plus"], "1.4.0");
  assert.equal(Object.hasOwn(pkg, "dependencies"), false);
  assert.equal(Object.hasOwn(pkg, "main"), false);
  assert.equal(Object.hasOwn(pkg, "module"), false);
  assert.deepEqual(pkg.exports, { ".": "./dist/normalize.css" });
  assert.equal(pkg.scripts.build, "node scripts/build.mjs");
  assert.deepEqual(pkg.files, ["dist"]);
  assert.deepEqual(pkg.sideEffects, ["**/*.css"]);
});

test("R-003 is the only product rule; browser-default monospace remains untouched", () => {
  const code = stylesheet.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
  assert.equal(code, "b,strong{font-weight:bolder;}");
  assert.doesNotMatch(stylesheet, /@import|@layer|!important|font-size\s*:/i);
  assert.equal(stylesheet.includes("https://"), false);
});

test("CSS-only build copies exactly one stylesheet without JavaScript wrappers", (t) => {
  const tmp = mkdtempSync(join(tmpdir(), "adui-css-build-"));
  t.after(() => rmSync(tmp, { recursive: true, force: true }));

  mkdirSync(join(tmp, "src"));
  mkdirSync(join(tmp, "scripts"));
  writeFileSync(join(tmp, "src", "normalize.css"), stylesheet);
  writeFileSync(
    join(tmp, "scripts", "build.mjs"),
    readFileSync(new URL("scripts/build.mjs", root)),
  );

  const result = spawnSync(process.execPath, [join(tmp, "scripts", "build.mjs")], {
    cwd: tmp,
    encoding: "utf8",
    timeout: 10_000,
  });

  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.deepEqual(readdirSync(join(tmp, "dist")), ["normalize.css"]);
  assert.equal(readFileSync(join(tmp, "dist", "normalize.css"), "utf8"), stylesheet);
});

test("generated stylesheet, if present, matches current source", () => {
  const built = new URL("dist/normalize.css", root);
  if (existsSync(built)) {
    assert.equal(readFileSync(built, "utf8"), stylesheet);
  }
});

test("offline validation command includes every local Node test, including tarball smoke", () => {
  const script = pkg.scripts["test:offline"];
  assert.equal(
    script,
    "node --test tests/fixtures.node.test.mjs tests/package.node.test.mjs tests/package-smoke.node.test.mjs tests/probe.node.test.mjs tests/r003-evidence.node.test.mjs tests/evidence-file.node.test.mjs",
  );
});
