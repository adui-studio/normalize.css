# 更新日志 · Changelog

本文件记录 `@adui/normalize.css` 的正式版本变更。维护者已通过 npm 官方 Registry 实测确认 **`0.0.1` 于 2026-11-05 首次发布**；尚未创建 Git Tag / GitHub Release。

## 未发布 · Unreleased

### 0.0.2（下一候选版本，尚未发布）

- 补充 7 个 npm Keywords、对应版本及真实 tarball 元数据契约。
- 在 R-003 基础上新增 R-007 `:where(abbr[title]) { text-decoration: underline dotted; }`，以及 R-008 `:where(table) { border-color: currentColor; }`；采用低特异性选择器，保留默认 Normalize 的克制原则。
- 扩展 T0/T2 至 12 个观察点与三条 CSSOM 严格校验，更新本地测试、双语 README 及规则证据。
- 维护者已批准 **`0.0.2` 继续作为当前版本号**；本次更新**不仅是元数据补丁，也包含可观察 CSS 行为变化**。仍需按新规则证据边界、版本提交与发行验收单独确认，**没有执行 npm 发布**。
- 正式发行后必须同步创建 **Git Tag `v0.0.2` 与 GitHub Release `v0.0.2`**，使用与实际 npm 发包内容一致的 Git 提交。详见 [人工发布规范](docs/RELEASING.md)。**本记录不等于已创建 Tag/Release**。

**后续里程碑**：默认 `normalize.css` 规则集合完成、逐项评审和必要回归验收后才采用 `0.1.0`；可选 Reset/Forms/A11y 各自继续独立评审。

## 0.0.1 · 2026-11-05（首次 npm 发布）

### 已实现

- 增加首版默认 Normalize 的唯一规则 R-003：`b, strong { font-weight: bolder; }`，有 Chrome 120 字重差异复现依据。
- 实现单一 CSS 根导出 `@adui/normalize.css` → `dist/normalize.css`，由 `vp pack` 构建静态 CSS；不包含运行时 JavaScript。
- 加入仅本地使用的 Vite+ Fixture、原生浏览器探针、真实 npm tarball 消费与第三方 Reset / UI 框架隔离验证场景。
- 为首个 MVP 开发收尾新增 **T0/T2 真实 CSS 包证据比较 CLI** 和合成数据离线测试；增加人工触发的 `verify:mvp` 一键验证入口，不新增 CI 或运行时依赖。
- 修复 T2 证据假阳性风险：增加同源 CSSOM 内容核验，空规则/错误规则/不可读取 CSSOM 不再仅凭样式表已挂载而通过；正式 CSS 不变。
- 收紧真实 npm tarball 的五文件包契约：英文 README 必须入包，且验证包名、版本、无 bundled 依赖及已安装元数据一致性。
- 完善开发期 npm 元数据：作者 `ADui`、MIT 许可证声明、英文包简介，以及正式 GitHub 仓库、主页与问题反馈地址；不变更依赖或 CSS 入口。
- 增加本机手动 `release:publish` 脚本（仅在未来明确授权后由维护者手动执行），并同步首版 `0.0.1/private:false` 包契约断言；无自动发布或 CI。

### 已确认的设计边界

- 36 条研究候选已完成首版规则评审；仅 R-003 进入默认 CSS。R-004 等宽字体字号保持浏览器默认值；其余候选暂缓、属于未来可选模块或明确排除默认入口。
- 不提供 `reset.css`、`a11y.css`、`forms.css` 或 `all.css`；默认不内置 `@layer`。
- W-03 本地 Harness、W-04 包交付、W-05 规则评审、W-06 回归工作项均按已归档记录结项。证据等级分别见 [W-05 归档](docs/research/W05_RULE_ACCEPTANCE.md) 和 [W-06 归档](docs/research/W06_ACCEPTANCE_INDEX.md)。

### 首发时的证据边界（历史记录）

- W-07 发行前质量审核和首次 npm 作用域写权限/正式发行授权仍待完成；维护者已提供首版候选 Windows 本地完整测试日志，日志未绑定最新 `main` HEAD。
- `main` 当前配置为 `0.0.1/private:false`，两处正式包 `private` 断言同步；维护者提供的候选日志显示冻结安装、格式/Lint、Vitest 7/7、Node 47/47、唯一 CSS 200 B、真实 tarball 与 Vite+ 消费各 1/1、五文件预打包及八张 Fixture 构建 PASS。关键源码/包配置 Blob 与此前候选一致，但尚无精确新 `main` HEAD 的单独执行日志。
- 对外公开的具体浏览器最低版本兼容性声明及对应可审计环境证据。
- npm `0.0.1` 已按维护者独立授权公开发布；未创建 Git Tag/GitHub Release，不增加 CI。

**版本说明（最新）**：npm `0.0.1` 已发布；`main` 为 **`0.0.2/private:false` 未发布候选**（包含新 CSS 和 Keywords）。`0.1.0` 等默认 Normalize 完成后再决定；本项目后续每次正式发行均需补齐对应 Git Tag 和 GitHub Release，无 CI。
