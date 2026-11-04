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

test("Vite+ config separates vp dev, vp build and experimental vp pack", () => {
  const source = readFileSync(new URL("vite.config.ts", root), "utf8");
  assert.match(source, /lib:\s*\{\s*entry:\s*"src\/normalize\.css"/);
  assert.match(source, /cssFileName:\s*"normalize"/);
  assert.match(source, /cssMinify:\s*false/);
  assert.match(source, /pack:\s*\{/);
  assert.match(source, /outDir:\s*"dist-pack"/);
  assert.doesNotMatch(source, /scripts\/build\.mjs/);
});

test("vp build output, if present, contains only the Normalize CSS", () => {
  const outputDirectory = new URL("dist/", root);
  const built = new URL("dist/normalize.css", root);
  if (existsSync(outputDirectory)) {
    assert.ok(existsSync(built), "vp build must emit dist/normalize.css");
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
    "node --test tests/fixtures.node.test.mjs tests/package.node.test.mjs tests/package-smoke.node.test.mjs tests/probe.node.test.mjs tests/r003-evidence.node.test.mjs tests/evidence-file.node.test.mjs",
  );
});
