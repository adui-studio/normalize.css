# 更新日志 · Changelog

本文件记录 `@adui/normalize.css` 的正式版本变更。**截至 2026-11-05 尚未发布任何 npm 版本或 GitHub Release。** 下列内容属于开发分支的待发布候选，不是已交付给公众的版本。

## 未发布 · Unreleased

### 已实现

- 增加首版默认 Normalize 的唯一规则 R-003：`b, strong { font-weight: bolder; }`，有 Chrome 120 字重差异复现依据。
- 实现单一 CSS 根导出 `@adui/normalize.css` → `dist/normalize.css`，由 `vp pack` 构建静态 CSS；不包含运行时 JavaScript。
- 加入仅本地使用的 Vite+ Fixture、原生浏览器探针、真实 npm tarball 消费与第三方 Reset / UI 框架隔离验证场景。
- 为首个 MVP 开发收尾新增 **T0/T2 真实 CSS 包证据比较 CLI** 和合成数据离线测试；增加人工触发的 `verify:mvp` 一键验证入口，不新增 CI 或运行时依赖。
- 修复 T2 证据假阳性风险：增加同源 CSSOM 内容核验，空规则/错误规则/不可读取 CSSOM 不再仅凭样式表已挂载而通过；正式 CSS 不变。
- 收紧真实 npm tarball 的五文件包契约：英文 README 必须入包，且验证包名、版本、无 bundled 依赖及已安装元数据一致性。
- 完善开发期 npm 元数据：作者 `ADui`、MIT 许可证声明、英文包简介，以及正式 GitHub 仓库、主页与问题反馈地址；不变更版本、依赖或 CSS 入口。

### 已确认的设计边界

- 36 条研究候选已完成首版规则评审；仅 R-003 进入默认 CSS。R-004 等宽字体字号保持浏览器默认值；其余候选暂缓、属于未来可选模块或明确排除默认入口。
- 不提供 `reset.css`、`a11y.css`、`forms.css` 或 `all.css`；默认不内置 `@layer`。
- W-03 本地 Harness、W-04 包交付、W-05 规则评审、W-06 回归工作项均按已归档记录结项。证据等级分别见 [W-05 归档](docs/research/W05_RULE_ACCEPTANCE.md) 和 [W-06 归档](docs/research/W06_ACCEPTANCE_INDEX.md)。

### 尚未完成

- W-07 发行前质量审核、最终 npm 发布权限与正式发行授权（首发候选配置 `0.0.1` 已确定）；**本轮新增代码与本地验证命令尚待维护者实跑**。
- 已配置并保留 `0.0.1`、`private:true`；维护者已对该版本完整运行冻结安装、Vite+ 格式/Lint、Vitest 7/7、Node 33/33、唯一 CSS 打包、真实 tarball 安装及 Vite+ 消费各 1/1、五文件预打包，全部 PASS。
- 对外公开的具体浏览器最低版本兼容性声明及对应可审计环境证据。
- npm 发布、GitHub Release、合并 `main`（均未获本轮授权）。

**版本说明**：当前开发分支 `package.json` 已配置 `version: "0.0.1"`、`private: true`；这是维护者明确确定的**首发候选配置**，没有执行 `npm publish`、Git Tag 或 GitHub Release。只有正式发行获单独批准且真实发布完成后，才将本“未发布”记录归入具体发行日期条目。
