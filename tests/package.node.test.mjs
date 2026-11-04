import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));

test("W-04 staging metadata keeps the package private and CSS-only", () => {
  assert.equal(pkg.name, "@adui/normalize.css");
  assert.equal(pkg.private, true);
  assert.equal(pkg.devDependencies["vite-plus"], "1.4.0");
  assert.equal(Object.hasOwn(pkg, "dependencies"), false);
  assert.equal(Object.hasOwn(pkg, "main"), false);
  assert.equal(Object.hasOwn(pkg, "module"), false);
  assert.deepEqual(pkg.files, ["dist"]);
  assert.deepEqual(pkg.sideEffects, ["**/*.css"]);
});

test("public CSS export remains blocked until there is a real product stylesheet", () => {
  const stylesheetExists = existsSync(new URL("dist/normalize.css", root));
  if (stylesheetExists) {
    assert.deepEqual(pkg.exports, { ".": "./dist/normalize.css" });
  } else {
    assert.equal(Object.hasOwn(pkg, "exports"), false);
  }
});

test("offline validation command includes every local Node test, including tarball smoke", () => {
  const script = pkg.scripts["test:offline"];
  assert.equal(
    script,
    "node --test tests/fixtures.node.test.mjs tests/package.node.test.mjs tests/package-smoke.node.test.mjs tests/probe.node.test.mjs tests/r003-evidence.node.test.mjs tests/evidence-file.node.test.mjs",
  );
});
