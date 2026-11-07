# CODEBASE_MAP — 仓库结构与定位

**2026-11-07 · R-009/R-011 专项隔离 Fixture（新研究分支）**：`fixtures/r009-r011-native.html` 是完全原生 T0，`fixtures/r009-r011-package.html` 是只额外加载 `../dist/normalize.css` 的 T2；公共 `fixtures/r009-r011-probe.js` 只记录 computed style、几何与 disclosure 状态（不影响发布包）。`vite.config.ts` 将这两页加入现有本地生产 Fixture 输入，`fixtures/index.html` 提供导航，`tests/fixtures.node.test.mjs` 增加 DOM/作者 CSS 对齐、静态资源与非产品 CSS 契约。研究与未验证边界见 [R-009/R-011 专项](research/R009_R011_NATIVE_RENDERING_20261107.md)。本次只扩展研究测试资产，不变更默认或可选 CSS、公开导出、依赖或 CI。

**2026-11-07 · 发行后测试资产已合并及下一轮规划位置（最新）**：PR #40/#41 已合入 `main@949683c2cf2be82c8f6898ef83afcd635d0ac607`；`fixtures/modules-cssom.js` 负责标准 CSSOM 嵌套导入检测，`fixtures/modules-probe.js` 在 M0/M1 页面采样并本地导出 JSON，`tests/modules-evidence.mjs` 是离线 CLI，`tests/fixtures.node.test.mjs` 含相应静态和合成验证。下一轮规则准入说明在 [`docs/plans/POST_V010_ACCEPTANCE_AND_NEXT_ITERATION.md`](plans/POST_V010_ACCEPTANCE_AND_NEXT_ITERATION.md)，兼容性结论在 [`docs/research/V010_POST_RELEASE_COMPATIBILITY.md`](research/V010_POST_RELEASE_COMPATIBILITY.md)。这些 Fixture/测试 JS 不属于 npm 运行时，产品 `src/*.css`、六个 exports、依赖与 CI 仍不变。

**2026-11-07 · 浏览器证据导出与对照文件定位（新分支，待验收）**：`fixtures/modules-native.html` 与 `fixtures/modules-all.html` 同步加入离线导出按钮；公共 `fixtures/modules-probe.js` 追加 `capturedAt`、`viewport` 和 Blob JSON 下载能力（不上传数据）。新增 `tests/modules-evidence.mjs`，可通过 `node tests/modules-evidence.mjs <M0.json> <M1.json>` 进行单浏览器、同媒体偏好的静态证据对照；`tests/fixtures.node.test.mjs` 添加其合成测试，无新 npm script。具体测试与证据边界见 [v0.1.0 补证矩阵第六节](research/V010_POST_RELEASE_COMPATIBILITY.md)。

**2026-11-07 · M0/M1 浏览器 CSSOM 补证文件定位（新分支待验收）**：`fixtures/modules-cssom.js` 新增纯浏览器 Fixture 辅助函数 `inspectModuleStylesheet`，递归读取同源 `CSSStyleSheet` 的 `@import` 与嵌套规则，识别四模块代表声明；`fixtures/modules-probe.js` 在原有 M0/M1 计算样式记录中追加 `pageProtocol` 和 `stylesheet.cssom`。`tests/fixtures.node.test.mjs` 增加存在、缺失和异常情形的离线测试；运行和证据边界见 [v0.1.0 补证矩阵](research/V010_POST_RELEASE_COMPATIBILITY.md)。不改产品 `src/`、六个 npm CSS 导出、Vite+ 工具链、依赖或 CI；这些 Fixture JS 不打进 npm 发布包。

**2026-11-07 · `v0.1.0` 已正式发行与后续验证定位（当前权威状态）**：发行源码 `cd28baaa5bf0a2af995053a7a35147e7392265a4`、npm `@adui/normalize.css@0.1.0`、附注 Tag 与 Published GitHub Release 均已核对；产品文件仍为 `src/normalize.css`、`src/reset.css`、`src/forms.css`、`src/a11y.css`、`src/all.css`，六个 CSS-only `exports` 与 `dist/normalize.css` 结构不变。真实 npm 包为十文件、9,240 B。新增发行后证据入口 [`docs/research/V010_POST_RELEASE_COMPATIBILITY.md`](research/V010_POST_RELEASE_COMPATIBILITY.md)，分层记录 Chromium 144/Linux 的有界 21/21 检查、历史组件/Reset 构建与仍缺的浏览器证据；复用 `tests/ecosystem-consumer.mjs`、`tests/reset-consumer.mjs`、`fixtures/modules-*.html`。**未新增测试脚本、产品 CSS、依赖或 CI**。下方阶段性“候选未开始/尚未发布”均仅是历史记录。

**2026-11-06 · v0.1.0 候选开发范围地图（尚未开始）**：新增[候选启动与最小版本迁移清单](plans/V010_CANDIDATE_START_REVIEW.md)，以现有 `0.0.3` 为事实基线，明确未来如获授权只涉及 `package.json` 版本、`tests/package.node.test.mjs` / `tests/package-real.node.test.mjs` 的版本断言、双语 README、CHANGELOG 和受影响的工程/发行文档；合成 smoke 的 `0.0.0-smoke.0`、默认与可选产品 CSS、六个公开 CSS exports、Vite+ 配置及无 CI 约束保持不变。此处是文件定位与拟修改范围，不代表任何 `0.1.0` 产品/版本代码已实施。

**2026-11-06 · v0.1.0 工程准入执行清单**：新增 [`docs/plans/V010_ENGINEERING_ADMISSION_PLAN.md`](plans/V010_ENGINEERING_ADMISSION_PLAN.md)，仅为基于 `main@52d7d78685f58c0eee963638b3d5d0427cc94ca6` 的真实测试命令覆盖盘点、Windows PowerShell 验收步骤、未来版本强绑定和旧浏览器证据边界。它不新增任何脚本、测试入口、源 CSS、依赖、CI，也不意味着 `0.1.0` 已获发布批准。

**2026-11-06 · ADR-0006 范围与兼容风险方案 A 已批准**：新增 [`docs/adr/0006-v01-default-scope-and-compatibility-risk.md`](adr/0006-v01-default-scope-and-compatibility-risk.md)，状态 **Accepted（方案 A）**。它将已合并的 36 条规则准入研究正式裁定为默认三规则冻结、限定接受旧 Safari/旧 Blink 风险、不公开承诺未经版本验证的最低支持版本，并保留未来 `0.1.0` 独立发行 Gate。不修改已经 Accepted 的 ADR-0001～0005，也不构成产品 CSS、公开版本或 CI 变更。

**2026-11-06 · 新增 v0.1.0 规则准入研究文档（待评审）**：[`docs/research/V01_RULE_ADMISSION_REVIEW_20261106.md`](research/V01_RULE_ADMISSION_REVIEW_20261106.md) 为下一阶段 36 条候选分类、默认规则与已发布可选模块实物映射、R-007/R-008 兼容风险及 G-01～G-07 版本准入门槛的**草案**。仅新增研究文件与历史文档引用，不修改 `src/`、`tests/`、`fixtures/`、`package.json`、Vite+ 配置、依赖、CI 或已发布的 `0.0.3`。

**2026-11-06 · Issue #18 浏览器模块补证文件定位（开发分支）**：新增 `fixtures/modules-native.html`、`fixtures/modules-all.html`（显式加载 `../src/all.css`）、`fixtures/modules-probe.js`，以及 [v0.0.3 可选模块浏览器验收矩阵](research/V003_OPTIONAL_MODULE_BROWSER_ACCEPTANCE.md)。`fixtures/index.html` 新增 M0/M1 导航，`tests/fixtures.node.test.mjs`、`tests/fixtures.test.ts` 添加同 DOM/作者 CSS、唯一 ID、本地资源等静态契约。**新增页面只供 `vp dev` 手工验收；不修改 `vite.config.ts` 的八张正式 build 页面列表**，不进入 npm `files:["dist","src"]`；未修改 `src/`、`package.json`、锁文件、依赖、CI。此分支尚待本机与真实浏览器验证，不将候选设施表述为已验证兼容性。

**2026-11-06 · `v0.0.3` 已发行代码地图（当前权威状态）**：正式发行源码为 `f5c08642e1ab6eaa1cb3d84782485f0298ae77be`，npm 版本 `0.0.3`，同一提交对应 GitHub 附注 Tag / Release `v0.0.3`。公开 CSS 导出共六个：`@adui/normalize.css`（默认 `dist/normalize.css`），及 `/normalize.css` 别名、`/reset.css`、`/forms.css`、`/a11y.css`、`/all.css`。`src/normalize.css` 仍包含默认三条规则，`src/reset.css`、`src/forms.css`、`src/a11y.css` 为可选模块，`src/all.css` 使用四行相对 `@import` 组合；Vite+ 只构建默认 CSS 到 `dist/`，可选文件在 `src/` 原样分发。十文件 npm 包及 Vite+ 消费验证通过，61/61 自动化测试、8 Fixture 页面构建通过；无 JS 运行时或 CI。旧目录树中若出现 `0.0.1`/`0.0.2`、单出口、待发布字样，均为**历史阶段快照**，以此段和当前代码为准。

**2026-11-05 · `0.0.3` 已合并代码地图（最新）**：PR #25 已合并到 `main@5e299a65e5a091d17ff6d329cadb166613bec332`。根 `package.json` 导出默认 `./dist/normalize.css` 及 `./normalize.css`、`./reset.css`、`./forms.css`、`./a11y.css`、`./all.css`；`src/normalize.css` 保持已发行的三条默认规则，其他模块分别在 `src/reset.css`、`src/forms.css`、`src/a11y.css`、`src/all.css`；Vite+ 仅将默认入口构建到 dist，其余 CSS 随 `src` 打包。`tests/fixtures.node.test.mjs` 保留默认根导出约束，`tests/package.node.test.mjs`、`tests/package-real.node.test.mjs` 和 `tests/package-vite-consumer.node.test.mjs` 覆盖模块导出/安装/打包组合。维护者已反馈 61/61 本机工程测试通过；当前仍未发布 `0.0.3`、未新增 CI。下方“开发候选/未执行验收”描述为旧时点记录。

**2026-11-05 · `0.0.3` 全套 CSS 模块开发代码地图（最新候选）**：`src/normalize.css`（默认三条已发布基础规则，仍经 `vp pack` 输出 `dist/normalize.css`）；新增 `src/reset.css`（布局 Reset）、`src/forms.css`（原生表单排版）、`src/a11y.css`（键盘焦点/系统偏好）、`src/all.css`（只用四行相对 `@import` 组合）。`package.json` 新增 CSS-only 子路径及 `files:["dist","src"]`，保留 `vite.config.ts`、Vite+ 1.4.0、pnpm 12.15.0 与唯一根 CSS 产物的构建方式。`tests/package.node.test.mjs`、`tests/package-real.node.test.mjs`、`tests/package-vite-consumer.node.test.mjs` 扩展完整模块的静态、tarball 安装与生产消费断言。中英文 README 与项目上下文同步。**全部尚待最终本机验收，未发布、不加 CI。**

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
