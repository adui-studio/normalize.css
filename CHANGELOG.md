# 更新日志 · Changelog

本文件记录 `@adui/normalize.css` 的正式版本变更。**截至 2026-11-04 尚未发布任何 npm 版本或 GitHub Release。** 下列内容属于开发分支的待发布候选，不是已交付给公众的版本。

## 未发布 · Unreleased

### 已实现

- 增加首版默认 Normalize 的唯一规则 R-003：`b, strong { font-weight: bolder; }`，有 Chrome 120 字重差异复现依据。
- 实现单一 CSS 根导出 `@adui/normalize.css` → `dist/normalize.css`，由 `vp pack` 构建静态 CSS；不包含运行时 JavaScript。
- 加入仅本地使用的 Vite+ Fixture、原生浏览器探针、真实 npm tarball 消费与第三方 Reset / UI 框架隔离验证场景。

### 已确认的设计边界

- 36 条研究候选已完成首版规则评审；仅 R-003 进入默认 CSS。R-004 等宽字体字号保持浏览器默认值；其余候选暂缓、属于未来可选模块或明确排除默认入口。
- 不提供 `reset.css`、`a11y.css`、`forms.css` 或 `all.css`；默认不内置 `@layer`。
- W-03 本地 Harness、W-04 包交付、W-05 规则评审、W-06 回归工作项均按已归档记录结项。证据等级分别见 [W-05 归档](docs/research/W05_RULE_ACCEPTANCE.md) 和 [W-06 归档](docs/research/W06_ACCEPTANCE_INDEX.md)。

### 尚未完成

- W-07 发行前质量审核和正式版本号决策。
- 公开发布元数据、包管理器锁文件策略及其可复核结果。
- 对外公开的具体浏览器最低版本兼容性声明及对应可审计环境证据。
- npm 发布、GitHub Release、合并 `main`（均未获本轮授权）。

**版本说明**：当前 `package.json` 为 `version: "0.0.0"`、`private: true`。后续只有获得正式版本与发布授权，才新增具体版本号和发行日期条目；不得把本“未发布”记录当成已发行版本。
