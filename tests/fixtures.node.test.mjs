import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";
import { inspectModuleStylesheet } from "../fixtures/modules-cssom.js";
import { compareModuleEvidence } from "./modules-evidence.mjs";

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
  assert.equal(measuredIds(baseline).length, 15);
  for (const id of ["abbr-title", "abbr-plain", "abbr-author", "table-border", "table-author"]) {
    assert.ok(measuredIds(baseline).includes(id));
  }
  assert.match(baseline, /\.abbr-author\s*\{\s*text-decoration:\s*overline solid\s*;/);
  assert.match(baseline, /\.table-author\s*\{\s*color:\s*rgb\(20, 40, 60\)/);
  assert.doesNotMatch(baseline, /id="package-css"|dist\/normalize\.css/);
  assert.match(
    integrated,
    /<link id="package-css" rel="stylesheet" href="\.\.\/dist\/normalize\.css" \/>/,
  );
  assert.doesNotMatch(integrated, /id="candidate-rule"|font-size:\s*1em|monospace,\s*monospace/);

  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.exports["."], "./dist/normalize.css");

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

test("v0.0.3 optional modules T0/T2 fixtures only differ by all.css link", () => {
  const native = read("modules-native.html");
  const all = read("modules-all.html");
  const bodyOf = (markup) => markup.match(/<body>[\s\S]*?<\/body>/)?.[0];
  const styleOf = (markup) => markup.match(/<style>[\s\S]*?<\/style>/)?.[0];

  assert.equal(bodyOf(native), bodyOf(all), "T0/T2 must share exactly the same DOM");
  assert.equal(styleOf(native), styleOf(all), "T0/T2 must share author styles");
  assert.doesNotMatch(native, /id="modules-css"|href="\.\.\/src\/all\.css"/);
  assert.match(all, /<link id="modules-css" rel="stylesheet" href="\.\.\/src\/all\.css" \/>/);
  for (const name of ["modules-native.html", "modules-all.html"]) {
    const html = read(name);
    const values = ids(html);
    assert.equal(new Set(values).size, values.length, name + ": duplicate IDs");
    assert.match(html, /<script type="module" src="\.\/modules-probe\.js"><\/script>/);
    assert.match(html, /<pre id="module-output" aria-live="polite">/);
    assert.doesNotMatch(html, /(?:src|href)="https?:\/\//i);
  }
  for (const id of [
    "module-heading",
    "module-paragraph",
    "module-list",
    "module-box",
    "module-svg",
    "module-table",
    "module-button",
    "module-input",
    "module-select",
    "module-textarea",
    "module-checkbox",
    "module-radio",
    "module-file",
    "module-fieldset",
    "module-legend",
    "module-details",
    "module-dialog",
    "module-hidden",
    "module-link",
  ]) {
    assert.ok(ids(native).includes(id), "Missing module observation point: " + id);
  }
});

test("v0.0.3 optional module probe has no network or storage dependencies", () => {
  const source = readFileSync(new URL("../fixtures/modules-probe.js", import.meta.url), "utf8");
  assert.match(source, /getComputedStyle/);
  assert.match(source, /matchMedia/);
  assert.match(source, /focusVisible/);
  assert.match(source, /window\.__aduiModuleCapture = capture/);
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|localStorage|sendBeacon/);
  const index = read("index.html");
  for (const name of ["modules-native.html", "modules-all.html"]) {
    assert.ok(index.includes('href="./' + name + '"'));
    assert.ok(existsSync(new URL("../fixtures/" + name, import.meta.url)));
  }
});

test("optional module CSSOM probe finds native imports, nested rules and missing modules", () => {
  const rule = (selectorText, declarations) => ({
    selectorText,
    style: { getPropertyValue: (property) => declarations[property] ?? "" },
  });
  const normalize = { cssRules: [rule("b, strong", { "font-weight": "bolder" })] };
  // Chromium may serialize "*::before" as "::before"; both must be recognized.
  const reset = { cssRules: [rule("*, ::before, ::after", { "box-sizing": "border-box" })] };
  const forms = {
    cssRules: [rule(":where(button, input, select, textarea)", { font: "inherit" })],
  };
  const a11y = {
    cssRules: [{ cssRules: [rule(":where(:focus-visible)", { "outline-offset": "2px" })] }],
  };
  const imported = [normalize, reset, forms, a11y].map((styleSheet) => ({ styleSheet }));

  assert.deepEqual(inspectModuleStylesheet({ cssRules: imported }), {
    normalize: true,
    reset: true,
    forms: true,
    a11y: true,
    complete: true,
    error: null,
  });
  assert.deepEqual(inspectModuleStylesheet({ cssRules: imported.slice(0, 3) }), {
    normalize: true,
    reset: true,
    forms: true,
    a11y: false,
    complete: false,
    error: null,
  });
  assert.equal(inspectModuleStylesheet(null), null);
  assert.deepEqual(
    inspectModuleStylesheet({
      get cssRules() {
        const error = new Error("cross-origin stylesheet");
        error.name = "SecurityError";
        throw error;
      },
    }),
    { complete: false, error: "SecurityError" },
  );
});

test("optional module probe exposes CSSOM and document protocol without remote APIs", () => {
  const source = read("modules-probe.js");
  assert.match(source, /from "\.\/modules-cssom\.js"/);
  assert.match(source, /pageProtocol: window\.location\.protocol/);
  assert.match(source, /cssom: inspectModuleStylesheet\(link\.sheet\)/);
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|localStorage|sendBeacon/);
});

function syntheticModuleEvidence(role) {
  const styles = Object.fromEntries(
    [
      "module-box",
      "module-table",
      "module-button",
      "module-input",
      "module-select",
      "module-textarea",
      "module-hidden",
    ].map((id) => [id, {}]),
  );
  styles["module-box"].boxSizing = role === "M1" ? "border-box" : "content-box";
  styles["module-table"].borderCollapse = role === "M1" ? "collapse" : "separate";
  styles["module-hidden"].display = "none";
  for (const id of ["module-button", "module-input", "module-select", "module-textarea"]) {
    styles[id].fontSize = role === "M1" ? "18px" : "13px";
  }
  return {
    userAgent: "Synthetic Browser/1 (unit-test only)",
    location: role === "M0" ? "/fixtures/modules-native.html" : "/fixtures/modules-all.html",
    pageProtocol: "http:",
    stylesheet:
      role === "M0"
        ? null
        : {
            href: "../src/all.css",
            loaded: true,
            cssom: {
              normalize: true,
              reset: true,
              forms: true,
              a11y: true,
              complete: true,
              error: null,
            },
          },
    media: { reducedMotion: false, forcedColors: false },
    rootScrollBehavior: "smooth",
    styles,
  };
}

test("M0/M1 synthetic static probes pass without claiming browser support", () => {
  const result = compareModuleEvidence(
    syntheticModuleEvidence("M0"),
    syntheticModuleEvidence("M1"),
  );
  assert.equal(result.status, "PROBE_PASS");
  assert.equal(result.failed, 0);
  assert.ok(result.checked >= 12);
});

test("missing imported module cannot pass evidence comparison", () => {
  const all = syntheticModuleEvidence("M1");
  all.stylesheet.cssom.forms = false;
  all.stylesheet.cssom.complete = false;
  const result = compareModuleEvidence(syntheticModuleEvidence("M0"), all);
  assert.equal(result.status, "PROBE_FAIL");
  assert.match(result.issues.join(" "), /cssom-forms/);
});

test("reduced-motion branch checks computed behavior", () => {
  const native = syntheticModuleEvidence("M0");
  const all = syntheticModuleEvidence("M1");
  native.media.reducedMotion = true;
  all.media.reducedMotion = true;
  all.rootScrollBehavior = "auto";
  assert.equal(compareModuleEvidence(native, all).status, "PROBE_PASS");
  all.rootScrollBehavior = "smooth";
  assert.equal(compareModuleEvidence(native, all).status, "PROBE_FAIL");
});

test("different browser or media settings cannot pass", () => {
  const native = syntheticModuleEvidence("M0");
  const all = syntheticModuleEvidence("M1");
  all.userAgent = "Other Browser/1";
  all.media.forcedColors = true;
  assert.equal(compareModuleEvidence(native, all).status, "PROBE_FAIL");
});

test("file protocol or unloaded stylesheet cannot pass", () => {
  const native = syntheticModuleEvidence("M0");
  const all = syntheticModuleEvidence("M1");
  native.pageProtocol = "file:";
  all.pageProtocol = "file:";
  all.stylesheet.loaded = false;
  assert.equal(compareModuleEvidence(native, all).status, "PROBE_FAIL");
});

test("malformed module evidence must not be reported as PASS", () => {
  assert.throws(
    () => compareModuleEvidence({}, syntheticModuleEvidence("M1")),
    /M0.location/,
  );
  const all = syntheticModuleEvidence("M1");
  all.styles["module-input"] = null;
  assert.throws(
    () => compareModuleEvidence(syntheticModuleEvidence("M0"), all),
    /M1.styles.module-input/,
  );
});

test("M0/M1 expose identical offline JSON export controls", () => {
  const native = read("modules-native.html");
  const all = read("modules-all.html");
  for (const html of [native, all]) {
    assert.match(html, /<button id="module-export" type="button">/);
  }
  const source = read("modules-probe.js");
  assert.match(source, /capturedAt: new Date\(\)\.toISOString\(\)/);
  assert.match(source, /URL\.createObjectURL\(data\)/);
  assert.match(source, /URL\.revokeObjectURL\(url\)/);
  assert.match(source, /link\.download =/);
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|localStorage|sendBeacon/);
});
