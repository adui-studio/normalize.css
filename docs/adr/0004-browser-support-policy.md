# ADR-0004 — 首版浏览器特性基线及支持范围

- **状态**：Accepted（2026-11-03，维护者明确同意方案 A：固定 Baseline 2023 作为特性准入参考）
- **日期**：2026-11-03
- **关联**：[NFR-002、NFR-003、NFR-007](../REQUIREMENTS.md) · [浏览器矩阵](../research/BROWSER_REVIEW.md) · [ADR-0003](0003-mvp-package-contract.md)
- **接受时事实（2026-11-03）**：仓库当时尚无 CSS 实现、可运行测试或浏览器兼容证明。

**2026-11-05 实施补记（不修改 Accepted 决策）**：PR #1/#9 已合并 main，R-003 唯一产品 CSS 已实现，W-06 已由维护者管理验收。Chrome 120、Firefox 121 有局部实测，仍不能认定七个最低目标的正式 CSS T2 全部通过。历史 OS/设备要求详见 [Baseline 映射研究](../research/BASELINE_2023_MAPPING.md)；对外支持声明须经 W-07/P-05 审核。


## 1. 决策问题

如何为 `@adui/normalize.css` 选择**可重复验证**的浏览器最低支持策略？必须区分：

- **语法支持**：浏览器是否识别 CSS 声明或选择器。
- **Normalize 必要性**：不同浏览器真实 UA 默认样式是否存在值得修复的差异。
- **集成兼容**：无障碍、系统偏好、Vue/React 组件库与其他 Reset 是否回归。
- **宿主环境**：独立浏览器与 Android WebView、微信内置浏览器的行为不必相同。

## 2. 方案对比

| 方案                      | 描述                                                                             | 优点                                     | 缺点                                           |
| ------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| A（**已接受的基线策略**） | 选定 **Baseline 2023** 固定年份作为 CSS **特性准入参考**，再核定各浏览器最低版本 | 基线可复现，现代能力与旧设备覆盖相对平衡 | 不自动证明 UA 样式一致，必须后续计算版本与实测 |
| B                         | Baseline 2024 固定年份                                                           | 可使用更新的互操作特性                   | 可能收窄旧 Safari、Android 系统支持            |
| C                         | 动态 Baseline Widely available                                                   | 跟随最新互操作进展                       | 30 个月移动窗口改变，难作固定 npm 发行承诺     |
| D                         | 最新两个主要版本                                                                 | 简单                                     | 随时间变化，无法复现历史支持承诺               |

[web.dev Baseline](https://web.dev/baseline) 说明 Newly available 与 Widely available 的区别；[如何选择 Baseline](https://web.dev/how-to-use-baseline) 明确区分固定年份与动态目标。Widely available 的时间条件为 30 个月。

**已接受的策略与验收目标**：固定 Baseline 2023 作为 CSS 特性准入参考；维护者随后明确接受该基线映射的核心浏览器版本作为首版**最低兼容性验收目标**。完整目标见下表。**该决定不是已经通过浏览器测试，也不是对已发布软件的兼容性声明**。

## 3. 首版最低兼容性验收目标（已批准版本，未实测）

固定 WebDX 上游提交 [`f0a635b`](https://github.com/web-platform-dx/baseline-browser-mapping/tree/f0a635b134cdeef3b82804a057bcb96796d42a2f) 的 `targetYear: 2023` 时间线截至 2023-12-31，可得到以下七项**验收目标下限**：

| 浏览器家族      | 首版目标最低版本 | 状态               |
| --------------- | ---------------- | ------------------ |
| Chrome 桌面     | 120              | 目标已批准；未测试 |
| Edge 桌面       | 120              | 目标已批准；未测试 |
| Firefox 桌面    | 121              | 目标已批准；未测试 |
| Safari macOS    | 17.2             | 目标已批准；未测试 |
| Chrome Android  | 120              | 目标已批准；未测试 |
| Firefox Android | 121              | 目标已批准；未测试 |
| Safari iOS      | 17.2 / iOS 17.2  | 目标已批准；未测试 |

**目标版本的规则**：发布前必须在目标最低版本或可验证的等效真实环境运行适用 Fixture；若无法获得旧版本环境，不得假称通过，也不得将未验证环境自动列入正式“已支持”声明。如实测发现重大兼容性缺陷，需补充最小修复并复测，或单独提交修订支持范围的 ADR 给维护者批准。

Apple 官方 [Safari 17.2 Release Notes](https://developer.apple.com/documentation/safari-release-notes/safari-17_2-release-notes) 记载 Safari 17.2 提供给 iOS 17.2、iPadOS 17.2、macOS Sonoma、Monterey、Ventura；这些是可用平台家族，**不意味着上述所有平台都已在本项目实测或列为单独的支持保证**。

详细的数据快照与核算方法见 [BASELINE_2023_MAPPING.md](../research/BASELINE_2023_MAPPING.md)。

## 4. 已接受的支持层次策略（实际覆盖仍待核验）

| 范围       | 浏览器                                                                            | 当前立场                                                            |
| ---------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 核心桌面   | Chrome、Edge、Firefox、Safari macOS                                               | 计划覆盖，最低版本待确认                                            |
| 核心移动   | Chrome Android、Firefox Android、Safari iOS                                       | 计划覆盖，OS / 设备 / 真实版本待核验                                |
| 条件性验证 | Android System WebView、Windows WebView2、微信/X5 内置浏览器、Samsung Internet 等 | 不能通过共享内核自动推导支持；有具体设备、宿主与 Fixture 后逐项评审 |
| 非首版承诺 | IE 与无测试条件的停维护旧浏览器                                                   | 不承诺；如有场景需求则另行评审                                      |

[MDN Baseline](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility) 明确：Baseline 不能取代无障碍与浏览器测试，也不能天然覆盖所有系统 WebView。

## 5. 已批准目标版本的落实步骤

1. 固定年份方案已接受：Baseline 2023。
2. 已读取官方 [baseline-browser-mapping](https://github.com/web-platform-dx/baseline-browser-mapping) 固定提交的 `timeline.js`，按 `targetYear: 2023` 的 2023-12-31 截止日期核对七项版本；**维护者已将其批准为首版验收目标**。未运行 npm 模块 `getCompatibleVersions()`，且未实测本库。
3. 审核计划纳入的每项 CSS 特性；超出年份目标的特性必须提供回退或不采纳。
4. 为候选规则记录没有本库 CSS 的原生 HTML Baseline、仅单规则变化、实际浏览器/OS/版本和是否仍有差异。
5. 按 [浏览器测试矩阵](../research/BROWSER_REVIEW.md) 验证焦点、表单、dialog、hidden、系统偏好及组件生态。
6. 在发行说明中区分“目标已批准 / 真实测试通过 / 部分验证 / 未验证”的完整版本边界。**本 ADR 不能替代正式兼容性测试结果**。

[Playwright 浏览器文档](https://playwright.dev/docs/browsers) 说明其 WebKit 自动化版本与品牌 Safari 不同；真实 Safari/iOS 仍需要明确的验证记录。

## 6. 结果、风险和决定

- **已批准**：固定 Baseline 2023 为特性准入参考、核心与条件支持环境分层方法，**以及 Chrome/Edge 120、Firefox 121、Safari 17.2 的首版最低测试目标（含对应核心移动家族）**。
- **已核对的数据**：[固定映射快照](../research/BASELINE_2023_MAPPING.md) 中的 Baseline 2023 特性兼容候选版本。
- **仍待确认**：所定最低目标是否通过实际浏览器/OS/设备、键盘、组件库与用户偏好验收，以及最终可以在发行说明中写为“已支持”的浏览器/系统组合；目标获批不表示通过测试。
- **已明确的长期原则**：不把历史 UA 规则原样复制为现代修复；不因语法支持就宣称整套 CSS 兼容。
- **待明确**：微信内置 WebView 是否列为承诺平台、Firefox ESR 是否单独测试、可获得的真实设备与系统版本；iOS 端已确定 Safari 17.2 / iOS 17.2 的测试目标，但设备和实测情况仍未知。
- **不增加 CI**：未来验证只能在明确授权开发后进行本地运行。
- ADR 状态为 **Accepted**（仅限策略选择）；不能宣称已完成最低版本映射、跨浏览器测试或开始代码开发。

## 7. 接受记录

2026-11-03：维护者同意方案 A（Baseline 2023 特性参考）；随后确认全部同意，将 WebDX 对应核心浏览器版本冻结为首版**最低测试目标**。这不是对尚不存在的 CSS 包的实测兼容性宣称；真实结果见后续 [MVP 实施计划](../plans/MVP_IMPLEMENTATION_PLAN.md)。
