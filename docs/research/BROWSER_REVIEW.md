# 浏览器支持边界与本地验证计划

**状态**：首版最低浏览器**测试目标已批准**；并非已验证或已发布的兼容性声明，无任何本项目浏览器实测结果。  
**日期**：2026-11-03。关联 NFR-002/003/007 与 [Harness](../HARNESS.md)。

## 兼容特性数据（MDN BCD）

截至本次阅读，以下为特性首次支持的版本，**不是本库承诺的最低浏览器版本**。

| 特性 | Chrome | Firefox | Safari | 源数据 |
| --- | ---: | ---: | ---: | --- |
| `:where()` | 88 | 78 | 14 | [BCD](https://github.com/mdn/browser-compat-data/blob/main/css/selectors/where.json) |
| `@layer` | 99 | 97 | 15.4 | [BCD](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/layer.json) |
| `:focus-visible` | 86 | 85 | 15.4 | [BCD](https://github.com/mdn/browser-compat-data/blob/main/css/selectors/focus-visible.json) |

实际 Android WebView、iOS Safari 与其他嵌入式容器的兼容性不能由 Chromium 或上述单一特性数据推断。

## 支持范围的提议

固定年份与非核心 WebView 支持分层策略见 [ADR-0004 Accepted](../adr/0004-browser-support-policy.md)；[固定快照映射研究](BASELINE_2023_MAPPING.md) 已交叉核算七项版本并经维护者批准为**最低测试目标**。**正式支持声明依然取决于未来的真实浏览器测试**。

- 计划面向仍受维护的 Chromium/Edge、Firefox 稳定版与 ESR、Safari macOS/iOS；发布前**冻结具体最低版本**和相关可复现测试记录。
- 不先承诺 IE 或过时 WebView；是否纳入微信内置浏览器、Android System WebView 等环境需要根据用户场景决定。
- 固定最低版本与测试时最新稳定版都应测试；“最新两个版本”等动态说法不足以复现历史结果。
- **已批准的最低测试目标**：Chrome/Edge 120、Firefox 121、Safari 17.2，以及对应 Chrome Android 120、Firefox Android 121、Safari iOS 17.2；来源与计算见 [WebDX 固定快照](BASELINE_2023_MAPPING.md)。这些版本**不是已经通过的兼容性声明**，OS、WebView、UA 样式和组件兼容仍待验证。
- [Web Platform Baseline](https://web.dev/baseline) 可以用于特性准入参考，但不会自动证明一整套 CSS 样式安全。

## 测试矩阵（未来仅本地执行）

| 级别 | 环境/Fixture | 主要验收 |
| --- | --- | --- |
| T0 | 未加载 Normalize 的原生 HTML | 目标浏览器有无真实问题 |
| T1 | 单条候选规则 | 修复差异且无非预期副作用 |
| T2 | 默认 Normalize 入口 | 不包含可选 Reset、Forms、A11y 行为 |
| T3 | Element Plus / Ant Design / TDesign Vue 和 React | 焦点、弹窗、表格、表单与布局回归 |
| T4 | Tailwind Preflight / UnoCSS Reset 独立及叠加 | 多 Reset、样式顺序和层优先级 |
| T5 | Chromium、Firefox、WebKit 与真实 Safari/iOS | 跨引擎与实际设备差异 |

每次测试记录浏览器名称/版本、OS、CSS 导入顺序、具体选择器和计算属性、键盘与触摸交互、截图、预期和实际结果。

旧版浏览器的实际获取线索、T0/T1/T2 对照和留证字段见 [R-003/R-004 本地验证执行指南](R003_R004_LOCAL_VERIFICATION.md)。官方归档的存在不等于本项目已安装/运行；已停止维护的旧版浏览器应只用于隔离的本地复现。

**Playwright WebKit 不是品牌 Safari。** [Playwright 官方说明](https://playwright.dev/docs/browsers)指出其 WebKit 由源码衍生并做自动化补丁；不能把 Playwright WebKit 通过等同为 iOS Safari 通过。

## 表单与文件按钮（研究扩展）

`::file-selector-button`、`::placeholder` 和 `appearance` 的支持起点及复现计划见 [表单规则研究](FORM_CONTROLS_REVIEW.md)。这些是特性数据而非整包已通过测试的证明。

## 通过门槛（未启用）

必须复现目标问题、提供修复前后证据、说明对语义/辅助技术/组件库的影响，并记录未覆盖的环境。需要发布时由维护者明确接受版本矩阵，不能由本草案擅自冻结版本。

**长期约束**：不增加任何 CI；未来的测试和报告仅允许按需本地手动执行。
