# CODEBASE_MAP — 仓库结构与定位

**状态**：文档初始化完成后的目录索引。严格区分**已经存在**和**仅规划**的路径。

## 1. 当前真实文件

```text
normalize.css/
├── LICENSE                   # 已存在：MIT
├── README.md                 # 本轮文档：中文项目入口
├── README.en.md              # 本轮文档：英文概览
├── AGENTS.md                 # 本轮文档：Agent 规则入口
└── docs/
    ├── REQUIREMENTS.md      # 本轮文档：需求与验收
    ├── ARCHITECTURE.md      # 本轮文档：总体架构草案
    ├── SDD.md               # 本轮文档：详细设计草案
    ├── PROJECT_CONTEXT.md   # 本轮文档：阶段事实
    ├── CODEBASE_MAP.md      # 本轮文档：代码地图
    ├── SKILLS.md            # 本轮文档：Skill 索引
    ├── HARNESS.md           # 本轮文档：验证机制规划
    ├── DOCUMENTATION_VALIDATION.md # 本轮文档：校验计划
    └── adr/
        └── 0001-css-base-strategy.md # 本轮文档：Proposed
```

本轮创建文件均为 Markdown，不包含任何实现源码。此目录图要与**本轮实际成功提交**同步；若提交未完成，必须标记为待提交而非已存在。

## 2. 尚不存在的路径（不据此创建占位）

| 候选路径 | 拟承担职责 | 状态 |
| --- | --- | --- |
| `src/` | CSS 源码分模块 | 规划中，**不存在** |
| `dist/` | CSS 发布产物 | 规划中，**不存在** |
| `package.json` | 包导出、开发命令、依赖 | 规划中，**不存在** |
| `tests/` | Fixtures、静态与浏览器测试 | 规划中，**不存在** |
| `scripts/` | 文档校验、构建与质量脚本 | 规划中，**不存在** |
| `.github/workflows/` | CI 工作流 | **不规划、不新增 CI**；当前不存在 |
| `.agents/skills/` | 经审核、确有价值的项目技能 | 尚无已安装 Skill |

## 3. 程序入口与依赖调用链

当前**没有**程序入口、运行时调用链、路由、状态管理、API、数据库、构建入口或自动化测试入口。

未来拟议的依赖路径（不可执行）：

```text
消费者应用
  -> npm package CSS entry (待实现)
     -> 默认 Normalize / 显式可选模块 (待实现)
        -> 目标浏览器渲染 (待测试)
```

## 4. 常见任务从哪里开始

| 任务 | 先看 | 同步维护 |
| --- | --- | --- |
| 确认新规则是否属于 Normalize | [REQUIREMENTS](REQUIREMENTS.md)、[SDD](SDD.md) | 需求、设计、测试计划 |
| 讨论 CSS Layers 或模块导出 | [ARCHITECTURE](ARCHITECTURE.md)、[ADR-0001](adr/0001-css-base-strategy.md) | SDD、ADR |
| 判断能否开始开发 | [PROJECT_CONTEXT](PROJECT_CONTEXT.md) | HARNESS 与状态 |
| 设计浏览器兼容性回归 | [HARNESS](HARNESS.md) | SDD、要求与产物 |
| 新增 Skill | [SKILLS](SKILLS.md) | AGENTS、校验规则 |
| 新增/重命名重要目录 | 本文 | README 导航 |

**更新约定**：只在仓库结构、关键入口、真实模块职责发生改变时更新；不得将计划中的文件写作已存在。