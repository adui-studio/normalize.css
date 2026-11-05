# 默认 Normalize 完整性复核与 0.1.0 准入门槛

**研究时间**：2026-11-05  
**依据**：仓库 [W-05 首版评审](W05_RULE_ACCEPTANCE.md)、[36 条候选来源](RULE_REVIEW.md)、[竞品研究](COMPETITOR_REVIEW.md)、[Issue #18](https://github.com/adui-studio/normalize.css/issues/18)。  
**状态**：下一阶段评审草案。本文不覆盖已发行 `0.0.1` 的首版结论，也不自行宣布默认 Normalize 已完成。

## 一、当前实际情况

- 已发布 npm `0.0.1` **只包含 R-003**；GitHub `main` 处于 **`0.0.2/private:false` 未发布候选**，默认 `src/normalize.css` 包含 R-003、R-007、R-008 共 3 条。
- R-007 和 R-008 已经维护者批准合并，但这不意味着全部支持目标浏览器/组件库均有精确提交绑定的实测 PASS。T0/T2 已经通过 PR #21 合并从 12 个观察点扩展到 **15 个**（无 `title` 的 `abbr`、缩写作者样式、表格作者边框），维护者提供的合并后 Windows 工程日志为 Vitest 7/7、离线 Node 51/51、真实包与 Vite+ 消费各 1/1 PASS；尚未取得这些观察点在目标浏览器的完整真实 T0/T2 原始数据。
- `0.0.2` **不得提前升至 `0.1.0`**。维护者要求只有在默认 `normalize.css` 规则范围和必要验证正式完成后，才使用 `0.1.0`。见 [人工发行规范](../RELEASING.md)。
- **不以规则数量作为完成指标**：需要修复的现代浏览器差异即使只有三条，也不应复制已过时的浏览器补丁或变相 Reset。以下是现有 36 条候选的**下一轮处理建议**，最终范围由维护者审核。

## 二、36 条候选的处理边界

| 处理结果         | 数量 | 说明                                                          |
| ---------------- | ---: | ------------------------------------------------------------- |
| 已合并到默认 CSS |    3 | R-003、R-007、R-008                                           |
| 继续暂缓         |   17 | 未证明必要，或可能影响原生样式、交互及用户偏好                |
| 可选模块设计     |    8 | Reset 六条、Forms 一条、A11y 一条；**均未作为公开子路径实现** |
| 排除默认         |    8 | 与默认 Normalize 的低侵入、安全和原生语义原则冲突             |
| 合计             |   36 | 保留 W-05 的历史决议；本表用于本轮增量评审                    |

| 规则 ID | 意图                             | 当前建议         | 主要理由或验证重点                                                        |
| ------- | -------------------------------- | ---------------- | ------------------------------------------------------------------------- |
| R-001   | HTML 行高统一                    | 继续暂缓         | 根行高属于整体排版决策，缺少当前必需的差异修正证据                        |
| R-002   | iOS 方向变化文字调整             | 继续暂缓         | 移动端文字自动调整涉及可读性与缩放偏好                                    |
| R-003   | b/strong 字重                    | 已合并到默认 CSS | 首版已发布且当前仍保留 b/strong 相对字重                                  |
| R-004   | code/kbd/samp/pre 等宽字体与字号 | 继续暂缓         | 会改变浏览器 monospace 字号/字体偏好                                      |
| R-005   | small 字号                       | 继续暂缓         | 尚未发现需覆盖原生 small 样式的差异                                       |
| R-006   | sub/sup 行高                     | 继续暂缓         | 会改变 sub/sup 的行盒与文本布局                                           |
| R-007   | abbr 标记下划线                  | 已合并到默认 CSS | 已合并带 title 的缩写下划线修正；验证作者覆盖与旧 Safari                  |
| R-008   | table 默认边框颜色               | 已合并到默认 CSS | 已合并 currentColor 修正；Chrome/Edge 149 原生已修复，保留历史 Blink 兼容 |
| R-009   | hr 高度与盒模型                  | 继续暂缓         | HTML 现行默认 hr 有 size 等呈现规则，不宜照搬旧高度/溢出重置              |
| R-010   | progress 垂直对齐                | 继续暂缓         | 改变 progress 垂直基线可能破坏原生视觉                                    |
| R-011   | summary 列表项显示               | 继续暂缓         | 原生 details>summary:first-of-type 已有 list-item 约定，避免全局覆盖      |
| R-012   | 表单控件 margin                  | 继续暂缓         | 表单默认 margin 应先证明目标 UA 差异                                      |
| R-013   | search 输入框外观                | 继续暂缓         | 不默认抹掉 search 的平台外观和控制按钮                                    |
| R-014   | WebKit 搜索装饰                  | 继续暂缓         | WebKit 私有搜索伪元素不足以形成跨引擎契约                                 |
| R-015   | file 选择按钮伪元素              | 继续暂缓         | 标准 file-selector-button 已有支持，修正前需实测旧设备                    |
| R-016   | placeholder 默认颜色与透明度     | 继续暂缓         | placeholder 的颜色/透明度涉及系统外观与可读性                             |
| R-017   | 强制重绘 dialog 主题             | 排除默认         | 不强制重绘原生 dialog 主题                                                |
| R-018   | 未打开 dialog 的显示状态         | 继续暂缓         | 关闭 dialog 的显示应优先保持原生语义                                      |
| R-019   | 强制隐藏所有 [hidden]            | 排除默认         | 强制 hidden display:none 可能影响 hidden=until-found                      |
| R-020   | body margin 清零                 | 可选模块设计     | 全局 body margin 清零是可选 Reset                                         |
| R-021   | 全局 border-box                  | 可选模块设计     | 全局 box sizing 是可选 Reset                                              |
| R-022   | 标题字号和字重重置               | 可选模块设计     | 标题字号字重重置是可选 Reset                                              |
| R-023   | 列表 marker/缩进清零             | 可选模块设计     | 列表 marker/缩进清零是可选 Reset                                          |
| R-024   | 媒体元素块级显示与宽高           | 可选模块设计     | 媒体元素的块级/尺寸规则是可选 Reset                                       |
| R-025   | table border-collapse            | 可选模块设计     | border-collapse 属于可选表格 Reset                                        |
| R-026   | 表单字体继承                     | 可选模块设计     | 表单字体继承属于可选 Forms，需评估组件库                                  |
| R-027   | 表单背景边框和圆角               | 继续暂缓         | 表单边框与背景属于设计偏好，仍待独立 Forms 评审                           |
| R-028   | 全局 :user-invalid 样式          | 继续暂缓         | 验证反馈属于 Forms/应用层，避免首次展示即报错                             |
| R-029   | 全局强制减少动效 !important      | 排除默认         | 禁用全部动效不代表尊重 prefers-reduced-motion                             |
| R-030   | 无条件 outline:none              | 排除默认         | outline:none 会直接破坏可见焦点                                           |
| R-031   | :focus-visible 的有限增强        | 可选模块设计     | 有限 :focus-visible 增强只作为可选 A11y                                   |
| R-032   | 全局主题和滚动条                 | 排除默认         | 不设置全局主题和滚动条                                                    |
| R-033   | 关闭 iOS 点击高亮                | 排除默认         | 不默认关闭 iOS 点击反馈                                                   |
| R-034   | 全局 word-break:break-all        | 排除默认         | 不默认使用侵入性断词                                                      |
| R-035   | 全局 accent-color                | 继续暂缓         | accent-color 是宿主/表单主题选择，继续暂缓                                |
| R-036   | 强制全局字体栈                   | 排除默认         | 全局字体栈不属于 Normalize                                                |

### 特别复审：旧浏览器修复可能已失去现代必要性

**R-008 的上游新证据**：Chromium 2026-04-03 提交 [移除 table 的 UA `border-color: gray`](https://chromium.googlesource.com/chromium/src/+/69afd54ee5a9591975dda9712d20328ee7b61a5c)，[Chrome 149 官方发行说明](https://developer.chrome.com/release-notes/149) 和 [Edge 149 官方说明](https://learn.microsoft.com/microsoft-edge/web-platform/release-notes/149) 已确认此修复。Firefox 和 WebKit 原本没有相同的 UA 灰色边框规则。故 R-008 **在 Chrome/Edge 149 及之后主要是冗余声明，对早期 Blink 有兼容价值**；当前 `:where(table)` 虽可被作者 CSS 覆盖，仍应在完成评审时核对是否继续保留，而非声称所有现代浏览器仍有该 Bug。

**R-007 的上游历史**：[WebKit Bug 277889](https://bugs.webkit.org/show_bug.cgi?id=277889) 已标为 FIXED，`abbr[title]` 点状下划线在近期 Safari 可能由 UA 自身实现；需要兼顾旧 Safari，同时确认不带 `title` 的缩写以及作者明确设置的下划线不受影响。

**R-009 / R-011**：HTML [hr 渲染建议](https://html.spec.whatwg.org/multipage/rendering.html#the-hr-element) 与 [details/summary 渲染建议](https://html.spec.whatwg.org/multipage/rendering.html#the-details-and-summary-elements) 已描述原生行为。不要为追平旧 normalize.css 的规则数量而使用全局 `hr {height:0;overflow:visible}` 或 `summary {display:list-item}`；只在目标 UA 的具体缺陷证据出现后再审。

## 三、默认 Normalize 完成的建议验收条件

1. **规则范围经维护者最终审核**：逐条记录准入/不准入依据，确认是否保留旧 Blink/Safari 兼容的 R-007/R-008；明确 17 条暂缓项的剩余证据需求或不采用结论；**不把可选 Reset/Forms/A11y 误当作默认内容**。
2. **低侵入行为可复核**：包括有 `title` 与无 `title` 的缩写、应用自定义装饰、表格作者边框颜色、原生焦点、`hidden="until-found"`、details/dialog/表单控件；自定义样式应能盖过 `:where()` 的零特异性声明。核对 DOM 和 CSSOM 并保留对比数据。
3. **完整本机验收绑定实际提交**：执行 `pnpm install --frozen-lockfile`、`pnpm run verify:mvp`、`pnpm exec vp build`；留存本机 Git SHA、测试数量、退出码与打包文件清单，必要时对 Vue/React、Element Plus、Ant Design、TDesign、UnoCSS、Tailwind CSS 做组件叠加回归。无证据的浏览器最低版本不得声称 PASS。
4. **发行契约稳定**：CSS-only、无运行时 JavaScript、根入口仍只导出 `dist/normalize.css`；`package.json` 在开发阶段继续 `0.0.2`，不提前改版本、不添加 CI。
5. **达到 `0.1.0` 的明确授权**：只有维护者确认默认 Normalize 规则范围已满足要求且通过必要验收后，才按 [RELEASING](../RELEASING.md) 决定版本升级、npm 发行与一致的 Git Tag / GitHub Release。**本研究并不构成发行授权**。

## 四、本轮实际结果与未验证内容

本轮已从 GitHub 读取当前 36 条评审矩阵，核对它们的原始分类并加入 Chrome/Edge 149 与 WebKit 证据。新增的三类 T0/T2 边界探针和比较器拒绝误报测试已随 PR #21 合并，维护者 Windows 工程回归已 PASS；这仍不能替代浏览器真实 T0/T2 取证。后续可依据本表收敛默认规则或提出新的可复现浏览器差异，不默认写入任何未评审的 CSS 声明。

## 五、2026-11-05 · 阶段性准入复核（分支清理后）

- **分支状态**：GitHub 远程分支仅余 `main` 与历史发行准备分支 `release/prepare-npm-0.0.1-20261105`；后者尚有相对 `main` 的独立提交，保留待单独处置。本节不指示删除历史发布资料。
- **R-007（保持已合并）**：只作用于带 `title` 的缩写，`:where()` 降低选择器特异性；PR #21 已增加无 `title` 与作者装饰样式保护的合成测试，尚不推断旧 Safari 及所有浏览器都已验证。**重开条件**：取得明确浏览器版本上的行为冲突或覆盖失效证据。
- **R-008（保持已合并）**：Chrome 149、Edge 149 官方说明明确移除 `table` UA 旧 `border-color: gray`；这使其在这些版本中的修复价值降低，但旧 Blink 兼容价值仍可能存在。保留 `:where(table) { border-color: currentColor; }`，不凭现代上游修复记录直接删除。**重开条件**：旧版目标 UA 差异的真实 T0/T2 证据与作者边框覆盖回归。
- **R-009（继续暂缓，不编码）**：现行 WHATWG HTML 渲染规范 15.3.11 为 `hr` 定义 `overflow: hidden`、边框、间距，并针对 `size`、`color`、`noshade`、`align` 等属性规定呈现行为。旧式 `overflow: visible`、`height: 0` 或盒模型统一规则有反向改变原生行为风险。**重开条件**：先给出受支持浏览器/OS 的可重复布局差异、最小页面和不破坏呈现属性的最小修复。
- **R-011（继续暂缓，不编码）**：现行 WHATWG HTML 渲染规范 15.5.5 已定义 `details > summary:first-of-type` 为 `list-item`，附带 disclosure marker 与折叠状态处理；全局 `summary { display: list-item; }` 范围过广。**重开条件**：有目标 UA 的具体差异，且修复范围可限制为原生 `details` 场景并验证键盘、marker、开合与作者样式。
- **工程验收与浏览器验收分开**：PR #21 合并后的维护者本机 `verify:mvp` 为 60/60 PASS、CSS-only 311 B、npm dry-run 五文件，不能据此宣布浏览器矩阵 PASS。本轮未修改 `src/normalize.css`、版本、导出、依赖或 CI。

**本次复核来源**： [WHATWG hr 渲染规范](https://html.spec.whatwg.org/multipage/rendering.html#the-hr-element)、[WHATWG details/summary 渲染规范](https://html.spec.whatwg.org/multipage/rendering.html#the-details-and-summary-elements)、[Chrome 149 发布说明](https://developer.chrome.com/release-notes/149)、[Edge 149 发布说明](https://learn.microsoft.com/microsoft-edge/web-platform/release-notes/149)。引用为标准与厂商资料核对，不冒充本库真实设备实测。
