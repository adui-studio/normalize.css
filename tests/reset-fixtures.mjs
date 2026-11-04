export const resetCases = Object.freeze({
  "tailwind-preflight": {
    title: "Tailwind CSS v4 Preflight",
    packages: { tailwindcss: "4.3.4", "@tailwindcss/vite": "4.3.4" },
    imports: [
      '@import "tailwindcss/theme.css" layer(theme);',
      '@import "tailwindcss/preflight.css" layer(base);',
    ],
    layers: "@layer theme, base, components, utilities;",
    vitePlugin: true,
  },
  "unocss-tailwind-v4": {
    title: "UnoCSS Reset tailwind-v4",
    packages: { "@unocss/reset": "66.12.0" },
    imports: ['@import "@unocss/reset/tailwind-v4.css";'],
    layers: "",
    vitePlugin: false,
  },
  "unocss-tailwind-compat": {
    title: "UnoCSS Reset tailwind-compat",
    packages: { "@unocss/reset": "66.12.0" },
    imports: ['@import "@unocss/reset/tailwind-compat.css";'],
    layers: "",
    vitePlugin: false,
  },
});

export const resetModes = Object.freeze(["baseline", "normalize-first", "normalize-last"]);

export function resetCss(caseName, mode) {
  const spec = resetCases[caseName];
  if (!spec) throw new Error("Unknown Reset case: " + caseName);
  if (!resetModes.includes(mode)) throw new Error("Unknown Reset mode: " + mode);

  const normalize = '@import "@adui/normalize.css";';
  const imports =
    mode === "normalize-first"
      ? [normalize, ...spec.imports]
      : mode === "normalize-last"
        ? [...spec.imports, normalize]
        : [...spec.imports];
  return [...(spec.layers ? [spec.layers] : []), ...imports, ""].join("\n");
}

export function resetHtml() {
  return [
    "<!doctype html>",
    '<html lang="zh-CN">',
    "  <head>",
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    "    <title>W-06 · 独立 Reset 对照</title>",
    '    <script type="module" src="./entry.js"></script>',
    "  </head>",
    "  <body>",
    '    <h1 id="heading">原生标题</h1>',
    '    <p id="paragraph">原生段落</p>',
    '    <section style="font-weight: 600">',
    '      <b id="bold">加粗标签</b>',
    '      <strong id="strong">强调标签</strong>',
    "    </section>",
    '    <code id="code">const value = 1;</code>',
    '    <ul id="list"><li>列表条目</li></ul>',
    '    <button id="button" type="button">原生按钮</button>',
    '    <input id="input" placeholder="原生输入框" />',
    '    <details id="details"><summary>展开内容</summary><p>详情内容</p></details>',
    '    <div id="hidden" hidden>应隐藏</div>',
    '    <div id="until-found" hidden="until-found">查找时显示</div>',
    '    <dialog id="dialog">原生弹窗</dialog>',
    '    <pre id="probe-output">等待采集</pre>',
    "  </body>",
    "</html>",
    "",
  ].join("\n");
}

export function resetProbe() {
  return [
    'const ids = ["heading", "paragraph", "bold", "strong", "code", "list", "button", "input", "details", "hidden", "until-found", "dialog"];',
    'const properties = ["fontFamily", "fontSize", "fontWeight", "lineHeight", "boxSizing", "margin", "padding", "borderWidth", "borderStyle", "backgroundColor", "display", "appearance", "outlineStyle", "cursor"];',
    "requestAnimationFrame(() => requestAnimationFrame(() => {",
    "  const rows = ids.map((id) => {",
    "    const element = document.getElementById(id);",
    "    const style = getComputedStyle(element);",
    "    return { id, ...Object.fromEntries(properties.map((key) => [key, style[key]])) };",
    "  });",
    "  const evidence = { userAgent: navigator.userAgent, rows };",
    "  window.__aduiResetEvidence = evidence;",
    '  document.getElementById("probe-output").textContent = JSON.stringify(evidence, null, 2);',
    "}));",
    "",
  ].join("\n");
}

export function resetViteConfig(caseName) {
  const spec = resetCases[caseName];
  if (!spec) throw new Error("Unknown Reset case: " + caseName);
  return [
    'import { defineConfig } from "vite-plus";',
    ...(spec.vitePlugin ? ['import tailwindcss from "@tailwindcss/vite";'] : []),
    "export default defineConfig({",
    ...(spec.vitePlugin ? ["  plugins: [tailwindcss({ optimize: false })],"] : []),
    '  build: { outDir: "dist", cssMinify: false, copyPublicDir: false },',
    "});",
    "",
  ].join("\n");
}
