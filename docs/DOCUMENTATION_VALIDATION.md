# DOCUMENTATION_VALIDATION — 文档校验规范

**当前状态**：人工校验规范已定义，自动校验工具及 CI 尚未实现；本阶段不新增脚本。

## 1. 校验对象和真实状态

根目录：[README](../README.md)、[README.en](../README.en.md)、[AGENTS](../AGENTS.md)、[LICENSE](../LICENSE)。

核心八类资产：AGENTS、[REQUIREMENTS](REQUIREMENTS.md)、[SDD](SDD.md)、[ARCHITECTURE](ARCHITECTURE.md)、[PROJECT_CONTEXT](PROJECT_CONTEXT.md)、[CODEBASE_MAP](CODEBASE_MAP.md)、[SKILLS](SKILLS.md)、[HARNESS](HARNESS.md)。

增强机制：[ADR-0001](adr/0001-css-base-strategy.md) 与本文。当前无实际 Skills、脚本、工作流或 CSS 发布文件。

## 2. 核查规则

| 类型 | 本阶段人工检查 | 未来自动化方向 |
| --- | --- | --- |
| 文件结构 | 所有链接的本地 Markdown/许可证存在 | 路径存在性扫描 |
| 链接有效 | 相对路径可解析；外链 URL 规范 | 本地路径检查；可选外链检查 |
| 需求 | FR/NFR 编号唯一，状态/优先级/验收明确 | 编号与交叉引用分析 |
| ADR | 编号唯一，Proposed/Accepted 等合法状态；索引可追踪 | front matter 或标题/索引检查 |
| Skills | SKILLS 索引与实际技能目录一致 | SKILL.md 规则和资源路径校验 |
| Harness | 不能将规划命令宣称已运行 | 检查脚本与 package.json 一致性 |
| CODEBASE_MAP | 已存在/尚未创建两类分明 | 使用文件树自动核对 |
| 安全 | 无凭据、无未经许可代码或发布承诺 | 密钥扫描、许可证检查 |
| 语义一致性 | “已确认/已实现/已验证/待决策”没有混淆 | 继续人工复核，不能依赖字符串就认定正确 |

## 3. 文档状态约束

- 使用“已确认”必须有用户明确要求或仓库事实支持。
- 使用“已实现”必须存在代码/可执行资产。
- 使用“已验证”必须有真正执行的命令或浏览器证据。
- “待评审、规划中、候选”不得描述为正式承诺。
- 以前的本地草案不等于当前 GitHub 仓库已发布的代码。

## 4. 需求与设计追踪方式

以 [REQUIREMENTS](REQUIREMENTS.md) 的 FR/NFR 为入口，追踪至 [SDD](SDD.md) 模块与后续测试。高层变更需要 [ARCHITECTURE](ARCHITECTURE.md) 和 ADR 支持。只检查 ID 是否被引用无法证明行为真的符合需求，因此需要人工语义审查和真实测试。

## 5. 运行时机及结果记录

- 初始化文档时：结构、相对链接、编号、状态、CODEBASE_MAP 一致性。
- 修改需求/设计/架构/ADR 时：关联文件及影响分析。
- 未来 PR 阶段：只执行相关文档检查与实际 Harness 命令。
- 对未执行的检查按“未执行/环境受限/不适用”记录，不记为通过。

## 6. 开发前待落实

未来进入开发阶段后，仅评估可由维护者本地触发的少依赖文档检查命令，不引入任何 CI。**本文件不表示自动校验已经存在。**

**更新约定**：文档目录、需求/ADR 格式、Skills 结构、命令或验证机制变化时维护；失败不得通过删除检查来掩盖。