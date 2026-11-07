# R-009 / R-011 · 现代 HTML 原生渲染与实际包对照（研究候选）

**2026-11-07 · 基线**：`main@5a57ecfe1e5abb027725ae2da40722e8d7b3d50e`；正式 npm `@adui/normalize.css@0.1.0`。  
**任务**：[Issue #43](https://github.com/adui-studio/normalize.css/issues/43)；**状态**：规范与竞品核查完成，新增可复现 T0/T2 Fixture；**浏览器实机结果待补证**。  
**约束**：现行默认 Normalize 仅 R-003/R-007/R-008；R-009/R-011 仍 `deferred`，不修改 `src/*.css`、公开导出、版本、依赖、CI 或历史发行内容。

## 一、来源与适用范围

| 来源 | 核对内容 | 可证明 / 不可证明 |
| --- | --- | --- |
| [WHATWG HTML Rendering §15.3.11](https://html.spec.whatwg.org/multipage/rendering.html#the-hr-element) | 建议 UA 为 `hr` 使用 `color: gray`、`border-style: inset`、1px 边框、`margin-block: .5em`、`margin-inline: auto`、`overflow: hidden`；另外规定 `align`、`size`、`noshade`、`color`、`width` 的呈现属性处理 | 是对**用户代理默认渲染的建议**，不能推出作者级 CSS 应覆盖这些属性，也不代表每个浏览器实现完全一致 |
| [WHATWG HTML Rendering §15.5.5](https://html.spec.whatwg.org/multipage/rendering.html#the-details-and-summary-elements) | 建议 `details, summary` 默认为 `block`，`details > summary:first-of-type` 为 `list-item`，使用 `disclosure-closed` / `disclosure-open`；无直接 summary 时提供 UA 自定义的默认标签 | 不等于要全局设置 `summary {display:list-item}`，且并非所有可访问性和 marker 行为在全部浏览器完全一致 |
| [MDN `summary`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary) | 描述原生 disclosure、作者改 `display:block` 可隐藏默认三角、存在辅助技术/标题语义差异 | 是行为参考，不是本库特定版本的实测证明 |
| [necolas/normalize.css v8 当前主仓库文件](https://github.com/necolas/normalize.css/blob/master/normalize.css) | 保留旧 `hr` 的 `box-sizing:content-box; height:0; overflow:visible` 以及全局 `summary {display:list-item}`；源文件注释包含 Firefox / Edge / IE 等历史动机 | 是历史修复方案，并非如今 `@adui/normalize.css` 必须移植的规则 |
| [modern-normalize v3.0.1 源码](https://github.com/sindresorhus/modern-normalize/blob/main/modern-normalize.css) | 仍有 `summary {display:list-item}`，但当前源码**未包含针对 `hr` 的专门规则**，全局盒模型属于其 opinionated 选择 | 证明竞品取舍并不统一，不能独立证明某个具体 UA 仍有 bug |

特别注意：WHATWG 的 Rendering 章节使用 *expected* 描述建议的 UA 表现。若作者侧为兼容旧引擎新增规则，需要证明实际缺陷和规则的额外价值；不能把规范建议当作需要复制到 CSS Normalize 的清单。

## 二、仓库实际代码与缺口

- `src/normalize.css` 仅影响 `b/strong`、`abbr[title]`、`table`；未触及 `hr` / `summary` / `details`。
- `src/reset.css` 是 opt-in 的基础盒模型和间距策略，没有专门为 `hr` / `summary` 写覆盖规则。即使在 Reset 中观察到全局盒模型改变，也不意味着应将它搬到默认 Normalize。
- 已有 `t2-native.html`/`t2-package.html` 测试原生 summary，但缺少 `hr` 传统呈现属性与作者自定义 marker 的成对观测点。因此本轮仅补专用 Fixture，不调整旧 15 点测量口径。

## 三、本轮新增 Fixture 与观察矩阵

新增 `fixtures/r009-r011-native.html`（T0）和 `fixtures/r009-r011-package.html`（T2），以及同源 `r009-r011-probe.js`。两页 **body、作者 `style`、探针完全相同**，T2 只额外导入 `../dist/normalize.css`；这是真实 `vp pack` 产物路径，非候选规则或内存 CSS。保留现有固定默认规则。

| 场景 | DOM 或作者样式 | 核对点 |
| --- | --- | --- |
| R-009 / 1 | `hr` | 原生高度、边框、溢出与实际渲染高度 |
| R-009 / 2 | `hr size="1"`、`hr size="4"` | 历史 `size` 呈现属性 |
| R-009 / 3 | `hr size="4" noshade`、`hr color width` | 呈现属性的组合与优先级 |
| R-009 / 4 | 作者 `height`、`border`、`overflow` | T2 不得覆盖作者明确意图 |
| R-011 / 1 | `details > summary`（默认关闭） | `display`、marker、实际点击/Enter/Space 展开 |
| R-011 / 2 | `details open > summary` | 初始打开、原生 marker、收起与焦点 |
| R-011 / 3 | 作者 `summary {display:block}`（仅局部 class） | 作者显式隐藏 marker 的策略不得被新默认规则覆盖 |
| R-011 / 4 | 作者 `summary::marker`，以及无 `summary` 的 `details` | 作者自定义与 UA 后备 label，应人工核对视觉 |

探针记录 UA、访问路径、HTTP(S) 协议、T2 链接状态、`hr` 计算样式与 `getBoundingClientRect().height`、`summary` 的 display/list-style/marker 内容、当前 `details.open` 及焦点快照。**不修改被测原生节点，不发送网络请求、不写浏览器持久存储**。

## 四、本机操作（Windows PowerShell）

```powershell
git rev-parse HEAD
pnpm install --frozen-lockfile
pnpm run verify:mvp
pnpm exec vp build
pnpm exec vp pack
pnpm exec vp dev
```

访问 Vite+ 实际输出的同源 HTTP 地址：

- `/fixtures/r009-r011-native.html`：T0 原生行为。
- `/fixtures/r009-r011-package.html`：T2，真实 `dist/normalize.css`。

在同一浏览器/OS/缩放/窗口尺寸下打开两页，**先不要交互**，分别复制 `#r009-r011-output`（或在 Console 调用 `window.__aduiR009R011Capture()`），按 ID 比对 `hr` 的所有计算样式及 `summary` 的 display、list-style、marker 与默认开合状态。由于产品 CSS 没有两项选择器，**预期无新增的计算样式差异**；真实 UA 可对合法传统属性展示不同本机默认值，不以固定像素值跨浏览器强求一致。

然后实际通过鼠标、Tab、Enter、Space 展开/折叠相关 `details`，每一步在**焦点未改变时**调用探针并记录输出/截图。原生 marker 的实际可见性、键盘顺序、辅助技术角色和后备 label 仍需人工观察；探针 `::marker` 计算值不能代替视觉或无障碍实测。检查 T2 Network `../dist/normalize.css` 真实响应，`stylesheet.loaded=true` **并不独立证明 HTTP 状态**。

在 Firefox、Safari、Chrome/Edge、移动端需要分别记录**浏览器准确版本/OS/设备和原始观测**。如有差异，先判断是否为用户代理允许的默认呈现差异；只有实测证明影响真实应用，才提出默认 CSS 或可选模块修复建议。

## 五、当前验证状态与最终准入建议

- **已确认（仓库事实/来源）**：正式默认 CSS 无 R-009/R-011；标准来源、竞品 v8 与 modern-normalize v3.0.1 取舍已核对。
- **已完成（开发候选）**：新 T0/T2 DOM 与作者 CSS、页面探针、Fixture 导航、Vite+ 新页面输入以及 Node 静态契约测试已编写；它们**不属于 npm 包**。
- **NOT_RUN（本轮仍待）**：维护者 Windows 当前 HEAD `verify:mvp` / `vp build` / 实际 HTTP 打包导入；Firefox/Safari/Chrome 真实 T0/T2 原始结果及人工 Tab/marker 操作。浏览器沙箱对本机 `file://` 导航未得到可用页面输出，**不冒充 Chromium 真实测试通过**。

**建议继续 `deferred`**。如果 T0/T2 无引入差异且没有产品级 UA 缺陷，Issue #43 可按“无新增 CSS 规则必要”研究结论关闭；如果存在可复现 bug，应另立最小 CSS 修复 PR、更新对应 ADR/需求/SDD 并评估语义化版本。此文档既不是批准新 CSS，也不构成新的 npm/Tag/Release/CI 授权。
