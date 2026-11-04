# ADR-0005 — 统一使用 Vite+ 作为开发工具链

- **状态**：Accepted（2026-11-03，维护者明确指定）
- **日期**：2026-11-03
- **关联**：[MVP 实施计划](../plans/MVP_IMPLEMENTATION_PLAN.md) · [架构](../ARCHITECTURE.md) · [Harness](../HARNESS.md) · [Vite+ 官方验证研究](../research/VITEPLUS_TOOLCHAIN_REVIEW.md)
- **注意**：本 ADR 只批准**后续开发所用工具链**，并不代表已经获准编写 CSS 源码、安装依赖或发布软件包。

## 1. 决策背景

`@adui/normalize.css` 是无运行时 JavaScript 依赖的纯 CSS 基础库，计划以 npm 静态 CSS 文件提供唯一默认入口。项目需要极简的格式化、本地检查、规则证据、跨浏览器测试和打包验证工具，而非完整前端应用脚手架。

维护者明确要求：“如果要开始开发的话，使用 viteplus”，指定 [Vite+](https://viteplus.dev/) 作为后续开发工具链。

## 2. 已接受的工具链原则

1. **统一工具链：Vite+**。通过项目依赖 `vite-plus` 与 `vp` CLI 运行约定的检查和开发命令，实际版本在获准开发时锁定。
2. **不引入运行时 JS**。Vite+ 仅为开发期工具；发布产物必须仍为静态 CSS。
3. **不生成与业务无关的应用脚手架**。当前仓库已经有正式文档和现有历史；不能在根目录直接运行可能覆盖仓库的脚手架。
4. **最小依赖**：优先使用 Vite+ 已集成的工具；浏览器真实交互与 CSS 特有的规则检查若缺少能力，再提供证据提出补充工具，禁止堆砌。
5. **保持绝对无 CI**：所有检查仅在维护者本地手动触发，不创建 GitHub Actions、CI、自动发布工作流、Cloud CI 等。
6. 不假定 Node/包管理器版本与用户本地状态；进入开发阶段后才核验，并固定锁文件。pnpm 为**可评审建议**，本 ADR 没有替用户额外决定包管理器。

## 3. 官方文档核对

| 目的             | 官方能力                                                                                | 采用原则                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 统一静态检查     | [`vp check`](https://viteplus.dev/guide/check) 通过 Oxfmt/Oxlint/类型检查处理支持的文件 | 作为本地统一入口候选；**不等于已拥有 CSS 特定语义检查**                                       |
| 格式化           | [`vp fmt`](https://viteplus.dev/guide/fmt)                                              | 格式化支持范围在实际文件上验证                                                                |
| 单元/规范性检查  | [`vp test`](https://viteplus.dev/guide/test) 基于 Vitest                                | 测试规则元数据、文件导出等可自动检验部分；无法替代浏览器渲染                                  |
| 应用预览/Fixture | [`vp dev`、`vp build`](https://viteplus.dev/guide/build)                                | 用于未来的本地可视化测试页面；不要把 `vp build` 误称为 CSS 库发布打包                         |
| 库打包           | [`vp pack`](https://viteplus.dev/guide/pack) 基于 tsdown，文档称支持 CSS bundling       | **需实测是否满足纯 CSS 无 JS 入口/产物**，暂不承诺直接可用                                    |
| 命令区别         | [Vite+ Getting Started](https://viteplus.dev/guide/)                                    | `vp build`、`vp test` 是内置命令；若要调用 package scripts 用 `vp run <name>` 或 `vpr <name>` |

## 4. 特别风险：纯 CSS npm 包与 vp pack

官方 `vp pack` 对库入口的说明主要基于 TS/JS；虽支持 CSS 转换与打包，但**没有据此验证纯 CSS 包能够直接以 `vp pack` 产出唯一 CSS 根入口且无 JS 包装文件**。

因此 W-04 必须在未来实现阶段进行对照：

- A：以 Vite+ 可直接支持的 CSS 构建与导出方式产生静态 CSS；
- B：如 `vp pack` 存在无关 JS 产物或 CSS 副作用问题，选择同一 Vite+ 工具链内最小可验证替代方式，必要时简单复制/压缩静态 CSS，但不能引入额外笨重脚手架；
- 采用哪个方式以真实 tarball、`exports`、`sideEffects`、Vite/Vite+ 和 Webpack 消费端构建验证为准。

不能把应用构建命令成功，等同于 npm CSS-only 包发布验证成功。

### 后续实施补充（2026-11-04，维护者确认）

本 ADR 的 Vite+ 单工具链约定保持 Accepted。开发分支已实际验证 `vp build` 的本地 Fixture 构建与 `vp pack` 的单 CSS 输出，并完成真实 npm tarball 独立安装及 Vite+ 生产消费端测试。维护者进一步明确：**本库仅交付标准 CSS 文件，不需要通过 Webpack 二次打包，Webpack 不属于首版强制开发工具或验收门槛**。先前关于 Vite+/Webpack 双消费端验证的条款属于早期风险研究，现由 [W-04 最新验收口径](../plans/CSS_PACKAGE_DELIVERY_REVIEW.md) 覆盖，不再阻塞 W-04。浏览器、无障碍与组件库回归仍须按 W-06 单独记录，未公开发布 npm，不增加 CI。

## 5. 验收与未完成

**已批准**：开发工具链选用 Vite+，其作用仅限开发和本地测试，长期无运行时 JS、无 CI。

**未运行**：`vp create`、`vp install`、`vp check`、`vp test`、`vp pack`、`vp build`；尚未生成 `package.json`、`vite.config.ts`、CSS、锁文件、JS、可运行测试或打包产物。

**需开发授权后再开展**：固定版本、必要配置、构建验证、产物检查；真实浏览器与组件库的结果另按 ADR-0004 审查。  
**记录**：2026-11-03 用户指定 Vite+，该工具链决策成为 Accepted，不需要另问是否同意选用 Vite+。
