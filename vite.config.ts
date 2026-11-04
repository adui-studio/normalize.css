import { defineConfig } from "vite-plus";

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
    // Build the only public asset directly, without a JavaScript library entry.
    lib: {
      entry: "src/normalize.css",
      formats: ["es"],
      cssFileName: "normalize",
    },
    cssMinify: false,
    copyPublicDir: false,
  },
  pack: {
    // Verify the experimental tsdown CSS-only entry separately from dist/.
    // Do not publish dist-pack/ or use it for the package root export.
    entry: ["src/normalize.css"],
    outDir: "dist-pack",
    format: ["esm"],
    dts: false,
    css: {
      fileName: "normalize.css",
      minify: false,
    },
  },
});
