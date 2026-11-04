import { openSync, fstatSync, readFileSync, closeSync } from "node:fs";

const MAX_BYTES = 256 * 1024;

/** Load a small, ordinary JSON evidence file without allocating unbounded input. */
export function readEvidenceFile(path) {
  const fd = openSync(path, "r");
  try {
    const stat = fstatSync(fd);
    if (!stat.isFile()) throw new Error("Evidence path must be a regular file");
    if (stat.size > MAX_BYTES) throw new Error("Evidence file exceeds 256 KiB");
    const raw = readFileSync(fd, { encoding: "utf8" });
    if (Buffer.byteLength(raw, "utf8") > MAX_BYTES)
      throw new Error("Evidence file exceeds 256 KiB");
    return JSON.parse(raw);
  } finally {
    closeSync(fd);
  }
}
