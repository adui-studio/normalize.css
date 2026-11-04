import { copyFileSync, mkdirSync } from "node:fs";

const source = new URL("../src/normalize.css", import.meta.url);
const outputDirectory = new URL("../dist/", import.meta.url);
const output = new URL("../dist/normalize.css", import.meta.url);

// CSS-only output: preserve the authored bytes without introducing a JS entry.
mkdirSync(outputDirectory, { recursive: true });
copyFileSync(source, output);
