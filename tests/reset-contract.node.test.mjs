import assert from "node:assert/strict";
import { test } from "node:test";
import {
  resetCases,
  resetCss,
  resetHtml,
  resetModes,
  resetProbe,
  resetViteConfig,
} from "./reset-fixtures.mjs";

test("W-06 Reset cases are isolated, pinned, and do not include two competing resets", () => {
  assert.deepEqual(Object.keys(resetCases), [
    "tailwind-preflight",
    "unocss-tailwind-v4",
    "unocss-tailwind-compat",
  ]);
  assert.deepEqual(resetModes, ["baseline", "normalize-first", "normalize-last"]);

  for (const [name, spec] of Object.entries(resetCases)) {
    assert.ok(spec.title);
    for (const version of Object.values(spec.packages)) {
      assert.match(version, /^\d+\.\d+\.\d+$/);
    }
    const baseline = resetCss(name, "baseline");
    const before = resetCss(name, "normalize-first");
    const after = resetCss(name, "normalize-last");
    assert.equal(before.replace('@import "@adui/normalize.css";\n', ""), baseline);
    assert.equal(after.replace('@import "@adui/normalize.css";\n', ""), baseline);
    assert.doesNotMatch(baseline, /@adui\/normalize\.css/);
    assert.match(before, /@adui\/normalize\.css/);
    assert.match(after, /@adui\/normalize\.css/);
    assert.equal((before.match(/@unocss\/reset\//g) ?? []).length <= 1, true);
    assert.equal((before.match(/tailwindcss\/preflight\.css/g) ?? []).length <= 1, true);
    if (name === "tailwind-preflight") {
      assert.doesNotMatch(baseline, /@unocss\/reset/);
      assert.match(baseline, /@import "tailwindcss\/preflight\.css" layer\(base\)/);
      assert.match(resetViteConfig(name), /@tailwindcss\/vite/);
      assert.ok(
        before.indexOf("@adui/normalize.css") < before.indexOf("tailwindcss/preflight.css"),
      );
      assert.ok(after.indexOf("@adui/normalize.css") > after.indexOf("tailwindcss/preflight.css"));
    } else {
      assert.doesNotMatch(baseline, /tailwindcss\/preflight\.css/);
      assert.doesNotMatch(resetViteConfig(name), /@tailwindcss\/vite/);
      assert.equal(Object.keys(spec.packages).length, 1);
      assert.deepEqual(Object.keys(spec.packages), ["@unocss/reset"]);
    }
  }
});

test("W-06 Reset samples share one DOM, probe and page without external resources", () => {
  const html = resetHtml();
  const ids = [
    "heading",
    "paragraph",
    "bold",
    "strong",
    "code",
    "list",
    "button",
    "input",
    "details",
    "hidden",
    "until-found",
    "dialog",
    "probe-output",
  ];
  for (const id of ids) {
    assert.ok(html.includes('id="' + id + '"'), "Missing element: " + id);
  }
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /@adui\/normalize\.css|@unocss\/reset|tailwindcss/);
  const probe = resetProbe();
  assert.match(probe, /__aduiResetEvidence/);
  assert.match(probe, /getComputedStyle/);
  assert.match(probe, /requestAnimationFrame/);
});

test("W-06 Reset invalid cases and modes fail explicitly", () => {
  assert.throws(() => resetCss("unknown", "baseline"), /Unknown Reset case/);
  assert.throws(() => resetCss("tailwind-preflight", "unknown"), /Unknown Reset mode/);
  assert.throws(() => resetViteConfig("unknown"), /Unknown Reset case/);
});
