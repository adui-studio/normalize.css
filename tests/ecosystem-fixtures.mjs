export const ecosystemCases = Object.freeze({
  "vue-element": {
    title: "Vue 3 + Element Plus",
    dependencies: ["vue@3.5.44", "element-plus@2.14.7"],
    packages: { vue: "3.5.44", "element-plus": "2.14.7" },
    buttonSelector: ".el-button",
    inputSelector: ".el-input",
    source: [
      'import { createApp, h } from "vue";',
      'import { ElButton, ElInput } from "element-plus";',
      'import "element-plus/dist/index.css";',
      'createApp({',
      '  render() {',
      '    return h("div", { id: "ui-panel" }, [',
      '      h(ElButton, { type: "primary" }, () => "Element Button"),',
      '      h(ElInput, { modelValue: "Element Input" }),',
      '    ]);',
      '  },',
      '}).mount("#app");',
    ],
  },
  "react-antd": {
    title: "React + Ant Design",
    dependencies: ["react@19.3.1", "react-dom@19.3.1", "antd@6.6.8"],
    packages: { react: "19.3.1", "react-dom": "19.3.1", antd: "6.6.8" },
    buttonSelector: ".ant-btn",
    inputSelector: ".ant-input",
    source: [
      'import { createElement } from "react";',
      'import { createRoot } from "react-dom/client";',
      'import { Button, Input } from "antd";',
      'createRoot(document.querySelector("#app")).render(',
      '  createElement("div", { id: "ui-panel" },',
      '    createElement(Button, { type: "primary" }, "Ant Button"),',
      '    createElement(Input, { defaultValue: "Ant Input" }),',
      '  ),',
      ');',
    ],
  },
});

export function consumerHtml() {
  return [
    "<!doctype html>",
    '<html lang="zh-CN">',
    "  <head>",
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    "    <title>W-06 · 真实组件库 CSS 对照</title>",
    '    <script type="module" src="./entry.js"></script>',
    "  </head>",
    "  <body>",
    "    <h1>W-06 · 真实 npm 包与 UI 组件库</h1>",
    "    <p>在相同浏览器中对比 native 与 package 两份独立构建。</p>",
    '    <section style="font-weight: 600">',
    '      <b id="b-600">b 标签</b>',
    '      <strong id="strong-600">strong 标签</strong>',
    "    </section>",
    '    <section style="font-weight: 700">',
    '      <b id="b-700">b 标签</b>',
    '      <strong id="strong-700">strong 标签</strong>',
    "    </section>",
    '    <code id="code">const value = 1;</code>',
    '    <div id="app"></div>',
    '    <pre id="probe-output">等待组件渲染</pre>',
    "  </body>",
    "</html>",
    "",
  ].join("\n");
}

export function consumerSource(caseName, withNormalize) {
  const config = ecosystemCases[caseName];
  if (!config) {
    throw new Error("Unknown ecosystem case: " + caseName);
  }

  return [
    ...(withNormalize ? ['import "@adui/normalize.css";'] : []),
    ...config.source,
    "",
    'const measure = (id) => {',
    "  const node = document.getElementById(id);",
    "  if (!node) return null;",
    "  const style = getComputedStyle(node);",
    "  return {",
    "    id,",
    "    fontWeight: style.fontWeight,",
    "    fontSize: style.fontSize,",
    "    fontFamily: style.fontFamily,",
    "  };",
    "};",
    "requestAnimationFrame(() => requestAnimationFrame(() => {",
    "  const evidence = {",
    "    caseName: " + JSON.stringify(caseName) + ",",
    "    userAgent: navigator.userAgent,",
    '    rows: ["b-600", "strong-600", "b-700", "strong-700", "code"].map(measure),',
    "    ui: {",
    "      buttonMounted: Boolean(document.querySelector(" + JSON.stringify(config.buttonSelector) + ")),",
    "      inputMounted: Boolean(document.querySelector(" + JSON.stringify(config.inputSelector) + ")),",
    "    },",
    "  };",
    "  window.__aduiEcosystemEvidence = evidence;",
    '  document.querySelector("#probe-output").textContent = JSON.stringify(evidence, null, 2);',
    "}));",
    "",
  ].join("\n");
}
