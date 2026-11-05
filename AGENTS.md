# AGENTS.md — @adui/normalize.css

> **当前状态（2026-11-05）**：MVP 已通过 PR #1、PR #9 合并进入 `main`，当前候选配置为 `0.0.1/private:false`（维护者 2026-11-05 最新决定，尚未发布 npm），维护者已确认最终签收；W-02 #3 已按首版规则研究范围结项，W-03～W-06 已管理结项，W-01 #2 已按维护者研究验收范围结项，W-07 #8 仍 Open。产品 CSS 目前仅包含已批准的 R-003，公开入口只有 `@adui/normalize.css`；已合并 `main`，尚未发布 npm。五项 ADR 均 Accepted，统一采用 Vite+ 1.4.0 / pnpm 12.15.0，**绝不新增 CI**。
>
> **验证及授权边界**：旧版 Windows `vp check`、`vp test`、离线 Node、`vp pack`、真实 tarball 和消费者测试有维护者提供的历史通过记录；最新测试断言及分支同步提交之后尚无完整 `pnpm run verify:mvp` 原始日志，不能作为本轮独立 PASS。W-06 正式签收不代表七项最低浏览器环境已有可公开审核的逐项证据。W-07 的 npm 首发认证、浏览器对外支持声明及单独发行授权仍未完成；**不得擅自合并后续 PR、再次修改发布配置、打 Tag/Release 或 npm 发布**。详见 [MVP 验收清单](docs/MVP_0_0_1_HANDOFF.md)、[W-07 发布门禁](docs/research/W07_RELEASE_GATES.md) 与 [HARNESS](docs/HARNESS.md)。

## 1. 项目事实

- 仓库：[adui-studio/normalize.css](https://github.com/adui-studio/normalize.css)，npm 包目标名：`@adui/normalize.css`。
- 当前已确认：正式仓库包含 MIT LICENSE，五项 ADR 已接受，首版默认 Normalize 已实现唯一 R-003；Chrome/Edge 120、Firefox 121、Safari 17.2（及对应核心移动版本）是**批准的最低测试目标，而非已公开承诺的最低支持版本**。参见 [MVP 计划](docs/plans/MVP_IMPLEMENTATION_PLAN.md)。
- 当前工程事实：`main` 现已包含 `package.json`、`pnpm-lock.yaml`、`vite.config.ts`、`src/normalize.css`、`fixtures/` 与 `tests/`。`vp pack` 只生成静态 CSS，真实包安装和 Vite+ 消费已有历史验证；最新变更的本机全量测试尚待归档。开发范围及状态以 [项目上下文](docs/PROJECT_CONTEXT.md) 和 [W-07 审核记录](docs/research/W07_RELEASE_READINESS_REVIEW.md) 为准。
- 目标：低侵入 CSS 标准化基础库；Reset、A11y、Forms 是已接受的长期可选模块方向，**首版延期**；默认不内置 `@layer`，固定 Baseline 2023 作为特性参考。
- **工具链决策**：后续开发统一 Vite+，参见 [ADR-0005](docs/adr/0005-viteplus-toolchain.md)。工具链保持 Vite+；本次已明确授权首批 CSS 开发，不据此推定 npm 发布、引入新依赖或增加 CI 的权限。

## 2. 单一事实来源

| 问题                 | 优先文档                                                                          |
| -------------------- | --------------------------------------------------------------------------------- |
| 要实现什么及如何验收 | [REQUIREMENTS](docs/REQUIREMENTS.md)                                              |
| 架构边界与原因       | [ARCHITECTURE](docs/ARCHITECTURE.md) 和 [ADR](docs/adr/0001-css-base-strategy.md) |
| 模块接口及具体设计   | [SDD](docs/SDD.md)                                                                |
| 当前进度和待决策     | [PROJECT_CONTEXT](docs/PROJECT_CONTEXT.md)                                        |
| 文件位置             | [CODEBASE_MAP](docs/CODEBASE_MAP.md)                                              |
| 可用 Skills          | [SKILLS](docs/SKILLS.md)：第三方原版技能的来源与使用边界                          |
| 可执行检查           | [HARNESS](docs/HARNESS.md)                                                        |
| 文档一致性           | [DOCUMENTATION_VALIDATION](docs/DOCUMENTATION_VALIDATION.md)                      |

## 3. 规则优先级

平台与系统约束之下：用户当前明确要求 → 当前适用的 AGENTS.md → 已确认需求/专项规范 → 架构与详细设计 → 经审核的项目 Skills → 经审核的第三方 Skills → 通用最佳实践。发生冲突先报告；不能把历史聊天、候选设计或工具生成内容当成已验证仓库事实。

## 4. 标准工作流

1. 读取任务边界、有关需求编号、当前项目上下文和现有文件。
2. 标记信息状态：**已确认、已实现、已验证、规划中、待决策、未知**。
3. 找到最小受影响范围，审查浏览器差异证据、无障碍与组件库风险。
4. 先更新需要调整的需求、SDD、架构和 ADR；未经允许不修改代码。
5. 执行当前真实存在的检查；不存在的命令只能写成计划，不能声称执行。
6. 交付文件变更、取舍依据、验证结果、风险及未解决事项。

## 5. CSS 设计红线（供后续实现评审）

- 默认 Normalize 只修复可说明的差异；不要复制整个竞品 CSS。
- 不在默认模块中强制根字号、主题配色、滚动条、按钮清空样式、通用间距归零。
- 不全局强制取消动画或抹除焦点标记；无障碍增强需要考虑系统偏好与回退。
- 首版默认不内置 `@layer`（ADR-0002 Accepted）；逐条审查 `:where()`，任何未来分层变体须独立决策和测试。
- 兼容性、包体积、浏览器版本和 UI 库结论必须由实际测试支持。

## 6. Git、权限与安全

- 最小变更；不擅自覆盖其他人工作、不执行强推、不提交密钥或令牌。
- 本项目明确**不增加任何 CI**；Harness 只讨论本地人工触发的验证，不新增任何工作流。
- 未经明确要求不创建发布/部署工作流、不推送发布版本、不运行不可信第三方脚本。
- Git 提交建议遵循 Conventional Commits、中文主题、适当 emoji；以仓库未来正式规范为准。
- 不为形式创建空 Skill、空源码目录、虚构脚本或通过状态。W-03 Fixture 测试代码不属于发布 CSS 源码，不能把候选规则测试写作产品实现。
- 第三方 Skills 固定上游 SHA、许可证和来源，见 [记录](.agents/skills/UPSTREAM.md)；工具调用必须匹配当前连接与权限。

## 7. 完成判定

文档内容可追溯，链接有效，规划与事实明确分离；相关需求/设计/架构/上下文已同步。代码实现阶段的 DoD 只有在实际进入开发后才适用。
