# 更新日志 · Changelog

本文件记录 `@adui/normalize.css` 的正式版本变更。维护者已通过 npm 官方 Registry 实测确认 **`0.0.1` 于 2026-11-05 首次发布**；尚未创建 Git Tag / GitHub Release。

## 未发布 · Unreleased

### 0.0.3（开发中，尚未发布）

- 从已正式发行的 `0.0.2` 启动下一个开发版本，更新 `package.json` 与两项真实包版本断言，保留 CSS-only 根导出、现有依赖和构建方式。
- 默认 CSS 暂继续保持 R-003、R-007、R-008 三条；下一步评审旧 WebKit/Blink 的真实差异与其余候选规则的必要性，未审核的规则不预先纳入本版本。
- Reset、Forms、A11y 仍为可选模块设计，不新增公开子路径；本轮不新增 CI，不执行 npm 发布或创建 `v0.0.3` Tag / Release。
- 对应 [0.0.3 迭代 Issue #22](https://github.com/adui-studio/normalize.css/issues/22)。本次只启动开发，尚未获得发行授权，也不能沿用 `0.0.2` 的测试日志作为当前候选的 PASS。

**后续里程碑**：持续完善 Normalize，达到明确完整性与质量验收要求后，才独立评审并发布 `0.1.0`。

## 0.0.2 · 2026-11-05（npm 与 GitHub Release 已发布）

- 补充 7 个 npm Keywords、对应版本及真实 tarball 元数据契约。
- 在 R-003 基础上新增 R-007 `:where(abbr[title]) { text-decoration: underline dotted; }`，以及 R-008 `:where(table) { border-color: currentColor; }`；采用低特异性选择器，保留默认 Normalize 的克制原则。
- 扩展 T0/T2 至 12 个观察点与三条 CSSOM 严格校验，更新本地测试、双语 README 及规则证据。
- **已合并的边界验证增强（PR #21）**：T0/T2 扩展为 15 个观察点，补充 `abbr` 无 `title` 的原生保留检查，以及作者自定义缩写文本修饰与表格边框颜色不得被 Normalize 覆盖的回归断言；维护者 Windows `verify:mvp` 60/60、8 张 Fixture 构建通过（见 [默认规则完整性研究](docs/research/DEFAULT_NORMALIZE_V01_READINESS.md)），不代表全部目标浏览器真实 T0/T2 矩阵通过。
- `0.0.2` **已正式公开发行**，不仅包含 npm 元数据更新，也包含可观察 CSS 行为变化。维护者提供的 npm Registry 查询返回 `0.0.2`；GitHub Release 状态为 Published，非 Draft/Prerelease。
- Git Tag [`v0.0.2`](https://github.com/adui-studio/normalize.css/tree/v0.0.2) 已推送并解析到经过验收的源码提交 `4d66e6b590c09b7de6e98332524684237dddf212`；[GitHub Release `v0.0.2`](https://github.com/adui-studio/normalize.css/releases/tag/v0.0.2) 已于 2026-11-05 正式发布。附注 Tag 对象 SHA 为 `4e2e90b2cc02144c731f6c82a09f167d7cda7f65`，与其目标提交不同是正常现象。npm 发布 tarball 的 SHA-1 尚无独立可核对结果，勿声称二进制哈希已匹配。

**后续里程碑**：`0.0.2` 已发行并对应 `v0.0.2` Tag / GitHub Release。默认 Normalize 下一阶段仍需补足规则价值研究、跨浏览器证据与必要回归；达到维护者认可的完整性后才能评审/发布 `0.1.0`。Reset、Forms、A11y 可选能力继续独立审议。

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

**版本说明（2026-11-05 最新）**：npm 已公开发布 `0.0.1`、`0.0.2`；`v0.0.2` Git Tag 和 GitHub Release 已存在，`main` 的包配置仍为 `0.0.2/private:false`（已发行版本），不自动改为 `0.1.0`。本项目不增加 CI。
