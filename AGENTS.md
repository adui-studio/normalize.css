# AGENTS.md — @adui/normalize.css

> **最新工程与范围评审状态（2026-11-05）**：PR #19、PR #21 均已合并 `main`；默认 `src/normalize.css` 保持 R-003/R-007/R-008 三条规则，PR #21 的 T0/T2 观察点已从 12 扩展为 15。维护者提供的合并后 Windows `pnpm run verify:mvp` 日志显示 Vitest 7/7、离线 Node 51/51、真实包与 Vite+ 消费各 1/1，合计 60/60 PASS，CSS-only 产物 311 B、npm dry-run 五文件；该日志未记录执行时完整 Git SHA，且不是所有目标浏览器 T0/T2 实测。依据 [36 条候选与 0.1.0 完整性门槛](docs/research/DEFAULT_NORMALIZE_V01_READINESS.md)，当前已提出三条规则作为**默认范围冻结候选**，尚非维护者批准的正式冻结或 `0.1.0` 发行授权；继续保持 `0.0.2`，不增加 CI。

> **当前主分支事实（2026-11-05）**：PR #19 已经维护者批准并合并 `main@ed729527142732cb18ffa8971e7bb701d120a026`。默认 `src/normalize.css` 现有 R-003、R-007、R-008 三条规则；T0/T2、CSSOM、真实包断言与双语 README 已同步。仓库 `package.json` 保持 `0.0.2/private:false`，单 CSS 根导出、无运行时 JavaScript 依赖；**公开 npm 已确认发行的是 `0.0.1`，不是 `0.0.2`**。W-07 Issue #8 已 Closed—completed；下一阶段由 Issue #18 继续跟踪。五项 ADR Accepted，Vite+ 1.4.0 / pnpm 12.15.0，**禁止增加 CI**。
>
> **版本策略（维护者已明确批准，2026-11-05）**：当前开发/下一候选版本**继续为 `0.0.2`**，它包含已合并的 CSS 变更和 npm Keywords，不再称为“纯关键词补丁”；**只有在默认 `normalize.css` 规则范围完成、验收并经维护者确认后才提升到 `0.1.0`**，不提前升级。公开发布版本必须同时对应 Git Tag `vX.Y.Z` 与 GitHub Release，具体人工清单见 [RELEASING](docs/RELEASING.md)；记录发行要求不等于已经执行发布。
>
> **验证与发行边界**：维护者已确认 MVP 回归通过；对 PR #19 新规则，已有静态、模拟 CSSOM 与比较器合成验证记录，但未在本轮取得绑定最新 `main` SHA 的全套 Windows/Vite+ 和所有目标浏览器实测日志，不能擅称全部通过。发布 `0.0.2` 仍需独立明确授权及维护者本机 npm 2FA，**不得提前创建对应 Tag/Release 或执行 npm publish**；旧版 `0.0.1` 的 Tag/Release 也不得在未确定准确发行提交时随意补建。**不新增 CI、自动发布、依赖或配置工作流**。

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
