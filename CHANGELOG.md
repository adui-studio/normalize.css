# 更新日志 · Changelog

本文件记录 `@adui/normalize.css` 已发行版本和历史候选变更。当前正式 npm 版本为 **[`0.1.0`](https://github.com/adui-studio/normalize.css/releases/tag/v0.1.0)**，已确认 npm `latest`、发布包 SHA-1 / integrity、附注 Git Tag 及 GitHub Release 一致。旧版 `0.0.1`、`0.0.2`、`0.0.3` 的发行记录保持不变。

## 0.1.0 · 2026-11-06（npm、附注 Git Tag、GitHub Release 已发布）

- **范围与产品行为**：依照 ADR-0006 方案 A，默认 Normalize 仍仅 R-003/R-007/R-008；Reset、Forms、A11y 与 `all.css` 继续显式 opt-in。相比已发布 `0.0.3`，产品 CSS 与六个 CSS-only 导出均不变，无运行时 JavaScript 依赖或新增 CI。
- **版本迁移**：`package.json` 调整为 `0.1.0`，同步两处真实包版本断言与中英文发行说明；保留 `0.0.3` 历史已发行事实。
- **工程验收（合并后源码）**：维护者在 `main@02dec1c9c3801fdb580b3b5798d803d348a2a213` 验证格式 94/94、Lint 22 文件零错误、Vitest 8/8、Node 离线 54/54、真实 npm tarball 安装 1/1、Vite+ CSS 消费 1/1，合计 64/64 PASS；8 个 Fixture 生产构建成功，工作区干净。
- **最终发行包**：发行源码 `cd28baaa5bf0a2af995053a7a35147e7392265a4` 经 `npm pack --dry-run` 确认 10 个文件、9,240 B、无 bundled 依赖；已公开 npm Registry 的 `dist.shasum=09ad11dc9c52538941fb8bdf5629f4841411dde3` 及 integrity 与最终预览一致。历史较早 SHA 的 9,281 B 仅为当时的候选预览。
- **兼容性边界**：旧 Safari/R-007、旧 Blink/R-008 风险按 ADR-0006 限定接受；现有测试不能证明全部历史浏览器、真实视觉、键盘或系统偏好矩阵通过，不承诺未经逐版本验证的最低浏览器版本。
- **正式发行**：npm `0.1.0` / `latest` 已公开；GitHub 附注 `v0.1.0` Tag 对象 `61ce800543c4d8a53c7c098c3d945843a219ef91` 解引用到上述发行源码，Release 已于 2026-11-06T10:07:24Z Published（非 Draft/Prerelease）。本版默认与可选 CSS 均不改变此前已发行行为；发行后的文档同步不能更改旧 tarball。

**发行后浏览器证据**：2026-11-07 在 Chromium 144/Linux Headless 完成 21/21 个受限 CSS 行为检查，逐文件 Git Blob 与发行 Tag 一致；采用内存 CSS 注入和媒体模拟，**不等于**实际 HTTP 导入、Windows 系统偏好或全浏览器组件矩阵 PASS。详见 [v0.1.0 发行后兼容性矩阵](docs/research/V010_POST_RELEASE_COMPATIBILITY.md)。

## 0.0.3 · 2026-11-06（npm、Git Tag、GitHub Release 已发布）

- **默认入口保持兼容**：继续仅包含 R-003、R-007、R-008 三条 Normalize 规则，不自动执行 Reset 或改写全局主题、根字号、按钮外观、原生焦点。
- **显式可选模块**：发布 `reset.css`（盒模型、间距与布局）、`forms.css`（表单排版）、`a11y.css`（焦点/系统偏好）和 `all.css`（Normalize → Reset → Forms → A11y 顺序组合）。
- **公开 CSS-only 导出**：保留 `@adui/normalize.css` 默认根入口，增加 `/normalize.css` 显式别名及四个模块子路径；npm 包 `files:["dist","src"]`，无运行时 JavaScript 依赖，未新增 CI。
- **工程验收**：维护者在最终发行源码 `f5c08642e1ab6eaa1cb3d84782485f0298ae77be` 上运行冻结安装、格式/Lint、Vitest 7/7、Node 离线 52/52、真实 tarball 安装 1/1、Vite+ `all.css` 生产消费 1/1，**总计 61/61 PASS**；8 张 Fixture 页面构建通过，工作区干净。
- **发行包**：10 个文件、压缩 9,223 B、SHA-1 `8f79c0bfd72db0a62e41facdcf788fdf0fbe6293`；与维护者实际 npm 发布日志中的 tarball SHA-1 一致。维护者报告 npm CLI 发布成功并确认上架；GitHub 附注 `v0.0.3` Tag 已独立验证指向上述验收 SHA，Release 为 Published（非 Draft/Prerelease）。
- **兼容性边界**：真实 Chrome/Firefox/Safari、移动设备和 Vue/React/Element Plus/Ant Design/TDesign 等场景尚未完成全部可审计矩阵；不宣称未经验证的最低支持版本。已有 Tailwind Preflight / UnoCSS Reset 时避免重复叠加可选 Reset。
- **对应记录**：[PR #25](https://github.com/adui-studio/normalize.css/pull/25)（产品套件）、[PR #26](https://github.com/adui-studio/normalize.css/pull/26)（发行准备）、[Issue #22](https://github.com/adui-studio/normalize.css/issues/22)（发行已结项）。

**发行后文档说明**：本段为后续仓库文档同步，不改变已发布的 `0.0.3` npm tarball 或 `v0.0.3` Tag。正式发行源码继续固定于上述 SHA；任何后续文档提交均不应冒充当次发行包。

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
