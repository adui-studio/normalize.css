# @adui/normalize.css

**简体中文** · [English](README.en.md)

面向现代 Web 应用的 CSS 标准化基础库，目标是**默认克制、按需增强、行为可预测、兼容可验证**。

> **项目状态：首批 CSS 源码和根导出已在开发分支实现，尚未发布。** ADR-0001～0005 已通过。当前 `src/normalize.css` 只包含有 Chrome 120 实测支持的 R-003（`b/strong` 相对字重）；R-004 等宽字号保留浏览器默认值。单一 npm CSS 根导出已配置，但包仍为 `private: true`、版本 `0.0.0`，真实生态兼容与完整最低浏览器矩阵尚未验收。

## 项目目标

- 修正有证据支持的跨浏览器默认样式差异，优先保留 HTML 原生语义和交互。
- 默认 Normalize 低侵入；Reset、无障碍增强、表单增强明确按需启用。
- 不照搬已有项目；每条规则记录来源、目标浏览器、预期收益、兼容风险及验证结果。
- 优先兼容 Vue、React、原生 HTML，以及 Element Plus、Ant Design、TDesign 等常见组件库。
- 追求无运行时 JavaScript 依赖、可审计的 CSS 输出和可重复验证流程。

## 首版入口（开发中，尚未发布）

| 入口（设计约定）                | 责任                         | 首版发布范围             |
| ------------------------------- | ---------------------------- | ------------------------ |
| `@adui/normalize.css`           | 仅修复有证据的浏览器 UA 差异 | **开发中，唯一 CSS 根导出** |
| `@adui/normalize.css/reset.css` | 盒模型与布局重置             | 首版延期；未来单独评审   |
| `@adui/normalize.css/a11y.css`  | 焦点及系统偏好辅助           | 首版延期；未来单独评审   |
| `@adui/normalize.css/forms.css` | 原生表单交互增强             | 首版延期；未来单独评审   |
| `@adui/normalize.css/all.css`   | 显式组合入口                 | 首版延期；未来单独评审   |

长期模块方向已经 [ADR-0001](docs/adr/0001-css-base-strategy.md) 批准，但首版只保留默认入口；默认**不内置 `@layer`**，固定 **Baseline 2023** 为特性准入参考。核心浏览器最低**测试目标**已批准：Chrome/Edge 120、Firefox 121、Safari 17.2（含对应移动浏览器），**尚未完整实测通过，不能视为已发布支持声明**。仓库已实现开发期根导出，但还未发布 npm 包。

## 本地构建与 CSS 使用（未发布）

该开发分支已提供唯一 CSS 根入口，当前只有 R-003：

```css
b,
strong {
  font-weight: bolder;
}
```

先生成静态 CSS 产物（Vite+ 仍用于开发检查，无额外运行时 JS 或构建依赖）：

```sh
npm run build
npm run test:offline
vp check
```

构建会把 `src/normalize.css` 原样复制为 `dist/normalize.css`。如需在本地 HTML 试用，可直接用 `<link rel="stylesheet" href="/dist/normalize.css">`（前提是你的静态服务器确实提供该 URL）。若从本地构建的 npm tarball 安装到支持 CSS 导入的构建工具，可测试 `import "@adui/normalize.css";`，但 Vite+/Webpack 生产消费端兼容尚未正式验收。**不执行 npm publish**。

默认 Normalize 不覆盖 `code/kbd/samp/pre` 的原生字体字号，不包含 Reset/Forms/A11y/组合入口，也不内建 `@layer`。

## 本地开发与复现（W-03）

本分支已配置 Vite+ 1.4.0 作为**开发依赖**；维护者本机已成功执行 `pnpm install`，但**尚未核对提交到 Git 的锁文件**。Node.js 需满足 `^22.18.0 || ^24.11.0 || >=26.0.0`；具体安装完成后请生成并提交所选包管理器的锁文件。

```sh
# 在有 npm 网络访问且 Node 版本满足要求时
npm install
npm exec -- vp check
npm exec -- vp test
npm exec -- vp dev
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

**截至 2026-11-04 的验证范围**：维护者此前在 Windows 完成 `vp check`、Vitest 6/6、Node 23/23 以及 Chrome 120 / Firefox 121 / Chrome 156 的局部 R-003、R-004 对照。本次新增 CSS 和打包脚本在独立 Linux Node 22.16.0 环境中完成构建、5 项定向测试及离线 tarball 安装与入口封装验证；**该 Node 版本低于仓库 Vite+ 引擎下限，尚未在维护者 Windows 上重新执行完整检查**。Chrome 120 的 R-003 原生计算字重与候选有四组差异，Firefox 121 / Chrome 156 无差异；R-004 按浏览器默认行为，不再进行额外字体偏好专项测试。Safari/Edge/移动端、UI 组件库和 Vite+/Webpack 生产消费验证仍未完成。项目不增加 CI、不发布 npm。

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
| [规则候选研究](docs/research/RULE_REVIEW.md)                                  | 36 条待评审候选，不代表已实现                                                                     |
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
| [纯 CSS npm 包交付研究](docs/plans/CSS_PACKAGE_DELIVERY_REVIEW.md)            | W-04 已部分落实文件白名单与 CSS 副作用元数据；根入口和消费端测试仍未实施                          |
| [浏览器矩阵](docs/research/BROWSER_REVIEW.md)                                 | 支持范围与测试策略草案                                                                            |
| [竞品对照](docs/research/COMPETITOR_REVIEW.md)                                | 六类 Normalize/Reset 方案源码研究                                                                 |

## 参与讨论与贡献

- [Issue 表单](https://github.com/adui-studio/normalize.css/issues/new/choose)：浏览器兼容性、规则提案、文档与架构讨论；**模板合并到 main 后生效**。
- [PR 模板](.github/pull_request_template.md)：说明规则证据、影响范围、实际本地验证和文档同步。
- [项目 Skills](docs/SKILLS.md)：直接纳入上游 `github/awesome-copilot` Skills 文件，供 Codex 与 OpenCode 使用；来源和安装限制见记录。

## 开发前门槛

维护者已批准开始开发，**开发工具链固定为 Vite+**。W-03 Fixture/离线测试与 Vite+ 在维护者本机已运行，W-04 已启动预发行元数据约束；旧版浏览器及 W-03 的格式问题仍待完成。W-04 的真实 CSS 包导出、W-05 的正式规则尚未实施；最低目标版本、规则必要性和生态兼容性必须有真实结果，不增加任何 CI，也不擅自发布。

## 许可证

[MIT](LICENSE)，Copyright © 2026 ADui Studio。
