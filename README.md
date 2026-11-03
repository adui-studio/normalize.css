# @adui/normalize.css

**简体中文** · [English](README.en.md)

面向现代 Web 应用的 CSS 标准化基础库，目标是**默认克制、按需增强、行为可预测、兼容可验证**。

> **项目状态：规划／文档初始化。** 当前仓库尚无 CSS 源码、npm 包、构建产物及已验证的浏览器测试。本文中的模块名、导入路径均为待评审设计，不能视为可用接口。

## 项目目标

- 修正有证据支持的跨浏览器默认样式差异，优先保留 HTML 原生语义和交互。
- 默认 Normalize 低侵入；Reset、无障碍增强、表单增强明确按需启用。
- 不照搬已有项目；每条规则记录来源、目标浏览器、预期收益、兼容风险及验证结果。
- 优先兼容 Vue、React、原生 HTML，以及 Element Plus、Ant Design、TDesign 等常见组件库。
- 追求无运行时 JavaScript 依赖、可审计的 CSS 输出和可重复验证流程。

## 计划中的公开入口（尚未实现）

| 入口（候选） | 责任 | 是否默认 |
| --- | --- | --- |
| `@adui/normalize.css` | 跨浏览器默认样式标准化 | 是 |
| `@adui/normalize.css/reset.css` | 盒模型与布局重置 | 否 |
| `@adui/normalize.css/a11y.css` | 焦点及系统偏好辅助 | 否 |
| `@adui/normalize.css/forms.css` | 原生表单交互增强 | 否 |
| `@adui/normalize.css/all.css` | 显式组合入口 | 否 |

所有入口、打包方式及浏览器版本范围须在设计评审与测试后冻结。**目前不能执行 npm 安装或导入示例。**

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
| [ADR-0001](docs/adr/0001-css-base-strategy.md) | 初始 CSS 基础策略（Proposed） |
| [ADR-0002](docs/adr/0002-cascade-layers.md) | CSS Cascade Layers 待评审方案 |
| [规则候选研究](docs/research/RULE_REVIEW.md) | 36 条待评审候选，不代表已实现 |
| [首批规则证据审查](docs/research/RULE_EVIDENCE_BATCH1.md) | 11 条候选的规范依据、历史修复及复现门槛 |
| [第二批表单规则研究](docs/research/FORM_CONTROLS_REVIEW.md) | 原生表单、文件按钮与占位符的证据审查 |
| [第三批规则证据研究](docs/research/RULE_EVIDENCE_BATCH3.md) | 剩余 17 条排版、Reset 和系统偏好候选规则 |
| [ADR-0003](docs/adr/0003-mvp-package-contract.md) | 首版 MVP 导出契约候选方案（Proposed） |
| [浏览器矩阵](docs/research/BROWSER_REVIEW.md) | 支持范围与测试策略草案 |
| [竞品对照](docs/research/COMPETITOR_REVIEW.md) | 六类 Normalize/Reset 方案源码研究 |

## 参与讨论与贡献

- [Issue 表单](https://github.com/adui-studio/normalize.css/issues/new/choose)：浏览器兼容性、规则提案、文档与架构讨论；**模板合并到 main 后生效**。
- [PR 模板](.github/pull_request_template.md)：说明规则证据、影响范围、实际本地验证和文档同步。
- [项目 Skills](docs/SKILLS.md)：直接纳入上游 `github/awesome-copilot` Skills 文件，供 Codex 与 OpenCode 使用；来源和安装限制见记录。

## 开发前门槛

先完成需求与 ADR 评审，再确定浏览器支持范围、模块接口、规则证据与测试方案。**本阶段不编写 CSS 源码、不发布 npm 包，也不宣称现有可运行命令。**

## 许可证

[MIT](LICENSE)，Copyright © 2026 ADui Studio。