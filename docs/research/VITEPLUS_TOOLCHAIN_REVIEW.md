# Vite+ 对纯 CSS Normalize 项目的工具链核对

- **研究日期**：2026-11-03
- **状态**：官方文档已核对；没有在本地安装 Vite+ 或运行任何构建命令
- **已接受决策**：[ADR-0005](../adr/0005-viteplus-toolchain.md)
- **官方入口**：[viteplus.dev](https://viteplus.dev/) · [LLM 全文](https://viteplus.dev/llms-full.txt)

## 1. 已核实的官方能力

| 命令 | 文档中的用途 | 对本项目的适用范围 |
| --- | --- | --- |
| `vp check` | Oxfmt + Oxlint + 类型检查 | 本地静态检查候选；需确认对 CSS 规则是否足够 |
| `vp fmt` | Oxfmt 格式化 | 本地 Markdown、CSS 格式校验支持范围需实际验证 |
| `vp test` | Vitest 单元测试 | 可验证规则 ID 映射、包导出等；不替代真实浏览器 |
| `vp dev` | Vite 开发服务器 | 为原生 HTML、交互和组件库 Fixture 提供本地预览 |
| `vp build` | Vite **应用**生产构建 | 用于 Fixture 消费者应用，不默认作为 CSS-only 发布命令 |
| `vp pack` | tsdown 库打包，官方称 CSS bundling 已集成 | 是否适合纯 CSS 根入口、无 JS 产物必须实测 |
| `vp run <name>` | 运行 package scripts | 与内置 `vp build/test` 区分，不假定自定义脚本会覆盖内置行为 |

来源：[guide](https://viteplus.dev/guide/) · [pack](https://viteplus.dev/guide/pack) · [build](https://viteplus.dev/guide/build) · [test](https://viteplus.dev/guide/test) · [config](https://viteplus.dev/config/)。

## 2. 最小开发期依赖及产物边界

- 候选开发期唯一综合工具为 `vite-plus`，具体版本与包管理器待实际获准开发时确认。
- 可以先评估 Vite+ 内置检查，再按缺失能力决定是否增补专门的 CSS 验证工具；**不自动安装 ESLint/Prettier/Vitest 等重复依赖**。
- 静态 CSS 库没有运行时 JS 依赖，不应因使用 Vite+ 就产生供消费者加载的 JavaScript 文件。
- 文档、规则证据和可选模块不因工具链选择而改变已接受的 MVP 范围。
- 本次不会运行 `vp create`、`vp migrate` 或初始化脚手架覆盖现有仓库。
- Playwright 或真实 Safari/iOS 等测试能力是否需要额外本地工具，在 W-03 中按具体 Fixture 与环境再决策。

## 3. 进入开发后的核对清单（尚未执行）

1. 在不修改现有业务/文档目录结构前提下，核对全局 `vp --version`、实际 Node 与包管理器版本。
2. 只增加完成任务必需的 `vite-plus` 开发依赖、锁文件和少量配置。
3. 用最小 CSS 入口测试 `vp pack` 的产物行为；若失败，记下原始错误、产物和替代方案，不伪称通过。
4. 运行真实 `vp check` / `vp test`，确认 CSS 相关检查的实际覆盖范围。
5. 验证 Vite+ 消费端与 Webpack 消费端 CSS 是否在生产构建中保留，以及 npm `exports` / `sideEffects` 是否正确。
6. 在 Chromium、Firefox、WebKit 以及可获取的真实 Safari/iOS 上逐条验证规则；不得仅依赖应用构建成功。
7. 所有检查只在本地人工触发；**不创建任何 CI、GitHub Actions 或发布流程**。

## 4. 现阶段验证结果

| 项目 | 结果 |
| --- | --- |
| Vite+ 官网文档与 CLI 说明 | **已查阅**（非运行测试） |
| CSS 打包文档存在性 | **已查阅** |
| Vite+ 实际安装及项目版本 | **未运行 / 未确认** |
| `vp pack` 对 CSS-only 包的有效性 | **未知，待实测** |
| `vp check` 是否覆盖全部 CSS 规则约束 | **未知，待实测** |
| Chrome / Firefox / Safari 兼容回归 | **未运行** |
| CI | **禁止，未添加** |
