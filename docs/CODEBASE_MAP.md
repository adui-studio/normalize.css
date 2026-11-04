# CODEBASE_MAP — 仓库结构与定位

**状态**：开发分支已包含 Fixture、探针、Vite+、首条 R-003 Normalize CSS、Vite+ CSS-only 构建配置和包根 exports；发布、生态兼容与完整浏览器矩阵仍未验收。区分开发分支、依赖的文档评审分支与 main。

## 1. 当前真实文件

```text
normalize.css/
├── LICENSE                   # 已存在：MIT
├── README.md                 # 本轮文档：中文项目入口
├── README.en.md              # 本轮文档：英文概览
├── AGENTS.md                 # Agent 规则入口
├── .gitignore                # 本地依赖、构建产物忽略
├── .gitattributes            # Git 对所有文本统一检出 LF，不依赖 Windows autocrlf
├── .editorconfig             # 编辑器 UTF-8、LF 与文件末尾换行约定
├── package.json              # W-03/W-04：private、vite-plus 1.4.0、CSS 文件白名单/副作用元数据、离线测试脚本
├── vite.config.ts            # W-03：Vite+ 单元测试与上游 Skills 格式检查排除
├── src/normalize.css         # W-05 首批：仅 R-003 的 b/strong 相对字重修正
├── fixtures/                 # W-03/W-06：R-003/R-004 T0/T1 与实际 CSS T2 对照
│   ├── index.html
│   ├── probe.js
│   ├── r003-native.html
│   ├── r003-candidate.html
│   ├── r004-native.html
│   ├── r004-risk-review.html
│   ├── r004-family-review.html  # T1b：仅增加重复 monospace 字体族的风险对照
│   ├── t2-native.html       # W-06：T0 原生内容，R003/R004 及基础语义观察点
│   └── t2-package.html      # W-06：T2 仅增加真实 dist/normalize.css link
├── tests/                    # W-03 已存在：契约和 Node 内置单测
│   ├── fixtures.test.ts
│   ├── fixtures.node.test.mjs
│   ├── package.node.test.mjs
│   ├── package-smoke.node.test.mjs  # 合成包烟测（普通 test:offline）
│   ├── package-real.node.test.mjs   # W-04 真实包打包/安装（先 vp pack，再 test:package）
│   ├── package-vite-consumer.node.test.mjs # W-04 Vite+ 生产 CSS 副作用消费检查（test:consumer）
│   ├── ecosystem-fixtures.mjs       # W-06 Vue/React/TDesign T0/T2 同源 JS/HTML 生成器
│   ├── ecosystem-consumer.mjs       # W-06 隔离真实 tarball + 组件库 Vite+ 构建 CLI
│   ├── ecosystem-contract.node.test.mjs # W-06 无网络隔离与依赖版本契约
│   ├── reset-fixtures.mjs       # W-06 F-010：Tailwind / UnoCSS 独立组页面和 CSS 顺序生成
│   ├── reset-consumer.mjs       # W-06 F-010：真实 tarball + Vite+ 三组构建命令
│   ├── reset-contract.node.test.mjs # W-06 F-010：无网络隔离契约
│   ├── probe.node.test.mjs
│   ├── r003-evidence.mjs             # R-003 JSON 比较 CLI
│   ├── r003-evidence.node.test.mjs   # 合成数据与 CLI 测试
│   ├── evidence-file.mjs             # R-003 JSON 限长与普通文件安全读取
│   └── evidence-file.node.test.mjs   # 证据文件格式与资源边界测试
├── .github/                  # 评审分支：Issue/PR 模板，无 CI
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report.yml
│   │   ├── rule-proposal.yml
│   │   ├── documentation.yml
│   │   └── config.yml
│   └── pull_request_template.md
├── .agents/skills/           # 评审分支：上游原版第三方 Skills
│   ├── github-issues/        # SKILL.md 与 10 个 references
│   ├── conventional-commit/  # SKILL.md
│   ├── bug-reproduction-brief/ # SKILL.md
│   ├── UPSTREAM.md
│   └── UPSTREAM_LICENSE.txt
└── docs/
    ├── REQUIREMENTS.md      # 本轮文档：需求与验收
    ├── ARCHITECTURE.md      # 本轮文档：总体架构草案
    ├── SDD.md               # 本轮文档：详细设计草案
    ├── PROJECT_CONTEXT.md   # 本轮文档：阶段事实
    ├── research/W06_ECOSYSTEM_LOCAL_VERIFICATION.md # W-06 生态对照本地执行与验收边界
    ├── research/W06_RESET_LOCAL_VERIFICATION.md # W-06 F-010 三组 Reset 分离验证执行说明
    ├── CODEBASE_MAP.md      # 本轮文档：代码地图
    ├── SKILLS.md            # 本轮文档：Skill 索引
    ├── HARNESS.md           # 本轮文档：验证机制规划
    ├── DOCUMENTATION_VALIDATION.md # 本轮文档：校验计划
    ├── research/                # 文档评审分支：研究资料
    │   ├── RULE_REVIEW.md
    │   ├── RULE_EVIDENCE_BATCH1.md
    │   ├── RULE_EVIDENCE_R003_R004.md
    │   ├── R003_R004_LOCAL_VERIFICATION.md
    │   ├── LOCAL_BROWSER_RUN_20261104.md
    │   ├── W06_T2_LOCAL_VERIFICATION.md # T2 真实 CSS 页面验证说明
    │   ├── FORM_CONTROLS_REVIEW.md
    │   ├── RULE_EVIDENCE_BATCH3.md
    │   ├── REVIEW_GATE.md
    │   ├── BROWSER_REVIEW.md
    │   ├── BASELINE_2023_MAPPING.md
    │   ├── VITEPLUS_TOOLCHAIN_REVIEW.md
    │   └── COMPETITOR_REVIEW.md
    ├── plans/
    │   ├── MVP_IMPLEMENTATION_PLAN.md
    │   ├── VITEPLUS_LOCAL_HARNESS_DESIGN.md
    │   └── CSS_PACKAGE_DELIVERY_REVIEW.md
    └── adr/
        ├── 0001-css-base-strategy.md # Accepted
        ├── 0002-cascade-layers.md # Accepted
        ├── 0003-mvp-package-contract.md # Accepted
        ├── 0004-browser-support-policy.md # Accepted
        └── 0005-viteplus-toolchain.md # Accepted
```

W-03/W-04/W-05 开发分支基于尚未合并的文档评审分支；已增加测试 Fixture、离线 Node 测试、Vite+ 开发配置、首条 R-003 CSS 和单一包根导出。`dist/` 仍为本机构建生成、Git 忽略目录，尚无发布包。以上内容在合并前均不能描述为 main 已存在；没有新增运行时依赖或 CI。

## 2. 尚不存在的路径（不据此创建占位）

| 候选路径                         | 拟承担职责                          | 状态                                                  |
| -------------------------------- | ----------------------------------- | ----------------------------------------------------- |
| `src/normalize.css`              | 默认 Normalize 唯一源码             | **开发分支已实现：仅 R-003**                          |
| `dist/`                          | CSS 发布产物                        | 规划中，**不存在**                                    |
| `package.json` 的 CSS `exports`  | 唯一根 CSS 入口                     | **开发分支已实现**；仍 `private: true`                |
| `tests/`                         | Fixture 契约、离线 Node 测试        | **已实现**；真实 tarball 与 Vite+ 生产消费均通过      |
| `vite.config.ts` 的 `build/pack` | Vite+ Fixture 预览构建与单 CSS 打包 | **已实测 vp build / vp pack 产物**                    |
| `.github/workflows/`             | CI/发布工作流                       | **明确不规划**，项目禁止增加 CI；当前不存在           |
| `.agents/skills/`                | 第三方原版 Skills                   | 评审分支已纳入，main 尚无；来源见 [SKILLS](SKILLS.md) |

## 3. 程序入口与依赖调用链

当前开发分支已有 Fixture 与测试入口，以及 `src/normalize.css`、Vite+ `build/pack` 配置、CSS 包根 exports。先执行 `vp pack` 生成 `dist/normalize.css`；维护者已验证真实 tarball 离线安装和独立 Vite+ 1.4.0 生产消费者均 1/1 PASS。Webpack 已退出首版必测范围；开发态和页面样式归 W-06，npm 尚未发布。项目没有路由、后端 API 或数据库。

开发期的预期依赖路径（发布前仍需消费端验证）：

```text
消费者应用
  -> npm package CSS entry (exports "." -> ./dist/normalize.css)
     -> src/normalize.css（由 vp pack 构建，当前只有 R-003）
        -> 目标浏览器渲染（仅有局部证据）
```

## 4. 常见任务从哪里开始

| 任务                         | 先看                                                                                | 同步维护             |
| ---------------------------- | ----------------------------------------------------------------------------------- | -------------------- |
| 确认新规则是否属于 Normalize | [REQUIREMENTS](REQUIREMENTS.md)、[SDD](SDD.md)                                      | 需求、设计、测试计划 |
| 讨论 CSS Layers 或模块导出   | [ARCHITECTURE](ARCHITECTURE.md)、[ADR-0001](adr/0001-css-base-strategy.md)          | SDD、ADR             |
| 判断能否开始开发             | [PROJECT_CONTEXT](PROJECT_CONTEXT.md)、[MVP 计划](plans/MVP_IMPLEMENTATION_PLAN.md) | HARNESS 与状态       |
| 设计浏览器兼容性回归         | [HARNESS](HARNESS.md)                                                               | SDD、要求与产物      |
| 新增 Skill                   | [SKILLS](SKILLS.md)                                                                 | AGENTS、校验规则     |
| 新增/重命名重要目录          | 本文                                                                                | README 导航          |

**更新约定**：只在仓库结构、关键入口、真实模块职责发生改变时更新；不得将计划中的文件写作已存在。
