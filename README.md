# @adui/normalize.css

**简体中文** · [English](README.en.md)

面向现代 Web 应用的 CSS 标准化基础库，目标是**默认克制、按需增强、行为可预测、兼容可验证**。

> **项目状态：架构决策已接受，首版实施尚未开始。** ADR-0001～0004 已正式通过；仓库仍无 CSS 源码、可安装 npm 包、构建产物或真实浏览器测试结果。首版只批准默认 Normalize 入口，不能将设计路径视为可用接口。

## 项目目标

- 修正有证据支持的跨浏览器默认样式差异，优先保留 HTML 原生语义和交互。
- 默认 Normalize 低侵入；Reset、无障碍增强、表单增强明确按需启用。
- 不照搬已有项目；每条规则记录来源、目标浏览器、预期收益、兼容风险及验证结果。
- 优先兼容 Vue、React、原生 HTML，以及 Element Plus、Ant Design、TDesign 等常见组件库。
- 追求无运行时 JavaScript 依赖、可审计的 CSS 输出和可重复验证流程。

## 已批准的首版入口（尚未实现）

| 入口（设计约定） | 责任 | 首版发布范围 |
| --- | --- | --- |
| `@adui/normalize.css` | 仅修复有证据的浏览器 UA 差异 | **首版唯一入口；待实现** |
| `@adui/normalize.css/reset.css` | 盒模型与布局重置 | 首版延期；未来单独评审 |
| `@adui/normalize.css/a11y.css` | 焦点及系统偏好辅助 | 首版延期；未来单独评审 |
| `@adui/normalize.css/forms.css` | 原生表单交互增强 | 首版延期；未来单独评审 |
| `@adui/normalize.css/all.css` | 显式组合入口 | 首版延期；未来单独评审 |

长期模块方向已经 [ADR-0001](docs/adr/0001-css-base-strategy.md) 批准，但首版只保留默认入口；默认**不内置 `@layer`**，固定 **Baseline 2023** 为特性准入参考。核心浏览器最低**测试目标**已批准：Chrome/Edge 120、Firefox 121、Safari 17.2（含对应移动浏览器），**尚未实测通过，不能视为已发布支持声明**。npm 导出仍未实现，目前不能执行安装或导入示例。

## 设计边界

默认入口不应强制改变根字体大小、页面颜色主题、按钮外观、全局滚动条、所有元素的间距或用户系统交互偏好。对于可能改变现有组件行为的规则，优先使用独立可选模块，并配套回归验证。

## 工程文档

| 文档 | 内容 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | AI Agent 与贡献者的协作规则 |
| [需求](docs/REQUIREMENTS.md) | 范围、功能/非功能需求、验收标准 |
| [架构](docs/ARCHITECTURE.md) | 模块边界、选型原则和依赖关系 |
| [详细设计](docs/SDD.md) | 待评审的导出契约、CSS 规则和验证设计 |
| [项目上下文](docs/PROJECT_CONTEXT.md) | 当前事实、进度、风险、待决策事项 |
| [代码地图](docs/CODEBASE_MAP.md) | 已存在文件与规划结构的区别 |
| [Skills 索引](docs/SKILLS.md) | 可复用流程评估和状态 |
| [Harness](docs/HARNESS.md) | 计划中的执行与验证闭环 |
| [文档校验](docs/DOCUMENTATION_VALIDATION.md) | 文档一致性审查策略 |
| [ADR-0001](docs/adr/0001-css-base-strategy.md) | 初始 CSS 基础策略（Accepted） |
| [ADR-0002](docs/adr/0002-cascade-layers.md) | CSS Cascade Layers 已批准策略 |
| [规则候选研究](docs/research/RULE_REVIEW.md) | 36 条待评审候选，不代表已实现 |
| [首批规则证据审查](docs/research/RULE_EVIDENCE_BATCH1.md) | 11 条候选的规范依据、历史修复及复现门槛 |
| [第二批表单规则研究](docs/research/FORM_CONTROLS_REVIEW.md) | 原生表单、文件按钮与占位符的证据审查 |
| [第三批规则证据研究](docs/research/RULE_EVIDENCE_BATCH3.md) | 剩余 17 条排版、Reset 和系统偏好候选规则 |
| [R-003/R-004 专项证据卡](docs/research/RULE_EVIDENCE_R003_R004.md) | b/strong 字重修复时间线与等宽字号用户偏好 |
| [ADR-0003](docs/adr/0003-mvp-package-contract.md) | 首版 MVP 导出契约已批准方案（Accepted） |
| [ADR-0004](docs/adr/0004-browser-support-policy.md) | 浏览器支持基线与范围策略（Accepted） |
| [ADR-0005](docs/adr/0005-viteplus-toolchain.md) | 后续开发统一使用 Vite+（Accepted；尚未安装） |
| [Baseline 2023 版本映射](docs/research/BASELINE_2023_MAPPING.md) | 特性兼容候选版本及尚待实测的支持边界 |
| [Vite+ 工具链研究](docs/research/VITEPLUS_TOOLCHAIN_REVIEW.md) | 本地命令、纯 CSS 打包风险和验证要求 |
| [开发准入清单](docs/research/REVIEW_GATE.md) | 四份已接受 ADR 与剩余验证门槛 |
| [MVP 实施计划](docs/plans/MVP_IMPLEMENTATION_PLAN.md) | W-01～W-07 的任务分解、依赖、测试与发布前验收 |
| [浏览器矩阵](docs/research/BROWSER_REVIEW.md) | 支持范围与测试策略草案 |
| [竞品对照](docs/research/COMPETITOR_REVIEW.md) | 六类 Normalize/Reset 方案源码研究 |

## 参与讨论与贡献

- [Issue 表单](https://github.com/adui-studio/normalize.css/issues/new/choose)：浏览器兼容性、规则提案、文档与架构讨论；**模板合并到 main 后生效**。
- [PR 模板](.github/pull_request_template.md)：说明规则证据、影响范围、实际本地验证和文档同步。
- [项目 Skills](docs/SKILLS.md)：直接纳入上游 `github/awesome-copilot` Skills 文件，供 Codex 与 OpenCode 使用；来源和安装限制见记录。

## 开发前门槛

架构已批准，**开发工具链固定为 Vite+（ADR-0005 Accepted，未安装/未运行）**，当前转入 **W-01～W-07 可执行任务规划**。CSS 实施、依赖/测试工具安装与 npm 发布仍须按项目指令另行授权；最低浏览器版本、规则必要性和生态兼容性必须通过真实验证，不增加任何 CI。

## 许可证

[MIT](LICENSE)，Copyright © 2026 ADui Studio。