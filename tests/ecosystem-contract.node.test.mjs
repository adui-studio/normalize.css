import assert from "node:assert/strict";
import { test } from "node:test";
import { consumerHtml, consumerSource, ecosystemCases } from "./ecosystem-fixtures.mjs";

test("W-06 ecosystem fixtures keep T0/T2 only CSS import difference", () => {
  const html = consumerHtml();
  for (const id of [
    "b-600",
    "strong-600",
    "b-700",
    "strong-700",
    "code",
    "app",
    "probe-output",
  ]) {
    assert.ok(html.includes('id="' + id + '"'), "Missing DOM fixture: " + id);
  }
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /@adui\/normalize\.css/);

  for (const [caseName, spec] of Object.entries(ecosystemCases)) {
    const native = consumerSource(caseName, false);
    const packaged = consumerSource(caseName, true);
    assert.equal(packaged.replace('import "@adui/normalize.css";\n', ""), native);
    assert.doesNotMatch(native, /@adui\/normalize\.css/);
    assert.match(packaged, /^import "@adui\/normalize\.css";\n/);
    assert.ok(spec.buttonSelector && spec.inputSelector);
    assert.ok(spec.dependencies.length >= 2);
    for (const dependency of spec.dependencies) {
      assert.match(dependency, /^[a-z][a-z0-9-]*@\d+\.\d+\.\d+$/);
    }
    assert.match(native, /__aduiEcosystemEvidence/);
    assert.match(native, /requestAnimationFrame/);
  }
});

test("W-06 ecosystem consumer cases use Vue and React without SFC or JSX plugins", () => {
  const vue = ecosystemCases["vue-element"];
  const react = ecosystemCases["react-antd"];
  assert.ok(vue.source.some((line) => line.includes('from "vue"')));
  assert.ok(vue.source.some((line) => line.includes('from "element-plus"')));
  assert.ok(react.source.some((line) => line.includes('from "react-dom/client"')));
  assert.ok(react.source.some((line) => line.includes('from "antd"')));
  for (const spec of [vue, react]) {
    assert.ok(spec.source.every((line) => !line.includes("https://")));
  }
  assert.throws(() => consumerSource("unsupported", true), /Unknown ecosystem case/);
});
