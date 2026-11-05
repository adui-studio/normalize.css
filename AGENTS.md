# AGENTS.md — @adui/normalize.css

> **0.0.3 开发启动（2026-11-05，最新）**：维护者明确要求开始 `0.0.3` 迭代。在独立开发分支 `chore/prepare-v0.0.3-20261105` 初始化候选 `package.json#version=0.0.3` 与两项真实包测试断言；当前正式 npm 版本仍为 `0.0.2`，历史发行 Tag/Release 不变。`0.0.3` 的规则变更和发布内容由 [Issue #22](https://github.com/adui-studio/normalize.css/issues/22) 后续审查；现在**没有获准的新 CSS 规则或公开可选子路径**，不将开发候选冒充已验收/已发行。先在 Windows 验证候选，未经单独授权不得合并 PR、发布 npm 或创建 `v0.0.3` Tag / Release；禁止新增 CI。`0.1.0` 仍需完整性验收及独立授权。

> **正式发行最新状态（2026-11-05）**：维护者已确认 npm Registry 公开版本 `@adui/normalize.css@0.0.2`；[GitHub Release v0.0.2](https://github.com/adui-studio/normalize.css/releases/tag/v0.0.2) 已正式发布（非 Draft/Prerelease），附注 Tag `v0.0.2` 解析到已验收源码提交 `4d66e6b590c09b7de6e98332524684237dddf212`。历史已公开 `0.0.1` 仅含 R-003；`0.0.2` 已包含 R-003/R-007/R-008。npm 已发布 tarball SHA-1 与本地包的二进制一致性尚未独立核验，不冒充已比对。

> **当前规则与版本策略（2026-11-05）**：默认 `src/normalize.css` 当前三条规则 R-003、R-007、R-008 已作为 `0.0.2` 正式交付；36 条候选其余 17 条暂缓、8 条独立可选模块设计、8 条排除默认。维护者明确要求继续完善 Normalize，**仅在完整性及必要验收达到要求后才评审并发布 `0.1.0`**；此前的“范围冻结”仅指 `0.0.2` 交付范围稳定，不意味着 `0.1.0` 已经完成。仍保持版本号 `0.0.2`；不得重复发布此版本、移动发行 Tag，亦不得擅自升级或发布下一版本。

> **已验证与未验证边界**：维护者 Windows PowerShell 在发行源码提交上提供冻结安装、格式/Lint、`verify:mvp` **60/60 PASS**，以及独立 `vp build` 构建 8 张 Fixture 页面 PASS、五文件 npm dry-run；以上不是全部目标浏览器 T0/T2 的真实兼容性证明，不声明缺乏证据的最低浏览器版本。发布采用独立授权的本机人工流程，具体见 [RELEASING](docs/RELEASING.md)；**禁止新增 CI、自动发行或运行时 JavaScript 依赖**。

## 1. 项目事实

- 仓库：[adui-studio/normalize.css](https://github.com/adui-studio/normalize.css)，npm 包目标名：`@adui/normalize.css`。
- 当前已确认：正式仓库包含 MIT LICENSE，五项 ADR 已接受；已发布的 `0.0.1` 仅含 R-003，已发布的 `0.0.2` 包含 R-003、R-007、R-008。Chrome/Edge 120、Firefox 121、Safari 17.2（及对应核心移动版本）是**批准的历史最低测试目标，而非已公开承诺的最低支持版本**。参见 [MVP 计划](docs/plans/MVP_IMPLEMENTATION_PLAN.md)。
- 当前工程事实：`main` 包含 `package.json`、`pnpm-lock.yaml`、`vite.config.ts`、`src/normalize.css`、`fixtures/` 与 `tests/`。`vp pack` 生成 CSS-only 静态产物，发行源码提交的真实包安装、Vite+ 消费和本机工程验收已归档；后续纯文档提交不冒充在新 HEAD 上重跑。开发范围及状态以 [项目上下文](docs/PROJECT_CONTEXT.md)、[HARNESS](docs/HARNESS.md) 和 [发行记录](docs/RELEASING.md) 为准。
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
