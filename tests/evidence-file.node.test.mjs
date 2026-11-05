import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readEvidenceFile } from "./evidence-file.mjs";

function withTempFile(content, inspect) {
  const dir = mkdtempSync(join(tmpdir(), "adui-evidence-input-"));
  try {
    const path = join(dir, "evidence.json");
    writeFileSync(path, content);
    return inspect(path, dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("reads valid JSON evidence", () => {
  withTempFile('{"rows":[],"userAgent":"synthetic"}', (path) => {
    assert.deepEqual(readEvidenceFile(path), { rows: [], userAgent: "synthetic" });
  });
});

test("rejects input larger than 256 KiB before parsing", () => {
  withTempFile(" ".repeat(256 * 1024 + 1), (path) => {
    assert.throws(() => readEvidenceFile(path), /exceeds 256 KiB/);
  });
});

test("rejects malformed JSON without treating it as evidence", () => {
  withTempFile("{ invalid json", (path) => {
    assert.throws(() => readEvidenceFile(path), SyntaxError);
  });
});

test("rejects non-regular paths and always closes handles", () => {
  withTempFile("{}", (_path, dir) => {
    assert.throws(() => readEvidenceFile(dir), /regular file/);
  });
});
