import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../fixtures/probe.js", import.meta.url), "utf8");

function inspect(computedStyles, stylesheet = null) {
  const probes = computedStyles.map(({ id, tagName, style, parentStyle }) => ({
    id,
    tagName: tagName.toUpperCase(),
    parentElement: { style: parentStyle },
    style,
  }));
  const output = { textContent: "" };
  const root = { dataset: {} };
  const document = {
    querySelectorAll: () => probes,
    getElementById: (id) =>
      id === "probe-output" ? output : id === "package-css" ? stylesheet : null,
    documentElement: root,
  };
  const getComputedStyle = (el) => el.style;
  runInNewContext(source, {
    document,
    getComputedStyle,
    navigator: { userAgent: "Unit Test Browser" },
    window: { location: { pathname: "/fixtures/r003-native.html" } },
  });
  return { output: JSON.parse(output.textContent), root };
}

test("probe captures inherited and computed font weights without changing source elements", () => {
  const original = {
    id: "b-600",
    tagName: "b",
    parentStyle: { fontWeight: "600", fontSize: "16px" },
    style: { fontWeight: "700", fontSize: "16px", fontFamily: "monospace" },
  };
  const { output, root } = inspect([original]);
  assert.equal(output.rows.length, 1);
  assert.equal(output.rows[0].parentFontWeight, "600");
  assert.equal(output.rows[0].fontWeight, "700");
  assert.equal(output.rows[0].fontFamily, "monospace");
  assert.equal(output.location, "/fixtures/r003-native.html");
  assert.equal(root.dataset.probeStatus, "complete");
  assert.equal(original.style.fontWeight, "700");
});

test("probe returns an empty result set safely", () => {
  const { output, root } = inspect([]);
  assert.deepEqual(output.rows, []);
  assert.equal(root.dataset.probeStatus, "complete");
});

test("T2 probe captures the parsed packed CSSOM instead of trusting the link alone", () => {
  const cssRule = (selectorText, name, value) => ({
    type: 1,
    selectorText,
    style: Object.assign([name], {
      getPropertyValue: (property) => (property === name ? value : ""),
      getPropertyPriority: () => "",
    }),
  });
  const link = {
    getAttribute: () => "../dist/normalize.css",
    sheet: {
      cssRules: [
        cssRule("b, strong", "font-weight", "bolder"),
        cssRule(":where(abbr[title])", "text-decoration", "underline dotted"),
        cssRule(":where(table)", "border-color", "currentcolor"),
      ],
    },
  };
  const loaded = inspect([], link).output.packageStylesheet;
  assert.equal(loaded.href, "../dist/normalize.css");
  assert.equal(loaded.loaded, true);
  assert.deepEqual(JSON.parse(JSON.stringify(loaded.rules)), [
    {
      type: 1,
      selector: "b, strong",
      declarations: [{ name: "font-weight", value: "bolder", priority: "" }],
    },
    {
      type: 1,
      selector: ":where(abbr[title])",
      declarations: [{ name: "text-decoration", value: "underline dotted", priority: "" }],
    },
    {
      type: 1,
      selector: ":where(table)",
      declarations: [{ name: "border-color", value: "currentcolor", priority: "" }],
    },
  ]);

  const empty = inspect([], {
    getAttribute: () => "../dist/normalize.css",
    sheet: { cssRules: [] },
  });
  assert.equal(empty.output.packageStylesheet.loaded, true);
  assert.deepEqual(empty.output.packageStylesheet.rules, []);

  const failed = inspect([], { getAttribute: () => "../dist/normalize.css", sheet: null });
  assert.equal(failed.output.packageStylesheet.loaded, false);
  assert.equal(failed.output.packageStylesheet.rules, null);
  assert.equal(inspect([]).output.packageStylesheet, undefined);
});

test("T2 probe handles inaccessible CSSOM without falsely marking rules verified", () => {
  const sheet = {
    get cssRules() {
      throw new Error("CSSOM SecurityError");
    },
  };
  const link = { getAttribute: () => "../dist/normalize.css", sheet };
  const evidence = inspect([], link).output.packageStylesheet;
  assert.equal(evidence.loaded, true);
  assert.equal(evidence.rules, null);
});
