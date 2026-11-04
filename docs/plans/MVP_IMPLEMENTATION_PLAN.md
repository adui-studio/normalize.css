# @adui/normalize.css — MVP v0 实施计划

- **状态**：五项 ADR Accepted；W-03 本机 Harness 已建立，W-04 已实现开发期 CSS 根导出与静态构建，W-05 已实现首条 R-003 规则；正式发布、浏览器矩阵与消费端回归未验收。
- **日期**：2026-11-03
- **范围**：只为首版默认 Normalize 入口建立真实、可测试、可审计的交付能力。已接受 [ADR-0005](../adr/0005-viteplus-toolchain.md)：开发时统一使用 Vite+，维护者 Windows 本机已完成静态检查、单测和部分 Chrome 156 Fixture 运行。
- **关联**：[需求](../REQUIREMENTS.md) · [架构](../ARCHITECTURE.md) · [SDD](../SDD.md) · [规则总表](../research/RULE_REVIEW.md) · [浏览器矩阵](../research/BROWSER_REVIEW.md) · [准入审查](../research/REVIEW_GATE.md)
- **约束**：只在维护者明确指令下开始代码开发、安装依赖或运行测试；**永不增加 CI / GitHub Actions / 自动化发布工作流**；版本发布另外授权。

## 0. 已批准的正式决策

| 决策                                              | 首版承诺                                                                                                         | 不等于                                                                                                   |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [ADR-0001](../adr/0001-css-base-strategy.md)      | 长期采用默认 Normalize + 可选 Reset / Forms / A11y 的模块化边界                                                  | 首版会交付全部模块                                                                                       |
| [ADR-0002](../adr/0002-cascade-layers.md)         | 默认 CSS 不内置 `@layer`，必要时逐条评估 `:where()`                                                              | 所有用户 CSS 必然可覆盖，或旧浏览器已经实测                                                              |
| [ADR-0003](../adr/0003-mvp-package-contract.md)   | MVP 只规划 `@adui/normalize.css` 默认 CSS 入口                                                                   | **尚未实现 npm exports 或公开 CSS 文件**；`/reset.css`、`/forms.css`、`/a11y.css`、`/all.css` 均首版延期 |
| [ADR-0004](../adr/0004-browser-support-policy.md) | 固定 Baseline 2023 特性准入；Chrome/Edge 120、Firefox 121、Safari 17.2（含相应移动核心家族）已批准为最低测试目标 | **只是最低测试目标批准**；未实测，不包括未确认 WebView                                                   |

## 1. 实施原则和验收标准

- 只有有真实、可重现、可追溯的跨浏览器默认样式问题才准进入默认 CSS。历史源文件、本地视觉偏好及规范 UA 建议都不能独立构成修复证据。
- 不全局清除根字体、背景主题、原生按钮样式、标题、列表、滚动条、焦点、动画和页面间距。
- 先保留原生浏览器 Baseline 证据，再研究候选修复；不存在需要修复的现代差异则**放弃该规则**，不以填满 CSS 文件为目标。
- 原生可访问性、键盘操作、系统偏好、UI 组件库和二次 Reset 叠加测试是发布前验收的一部分。
- 在项目根目录只加入完成需求所必需的文件；实际目录、测试工具和版本必须在获准开发后按真实情况记录。
- 文档只写真实执行过的验证。不能从规范兼容性、单个 Chromium 结果推导 WebKit/真实 Safari 结果。

## 2. 工作包与依赖

| ID   | 顺序     | 任务                                  | 交付物（未来）                                                                                                                                                                  | 验收口径                                                                                                                                                       | 状态                                                     |
| ---- | -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| W-01 | 第一阶段 | 冻结浏览器最低测试目标和验证边界      | 七项 [最低测试目标](../research/BASELINE_2023_MAPPING.md) 已批准，固定时间线核对通过；仍需 OS/设备/发行版证据                                                                   | 取得真实版本测试结果后才可在发行说明承诺支持，不自动覆盖 WebView                                                                                               | **版本目标已批准，实测待进行**                           |
| W-02 | 第一阶段 | 最小规则证据卡与原生 Fixture 设计     | [R-003/R-004 证据卡](../research/RULE_EVIDENCE_R003_R004.md) 和 [本地验证执行指南](../research/R003_R004_LOCAL_VERIFICATION.md) 已包含旧版官方环境获取线索、T0/T1/T2 与记录模板 | 必测父级 400/600/700、Chrome/Edge 120、Firefox 121、Safari 17.2 与对应移动端；不以源码当实测                                                                   | **Chrome 120 差异4组、Firefox 121 无差异；其他目标待测** |
| W-03 | 第二阶段 | Vite+ 本地 Harness 与验证规范         | 已创建 `package.json`、`vite.config.ts`、R-003/004 T0/T1 HTML、计算样式探针和测试；[设计](VITEPLUS_LOCAL_HARNESS_DESIGN.md) 持续跟踪                                            | 已实测 `vp check`（55 格式/11 Lint）、`vp test` 6/6、离线 Node 26/26、`vp dev`、`vp build` 6 页 Fixture、`vp pack` 单一 CSS；T2、组件库及完整浏览器回归转 W-06 | **W-03 已验收结项（Issue #4 Closed）**                   |
| W-04 | 第二阶段 | Vite+ 下的单一 CSS 包导出与副作用验证 | 已实现 CSS-only 根导出，真实 tarball 安装与 Vite+ 生产消费均 PASS；见 [W-04 验收](CSS_PACKAGE_DELIVERY_REVIEW.md)                                                               | 真实包 P-01/06/07/09 与 Vite+ 生产 CSS 保留已 PASS；Webpack 不要求；开发态/浏览器回归转 W-06                                                                   | **W-04 包交付已验收（Issue #5 Closed）**                 |
| W-05 | 第三阶段 | 逐条最小 Normalize 修复               | 按证据准入的最小 CSS、R-ID → 来源 → 测试映射及变更说明                                                                                                                          | 有证据才实现；不内建 `@layer`，不加默认 Reset/Forms/A11y；视觉回归无新增重大问题                                                                               | **首批仅 R-003 已开发；发布前仍待审查**                  |
| W-06 | 第四阶段 | 跨浏览器、无障碍、生态与发布前验收    | T0/T2 已实现且反馈通过；F-003～F-007 原生控件观察点扩展中，逐浏览器记录待补                                                                                                     | T2 反馈未附 UA/JSON；新增 dialog/fieldset 等语义控件，交互回归仍 NOT_RUN                                                                                       | **T2 反馈通过；交互矩阵未验收**                          |
| W-07 | 第五阶段 | 文档、许可证与版本发布评审            | README 中文/英文、兼容矩阵、迁移/风险说明、发布前检查表                                                                                                                         | 包入口、实际功能、浏览器声明与证据一致；Release 与 npm 发布仍须单独授权                                                                                        | 未开始                                                   |

**依赖**：W-01 和 W-02 可在设计阶段继续；W-03/W-04 必须在开发获准后开始；W-05 必须依赖 W-02 的可复现问题、W-03 的测试能力；W-06 依赖真实产物；W-07 依赖完整证据。

## 3. 规则准入的分叉路径

```text
登记规则 R-XXX
  -> 查询规范 / 浏览器问题 / 固定上游 SHA
  -> 构造原生 HTML Baseline（实际开发前仅设计）
  -> 是否可在承诺浏览器中重复复现差异？
       否  -> 不采纳；记录“无证据 / 已修复 / 非 Normalize”
       是  -> 是否属于浏览器修复而非视觉 Reset？
                否 -> 移至可选模块未来评审，不进入首版
                是 -> 提出一条最小声明并验证 a11y / 组件库回归
                         失败 -> 缩小或拒绝规则，记录结果
                         通过 -> 才能纳入默认 Normalize
```

R-003 已因首版最低目标包含旧版 Blink/WebKit 而列为**优先必测候选**；R-004 默认保留等宽字体字号偏好，不采纳统一字号。R-003 现已在开发分支实现单条产品 CSS，Chrome 120 的四组计算差异是首批依据；R-004 已决定保留浏览器默认字号，**不会**写入产品 CSS。前述有限实测不等于完整发布兼容性验收。其他历史 Bug（如 R-007/008）必须先证实现代目标浏览器仍有问题。

## 4. 最小 Fixture 验收矩阵（规划，不是测试结果）

| Fixture | 关键用例                                | 预计阻塞风险               |
| ------- | --------------------------------------- | -------------------------- |
| F-001   | strong/code/abbr、字体继承、缩放、嵌套  | 字重/字号规则的必要性      |
| F-002   | table、hr、progress 的默认表现          | 过时 UA 修复               |
| F-003   | details/summary、键盘展开/焦点          | 原生语义被覆盖             |
| F-004   | 原生 button/search/file/select/textarea | 触控、原生控件样式变化     |
| F-005   | dialog、popover、浅深色                 | top-layer、主题与 Esc 行为 |
| F-006   | hidden 与 hidden="until-found"          | 页面查找/片段导航被破坏    |
| F-007   | focus-visible、forced-colors、减少动效  | a11y 与用户偏好            |
| F-008   | 文字断行、媒体、列表、表格              | Reset 侵入性               |
| F-009   | Element Plus / Ant Design / TDesign     | 组件库布局/样式冲突        |
| F-010   | Tailwind Preflight / UnoCSS Reset       | 重复 Reset 与 CSS 顺序     |

每条测试记录：目标规则、精确浏览器/OS/宿主版本、HTML、导入顺序、无库/单规则/实际导出三种输入、可观察的预期/实际、截图或日志、复现次数、失败/通过/未验证、修复后的回归与回退。

## 5. 实现后的交付定义（DoD）

1. 只暴露已批准的默认 Normalize CSS 根入口；不隐式包含可选模块或新增组合包。
2. 所有进入默认入口的规则都具有 R-ID、浏览器差异证据、最小可复现 Fixture、验证记录与拒绝/回退说明。
3. 目标浏览器版本与实际测试环境清单有证据；不能满足的覆盖范围单独标记未验证并调整发布承诺。
4. 无全局焦点消除、强制动画关闭、主题或视觉 Reset；默认不内置 `@layer`。
5. 包文件清单、LICENSE、CSS 导出与生产构建保留 CSS 的结果经实际检查；`sideEffects:false` 不得未经证明直接采用。
6. 同步中英文 README、需求/设计/上下文/代码地图；风险与破坏性变化对消费者可见。
7. 本地检查结果真实存在且可审查，**无任何 CI 或自动化发布工作流**。
8. 上述检查不等于 npm 发布授权；发布前必须另行批准。

## 6. 状态、权限与待确认

**已完成（本次文档阶段）**：四项 ADR 已接受；36 条候选已做文献与来源研究；原版 Skills 和 Issue/PR 模板在现有 Draft PR 分支中。

**已有部分研究结果**：W-01 的 [Baseline 2023 最低目标](../research/BASELINE_2023_MAPPING.md) 已批准且源数据/时间线一致；W-02 的 [R-003/R-004 专项证据卡](../research/RULE_EVIDENCE_R003_R004.md) 已补充 Blink 120/WebKit 2023 快照，R-003 最低目标必测；Vite+ 工具链已按 ADR-0005 选定。

**W-04 近期补充（2026-11-04）**：维护者已真实执行修订后的 `vp build`（六张 Fixture HTML 与探针 JS）、`vp pack`（仅 `dist/normalize.css` 200 字节）和离线 Node 26/26，W-03 已以完成关闭 #4；W-04 已增加独立 `npm run test:package`（真实 tarball/安装）和 `npm run test:consumer`（真实 Vite+ 生产 CSS 保留）的本地脚本，**尚待 Windows 本机实跑**。Webpack 已按维护者最新决定取消必测；组件库与正式发布验收分别留在 W-06/W-07。详见[W-04 记录 §7.4～§7.5](CSS_PACKAGE_DELIVERY_REVIEW.md)。

**未完成**：完整最低浏览器 UA/OS/设备测试、正式发行兼容性声明、WebView/Safari/组件库回归、锁文件提交确认、Windows 最新全量检查、Vite+/Webpack 生产消费者和实际完整仓库 npm tarball 验收。维护者本机 `vp check` 已通过、Chrome 156 的 R-003 原始 JSON 比较已完成；W-03 已获取 Chrome 120 桌面版 R-003 四组真实 JSON 差异、Firefox 121 零差异证据，Edge 120、Safari 17.2、移动端及组件库仍未测；W-04 已有真实 CSS 根导出、静态构建与独立环境的局部打包验证，但正式交付验收未完成；W-05 首条 R-003 规则已开发，后续规则与 W-06/W-07 尚未完成。

**授权区分**：维护者已明确允许开始开发，当前优先实施 W-03 本地 Harness。**仍不推定**已授权合并 PR、发布 npm、创建 Release 或新增任何 CI。真正 CSS 规则须先完成证据准入。

**W-04 最新本机结果（2026-11-04）**：维护者已运行 `vp pack`（单个 CSS）、`npm run test:package`（真实 tarball / 离线安装 **1/1 PASS**）、`npm run test:consumer`（独立 Vite+ 1.4.0 生产 CSS 导入 **1/1 PASS**）。P-01/06/07/09 达到当前包契约，P-02 的生产构建保留 CSS 子项通过；但 P-02 开发态/页面实际表现、P-03 Webpack 5 已取消强制验收，不视作 PASS；W-06 的开发态/浏览器样式回归仍未完成。另新增 Git `.gitattributes` 与 EditorConfig LF 统一配置，防止 Windows CRLF 反复触发格式修复；在维护者机器上的新配置仍待验证。W-04 #5 继续 Open；不合并或发布 npm、不增加 CI。

**W-04 最新范围收敛（2026-11-04；Issue #5 已以 Completed 结项）**：维护者强调本库只使用 Vite+，因此已删除未运行的 `test:webpack` 与对应脚本，P-03 Webpack 改为**范围外、非必测**；此决策不意味着曾经测试通过。现有 `vp pack` 唯一 CSS、真实包安装 1/1 和 Vite+ 生产消费 1/1 的证据已达到 W-04 当前包交付 DoD，开发态/浏览器/组件库效果移交 W-06，npm 发行审批移交 W-07。维护者 `git check-attr` 确认 LF；上轮 `vp check --fix` 主要修复 Markdown 表格对齐，本轮更新后仍待重新运行完整 `vp check`。

**W-06 首批 T2 Fixture 开发（2026-11-04）**：已在开发分支创建 `fixtures/t2-native.html` / `t2-package.html`，二者相同 DOM、同一父级字重样式和 10 个原生计算样式探针；后者仅通过 `../dist/normalize.css` 加载 `vp pack` 的真实产物，探针记录样式表是否挂载。新增两页到 `vp build` 并扩展 Node/Vitest 契约，另有 [W-06 本地验证说明](../research/W06_T2_LOCAL_VERIFICATION.md)。仅在 GitHub 文件层面完成结构一致性检查；**本轮的 Vite+ 真正执行和浏览器 T2 对照尚未获取结果**。W-06 #7 继续 Open；组件库、交互与 Safari/移动端仍未测。不新增产品 CSS、运行时依赖或 CI。

**W-06 T2 维护者反馈与第二批原生观察点（2026-11-04）**：维护者反馈首批本地 T0/T2 运行验证通过，尚未提供精确浏览器/OS/JSON/截图，因此不认定全浏览器 PASS。当前在原有两张内容相同的 T0/T2 页面同步增加 fieldset、select、textarea、checkbox、dialog；F-003/004/005/006/007 的 Tab、Esc、summary、hidden/until-found、系统偏好操作仍为 NOT_RUN。继续复用 Vite+ 与现有 10 个计算样式探针，未增加产品 CSS、依赖、CI 或发布行为。见[W-06 本地验证](../research/W06_T2_LOCAL_VERIFICATION.md)。

**W-06 Chrome 156 截图结果（2026-11-04）**：维护者新增 T0/T2 实际页面截图并确认通过。T2 显示真实 `dist/normalize.css` 已挂载（`packageStylesheet.loaded: true`）；两页 10 个 R-003/R-004 测量点的计算样式一致，四个等宽元素仍为浏览器默认 `13px`、`monospace`。据此将 **Chrome 156 本地 T2 静态加载及计算样式对照**记为有截图证据的 PASS；此前“无截图”的阶段记录保留为历史，不再代表最新状态。Tab、dialog、hidden/until-found、系统偏好、其他浏览器/移动端和生态组件库仍未有逐项操作证据，W-06 #7 继续 Open。详见[W-06 实测记录](../research/W06_T2_LOCAL_VERIFICATION.md)。

## 7. GitHub Issue 跟踪

已基于仓库原版 [github-issues Skill](../../.agents/skills/github-issues/SKILL.md) 创建以下正式任务，全部为 Open / 未实施；Issue 在 GitHub 仓库可见，而本计划和 Issue/PR 模板仍位于 Draft PR #1 分支。

| 实施工作包                | GitHub Issue                                                                        | 阶段与启动条件                                    |
| ------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------- |
| W-01 浏览器版本与设备范围 | [#2：Baseline 2023 最低版本](https://github.com/adui-studio/normalize.css/issues/2) | 研究可先开展；真实设备验证待条件具备              |
| W-02 最小规则证据         | [#3：R-003/R-004 证据卡](https://github.com/adui-studio/normalize.css/issues/3)     | 文献/Fixture 设计可先开展；实际浏览器复现须获授权 |
| W-03 本地 Harness         | [#4：本地测试 Harness](https://github.com/adui-studio/normalize.css/issues/4)       | 需开发与测试工具授权，不增加 CI                   |
| W-04 单一 CSS 包入口      | [#5：根入口与副作用验证](https://github.com/adui-studio/normalize.css/issues/5)     | 需开发授权和真实打包环境                          |
| W-05 逐条 Normalize CSS   | [#6：最小规则实现](https://github.com/adui-studio/normalize.css/issues/6)           | 需开发授权以及可复现的浏览器差异                  |
| W-06 真实兼容性回归       | [#7：浏览器与生态回归](https://github.com/adui-studio/normalize.css/issues/7)       | 依赖实际 CSS、浏览器与 UI 库环境                  |
| W-07 发行前质量审查       | [#8：文档与发布前审核](https://github.com/adui-studio/normalize.css/issues/8)       | 依赖真实验证；不执行 npm 发布或 Release           |

Issue 的创建不代表任务已经开始，更不代表验收通过。
