# AGENTS.md — @adui/normalize.css

> 本文件是项目 Agent 的简明规则入口。**维护者要求使用 `vp dev`、`vp build`、`vp pack`：本机已证明 `vp pack` 可以只输出 CSS，`vp build` 旧 CSS 库入口存在冲突；现改为 `vp build` 打包本地 Fixture、`vp pack` 打包唯一 CSS，修订配置待本机复测。未经明确许可不合并、发布或增加 CI。** 以用户最新要求为准。

## 1. 项目事实

- 仓库：[adui-studio/normalize.css](https://github.com/adui-studio/normalize.css)，npm 包目标名：`@adui/normalize.css`。
- 当前已确认：GitHub 仓库已建立并包含 MIT LICENSE；五项 ADR 已接受，首版只规划默认 Normalize 入口；Chrome/Edge 120、Firefox 121、Safari 17.2（及对应核心移动版本）已确定为**最低测试目标而非已验证兼容范围**，参见 [MVP 计划](docs/plans/MVP_IMPLEMENTATION_PLAN.md)。
- W-03 开发分支已增加 `package.json`、`vite.config.ts`、`fixtures/` 与 `tests/`；**R-003 产品 CSS 源码和单一 CSS 根导出已实现，已由旧 Node 复制脚本切换为 Vite+ 内置构建配置；仍没有发布包或完整消费端验收**。Vite+ 已在清单中固定到 1.4.0；维护者的 Windows 本地环境在本轮修订前已完成 `vp check`（55 文件格式和 11 文件 Lint 通过）、`vp test`（6/6）及 `npm run test:offline`（25/25），并已运行 `vp dev` 与原 CSS-only `vp pack`，`DEP0190` 在修复后的 Windows 回归中未再出现；R-003 已取得 Chrome 156 零差异、Chrome for Testing 120.0.6099.109 四组差异和 Firefox 121 零差异的 T0/T1 原始 JSON 证据；Edge 120、Safari 17.2 与移动端仍未测，正式 CSS 仍未准入。本执行容器仍未安装 Vite+。见 [首次本机运行记录](docs/research/LOCAL_BROWSER_RUN_20261104.md)。
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
