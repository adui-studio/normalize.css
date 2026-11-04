# PROJECT_CONTEXT — 项目长期上下文

**最近更新**：2026-11-04  
**当前阶段**：文档已迁移到 ADui Studio / 未开发

## 1. 项目概况

- 名称：`@adui/normalize.css`
- GitHub：[adui-studio/normalize.css](https://github.com/adui-studio/normalize.css)
- 类型：计划中的 CSS 标准化 npm 库
- 目标：吸收主流 Normalize/Reset 方案中有证据的优点，舍弃过时、过度或高侵入的默认规则。
- 已确认许可证：MIT（见根目录 [LICENSE](../LICENSE)）。
- 团队沟通语言：中文优先，英文作为必要的项目概览。

## 2. 事实状态

| 项目 | 状态 | 证据/说明 |
| --- | --- | --- |
| GitHub 仓库 | 已创建 | 根目录已有 LICENSE |
| LICENSE | 已存在 | MIT，Copyright © 2026 ADui Studio |
| 八类工程资产 | 文档初始化 | [AGENTS](../AGENTS.md)、需求、SDD、架构、上下文、代码地图、Skills、Harness |
| CSS 源码 | **未实现** | 仓库无 src/ 或发布 CSS 文件 |
| package.json、依赖、构建脚本 | **未实现** | 技术栈和具体工具尚未确认 |
| 自动化测试、浏览器回归、CI | **未实现/未运行** | 不得声称测试通过 |
| npm 包发布、版本号 | **未发布/未确定** | 不能将先前讨论的草案版本当成仓库发布事实 |
| 实现方案 | **待评审** | 模块与接口见 [SDD](SDD.md)，ADR-0001 为 Proposed |
| Skills | **未创建** | 仅建立 [索引](SKILLS.md) |
| Harness | **未搭建** | 仅建立 [验证计划](HARNESS.md) |

## 3. 已讨论但尚未批准的方向

- 默认 Normalize 仅纠正可验证浏览器差异。
- 可选模块：Reset、A11y、Forms，以及待决策的组合入口。
- 候选 CSS Layers、npm 导出和无运行时 JS 依赖方案。
- 重点评估 Vue/React 与 Element Plus、Ant Design、TDesign 共存。
- 不将浏览器主题、根字号、全局按钮和滚动条样式写成默认必需行为。

上述描述属于**设计方向**，不是仓库内已经实现的功能。

## 4. 当前工作与后续顺序

1. **本轮**：从原仓库迁移正式工程文档到 ADui Studio；更新仓库地址及许可证归属文字；不实施 CSS 或 CI。
2. **下一阶段（尚未启动）**：评审需求编号、模块范围、支持浏览器矩阵、CSS Layers 和 ADR。
3. **开发阶段（需新指令）**：选择最小工具链、编写源码、Fixture、自动测试与打包配置。
4. **发布阶段（需单独授权）**：npm 作用域/包名检查、版本冻结、发布审批、Release。

## 5. 当前风险与阻塞

- 浏览器最低版本及老旧 WebView 是否支持尚未确定。
- npm `@adui` 作用域的发布权限未验证。
- CSS Layers 与 UI 组件库存在潜在层优先级冲突，需要实测。
- 下一阶段验证优先顺序已确认：W-06 TDesign 的 Chromium/Firefox/WebKit 对照 → Tailwind v4 Preflight 独立测试 → UnoCSS Reset 独立测试；不得在同一对照组叠加两套 Reset。完整矩阵与证据门槛记录于 [HARNESS](HARNESS.md) 第 6 节，所有新用例仍为**待执行**。
- 第三方规则借鉴需独立审查许可证、差异证据和破坏性影响。
- 已补充 TDesign 的样式来源检查（含独立 `dist/reset.css`）、交互回归步骤、Chromium/Firefox/WebKit 记录方式，以及 Tailwind/UnoCSS 真实产物与层级归因条件，详见 [HARNESS](HARNESS.md) 第 6.6/6.7 节；**仍未运行实际浏览器测试**。
- 2026-11-04 已核对并固定 Tailwind、UnoCSS、TDesign 上游源码快照，识别 CSS 层、全局盒模型/表单、`[hidden]`、按钮光标及占位符等**待验证冲突候选**。详见 [源码审查](research/2026-11-04-reset-source-audit.md)。这不是 npm 包或浏览器测试结果。
- 本阶段只能完成文档一致性检查，不能验证运行时与视觉兼容性。

## 6. 文档索引和变更记录

[README](../README.md) · [AGENTS](../AGENTS.md) · [REQUIREMENTS](REQUIREMENTS.md) · [ARCHITECTURE](ARCHITECTURE.md) · [SDD](SDD.md) · [CODEBASE_MAP](CODEBASE_MAP.md) · [SKILLS](SKILLS.md) · [HARNESS](HARNESS.md) · [ADR](adr/0001-css-base-strategy.md) · [文档校验](DOCUMENTATION_VALIDATION.md)

| 日期 | 事件 | 备注 |
| --- | --- | --- |
| 2026-11-03 | 初始工程文档创建于 adui-dev/normalize.css | 仅文档，无 CSS 或 CI |
| 2026-11-03 | 迁移文档到 adui-studio/normalize.css | 保留目标仓库原有 LICENSE；原仓库未删除，Git 历史独立 |
| 2026-11-04 | 扩展 W-06/Tailwind/UnoCSS 隔离验证设计 | 完善可复现步骤与 CSS 归因；未执行浏览器测试，无 CI |

**更新约定**：重大进度、已完成验证、关键决策、阻塞与下一阶段变化时更新；事实来源优先实际仓库、命令输出与正式 ADR，而非历史聊天。

## 7. 迁移来源

本次文档迁移来源于 [adui-dev/normalize.css 的初始化提交](https://github.com/adui-dev/normalize.css/commit/7f9d4a1af3ea7fea6fb978378f93390ecd47271f)。目标仓库已独立存在，因此采用文档内容迁移而非 GitHub 原生 Transfer；两个仓库的 Git 历史没有合并。
