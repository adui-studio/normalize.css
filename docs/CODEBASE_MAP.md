# CODEBASE_MAP — 仓库结构与定位

**2026-11-05 · `0.0.3` 开发候选文件定位**：独立分支 `chore/prepare-v0.0.3-20261105` 修改 `package.json#version` 与 `tests/package.node.test.mjs`、`tests/package-real.node.test.mjs` 的正式包版本断言；`CHANGELOG.md` 新增 `0.0.3` Unreleased 条目，`README.md`/`README.en.md` 与 `docs/RELEASING.md` 记录 npm 已发布 `0.0.2` / 新开发候选 `0.0.3` 的区别。`src/normalize.css` 仍为 R-003、R-007、R-008；锁文件、依赖、根 CSS 导出及 CI 均不变。规则复审工作记录于 [Issue #22](https://github.com/adui-studio/normalize.css/issues/22)，本地验收未执行，不代表 `0.0.3` 已发布。

**2026-11-05 · v0.0.2 正式发行后的最新代码定位**：`src/normalize.css` 当前已发布 R-003/R-007/R-008 三条默认规则；`package.json` 为已发行 `0.0.2/private:false`，单一 `exports["."]` CSS 根入口与五文件 npm 包结构保持不变。PR #21 的 T0/T2 15 观察点已合并并在维护者 Windows 工程测试中通过。`v0.0.2` Tag 指向发行源码提交 `4d66e6b590c09b7de6e98332524684237dddf212`，GitHub Release 已发布；`main` 后续文档提交不属于该发行包。之前记录中的“待审分支”“仅 R-003/未发布”均为历史阶段，不是当前状态。后续完善 Normalize 并补齐必要证据后才评审 `0.1.0`，不增加 CI。

**2026-11-05 · 当前文件与验收定位**：PR #21 的 `fixtures/t2-native.html`、`fixtures/t2-package.html` 已合并 `abbr-plain`、`abbr-author`、`table-author` 等新增测试元素，`tests/t2-evidence.mjs`、`tests/t2-evidence.node.test.mjs`、`tests/fixtures.node.test.mjs` 已覆盖 15 个探针。R-003/R-007/R-008 三条默认规则范围已冻结，详细准入依据见 [DEFAULT_NORMALIZE_V01_READINESS.md](research/DEFAULT_NORMALIZE_V01_READINESS.md)。`package.json` 仍为 `0.0.2`，本轮仅准备版本迁移资料；下方既有历史阶段状态不代表当前实现，项目不增加 CI。

**2026-11-05 · 最新文件与发行规范索引**：PR #19 已合并 main，`src/normalize.css` 现为 R-003、R-007、R-008 三条规则，T0/T2 为 12 个观测点。`package.json` 当前 `0.0.2/private:false`，npm 已发行 `0.0.1`；新建 [RELEASING.md](RELEASING.md) 记录维护者确定的 `0.0.2 → 默认 Normalize 完成后 0.1.0` 版本门槛及 npm 成功后创建 Git Tag + GitHub Release 的人工流程。以下旧的“仅 R-003/未发布”描述是历史记录。不新增 CI。

**2026-11-05 · Issue #18 新规则功能分支（待验收）**：`feat/normalize-r007-r008-20261105` 的 `src/normalize.css` 拟包含 R-003、R-007、R-008 三条低侵入规则，T0/T2 Fixture 新增 `abbr-title` 与 `table-border` 两个计算样式点，CSSOM 检查从单规则升级为三规则，真实 npm tarball 契约同步检查三条规则；`main` 仍仅 R-003。原本的 CODEBASE_MAP 目录图属于已发布 `0.0.1` 的历史，功能分支的新增内容尚未合并/发布；不新增 CI。详见 [竞品研究](research/COMPETITOR_REVIEW.md)。

**状态（2026-11-05）**：PR #1/#9 已按顺序合并 `main`；目前唯一正式默认 Normalize CSS 仍为 R-003；**W-05 36 条规则评审与 W-06 管理验收均已结项**。现已启动 W-07 发布前质量审核，新增未发布更新日志与审查矩阵；锁文件已提交；候选版本和 npm 包元数据已确定为 `0.0.1/private:false`；公开兼容范围与首次 npm 发行仍待审批，尚未发布。下方各批次保留历史阶段描述。

**W-07 包管理器与锁文件核验（2026-11-04，最新）**：根 `package.json` 已固定 `packageManager: "pnpm@12.15.0"`；**`pnpm-lock.yaml` 已提交**，GitHub 静态核对确认环境文档锁定 pnpm 12.15.0、项目文档锁定 `vite-plus@1.4.0`。冻结安装输出仍待核验。见 [W-07 审核记录](research/W07_RELEASE_READINESS_REVIEW.md)。

**2026-11-05 · W-07 忽略规则与验收同步**：维护者当前 Git 工作区只有未跟踪的 JetBrains `.idea/`。已按最小范围在 `.gitignore` 增加 `.idea/`，供开发分支后续检出时阻止误提交本机 IDE 配置；不会删除或修改本地 `.idea` 内容。最新冻结安装、静态检查、Vitest、离线 Node、CSS 打包、真实包消费及 `npm pack --dry-run` 有实际通过日志，见 [W-07 审核记录](research/W07_RELEASE_READINESS_REVIEW.md)。

**2026-11-05 · W-07 npm 元数据同步**：`package.json` 已获维护者批准并补充 `description`、`license:"MIT"`、正式 `repository/homepage/bugs`；它们是现有包文件的元数据变更，没有新增源码、公开入口、依赖或目录。版本、private 和 pnpm 锁文件不变；修改后打包测试待维护者本机复核。见 [W-07 审核记录](research/W07_RELEASE_READINESS_REVIEW.md)。

**2026-11-05 · W-07 作者元数据补充**：开发分支 `package.json` 已增加 `author:"ADui"`，其余 npm 元数据、`version:0.0.0`、`private:true`、入口和依赖均不变；`LICENSE` 的 2026 ADui Studio 版权信息保持不变。此前五项元数据的 Windows 打包/消费真实回归已通过；作者字段加入后的最终文件尚待复验。详见 [W-07 审核记录](research/W07_RELEASE_READINESS_REVIEW.md)。

**2026-11-05 · W-07 首发审核文件**：新增 [W-07 首发决策审核](research/W07_RELEASE_GATES.md)，只记录 P-02 版本候选、P-04 npm scope 核对方法、P-05 浏览器公开声明与证据边界；不增加 CSS、脚本或发布资产。包配置与根导出保持不变。

**2026-11-05 · W-07 发行候选配置变化（历史阶段，最终配置见顶部）**：维护者已确认首发候选版本 **`0.0.1`**、`private:false`；根包仅调整这两项，同时将 `tests/package.node.test.mjs` 与 `tests/package-real.node.test.mjs` 的正式包断言切换为新值。测试合成 Fixture 与隔离消费者的 `private:true` 不变。正式 CSS 仍仅 R-003、导出与 pnpm 锁文件不变；新版本实际本地质量回归待执行，未发布 npm。见 [W-07 审核报告](research/W07_RELEASE_READINESS_REVIEW.md)。

**2026-11-05 · W-07 private 安全开关恢复（历史阶段，已由最新决定覆盖）**：当前根 `package.json` 为 `version:0.0.1`、`private:true`；正式包两项测试断言已恢复 `true`，合成测试和隔离消费者保持不变。之前 `private:false` 只是历史配置阶段。CSS 仍仅 R-003；锁文件、单一根导出、依赖不变。该组合的 Windows 实际回归待完成，仍未发布。见 [W-07 报告](research/W07_RELEASE_READINESS_REVIEW.md)。

**2026-11-05 · W-07 P-05 证据矩阵归档（最新）**：新增 [七项目标浏览器证据矩阵](research/W07_P05_BROWSER_EVIDENCE_MATRIX.md)，为已批准的最低测试目标逐项记录已有证据、缺口及复用的本地 T0/T2 采集步骤；不新增源码、Fixture 或依赖。管理验收与版本兼容承诺严格区分，P-05 尚未 PASS。

**2026-11-05 · 首个 MVP 开发收尾（最新）**：新增本地 `verify:mvp` 一键验证脚本、T0/T2 JSON 比较器及合成数据 Node 测试，并新增 [MVP v0.0.1 交付清单](MVP_0_0_1_HANDOFF.md)。正式源码仍仅 R-003，不增加依赖、公开子路径或 CI；本机全套验证需维护者后续执行。

**2026-11-05 · T2 CSSOM 误判防护（最新）**：更新既有 `fixtures/probe.js`、`tests/probe.node.test.mjs`、`tests/t2-evidence.mjs`、`tests/t2-evidence.node.test.mjs`，对已挂载但无正确产品规则的 CSS 单独标记 `STYLESHEET_CONTENT_MISMATCH`；没有增加发布资产或入口。

## 1. 当前真实文件

```text
normalize.css/
├── LICENSE                   # 已存在：MIT
├── pnpm-lock.yaml            # W-07：真实 pnpm 12 锁文件，冻结安装待验
├── CHANGELOG.md             # W-07：仅记录 Unreleased，未发布任何正式版本
├── README.md                 # 本轮文档：中文项目入口
├── README.en.md              # 本轮文档：英文概览
├── AGENTS.md                 # Agent 规则入口
├── .gitignore                # 本地依赖、构建产物忽略
├── .gitattributes            # Git 对所有文本统一检出 LF，不依赖 Windows autocrlf
├── .editorconfig             # 编辑器 UTF-8、LF 与文件末尾换行约定
├── package.json              # W-07：0.0.1、private true、vite-plus 1.4.0、CSS-only exports/元数据
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
│   ├── t2-evidence.mjs               # W-07：正式 T0/T2 包 CSS 探针 JSON 比较 CLI
│   ├── t2-evidence.node.test.mjs     # W-07：合成 T0/T2、异常与 CLI 退出码测试
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
    ├── MVP_0_0_1_HANDOFF.md # MVP 0.0.1 交付定义与手工验收步骤
    ├── REQUIREMENTS.md      # 本轮文档：需求与验收
    ├── ARCHITECTURE.md      # 本轮文档：总体架构草案
    ├── SDD.md               # 本轮文档：详细设计草案
    ├── PROJECT_CONTEXT.md   # 本轮文档：阶段事实
    ├── research/W06_ECOSYSTEM_LOCAL_VERIFICATION.md # W-06 生态对照本地执行与验收边界
    ├── research/W06_RESET_LOCAL_VERIFICATION.md # W-06 F-010 三组 Reset 分离验证执行说明
    ├── research/W06_ACCEPTANCE_INDEX.md # W-06 正式验收归档索引与证据边界
    ├── research/W05_RULE_ACCEPTANCE.md # W-05 36 条规则首版评审归档索引
    ├── research/W07_RELEASE_READINESS_REVIEW.md # W-07 发布前审核清单与发行阻塞项
    ├── research/W07_RELEASE_GATES.md # W-07 首发版本/作用域/兼容性声明审核
    ├── research/W07_P05_BROWSER_EVIDENCE_MATRIX.md # P-05 七项最低目标浏览器证据及补证指南
    ├── CODEBASE_MAP.md      # 本轮文档：代码地图
    ├── SKILLS.md            # 本轮文档：Skill 索引
    ├── HARNESS.md           # 本轮文档：验证机制规划
    ├── DOCUMENTATION_VALIDATION.md # 本轮文档：校验计划
    ├── research/                # 文档评审分支：研究资料
    │   ├── 2026-11-04-reset-source-audit.md # main 分支固定源码审查（历史研究，非 W-06 实测）
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

**合并前历史记录**：W-03/W-04/W-05 曾基于尚未合并的文档评审分支开展开发。2026-11-05 已通过 PR #1/#9 合并 `main`，源码、Fixture、离线 Node、Vite+ 配置、唯一 R-003 和 CSS 根导出均已进入 `main`。`dist/` 仍属 `vp pack` 生成且被 Git 忽略的产物，npm 包尚未发布；没有运行时依赖或 CI。

## 2. 关键路径的实际状态（区分 Git 文件与构建产物）

| 候选路径                         | 拟承担职责                          | 状态                                             |
| -------------------------------- | ----------------------------------- | ------------------------------------------------ |
| `src/normalize.css`              | 默认 Normalize 唯一源码             | **main 已存在**：仅 R-003                        |
| `dist/`                          | CSS 发布产物                        | **Git 不跟踪**；执行 `vp pack` 时生成            |
| `package.json` 的 CSS `exports`  | 唯一根 CSS 入口                     | **已实现**；`0.0.1`、`private:false`             |
| `tests/`                         | Fixture 契约、离线 Node 测试        | **已实现**；真实 tarball 与 Vite+ 生产消费均通过 |
| `vite.config.ts` 的 `build/pack` | Vite+ Fixture 预览构建与单 CSS 打包 | **已实测 vp build / vp pack 产物**               |
| `.github/workflows/`             | CI/发布工作流                       | **明确不规划**，项目禁止增加 CI；当前不存在      |
| `.agents/skills/`                | 第三方原版 Skills                   | **main 已存在**；来源见 [SKILLS](SKILLS.md)      |

## 3. 程序入口与依赖调用链

当前 `main` 已包含 Fixture 与测试入口，以及 `src/normalize.css`、Vite+ `build/pack` 配置、CSS 包根 exports。先执行 `vp pack` 生成 `dist/normalize.css`；维护者已验证真实 tarball 离线安装和独立 Vite+ 1.4.0 生产消费者均 1/1 PASS。Webpack 已退出首版必测范围；开发态和页面样式归 W-06，npm 尚未发布。项目没有路由、后端 API 或数据库。

当前包的构建/消费调用路径（已存在历史真实 tarball 与 Vite+ 消费验证，最新变更的本机日志仍待归档）：

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
