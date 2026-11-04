import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

const fixtures = [
  "index",
  "r003-native",
  "r003-candidate",
  "r004-native",
  "r004-risk-review",
  "r004-family-review",
  "t2-native",
  "t2-package",
].map((name) => fileURLToPath(new URL(`./fixtures/${name}.html`, import.meta.url)));

export default defineConfig({
  fmt: {
    // Keep pinned upstream Skills unchanged; first-party files remain checked.
    ignorePatterns: [".agents/skills/**"],
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
  build: {
    // vp build is only for the local HTML evidence pages, not the npm package.
    outDir: "dist-fixtures",
    rolldownOptions: {
      input: fixtures,
    },
    copyPublicDir: false,
  },
  pack: {
    // vp pack is the proven CSS-only library build. No JavaScript entry.
    entry: ["src/normalize.css"],
    outDir: "dist",
    format: ["esm"],
    dts: false,
    css: {
      fileName: "normalize.css",
      minify: false,
    },
  },
});
