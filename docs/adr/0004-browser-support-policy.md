# ADR-0004 — 首版浏览器特性基线及支持范围

- **状态**：Proposed（未批准）
- **日期**：2026-11-03
- **关联**：[NFR-002、NFR-003、NFR-007](../REQUIREMENTS.md) · [浏览器矩阵](../research/BROWSER_REVIEW.md) · [ADR-0003](0003-mvp-package-contract.md)
- **事实**：仓库尚无 CSS 实现、可运行测试或浏览器兼容证明。

## 1. 决策问题

如何为 `@adui/normalize.css` 选择**可重复验证**的浏览器最低支持策略？必须区分：

- **语法支持**：浏览器是否识别 CSS 声明或选择器。
- **Normalize 必要性**：不同浏览器真实 UA 默认样式是否存在值得修复的差异。
- **集成兼容**：无障碍、系统偏好、Vue/React 组件库与其他 Reset 是否回归。
- **宿主环境**：独立浏览器与 Android WebView、微信内置浏览器的行为不必相同。

## 2. 方案对比

| 方案 | 描述 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（**目前建议**） | 选定 **Baseline 2023** 固定年份作为 CSS **特性准入参考**，再核定各浏览器最低版本 | 基线可复现，现代能力与旧设备覆盖相对平衡 | 不自动证明 UA 样式一致，必须后续计算版本与实测 |
| B | Baseline 2024 固定年份 | 可使用更新的互操作特性 | 可能收窄旧 Safari、Android 系统支持 |
| C | 动态 Baseline Widely available | 跟随最新互操作进展 | 30 个月移动窗口改变，难作固定 npm 发行承诺 |
| D | 最新两个主要版本 | 简单 | 随时间变化，无法复现历史支持承诺 |

[web.dev Baseline](https://web.dev/baseline) 说明 Newly available 与 Widely available 的区别；[如何选择 Baseline](https://web.dev/how-to-use-baseline) 明确区分固定年份与动态目标。Widely available 的时间条件为 30 个月。

**方案 A 只是建议，不等于接受，也不等于已经声明支持某些具体浏览器版本。**

## 3. 分层支持范围（拟议）

| 范围 | 浏览器 | 当前立场 |
| --- | --- | --- |
| 核心桌面 | Chrome、Edge、Firefox、Safari macOS | 计划覆盖，最低版本待确认 |
| 核心移动 | Chrome Android、Firefox Android、Safari iOS | 计划覆盖，OS / 设备 / 真实版本待核验 |
| 条件性验证 | Android System WebView、Windows WebView2、微信/X5 内置浏览器、Samsung Internet 等 | 不能通过共享内核自动推导支持；有具体设备、宿主与 Fixture 后逐项评审 |
| 非首版承诺 | IE 与无测试条件的停维护旧浏览器 | 不承诺；如有场景需求则另行评审 |

[MDN Baseline](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility) 明确：Baseline 不能取代无障碍与浏览器测试，也不能天然覆盖所有系统 WebView。

## 4. 冻结具体浏览器最低版本的步骤

1. 维护者先批准固定年份方案。
2. 使用官方 [baseline-browser-mapping](https://github.com/web-platform-dx/baseline-browser-mapping) 的 `targetYear` 得到各核心浏览器版本，并固定数据快照。**本轮没有执行映射，也未批准具体最低版本值。**
3. 审核计划纳入的每项 CSS 特性；超出年份目标的特性必须提供回退或不采纳。
4. 为候选规则记录没有本库 CSS 的原生 HTML Baseline、仅单规则变化、实际浏览器/OS/版本和是否仍有差异。
5. 按 [浏览器测试矩阵](../research/BROWSER_REVIEW.md) 验证焦点、表单、dialog、hidden、系统偏好及组件生态。
6. 在发行说明中明确“正式支持 / 经部分验证 / 未验证”及完整版本边界。

[Playwright 浏览器文档](https://playwright.dev/docs/browsers) 说明其 WebKit 自动化版本与品牌 Safari 不同；真实 Safari/iOS 仍需要明确的验证记录。

## 5. 结果、风险和决定

- **尚未批准**：Baseline 2023、支持设备清单、浏览器最低版本及测试工具。
- **已明确的长期原则**：不把历史 UA 规则原样复制为现代修复；不因语法支持就宣称整套 CSS 兼容。
- **待明确**：微信内置 WebView 是否列为承诺平台、Firefox ESR 是否单独测试、旧 iOS 的最低系统版本、实际可获得的测试环境。
- **不增加 CI**：未来验证只能在明确授权开发后进行本地运行。
- ADR 状态维持 **Proposed**，不得改为 Accepted 或宣称开始开发。
