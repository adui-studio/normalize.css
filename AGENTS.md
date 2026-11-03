# AGENTS.md — @adui/normalize.css

> 本文件是项目 Agent 的简明规则入口。**当前阶段仅允许文档规划与维护，不进行 CSS/脚本实现、依赖安装、发布或部署**；用户后续明确变更范围时，以最新要求为准。

## 1. 项目事实

- 仓库：[adui-studio/normalize.css](https://github.com/adui-studio/normalize.css)，npm 包目标名：`@adui/normalize.css`。
- 当前已确认：GitHub 仓库已建立；仓库包含 MIT LICENSE；本轮仅初始化文档。
- 目前没有实现源码、可运行包、已选定工具链或已执行的浏览器兼容测试。
- 目标：低侵入 CSS 标准化基础库；Reset、A11y、Forms 为**拟议**可选增强。

## 2. 单一事实来源

| 问题 | 优先文档 |
| --- | --- |
| 要实现什么及如何验收 | [REQUIREMENTS](docs/REQUIREMENTS.md) |
| 架构边界与原因 | [ARCHITECTURE](docs/ARCHITECTURE.md) 和 [ADR](docs/adr/0001-css-base-strategy.md) |
| 模块接口及具体设计 | [SDD](docs/SDD.md) |
| 当前进度和待决策 | [PROJECT_CONTEXT](docs/PROJECT_CONTEXT.md) |
| 文件位置 | [CODEBASE_MAP](docs/CODEBASE_MAP.md) |
| 可用 Skills | [SKILLS](docs/SKILLS.md)：第三方原版技能的来源与使用边界 |
| 可执行检查 | [HARNESS](docs/HARNESS.md) |
| 文档一致性 | [DOCUMENTATION_VALIDATION](docs/DOCUMENTATION_VALIDATION.md) |

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
- 尽可能降低选择器特异性；使用 Cascade Layers 前需验证层优先级及消费者覆盖行为。
- 兼容性、包体积、浏览器版本和 UI 库结论必须由实际测试支持。

## 6. Git、权限与安全

- 最小变更；不擅自覆盖其他人工作、不执行强推、不提交密钥或令牌。
- 本项目明确**不增加任何 CI**；Harness 只讨论本地人工触发的验证，不新增任何工作流。
- 未经明确要求不创建发布/部署工作流、不推送发布版本、不运行不可信第三方脚本。
- Git 提交建议遵循 Conventional Commits、中文主题、适当 emoji；以仓库未来正式规范为准。
- 文档阶段不为形式创建空 Skill、空源码目录、虚构脚本或通过状态。
- 第三方 Skills 固定上游 SHA、许可证和来源，见 [记录](.agents/skills/UPSTREAM.md)；工具调用必须匹配当前连接与权限。

## 7. 完成判定

文档内容可追溯，链接有效，规划与事实明确分离；相关需求/设计/架构/上下文已同步。代码实现阶段的 DoD 只有在实际进入开发后才适用。