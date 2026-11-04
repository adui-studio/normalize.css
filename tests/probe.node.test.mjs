import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../fixtures/probe.js", import.meta.url), "utf8");

function inspect(computedStyles) {
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
    getElementById: (id) => (id === "probe-output" ? output : null),
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
