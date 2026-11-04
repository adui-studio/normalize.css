import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";

const read = (name) => readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8");
const fixtureNames = [
  "r003-native.html",
  "r003-candidate.html",
  "r004-native.html",
  "r004-risk-review.html",
  "r004-family-review.html",
  "t2-native.html",
  "t2-package.html",
];

const ids = (markup) => [...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const measuredIds = (markup) =>
  [...markup.matchAll(/\bid="([^"]+)"\s+data-probe\b/g)].map((match) => match[1]).sort();
const cssFor = (markup, id) => {
  const block = markup.match(new RegExp(`<style id="${id}">([\\s\\S]*?)<\\/style>`));
  assert.ok(block, `Missing style block ${id}`);
  return block[1].replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
};

test("every fixture has unique probe IDs and only uses local probe resources", () => {
  for (const name of fixtureNames) {
    const markup = read(name);
    const values = ids(markup);
    assert.equal(new Set(values).size, values.length, `${name}: duplicate IDs`);
    assert.match(markup, /<script type="module" src="\.\/probe\.js"><\/script>/);
    assert.match(markup, /<pre id="probe-output" aria-live="polite">/);
    assert.doesNotMatch(markup, /(?:src|href)="https?:\/\//i);
    assert.ok(values.includes("probe-output"));
  }
});

test("R-003 native and candidate pages measure identical elements", () => {
  const native = read("r003-native.html");
  const candidate = read("r003-candidate.html");
  assert.deepEqual(measuredIds(native), measuredIds(candidate));
  for (const weight of [400, 600, 700]) {
    assert.match(native, new RegExp(`class="weight-${weight}"`));
    assert.match(native, new RegExp(`id="b-${weight}" data-probe`));
    assert.match(native, new RegExp(`id="strong-${weight}" data-probe`));
  }
  assert.doesNotMatch(native, /id="candidate-rule"|font-weight:\s*bolder/);
  assert.equal(cssFor(candidate, "candidate-rule"), "b,strong{font-weight:bolder;}");
});

test("R-004 risk style remains isolated from native typography fixture", () => {
  const native = read("r004-native.html");
  const risk = read("r004-risk-review.html");
  assert.deepEqual(measuredIds(native), measuredIds(risk));
  assert.doesNotMatch(native, /<style\b|font-size:\s*1em/);
  assert.equal(cssFor(risk, "risk-review-only"), "code,kbd,samp,pre{font-size:1em;}");
});

test("R-004 T1b only adds the font-family change to T1", () => {
  const native = read("r004-native.html");
  const sizeOnly = read("r004-risk-review.html");
  const familyReview = read("r004-family-review.html");
  assert.deepEqual(measuredIds(native), measuredIds(sizeOnly));
  assert.deepEqual(measuredIds(sizeOnly), measuredIds(familyReview));
  assert.equal(cssFor(sizeOnly, "risk-review-only"), cssFor(familyReview, "risk-review-only"));
  assert.equal(
    cssFor(familyReview, "family-review-only"),
    "code,kbd,samp,pre{font-family:monospace,monospace;}",
  );
  assert.doesNotMatch(native, /id="family-review-only"/);
  assert.doesNotMatch(sizeOnly, /id="family-review-only"|font-family:\s*monospace,\s*monospace/);
});

test("W-06 T0/T2 pages share probe targets and only T2 loads the real packed CSS", () => {
  const baseline = read("t2-native.html");
  const integrated = read("t2-package.html");
  const bodyOf = (markup) => markup.match(/<body>[\s\S]*?<\/body>/)?.[0];
  const firstStyle = (markup) => markup.match(/<style>[\s\S]*?<\/style>/)?.[0];

  assert.ok(bodyOf(baseline), "Missing baseline body");
  assert.equal(bodyOf(baseline), bodyOf(integrated));
  assert.equal(firstStyle(baseline), firstStyle(integrated));
  assert.deepEqual(measuredIds(baseline), measuredIds(integrated));
  assert.equal(measuredIds(baseline).length, 10);
  assert.doesNotMatch(baseline, /id="package-css"|dist\/normalize\.css/);
  assert.match(
    integrated,
    /<link id="package-css" rel="stylesheet" href="\.\.\/dist\/normalize\.css" \/>/,
  );
  assert.doesNotMatch(integrated, /id="candidate-rule"|font-size:\s*1em|monospace,\s*monospace/);

  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.deepEqual(packageJson.exports, { ".": "./dist/normalize.css" });

  for (const id of [
    "t2-button",
    "t2-search",
    "t2-fieldset",
    "t2-select",
    "t2-textarea",
    "t2-checkbox",
    "t2-summary",
    "t2-hidden",
    "t2-until-found",
    "t2-dialog",
    "t2-dialog-title",
    "t2-dialog-close",
  ]) {
    assert.ok(ids(baseline).includes(id), `Missing native observation point: ${id}`);
  }
  for (const element of [
    '<fieldset id="t2-fieldset">',
    '<select id="t2-select">',
    '<textarea id="t2-textarea" rows="2">',
    '<input id="t2-checkbox" type="checkbox" />',
    '<dialog id="t2-dialog" aria-labelledby="t2-dialog-title">',
    '<form method="dialog">',
  ]) {
    assert.ok(baseline.includes(element), `Missing native semantic element: ${element}`);
  }
});

test("fixture landing page links to every existing local test page", () => {
  const index = read("index.html");
  for (const name of fixtureNames) {
    assert.ok(index.includes(`href="./${name}"`), `Missing link: ${name}`);
    assert.ok(existsSync(new URL(`../fixtures/${name}`, import.meta.url)));
  }
});
