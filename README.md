# @adui/normalize.css

**简体中文** · [English](README.en.md)

面向现代 Web 应用的 CSS 标准化基础库，目标是**默认克制、按需增强、行为可预测、兼容可验证**。

> **最新状态（2026-11-05）：PR #1（架构/文档）与 PR #9（MVP）已通过 Merge commit 合并进 `main`，但 npm 包尚未发布。W-03/W-04/W-05/W-06 已结项，W-07 发布前质量审核进行中。** ADR-0001～0005 已批准；36 条候选的首版评审结论全部通过，但 `src/normalize.css` 仍只有 R-003（`b/strong` 相对字重）。R-004 保留浏览器默认等宽字号，其他候选不进入首版默认 CSS。唯一 npm CSS 根导出已配置，包已按维护者最新决定配置为 `private: true`、`0.0.1` 候选版本，**仍未 npm 发布**。W-06 已由维护者正式验收归档；具体最低浏览器版本的公开支持声明仍须以可复核的环境证据为准。

**最新审查入口**：[W-05 规则评审归档](docs/research/W05_RULE_ACCEPTANCE.md) · [W-06 正式验收索引](docs/research/W06_ACCEPTANCE_INDEX.md) · [W-07 发布前审核](docs/research/W07_RELEASE_READINESS_REVIEW.md) · [未发布更新日志](CHANGELOG.md)。以下 W-03/W-04/W-06 的部分段落保留各阶段执行时的原始状态与历史结果，不代表今天仍未验收；当前判断以上述最新归档为准。

## 项目目标

- 修正有证据支持的跨浏览器默认样式差异，优先保留 HTML 原生语义和交互。
- 默认 Normalize 低侵入；Reset、无障碍增强、表单增强明确按需启用。
- 不照搬已有项目；每条规则记录来源、目标浏览器、预期收益、兼容风险及验证结果。
- 优先兼容 Vue、React、原生 HTML，以及 Element Plus、Ant Design、TDesign 等常见组件库。
- 追求无运行时 JavaScript 依赖、可审计的 CSS 输出和可重复验证流程。

## 首版入口（开发中，尚未发布）

| 入口（设计约定）                | 责任                         | 首版发布范围                |
| ------------------------------- | ---------------------------- | --------------------------- |
| `@adui/normalize.css`           | 仅修复有证据的浏览器 UA 差异 | **开发中，唯一 CSS 根导出** |
| `@adui/normalize.css/reset.css` | 盒模型与布局重置             | 首版延期；未来单独评审      |
| `@adui/normalize.css/a11y.css`  | 焦点及系统偏好辅助           | 首版延期；未来单独评审      |
| `@adui/normalize.css/forms.css` | 原生表单交互增强             | 首版延期；未来单独评审      |
| `@adui/normalize.css/all.css`   | 显式组合入口                 | 首版延期；未来单独评审      |

长期模块方向已经 [ADR-0001](docs/adr/0001-css-base-strategy.md) 批准，但首版只保留默认入口；默认**不内置 `@layer`**，固定 **Baseline 2023** 为特性准入参考。核心浏览器最低**测试目标**已批准：Chrome/Edge 120、Firefox 121、Safari 17.2（含对应移动浏览器），**尚未完整实测通过，不能视为已发布支持声明**。仓库已实现开发期根导出，但还未发布 npm 包。

## MVP `0.0.1` · 本地开发交付与最后验收

首个 MVP 已按 [W-05 正式规则准入](docs/research/W05_RULE_ACCEPTANCE.md) 固定为**单一 Normalize CSS 根入口、唯一 R-003 规则**；本轮补充了 T0/T2 真实包 CSS 的离线证据比较器和**一键本地人工验证脚本**，不扩充未获批准的默认 Reset。**新脚本尚未在维护者 Windows 运行**。

```powershell
pnpm install --frozen-lockfile
pnpm run verify:mvp
```

`verify:mvp` 顺序执行 `vp check`、`vp test`、Node 离线测试、`vp pack`、真实 tarball 安装、Vite+ 消费、`npm pack --dry-run`；**不执行 npm publish、不修改 private、不使用 CI**。浏览器实际取证时，先在 T0/T2 页面复制 JSON，再运行 `node tests/t2-evidence.mjs ./t2-native.json ./t2-package.json`。比较器会同时核验真实 CSSOM 里是否恰好包含唯一的 R-003 规则，避免仅因 `link.sheet` 存在而误判空样式表通过。**完整验收步骤与未完成项**见 [MVP 交付清单](docs/MVP_0_0_1_HANDOFF.md)。

## 本地构建与 CSS 使用（未发布）

该开发分支已提供唯一 CSS 根入口，当前只有 R-003：

```css
b,
strong {
  font-weight: bolder;
}
```

使用 Vite+ 的内置命令（无需旧版 Node 复制脚本）：

```sh
vp dev             # 本地 Fixture 开发服务
vp build           # 构建 HTML Fixture 预览，输出 dist-fixtures/
vp pack            # 构建唯一 CSS 包，输出 dist/normalize.css
vp check           # 格式与 Lint 检查
vp test            # Vitest 单元测试
npm run test:offline
npm run test:package  # vp pack 后，验证真实 npm tarball 与离线安装
npm run test:consumer # vp pack 后，验证 Vite+ 生产消费者保留 CSS
npm run test:ecosystem -- vue-element # 可选：隔离 Vue + Element Plus 真实消费
npm run test:ecosystem -- react-antd   # 可选：隔离 React + Ant Design 真实消费
npm run test:ecosystem -- vue-tdesign # 可选：隔离 Vue + TDesign 真实消费
```

本机已验证 Vite+ 1.4.0 的 `vp pack` 能直接以 CSS 作为唯一入口、输出一个样式文件（测试时约 200 字节、无 JS）。因此现在由 **`vp pack` 生成 npm 根导出的 `dist/normalize.css`**。原先把 CSS 作为 `vp build` 库入口会触发 `cssCodeSplit: false` 与 CSS input 冲突，已改成 **`vp build` 负责构建 HTML Fixture**，结果隔离在 `dist-fixtures/`，不进入 npm 包。最初六张页面的配置已在维护者 Windows Vite+ 1.4.0 实测通过；W-06 后续扩展为八张页面，更新后的完整构建仍待复验。如需在本地 HTML 试用，可直接用 `<link rel="stylesheet" href="/dist/normalize.css">`（前提是你的静态服务器确实提供该 URL）。若从本地构建的 npm tarball 安装到支持 CSS 导入的构建工具，可测试 `import "@adui/normalize.css";`，其中 Vite+ 生产构建已经验证 CSS 保留，Webpack 已取消首版必测要求；Chrome 156 本地 T0/T2 页面及部分原生交互已有维护者验证反馈，其他浏览器与组件库仍待验收。**不执行 npm publish**。

默认 Normalize 不覆盖 `code/kbd/samp/pre` 的原生字体字号，不包含 Reset/Forms/A11y/组合入口，也不内建 `@layer`。

## 本地开发与复现（W-03）

本分支已配置 Vite+ 1.4.0 作为**开发依赖**，并根据 W-07 决议统一使用 **pnpm 12.15.0**（`package.json#packageManager`）。Node.js 需满足 `^22.18.0 || ^24.11.0 || >=26.0.0`。**维护者已提交 `pnpm-lock.yaml`**；GitHub 静态审核确认 pnpm 12.15.0 与 `vite-plus@1.4.0` 的依赖锁定一致，仍需保留 Windows `pnpm install --frozen-lockfile` 的实际输出作为安装通过证据。

```sh
# 在有 npm 网络访问、Node 满足要求且 pnpm 版本为 12.15.0 时
pnpm --version
pnpm install --frozen-lockfile  # 使用已经提交的 pnpm-lock.yaml
pnpm exec vp check
pnpm exec vp test
pnpm exec vp dev
```

打开本地 Vite+ 服务器提示的地址下的 `/fixtures/`，选择 R-003 的 T0 原生与 T1 候选页面；R-004 提供 T0 原生、T1 单独 `font-size: 1em`、T1b 只额外添加 `monospace, monospace` 字体族的风险对照。T1b **只用于调查 Chrome 的等宽字体偏好，不能作为正式 Normalize 规则**。维护者已在 Chrome 156 实测四个元素的计算字号为 T0 13px、T1 13px、T1b **16px**；完整目标浏览器与用户设置验证未完成。每页会展示可复制的计算样式 JSON。无需 Vite+ 安装也可以使用**内置 Node 测试**检验探针逻辑：

```sh
npm run test:offline
```

真实浏览器采集 R-003 的 T0/T1 计算样式后，分别保存页面 `probe-output` 中显示的 JSON（本机临时文件，不直接提交包含环境信息的记录），即可用下列命令校验六组字重和采样环境：

```sh
node tests/r003-evidence.mjs r003-native.json r003-candidate.json
```

输出会区分 `COMPUTED_DIFFERENCE_OBSERVED`、`NO_COMPUTED_DIFFERENCE` 与 `CANDIDATE_MISMATCH`，但**不会自动证明 UA 缺陷、具体发行版本或实际字体渲染**。见 [R-003/R-004 本地验证指南](docs/research/R003_R004_LOCAL_VERIFICATION.md)。

**W-04 最新真实验证（2026-11-04）**：维护者在 Windows Vite+ 1.4.0 执行 `vp pack`，生成唯一 `dist/normalize.css`（约 200 字节）；`npm run test:package` **1/1 PASS**（真实 tarball、离线安装、根导出/私有子路径和文件白名单）；`npm run test:consumer` **1/1 PASS**（真实 tarball 安装至独立 Vite+ 生产消费者，CSS 副作用导入保留）。已有本地 `vp build` 六张 Fixture HTML、`vp test` 6/6 和 `npm run test:offline` 26/26 的实际输出。Vite+ 开发态以及真实浏览器页面/组件库回归留给 W-06；Webpack 已取消首版必测要求。项目不发布 npm、不新增 CI。

**W-04 包交付验收（开发分支范围）**：维护者确认只需 Vite+ 工具链。`vp pack` 唯一 CSS、`test:package` 真实包安装、`test:consumer` Vite+ 生产构建均已有实测 PASS；Webpack 专项测试已删除，不再作为阻塞。浏览器直接加载、开发态效果和组件库风险仍归 W-06；公开 npm 包仍须 W-07 单独批准。详见[W-04 当前验收口径](docs/plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

## W-06：真实 CSS T2 本地对照（开发中）

先构建 CSS 包，再启动 Vite+：

```powershell
vp pack
vp build
npm run test:offline
vp test
vp dev
```

访问 [T0 原生](http://localhost:5173/fixtures/t2-native.html) 和 [T2 实际 CSS](http://localhost:5173/fixtures/t2-package.html)。两页具有相同的被测内容，T2 **只多一个** `../dist/normalize.css` 样式链接，探针会报告 `packageStylesheet.loaded`；若为 `false` 则不能据此判定规则无差异。新增页面保留 R-003 字重、R-004 等宽字体以及原生表单、details、dialog、hidden 等观察点，**维护者已反馈首批 T2 本地验证通过**，但未提供逐浏览器 JSON/版本记录；新增加的原生表单、dialog、键盘焦点和隐藏元素交互检查仍待执行，不能因此推定组件库或无障碍兼容性通过。后续回归继续归 W-06 #7。

详细步骤见 [W-06 T2 验证说明](docs/research/W06_T2_LOCAL_VERIFICATION.md)。`dist-fixtures/` 仅供本地测试，绝不会进入只包含 `dist/` 的 npm 包。本轮不修改产品 CSS、不新增依赖或 CI。

## W-06：Vue / React / TDesign 组件库独立消费

继 Chrome 156 原生页面静态对照与部分交互人工验证通过后，已新增隔离的 Vue 3 + Element Plus、React + Ant Design、Vue 3 + TDesign Vue Next 三个测试场景。使用本仓库 `vp pack` 的**真实 tarball**，由 Vite+ 1.4.0 分别构建 T0（不加载本库）与 T2（加载 `@adui/normalize.css`）；只在显式运行时向 Git 忽略的临时目录安装固定版本组件库，**不会增加正式项目依赖或发布文件**。

```powershell
vp pack
npm run test:offline
npm run test:ecosystem -- vue-element
npm run test:ecosystem -- react-antd
npm run test:ecosystem -- vue-tdesign
```

生态构建首次运行可能需要 npm 网络。构建成功**不等于 UI 实际渲染兼容通过**；如需保留临时对照项目供浏览器人工测试，添加 `--keep`。详细步骤见 [W-06 生态对照指南](docs/research/W06_ECOSYSTEM_LOCAL_VERIFICATION.md)。Vue + TDesign Vue Next 1.20.10 测试脚本已加入但尚未实跑；UnoCSS Reset 与 Tailwind Preflight 仍待后续独立测试。

**最新 Windows 实测（2026-11-04）**：Vue + Element Plus 与 React + Ant Design 两组真实 tarball 的 Vite+ 生产构建均已 PASS；Vue `--keep` 已保留临时 T0/T2 项目用于浏览器对照。原 `npm run test:offline` 为 29/30 PASS：`tests/package.node.test.mjs` 仍断言旧六项清单，遗漏新增的第七项生态契约。该断言现已修正，**修复后已在维护者 Windows 真实重跑 30/30 PASS**（这是新增 TDesign 用例之前的结果；新增用例仍待复验）。Vue + Element Plus 已在 Chrome 156 的 T0/T2 浏览器截图中确认 Button/Input 挂载正常、静态外观及五项计算样式一致，**静态 UI 对照 PASS**。两页的 Vue feature flags 警告和 favicon 404 相同，未发现可归因于 Normalize 的样式冲突。**React + Ant Design 也已提供 Chrome 156 的 T0/T2 截图**：Button/Input 均挂载成功，静态外观一致，五项计算样式与原生组相同，因此其静态 UI 对照亦为 PASS。**两组的键盘、输入行为、其他浏览器及 TDesign/Reset 生态仍未完成**；构建或静态截图不能自动代表交互兼容 PASS。

## Windows 换行符统一（LF）

仓库新增 `.gitattributes` 的 `* text=auto eol=lf`，用于统一 Git 文本文件的换行；`.editorconfig` 要求 UTF-8、LF、文件末尾换行。JetBrains 编辑器应遵循项目 EditorConfig，防止 Windows 的 CRLF 在后续保存中反复触发 `vp check --fix`。**不要**为了此项配置执行 `git reset --hard`、批量 `git add --renormalize .` 或覆盖未提交的本地修改。

```powershell
git status --short
git pull --ff-only origin feat/viteplus-local-harness
git check-attr text eol -- README.md src/normalize.css
vp check
```

维护者已确认 `git check-attr` 对两个样本返回 `text: auto`、`eol: lf`。上次 `vp check --fix` 的远程 Git diff 是三处 Markdown 表格对齐修正，并非行尾属性失效；在新增或编辑表格后仍需遵循 Vite+ 的表格格式规则。修复完成后再运行一次 `vp check` 才能确认全部格式已 PASS。

如果已有工作区文件仍沿用旧 CRLF，先确认本地修改无冲突，再对项目自有文件执行一次 `vp check --fix`，检查 `git diff` 并按需提交；新配置不保证已检出的所有文件被 Git 自动重写。固定来源的第三方 Skills 不应因换行符配置被批量改写。

## Vite+ 格式检查与第三方 Skills

已在根 `vite.config.ts` 的 `fmt.ignorePatterns` 中**仅排除固定来源的 `.agents/skills/**`**，避免批量格式化污染第三方原文。项目自有的 Markdown、Fixture、测试、配置与 GitHub 模板仍接受完整 `vp check` 检查。维护者已在 Windows 完成过 `vp check --fix` 并提交推送；当前新增源码和文档仍需在相同环境重验 `vp check`。第三方原版 Skills 保持不变。可以在本地运行：

```sh
pnpm exec vp fmt --check
pnpm exec vp check
pnpm exec vp check --no-fmt  # 仅隔离格式问题排查 lint，不等于完整通过
```

## 设计边界

默认入口不应强制改变根字体大小、页面颜色主题、按钮外观、全局滚动条、所有元素的间距或用户系统交互偏好。对于可能改变现有组件行为的规则，优先使用独立可选模块，并配套回归验证。

## 工程文档

| 文档                                                                          | 内容                                                                                              |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [AGENTS.md](AGENTS.md)                                                        | AI Agent 与贡献者的协作规则                                                                       |
| [需求](docs/REQUIREMENTS.md)                                                  | 范围、功能/非功能需求、验收标准                                                                   |
| [架构](docs/ARCHITECTURE.md)                                                  | 模块边界、选型原则和依赖关系                                                                      |
| [详细设计](docs/SDD.md)                                                       | 待评审的导出契约、CSS 规则和验证设计                                                              |
| [项目上下文](docs/PROJECT_CONTEXT.md)                                         | 当前事实、进度、风险、待决策事项                                                                  |
| [代码地图](docs/CODEBASE_MAP.md)                                              | 已存在文件与规划结构的区别                                                                        |
| [Skills 索引](docs/SKILLS.md)                                                 | 可复用流程评估和状态                                                                              |
| [Harness](docs/HARNESS.md)                                                    | 计划中的执行与验证闭环                                                                            |
| [文档校验](docs/DOCUMENTATION_VALIDATION.md)                                  | 文档一致性审查策略                                                                                |
| [ADR-0001](docs/adr/0001-css-base-strategy.md)                                | 初始 CSS 基础策略（Accepted）                                                                     |
| [ADR-0002](docs/adr/0002-cascade-layers.md)                                   | CSS Cascade Layers 已批准策略                                                                     |
| [规则候选研究](docs/research/RULE_REVIEW.md)                                  | 36 条首版去留已审定，唯一准入 R-003 已实现；其余未加入默认入口                                    |
| [首批规则证据审查](docs/research/RULE_EVIDENCE_BATCH1.md)                     | 11 条候选的规范依据、历史修复及复现门槛                                                           |
| [第二批表单规则研究](docs/research/FORM_CONTROLS_REVIEW.md)                   | 原生表单、文件按钮与占位符的证据审查                                                              |
| [第三批规则证据研究](docs/research/RULE_EVIDENCE_BATCH3.md)                   | 剩余 17 条排版、Reset 和系统偏好候选规则                                                          |
| [R-003/R-004 专项证据卡](docs/research/RULE_EVIDENCE_R003_R004.md)            | b/strong 字重修复时间线与等宽字号用户偏好                                                         |
| [R-003/R-004 本地验证指南](docs/research/R003_R004_LOCAL_VERIFICATION.md)     | 版本目标、测试矩阵与留证要求                                                                      |
| [首次本地运行记录（2026-11-04）](docs/research/LOCAL_BROWSER_RUN_20261104.md) | 本机 Vite+ / 22+5 项旧版本测试、Chrome 156 的 R-003 无差异、R-004 T0/T1/T1b 13/13/16px 与格式失败 |
| [ADR-0003](docs/adr/0003-mvp-package-contract.md)                             | 首版 MVP 导出契约已批准方案（Accepted）                                                           |
| [ADR-0004](docs/adr/0004-browser-support-policy.md)                           | 浏览器支持基线与范围策略（Accepted）                                                              |
| [ADR-0005](docs/adr/0005-viteplus-toolchain.md)                               | 后续开发统一使用 Vite+（Accepted；维护者本机已验证可运行）                                        |
| [Baseline 2023 版本映射](docs/research/BASELINE_2023_MAPPING.md)              | 特性兼容候选版本及尚待实测的支持边界                                                              |
| [Vite+ 工具链研究](docs/research/VITEPLUS_TOOLCHAIN_REVIEW.md)                | 本地命令、纯 CSS 打包风险和验证要求                                                               |
| [开发准入清单](docs/research/REVIEW_GATE.md)                                  | 四份已接受 ADR 与剩余验证门槛                                                                     |
| [MVP 实施计划](docs/plans/MVP_IMPLEMENTATION_PLAN.md)                         | W-01～W-07 的任务分解、依赖、测试与发布前验收                                                     |
| [Vite+ 本地 Harness 设计](docs/plans/VITEPLUS_LOCAL_HARNESS_DESIGN.md)        | 本机 `vp test` / `vp dev` 已运行；`vp check` 格式失败，旧版实测未完成                             |
| [纯 CSS npm 包交付研究](docs/plans/CSS_PACKAGE_DELIVERY_REVIEW.md)            | W-04 已通过真实包安装、单一 CSS 导出和 Vite+ 生产消费端测试                                       |
| [浏览器矩阵](docs/research/BROWSER_REVIEW.md)                                 | 支持范围与测试策略草案                                                                            |
| [竞品对照](docs/research/COMPETITOR_REVIEW.md)                                | 六类 Normalize/Reset 方案源码研究                                                                 |

## 参与讨论与贡献

- [Issue 表单](https://github.com/adui-studio/normalize.css/issues/new/choose)：浏览器兼容性、规则提案、文档与架构讨论；**模板合并到 main 后生效**。
- [PR 模板](.github/pull_request_template.md)：说明规则证据、影响范围、实际本地验证和文档同步。
- [项目 Skills](docs/SKILLS.md)：直接纳入上游 `github/awesome-copilot` Skills 文件，供 Codex 与 OpenCode 使用；来源和安装限制见记录。

## 开发前门槛

维护者已批准首批最小实现，开发工具链统一使用 **Vite+**。W-03 本地 Harness、W-04 真实 CSS 包交付、W-05 首版 36 条规则去留评审、W-06 回归工作项均已按正式记录结项；W-02 #3 已按 MVP 首版规则证据研究完成结项；后续新增规则证据维护须另立任务，W-01 浏览器环境与 W-07 发布前审核仍为独立事项。**已确定首个公开候选版本 `0.0.1`，但尚未发布**：pnpm 12.15.0 锁文件已提交并经过先前版本的本机冻结安装验收；`package.json` 已恢复并保持 `private: true` 以防误发布，**PR #1/#9 已获批准并合并主分支；仍未获 npm 发布、Tag 或 Release 授权**。新版本的包契约测试需要重新执行。参见 [W-07 审核矩阵](docs/research/W07_RELEASE_READINESS_REVIEW.md)和[首发决策审核](docs/research/W07_RELEASE_GATES.md)。项目明确不增加任何 CI。

## 许可证

[MIT](LICENSE)，Copyright © 2026 ADui Studio。
