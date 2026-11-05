import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { compareT2Evidence } from "./t2-evidence.mjs";

function fixture(role, oldBlink = false) {
  const rows = [400, 600, 700].flatMap((parent) =>
    ["b", "strong"].map((tag) => ({
      id: tag + "-" + parent,
      tagName: tag,
      parentFontWeight: String(parent),
      fontWeight: String(role === "native" && oldBlink ? 700 : parent === 400 ? 700 : 900),
      parentFontSize: "16px",
      fontSize: "16px",
      fontFamily: "serif",
    })),
  );
  for (const tag of ["code", "kbd", "samp", "pre"]) {
    rows.push({
      id: tag,
      tagName: tag,
      parentFontWeight: "400",
      fontWeight: "400",
      parentFontSize: "16px",
      fontSize: "13px",
      fontFamily: "monospace",
    });
  }
  return {
    userAgent: "Synthetic Browser/120 (not real evidence)",
    location: "/fixtures/t2-" + role + ".html",
    ...(role === "package"
      ? { packageStylesheet: { href: "../dist/normalize.css", loaded: true } }
      : {}),
    rows,
  };
}

test("R-003 old Blink synthetic T0/T2 has four intended bolder differences", () => {
  const result = compareT2Evidence(fixture("native", true), fixture("package"));
  assert.equal(result.status, "PROBE_PASS");
  assert.equal(result.weightDifferences, 4);
  assert.equal(result.rows.length, 10);
  assert.match(result.limitations[0], /not actual browser identity/);
});

test("modern UA synthetic T0/T2 may have zero differences", () => {
  const result = compareT2Evidence(fixture("native"), fixture("package"));
  assert.equal(result.status, "PROBE_PASS");
  assert.equal(result.weightDifferences, 0);
});

test("unloaded packed CSS cannot be reported as passing", () => {
  const packed = fixture("package");
  packed.packageStylesheet.loaded = false;
  assert.equal(compareT2Evidence(fixture("native"), packed).status, "STYLESHEET_NOT_LOADED");
});

test("missing bolder normalization is a mismatch", () => {
  const packed = fixture("package");
  packed.rows[4].fontWeight = "700";
  const result = compareT2Evidence(fixture("native", true), packed);
  assert.equal(result.status, "STYLE_MISMATCH");
  assert.match(result.issues[0], /expected bolder weight/);
});

test("monospace font size, family and weight cannot change", () => {
  const packed = fixture("package");
  packed.rows[6].fontSize = "16px";
  packed.rows[6].fontFamily = "sans-serif";
  packed.rows[6].fontWeight = "700";
  const result = compareT2Evidence(fixture("native"), packed);
  assert.equal(result.status, "STYLE_MISMATCH");
  assert.equal(result.issues.length, 3);
});

test("mismatched browser builds or incorrect fixture roles are rejected", () => {
  const packed = fixture("package");
  packed.userAgent = "Another UA";
  assert.throws(() => compareT2Evidence(fixture("native"), packed), /userAgent differs/);
  packed.userAgent = fixture("native").userAgent;
  packed.location = "/fixtures/t2-native.html";
  assert.throws(() => compareT2Evidence(fixture("native"), packed), /package.location/);
});

test("missing or forged CSS link and duplicate probes are rejected", () => {
  const native = fixture("native");
  native.packageStylesheet = { href: "../dist/normalize.css", loaded: true };
  assert.throws(() => compareT2Evidence(native, fixture("package")), /T0 must not include/);
  const packed = fixture("package");
  packed.packageStylesheet.href = "../src/normalize.css";
  assert.throws(() => compareT2Evidence(fixture("native"), packed), /packed CSS href/);
  packed.packageStylesheet.href = "../dist/normalize.css";
  packed.rows[1].id = packed.rows[0].id;
  assert.throws(() => compareT2Evidence(fixture("native"), packed), /duplicate probe/);
});

test("wrong parent weights, missing computed values and changed context are handled", () => {
  const native = fixture("native");
  native.rows[0].parentFontWeight = "900";
  assert.throws(() => compareT2Evidence(native, fixture("package")), /wrong parent weight/);
  const packed = fixture("package");
  packed.rows[0].fontWeight = "";
  assert.throws(() => compareT2Evidence(fixture("native"), packed), /computed font-weight/);
  packed.rows[0].fontWeight = "700";
  packed.rows[0].fontFamily = "another family";
  assert.equal(compareT2Evidence(fixture("native"), packed).status, "STYLE_MISMATCH");
});

function cli(native, packed) {
  const directory = mkdtempSync(join(tmpdir(), "adui-t2-evidence-"));
  try {
    const a = join(directory, "native.json");
    const b = join(directory, "package.json");
    writeFileSync(a, JSON.stringify(native));
    writeFileSync(b, JSON.stringify(packed));
    return spawnSync(
      process.execPath,
      [fileURLToPath(new URL("./t2-evidence.mjs", import.meta.url)), a, b],
      {
        encoding: "utf8",
        timeout: 10000,
      },
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("CLI exits zero and prints JSON for synthetic expected differences", () => {
  const result = cli(fixture("native", true), fixture("package"));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).weightDifferences, 4);
});

test("CLI distinguishes detected regressions (1) from invalid evidence (2)", () => {
  const packed = fixture("package");
  packed.rows[0].fontSize = "17px";
  const mismatch = cli(fixture("native"), packed);
  assert.equal(mismatch.status, 1);
  const invalid = cli(fixture("package"), packed);
  assert.equal(invalid.status, 2);
  assert.match(invalid.stderr, /evidence invalid/);
});
