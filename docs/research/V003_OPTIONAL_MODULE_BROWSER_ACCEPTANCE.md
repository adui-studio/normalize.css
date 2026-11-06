# v0.0.3 · 可选 CSS 模块真实浏览器验收矩阵

**日期**：2026-11-06  
**任务**：[Issue #18](https://github.com/adui-studio/normalize.css/issues/18)  
**基线**：已发行 `@adui/normalize.css@0.0.3`，Tag `v0.0.3` 对应源提交 `f5c08642e1ab6eaa1cb3d84782485f0298ae77be`；发行后的文档同步已合并到 `main@783c3b298adfbcfa6e4aae999073e12c01eeb626`。  
**状态**：**已准备本地测试资产，尚无本轮真实浏览器结果**；未修改产品 CSS、包版本、依赖或 CI，不对浏览器最低版本作新的承诺。

## 1. 现有证据与缺口

- `src/normalize.css` 只有 R-003、R-007、R-008。原生 T0 / 打包 T2 使用 15 个探针和严格 CSSOM 比较器；继续复用 [R-007/R-008 专项补证](R007_R008_COMPATIBILITY_V003.md)。
- 可选 `reset.css`、`forms.css`、`a11y.css`、`all.css` 已公开发行。维护者已经在准确发布 SHA 上通过 61/61 工程测试（包括真实 tarball 安装和 `all.css` 的 Vite+ 生产消费）。**工程通过不等于浏览器真实计算样式、键盘交互及系统偏好通过**。
- [W-06 归档](W06_ACCEPTANCE_INDEX.md) 已记录 Vue/React/TDesign、Tailwind/UnoCSS 的历史成果；其重点是旧阶段**默认 Normalize**。不能把历史结果自动扩展成 `v0.0.3` 新可选模块全部通过。

## 2. 新增 M0 / M1 页面

| 角色    | 路径（端口以 `vp dev` 实际输出为准） | 说明                                                                              |
| ------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| M0 原生 | `/fixtures/modules-native.html`      | 无本库 CSS；只使用两页相同的作者样式                                              |
| M1 All  | `/fixtures/modules-all.html`         | 只比 M0 多一个 `<link id="modules-css" rel="stylesheet" href="../src/all.css" />` |

两页的 `<body>` 和 `<style>` 必须逐字一致；公共 `fixtures/modules-probe.js` 使用 `getComputedStyle`、`matchMedia` 与焦点样式观察，将数据展示在 `#module-output`，并提供 `window.__aduiModuleCapture()` 重新采样。脚本只用于本地 Fixture，不随 npm 发行。

**证据边界**：M1 加载的是仓库 `src/all.css`（该文件也随 npm 包发布），而非从 Registry 安装 tarball 后运行的消费应用。因此 M1 是**本地模块行为证据**，不是新的真实 npm 消费 PASS。`stylesheet.loaded: true` 仅反映浏览器已识别样式表；还应检查实际 CSSOM 规则与计算样式。Vite/Vite+ 开发服务可能使用 `postcss-import` 将四个相对 `@import` 内联到一个 `all.css` 响应中，因此**不能要求 Network 中必须出现四个独立 CSS 请求**。若导入没有被内联，应核对相应子请求；无论采用哪种处理方式，均不得有加载错误。

## 3. 行为验收要点

| 模块     | 样例对象 / 属性                                             | 验收关注点                                                 |
| -------- | ----------------------------------------------------------- | ---------------------------------------------------------- |
| Reset    | `module-box.boxSizing`                                      | M1 应为 `border-box`                                       |
| Reset    | 标题、段落、列表 `marginBlockStart/End`                     | M1 对应间距为 0；列表 marker 不得被清空                    |
| Reset    | `module-svg.maxInlineSize`                                  | M1 媒体宽度应受到 120px 容器约束；还需检查实际可见宽度     |
| Reset    | `module-table.borderCollapse` / `borderSpacing`             | M1 使用折叠边框模型；该布局变化属于显式 opt-in             |
| Forms    | Button / Input / Select / Textarea `fontFamily`、`fontSize` | M1 继承 18px 表单上下文字体；原生交互与外观仍可用          |
| Forms    | Checkbox / Radio / File / Fieldset / Legend                 | 检查可选中、可输入、文件按钮可见、图形无破坏               |
| A11y     | 键盘 Tab 的 `focusVisible` 与 outline                       | 必须由**真实键盘**触发，并辅以可见焦点截图                 |
| A11y     | Windows 强制颜色模式与 `media.forcedColors`                 | 仅具备真实环境时验收，否则记 N/A                           |
| A11y     | 系统减少动态效果与 `rootScrollBehavior`                     | 共同作者样式先设置 smooth；当系统 reduce 时 M1 应改为 auto |
| 原生行为 | Details、Dialog、Hidden                                     | 展开/收起、Esc 关闭、隐藏元素仍按原生语义工作              |

**禁止误判**：M0 和 M1 不要求所有计算值相等；Reset/Forms 具有明确的**预期差异**。采样脚本也不自动输出 PASS/FAIL。输入法、键盘、原生控件与系统偏好必须手工核实；一份 JSON 不能证明完整交互。

## 4. 证据优先级矩阵

| 优先级 | 浏览器 / 生态                                           | 本轮 M0 / M1 状态 | 说明                                               |
| ------ | ------------------------------------------------------- | ----------------- | -------------------------------------------------- |
| P0     | Chrome / Edge 当前稳定版，Windows                       | EVIDENCE_MISSING  | 重点补表单、焦点与 forced-colors                   |
| P0     | Firefox 当前稳定版                                      | EVIDENCE_MISSING  | 补表单、布局、焦点、详情                           |
| P0     | 真实 Safari macOS 可用版本                              | EVIDENCE_MISSING  | 留意 R-007 简写及原生文件按钮                      |
| P1     | Chrome / Edge 120（安全隔离可得时）                     | EVIDENCE_MISSING  | 专项验证旧 Blink R-008 修复价值                    |
| P1     | 真实 Safari 17.2 / iOS Safari 17.2（可得时）            | EVIDENCE_MISSING  | R-007 旧 WebKit 风险；不能用模拟 UA 代替           |
| P1     | Android Chrome / Firefox 真机                           | EVIDENCE_MISSING  | 记录 OS / 浏览器完整版本 / 设备                    |
| P2     | Vue + Element Plus / Vue + TDesign / React + Ant Design | 待扩展            | 既有消费者主要覆盖默认 Normalize，不是 opt-in 模块 |
| P2     | Tailwind Preflight / UnoCSS Reset                       | 待专项风险复核    | 避免重复引入 `reset.css` 或 `all.css` 造成双 Reset |

`EVIDENCE_MISSING` 表示当前仓库没有本轮新增场景的**原始实测附件**，不意味着维护者此前没有运行过，也不否认 W-06 的管理验收。真实 Safari 与 Playwright WebKit、真机与移动视口模拟必须区分。旧浏览器只能用于受控本地页面测试，不登录账号或访问不可信网站。

## 5. Windows PowerShell 执行步骤

本 PR 为本地 Fixture 增量；**无需新增浏览器自动化依赖，也不需要 CI**。

```powershell
git fetch origin
git switch test/v003-optional-modules-browser-20261106
git pull --ff-only
git rev-parse HEAD

pnpm install --frozen-lockfile
vp check --fix
pnpm run verify:mvp
pnpm exec vp build
pnpm exec vp dev
```

在同一个真实浏览器、相同版本/设备/OS 配置下打开（端口以实际输出为准）：

- `http://localhost:5173/fixtures/modules-native.html`
- `http://localhost:5173/fixtures/modules-all.html`

M0 不应加载本库 CSS；M1 应能在 Network 识别 `../src/all.css`（响应 `200` 或浏览器缓存有效时的 `304` 均可能正常）。Vite+ 开发服务可以内联四个相对导入，因此只看到 `all.css` 一个 CSS 请求**不应判失败**。M1 的 `stylesheet.href` 应为 `../src/all.css`、`stylesheet.loaded` 应为 `true`；必须进一步确认 CSSOM 中 Normalize / Reset / Forms / A11y 的代表规则存在、对应计算样式符合预期，并排除 404/资源内容错误。若仍是原生 `@import`，再检查其子请求。仅凭 `loaded:true` 或 `304` 不能直接判定四模块完整生效。

按下 Tab 导航、操作 Button / Input / Checkbox / Radio / File / Details / Dialog，记录鼠标、键盘、Esc 关闭、样式与截图。系统开启减少动态效果后重载；有条件再启用 Windows 强制颜色模式并重载。控制台重新取样：

```js
window.__aduiModuleCapture();
```

对 M0 和 M1 分别保存原始 JSON、Network 截图、操作日志、OS / 设备与浏览器完整版本号；使用 Console 后焦点可能变化，**以实际 Tab 时自动更新的页面采样和截图**为准。移动设备不可用自己的 localhost 代替开发机 IP，具体 LAN 网络策略应自行确认。

旧的**默认 Normalize** 15 探针仍用独立流程：

```powershell
pnpm exec vp pack
# 保存同一浏览器的 /fixtures/t2-native.html 与 /fixtures/t2-package.html 原始 JSON
node tests/t2-evidence.mjs .\t2-native.json .\t2-package.json
```

**不可使用 `tests/t2-evidence.mjs` 去比较新 M0/M1**：它只认旧 T0/T2 的 15 探针、页面角色与 3 条默认规则的 CSSOM。`vp build` 原有 8 个 Fixture 入口保持不变；新 M0/M1 仅由 `vp dev` 直接服务，故 `vp build` 成功也不等于手工页面已验收。

### 5.1 Vite+ CSS @import 内联与缓存的判断

Vite 官方文档明确支持经 postcss-import 内联 CSS `@import`（见 [Vite CSS @import Inlining](https://vite.dev/guide/features#css)）。因此开发服务的 Network 面板仅出现一个 `all.css` 很常见，并不能推导其余四个模块未加载。若显示 `304 Not Modified`，说明客户端缓存验证后可复用现有资源；也不应仅凭状态码认定所有规则正确。

可在 M1 页面（保持没有切换为其他样式源）打开 DevTools Console，运行**只读 CSSOM 采样**，收集四个模块各一条代表选择器：

```js
const stylesheet = document.querySelector("#modules-css")?.sheet;
if (!stylesheet) throw new Error("all.css stylesheet missing");
const selectors = [];
function collectRules(rules) {
  for (const rule of rules) {
    if (rule.type === CSSRule.IMPORT_RULE) {
      if (!rule.styleSheet) throw new Error("unresolved CSS @import");
      collectRules(rule.styleSheet.cssRules);
    } else if (rule.type === CSSRule.STYLE_RULE) {
      selectors.push(rule.selectorText.replace(/\s+/g, ""));
    } else if ("cssRules" in rule) {
      collectRules(rule.cssRules);
    }
  }
}
collectRules(stylesheet.cssRules);
console.table({
  normalize: selectors.includes("b,strong"),
  reset: selectors.some(
    (selector) => selector.includes("*::before") && selector.includes("*::after"),
  ),
  forms: selectors.includes(":where(button,input,select,textarea)"),
  a11y: selectors.includes(":where(:focus-visible)"),
});
```

四项均为 `true` 是**当前源码结构下四类代表规则可被 CSSOM 读取**的证据，但还须结合已有计算样式、真实键盘/原生控件操作及系统偏好判断效果。若 CSSOM 因安全限制无法访问，记录 `BLOCKED` 并检查 Network Response / Sources 与样式来源，**不要伪造通过**。测试 Console 后焦点可能变化，焦点结果以真实 Tab 采样为准。

## 6. 每环境证据记录模板

| 字段                                            | 结果             |
| ----------------------------------------------- | ---------------- |
| HEAD / 浏览器品牌与完整版本 / OS / 设备         | 待填写           |
| M0 与 M1 两份原始 JSON                          | 待提供           |
| `all.css` Network、CSSOM 四模块规则及缓存状态   | 待提供           |
| Reset（布局、列表、媒体、表格）                 | EVIDENCE_MISSING |
| Forms（字体、输入、原生控件）                   | EVIDENCE_MISSING |
| A11y（键盘焦点、forced-colors、reduced-motion） | EVIDENCE_MISSING |
| Details / Dialog / Hidden 原生交互              | EVIDENCE_MISSING |
| 截图、失败重现步骤 / 判定                       | 待提供           |

状态只能按真实证据填写 `PASS` / `FAIL` / `BLOCKED` / `N/A` / `EVIDENCE_MISSING`。缺少真实样例不能脑补；`CSS.supports` 也只能作为语法线索，不能代替 computed style 与可见结果。

## 7. 下一步与代码边界

1. 首先由维护者在 Windows 上运行本次新增 Fixture 的静态/浏览器验证并保存真实证据。新增仓库测试的通过状态待实测，不能沿用发行 SHA 的 61/61 代替。
2. 优先真实 Chrome/Edge + Firefox；Safari/移动端在可获得设备后补证。发现 R-007/R-008 证据后再讨论是否修改默认规则，不为凑规则数量而改。
3. 生态消费者中新增可选模块覆盖须独立评估；本轮不改现有 Vue/React/Tailwind/UnoCSS 测试脚本。
4. `0.1.0` 仍为未批准的完整性里程碑；本轮不改 `src/*.css`、`package.json`、`vite.config.ts`、锁文件、依赖、CI，也不重发 npm/Tag/Release。
