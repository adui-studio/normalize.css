import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const stylesheet = readFileSync(new URL("src/normalize.css", root), "utf8");
const normalizeCss = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, "")
    .replace(/;?}/g, ";}");

test("W-04 development package exports only the Normalize CSS root", () => {
  assert.equal(pkg.name, "@adui/normalize.css");
  assert.equal(pkg.private, true);
  assert.equal(pkg.devDependencies["vite-plus"], "1.4.0");
  assert.equal(Object.hasOwn(pkg, "dependencies"), false);
  assert.equal(Object.hasOwn(pkg, "main"), false);
  assert.equal(Object.hasOwn(pkg, "module"), false);
  assert.deepEqual(pkg.exports, { ".": "./dist/normalize.css" });
  assert.equal(Object.hasOwn(pkg.scripts, "build"), false);
  assert.deepEqual(pkg.files, ["dist"]);
  assert.deepEqual(pkg.sideEffects, ["**/*.css"]);
});

test("R-003 is the only product rule; browser-default monospace remains untouched", () => {
  assert.equal(normalizeCss(stylesheet), "b,strong{font-weight:bolder;}");
  assert.doesNotMatch(stylesheet, /@import|@layer|!important|font-size\s*:/i);
  assert.equal(stylesheet.includes("https://"), false);
});

test("Vite+ config builds local HTML fixtures and packs only CSS", () => {
  const source = readFileSync(new URL("vite.config.ts", root), "utf8");
  assert.match(source, /rolldownOptions:\s*\{/);
  assert.match(source, /input:\s*fixtures/);
  assert.match(source, /outDir:\s*"dist-fixtures"/);
  assert.match(source, /entry:\s*\["src\/normalize\.css"\]/);
  assert.match(source, /outDir:\s*"dist"/);
  assert.doesNotMatch(source, /lib:\s*\{/);
  assert.doesNotMatch(source, /scripts\/build\.mjs/);

  for (const name of [
    "index",
    "r003-native",
    "r003-candidate",
    "r004-native",
    "r004-risk-review",
    "r004-family-review",
    "t2-native",
    "t2-package",
  ]) {
    assert.ok(source.includes(`"${name}"`), `Missing fixture input: ${name}`);
  }
});

test("vp build preview, if present, includes all eight fixture HTML pages", () => {
  const directory = new URL("dist-fixtures/", root);
  if (existsSync(directory)) {
    const outputs = readdirSync(directory, { recursive: true }).map((name) =>
      name.replaceAll("\\", "/"),
    );
    for (const name of [
      "index",
      "r003-native",
      "r003-candidate",
      "r004-native",
      "r004-risk-review",
      "r004-family-review",
      "t2-native",
      "t2-package",
    ]) {
      assert.ok(
        outputs.some((output) => output.endsWith(`/${name}.html`) || output === `${name}.html`),
        `Missing preview HTML: ${name}.html`,
      );
    }
  }
});

test("vp pack output, if present, contains only the Normalize CSS", () => {
  const outputDirectory = new URL("dist/", root);
  const built = new URL("dist/normalize.css", root);
  if (existsSync(outputDirectory)) {
    assert.ok(existsSync(built), "vp pack must emit dist/normalize.css");
    assert.deepEqual(
      readdirSync(outputDirectory),
      ["normalize.css"],
      "The public dist/ folder must not contain JS wrappers or unrelated assets",
    );
    assert.equal(normalizeCss(readFileSync(built, "utf8")), normalizeCss(stylesheet));
  }
});

test("offline validation command includes every local Node test, including tarball smoke", () => {
  const script = pkg.scripts["test:offline"];
  assert.equal(
    script,
    "node --test tests/fixtures.node.test.mjs tests/package.node.test.mjs tests/package-smoke.node.test.mjs tests/probe.node.test.mjs tests/r003-evidence.node.test.mjs tests/evidence-file.node.test.mjs tests/ecosystem-contract.node.test.mjs",
  );
});
