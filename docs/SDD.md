# SDD — 详细设计草案

**2026-11-06 · ADR-0006 规则范围批准与设计冻结**：维护者已接受 [ADR-0006 方案 A](adr/0006-v01-default-scope-and-compatibility-risk.md)，确认默认三条 CSS 规则与既有六个 CSS-only exports 保持现状；历史 R-022/023/024 的部分 Reset 实现属于主动保留 HTML 语义，Forms R-012/015 的局部行为继续只在 opt-in 中出现。R-007/R-008 旧版本风险仅限定接受，不将缺失的真机结果标为 PASS。**没有批准新增产品 CSS、更新 package 版本、启动 `0.1.0` 发布或 CI**，现有代码不需变更。

**2026-11-06 · `v0.0.3` 发行后生效设计（当前事实）**：正式 npm `0.0.3` 已发布；默认 `exports["."] → ./dist/normalize.css` 保持 R-003/R-007/R-008，别名 `./normalize.css` 指向相同产物，Reset/Forms/A11y/All 分别映射到 `src/*.css`。`all.css` 使用 Normalize → Reset → Forms → A11y 四条相对 CSS `@import`；`vp pack` 只生成默认 CSS，五份 `src` CSS 随 npm `files:["dist","src"]` 原样分发。发行源码 `f5c08642e1ab6eaa1cb3d84782485f0298ae77be` 已通过 61/61 自动化测试、真实 tarball 安装与 Vite+ 组合消费，Git Tag/Release `v0.0.3` 已正式发布。默认入口不隐式引入可选模块，无 JS 运行时或 CI。**真实浏览器及组件库完整交互兼容矩阵仍待完善**；下方 0.0.1/0.0.2 首版规划是历史记录，不代表当前导出接口。

**2026-11-05 · `0.0.3` 完整实现方案（最新开发候选）**：公开 CSS 根入口 `exports["."] → ./dist/normalize.css` 维持已发布 R-003/R-007/R-008 的默认语义；新建 `exports["./normalize.css"] → ./dist/normalize.css` 作为别名，`./reset.css`、`./forms.css`、`./a11y.css`、`./all.css` 对应 `src/*.css`。`all.css` 为相对 CSS `@import` 顺序组合（normalize → reset → forms → a11y），不通过 JavaScript、重复声明或打包时拼接实现；`vp pack` 仍只生成 `dist/normalize.css`，npm `files:["dist","src"]` 携带可选 CSS 源文件。所有可选样式显式 opt-in：Reset 不清除列表 marker/焦点；Forms 不去除 UA 控件外观；A11y 不全局消除动画且尊重 forced-colors/reduced-motion。10 文件 tarball 与 Vite+ 组合入口消费按本轮测试契约复核。该变更须最终集中验证，不宣称已通过浏览器全矩阵或已发行。

**2026-11-05 · 默认入口设计冻结（当前决定）**：默认单一 CSS 根入口的产品规则范围经维护者确认仅为 R-003、R-007、R-008；17 条暂缓不在本里程碑编码，Reset/Forms/A11y 均不公开导出，仍独立设计。`0.0.2`、`exports["."]`、Vite+ CSS-only 包契约不变。规则范围批准不替代目标浏览器实测，不授权 `0.1.0` 或发布；参考 [最终范围冻结记录](research/DEFAULT_NORMALIZE_V01_READINESS.md)。

**2026-11-05 · 当前主分支与回归扩展（最新）**：PR #19 已按维护者批准合并，`main` 默认 `src/normalize.css` 包含 R-003、R-007、R-008 三条规则；`package.json` 仍为 `0.0.2/private:false`，npm 已发布 `0.0.1`。本次仅扩展 T0/T2 验收覆盖（12→15 个探针），测试无 `title` 缩写与作者明示的缩写/表格样式能否优先于低特异性 `:where()`；完整覆盖矩阵见 [默认 Normalize 完整性门槛](research/DEFAULT_NORMALIZE_V01_READINESS.md)。此前 W-05 首版决议保留历史效力，暂缓项不因竞品存在就自动准入；`0.1.0` 只在默认 Normalize 完成且维护者验收后采用。当前尚无最新提交完整 Windows/Vite+ 与浏览器回归的实测日志，不增加 CI。

**历史状态（2026-11-04）**：首版公开 CSS 契约与 ADR-0001～0005 已批准，**W-05 的 36 条规则首版评审结论已由维护者全部确认**；唯一默认准入 R-003（`b, strong { font-weight: bolder; }`）已实现，R-004 和其他 34 条按暂缓、可选或排除决定不进入首版默认 CSS。W-06 已正式验收归档（证据等级见归档索引）；开发包仍保持 `private: true`，尚未 npm 发布，公开支持范围属于后续发行审核。详见 [W-05 规则评审归档](research/W05_RULE_ACCEPTANCE.md)。

**2026-11-05 · W-07 发行候选配置（最新）**：维护者已将单一 CSS 规则 R-003 的首发候选版本确认为 `0.0.1`，并将 `package.json#private` 设置为 `false`；此前 `0.0.0/private:true` 的实施阶段描述现为历史记录。唯一 `exports["."]`、CSS `sideEffects`、`vp pack` CSS-only 构建与全部可选模块的未实现状态均不改变；两项包测试的断言已更新，最新本机回归待完成。不因发行候选配置变更而推导已支持的浏览器版本或 npm 发布权限。详见 [W-07 记录](research/W07_RELEASE_READINESS_REVIEW.md)。

**2026-11-05 · W-07 private 保护恢复（最新）**：版本继续 `0.0.1`，维护者已将包 `private` 恢复为 `true`；前段 `private:false` 仅为历史状态。单一 CSS 入口、R-003 规则、Vite+ 打包行为不变；离线/真实 tarball 测试的正式包 private 断言同步恢复。本版本组合的 Windows 回归待执行，不代表已经发布。详见 [W-07 审核](research/W07_RELEASE_READINESS_REVIEW.md)。

**2026-11-05 · MVP 本地证据工具设计增量（最新）**：在已证明可运行的 R-003 单规则、CSS-only `exports`、Vite+ 打包及原有 Probe 之上，新增仅用于开发测试的 T0/T2 JSON 对照 CLI（`tests/t2-evidence.mjs`）与合成用例。CLI 依赖现有 `tests/evidence-file.mjs`，只读取本机 JSON、检查 T2 CSS 加载标记、相同 UA、六组 R-003 字重与四组 R-004 等宽字体不变性；它不会进入 npm CSS 包，且不能代替 Network/OS/设备/交互的人工验收。本地 `verify:mvp` 串联既有检查，**不安装新依赖、不运行 CI**。代码已准备，最新整组 Windows 回归待维护者执行，见 [MVP 交付清单](MVP_0_0_1_HANDOFF.md)。

**2026-11-05 · T2 比较器正确性补丁（最新）**：开发测试层发现不能凭 `link.sheet` 存在断言加载了正确的 CSS。T2 探针同源读取 CSSOM 的一条普通 `b,strong` 字重 `bolder` 规则及其声明数、优先级，离线比较器以 `STYLESHEET_CONTENT_MISMATCH` 区分已挂载但内容不匹配（包括 CSSOM 不可读）；缺失新 `rules` 字段则拒绝旧格式数据，不给 PASS。修改只在 `fixtures/`、`tests/` 和证据文档，npm 包内容与 CSS API 完全不变；仍须留存真实 Network 与目标浏览器证据。见 [MVP 交付清单](MVP_0_0_1_HANDOFF.md)。

## 1. 设计范围与需求映射

| 模块      | 对应需求                | 已发行职责                       | 状态                     |
| --------- | ----------------------- | -------------------------------- | ------------------------ |
| Normalize | FR-001、NFR-001         | 默认标准化 CSS                   | 已发行                   |
| Reset     | FR-002                  | 显式导入的盒模型与布局重置       | 已发行（可选）           |
| A11y      | FR-003                  | 焦点与系统偏好增强               | 已发行（可选）           |
| Forms     | FR-004                  | 原生表单排版增强                 | 已发行（可选）           |
| Combined  | FR-005                  | 四模块组合入口                   | 已发行（可选）           |
| Exports   | FR-006                  | npm CSS-only 子路径映射          | 已发行                   |
| 规则追踪  | FR-007、NFR-002/003/007 | 规则证据、工程回归与实机兼容记录 | 部分完成，浏览器矩阵待补 |

## 2. 已发行的 CSS-only 导出契约（v0.0.3）

| 导入路径                            | npm 包对应文件       | 影响范围                                  |
| ----------------------------------- | -------------------- | ----------------------------------------- |
| `@adui/normalize.css`               | `dist/normalize.css` | 默认三条 Normalize，不触发可选模块        |
| `@adui/normalize.css/normalize.css` | `dist/normalize.css` | 默认入口别名                              |
| `@adui/normalize.css/reset.css`     | `src/reset.css`      | 可选布局/间距重置                         |
| `@adui/normalize.css/forms.css`     | `src/forms.css`      | 可选表单样式                              |
| `@adui/normalize.css/a11y.css`      | `src/a11y.css`       | 可选无障碍辅助                            |
| `@adui/normalize.css/all.css`       | `src/all.css`        | 按 Normalize、Reset、Forms、A11y 顺序组合 |

发行源码使用 Vite+ 1.4.0，`files:["dist","src"]` 和 CSS `sideEffects`；正式 npm 包包含十个文件，无 JS 运行时。维护者已验证真实 tarball 安装、子路径解析和 `all.css` 的 Vite+ 生产构建。下节保留 **2026-11-04 首版历史设计过程**，其当时的 `private:true`、未公开子路径与构建风险不代表现行 `v0.0.3`。

### 2.1 首个最小交付切片（2026-11-04 开发决策）

- **首批源文件**：`src/normalize.css`，只纳入 R-003：`b, strong { font-weight: bolder; }`。依据真实 Chrome for Testing 120.0.6099.109 T0/T1 对照（父级 600/700 时四组计算字重由 700 → 900），Firefox 121 / Chrome 156 中候选无额外计算值变化；[证据卡](research/RULE_EVIDENCE_R003_R004.md)。
- **明确不纳入**：R-004 `font-size: 1em`、重复 `monospace`、统一代码字体栈；不添加 Reset、Forms、A11y、全局视觉规则、`@layer`、`!important`。
- **开发期根入口**：`package.json` 的唯一 `exports["."]` 指向 `./dist/normalize.css`；仍 `private: true`、版本 `0.0.0`，不能公开发布。Vite+ 继续承担开发与本机检查；维护者实际验证 `vp pack` 可以独立打包 CSS，而原 CSS-entry `vp build` 因默认关闭 CSS 拆分而失败；当前由 `vp pack` 输出根导出产物，`vp build` 负责构建测试 Fixture。修订后需本机复测。
- **验证边界**：构建字节完整性、文件封装、离线 npm smoke 可以本地验证；实际消费端的 Vite+ 生产构建现已通过；WebKit/Safari、Edge/移动端、组件库及最终 CSS 准入仍应在对应 W-06/W-07 审核。维护者当前要求停止额外字体偏好专项测试，按浏览器原生行为使用。

### 2.2 统一 Vite+ 命令与 CSS-only 构建（2026-11-04）

维护者明确要求使用 Vite+ 原生命令 `vp dev`、`vp build`、`vp pack`，替代 `npm run build` 调用 Node 文件复制脚本。三条命令功能不同（[Vite+ Build](https://viteplus.dev/guide/build)、[Dev](https://viteplus.dev/guide/dev)、[Pack](https://viteplus.dev/guide/pack)）：

- `vp dev`：仍从项目根目录启动本地 Vite 开发服务器，访问现有 `/fixtures/`；不发布 CSS。
- `vp build`：现已修订为六张现有 HTML Fixture 的预览构建，输出到 `dist-fixtures/`；不进入 npm 包。此前直接以 CSS 作为库构建入口在 Vite+ 1.4.0 本机失败，实际根因与修正见 §2.3。
- `vp pack`：已在维护者 Windows Vite+ 1.4.0 实测可直接以 CSS 为唯一入口生成单个文件（原验证输出 `dist-pack/normalize.css`），现改为输出 `dist/normalize.css`，作为唯一 npm 根导出目标；修订配置仍需重新运行。
- `vp pack` 不是 `npm pack`：真正检查 npm tarball 应使用 `npm pack --dry-run`，任何发布仍需维护者单独授权。

不增加发布用 JS、额外打包依赖、公开子路径或 CI；保留 `private: true`。`vp pack` 已是正式候选 CSS 产物构建命令，但是否可以公开发布仍受 tarball、消费端和兼容性验收约束。

### 2.3 Vite+ 1.4.0 本机实测后的构建职责修订（2026-11-04）

维护者在 Windows 报告：`vp check` PASS（55 个文件格式、11 个文件 Lint）、`vp test` 6/6、`npm run test:offline` 25/25、`vp dev` 成功启动、`vp pack` **成功生成仅一个** `dist-pack/normalize.css`（约 200 字节，无 JS），唯独 `vp build` 报错：`When "build.cssCodeSplit: false" is set, "rolldownOptions.input" should not include CSS files.`。原 `dist/normalize.css` 时间早于该次失败构建，不能视为 `vp build` 的产物。

根因是 `build.lib` 默认 `cssCodeSplit: false`，与直接作为构建入口的 CSS 文件发生冲突。既然 `vp pack` 的 CSS-only 入口已在真实 Vite+ 1.4.0 上产出准确的单 CSS 文件，**不再将 `vp build` 当作库发布构建命令**：

- `vp dev`：浏览器访问现有 `/fixtures/`，供本地原生对照。
- `vp build`：使用 Vite 多页面 HTML 输入构建现有六张 Fixture 页面，输出到**私有**的 `dist-fixtures/`，不进入 npm 包；其 HTML/JS 仅用于测试，不属于 CSS 库运行时依赖。
- `vp pack`：直接以 `src/normalize.css` 为唯一入口，输出到 **`dist/normalize.css`**；开发包 `exports["."]` 保持指向此文件，且不添加 JS 包装和其他公开子路径。
- `npm pack`：独立的 npm tarball 清单检查，不能与 `vp pack` 混为一谈。

本次 Vite+ 命令配置修订后，仍需维护者重新执行 `vp build`、`vp pack` 和离线测试，核实 HTML 预览与 CSS 发布产物各自只有预期内容；未执行的测试不得记为通过。保留 `private: true` 和禁用 CI、发布的约束。

### 2.4 W-04 真实包离线安装检查（2026-11-04）

W-03 已验收后，W-04 下一项最小必要检查是 **`vp pack` 的真实 `dist/normalize.css`，而非合成 CSS 烟测**。为不打断普通单测，在 `npm run test:offline` 之外提供单独的 `npm run test:package`（先运行 `vp pack`）：

- 对完整当前仓库执行 `npm pack --offline --ignore-scripts --json`，将临时 tarball 定向到系统临时目录；不调用 `npm publish`。
- 核对真实包的 `LICENSE`、`README.md`、`dist/normalize.css`、`package.json`，拒绝发布测试资产、源码和 JS 包装文件。
- 从临时 tarball 离线安装到新的独立临时消费目录，对照实际构建 CSS 的字节、根 `exports`、`sideEffects` 和未公开子路径限制；清理全部临时内容。
- 此项**仅覆盖实际打包、安装和文件解析**，并不等于 Vite+/Webpack 生产消费者的 CSS 副作用保留和页面视觉效果已通过。后两项仍需独立验证。

新增测试应当不依赖网络、无新增依赖，且没有生成任何 GitHub Actions 或 CI。实际运行结果以维护者的本机输出为准。

### 2.5 W-04 独立 Vite+ 生产消费者（开发中／尚未执行）

新增独立的 `npm run test:consumer`：在已经 `vp pack` 的前提下，重新对真实仓库 `npm pack --offline`，安装到 `node_modules/.cache/` 下临时隔离的小型 Vite+ 应用；复用项目固定的 `vite-plus@1.4.0`，不安装第二套构建工具。应用的 JS 入口使用 `import "@adui/normalize.css"`，执行真实 `vp build`，再检查 `dist/assets/*.css` 是否包含 R-003 的 `b,strong { font-weight:bolder }`；结束后清理临时目录。该测试用于 P-02 的生产构建 CSS 保留证据，**不证明浏览器渲染和 UI 框架兼容**。

维护者后来在 Windows Vite+ 1.4.0 实测 `npm run test:consumer` 1/1 PASS。其验证范围是生产 CSS 保留，开发态及页面实际计算样式仍归 W-06；Webpack 专项验收已按 §2.7 取消。

### 2.6 W-04 Windows 真实验收与行尾规则（2026-11-04）

维护者确认 `vp pack` 输出唯一 `dist/normalize.css`（约 200 字节）；`npm run test:package` **1/1 PASS**，验证完整仓库真实 tarball 的文件白名单、导出、离线安装与子路径封装；`npm run test:consumer` **1/1 PASS**，验证独立 Vite+ 1.4.0 **生产**消费应用的 CSS 导入未被丢弃。W-04 的 P-01/P-06/P-07/P-09 已满足当前包契约；P-02 生产 CSS 保留子项已通过，但 Vite+ 开发态与浏览器实际渲染未测试；P-03 Webpack 5 已由维护者调整为范围外，不属于 W-04 阻塞。详见[W-04 §7.6](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

维护者反映 Windows 上反复 `vp check --fix` 是 CRLF→LF 行尾纠正。新增 `.gitattributes` 的 `* text=auto eol=lf` 与 `.editorconfig` 的 `end_of_line = lf`、UTF-8 和末尾换行规定，**不修改产品 CSS**。这解决后续 Git 检出与编辑器保存的统一策略，但是否消除既有工作区行尾问题，仍待维护者拉取后执行 `vp check` 核对；不对第三方 Skills 执行大规模 renormalize。

### 2.7 W-04 范围调整与完成结论（2026-11-04）

维护者重申**工程统一 Vite+**；生成和消费标准 CSS 不依赖 Webpack。撤销上一轮未执行的 Webpack 5 测试，并从 `package.json` 删除 `test:webpack`、从 `tests/` 删除相关脚本，不增加其他依赖。外部消费者可以使用自己的工具链，但本项目**不以某一外部工具链的生产构建作为必过验收**。

W-04 仅要求 `vp pack` CSS-only 真实产物、npm 根 `exports`、文件白名单、`sideEffects`、零运行时依赖、真实 tarball 独立安装与 Vite+ 生产消费验证。维护者已实测 `npm run test:package` 1/1、`npm run test:consumer` 1/1，故**开发分支上的包交付契约已满足**。Vite+ 开发态、浏览器直接加载和 UI 组件库样式回归仍应在 W-06 验证；正式 npm 发布须经 W-07 单独批准。

此次调整只收敛测试范围，**不修改** ADR-0003 的唯一根入口、CSS 语义、`private: true`、已有包元数据或发布授权。[W-04 最新 DoD](plans/CSS_PACKAGE_DELIVERY_REVIEW.md#77-最新范围决策只使用-vite撤销-webpack-强制验收2026-11-04) 为当前实施基准。

### 2.8 W-06 首批 T2 实际 CSS 页面对照（2026-11-04）

W-03 的 T0/T1 只验证浏览器原生值与孤立候选规则；W-04 已证明真实 npm tarball 可以被 Vite+ 生产消费者保留，但尚未在真实浏览器里采集**实际 `vp pack` CSS 加载后的计算样式**。W-06 第一阶段新增两张 HTML Fixture：

- `fixtures/t2-native.html`：T0，保留原生样式；只设置 R-003 测试用父级 font-weight（400/600/700），不加载任何产品 CSS。
- `fixtures/t2-package.html`：T2，与 T0 **相同 body、被测元素和测试用父级样式**，仅在 `head` 增加 `<link id="package-css" rel="stylesheet" href="../dist/normalize.css">`。引用的是 `vp pack` 真正输出的 CSS 文件，而不是复制粘贴候选声明或新增 JS 包装。
- 复用 `fixtures/probe.js` 采集原有的计算 fontWeight、fontSize、fontFamily；仅在存在 `package-css` 链接时，额外记录同源样式表的 `href` 和是否成功挂载 `sheet`。若未加载则证据无效，不能把零差异误判为无回归。
- 首批被测元素：`b`/`strong`（父级 400/600/700）、`code`/`kbd`/`samp`/`pre`；同时保留原生 button、search input、details/summary、hidden 与 `hidden="until-found"` 作为后续手工交互观察点。**存在 DOM 不等于交互测试已通过**。
- 构建前需执行 `vp pack`；`vp dev` 访问 `/fixtures/t2-native.html` 和 `/fixtures/t2-package.html`；`vp build` 的多页面输入须同时包含这两页。`dist-fixtures/` 仍是私有测试预览产物，npm `files: ["dist"]` 不包含它。

本阶段只开发本地可复现实验，不新增产品 CSS、UI 框架依赖、浏览器自动化提供者或 CI；通过 Node/Vitest 的静态契约不等于任何浏览器 T2 真正通过。见[W-06 T2 本地验证说明](research/W06_T2_LOCAL_VERIFICATION.md)。

### 2.9 W-06 第二批：原生交互观察点（2026-11-04）

维护者反馈前一轮 T2 本地验证**通过**，但未提供浏览器版本、逐项控制台 JSON、键盘操作录屏或截图；因此可记录为“维护者报告 T2 基础回归通过”，**不能标记 F-001～F-010 全矩阵 PASS**，也不外推到 Safari、Edge 或移动端。

第二批仍只扩展现有 `t2-native.html` 与 `t2-package.html` 两页，维持两页 **body 完全一致、T2 唯一新增实际 CSS link** 的隔离契约。添加原生 `select`、`textarea`、`checkbox`、`fieldset`、`dialog` 作为 F-004/F-005 观察点，复用既有 `button`、`input[type=search]`、`details/summary` 和 `hidden` 作为 F-003/F-006/F-007 观察点。通过原生 `dialog.showModal()`、`<form method="dialog">`、键盘 Tab/Esc、页面查找等手工操作确认行为；不添加交互模拟脚本、CSS 覆盖、依赖或 CI。

此阶段只提供可复现**操作和证据采集入口**。用户反馈的上一轮 T2 通过不能自动成为这些新交互项目的 PASS；按浏览器/系统/功能逐项记录 PASS、FAIL、NOT_RUN。[W-06 验证说明](research/W06_T2_LOCAL_VERIFICATION.md)持续维护具体操作。

### 2.10 W-06 原生交互实测反馈（2026-11-04）

维护者在 Chrome 156 的 T0/T2 截图确认真实 CSS 加载、10 个计算样式点一致后，进一步明确**已经实际操作并通过** `dialog` 打开及 Esc 关闭、键盘焦点、`hidden="until-found"` 的页面查找揭示。验收记录分别对应 **F-005/F-006/F-007 的具体子项人工 PASS**；不是 F-003～F-007 整体的自动化 PASS，且该轮并无逐操作录屏/原始交互日志。

仍需保留 NOT_RUN / 部分完成状态：`details/summary` 键盘展开、完整表单交互、dialog `method="dialog"` 关闭按钮、系统 `prefers-reduced-motion` / `forced-colors` 切换，以及最低目标浏览器与 Vue/React/UI 组件库回归。对同一操作不再重复要求维护者执行；完整支持声明仍须分别取得环境和结果证据。[W-06 记录](research/W06_T2_LOCAL_VERIFICATION.md)。

### 2.11 W-06 第三批：Vue/React 真实组件库消费对照（2026-11-04）

在 W-06 已取得 Chrome 156 的 T0/T2 静态对照、dialog/Esc、键盘焦点及 until-found 实操反馈之后，生态测试先实现两个可复现的**隔离消费者**：Vue 3 + Element Plus、React + Ant Design。TDesign、Tailwind Preflight 与 UnoCSS Reset 留到后续批次，避免一次扩大变量和安装范围。

- **Vite+ 唯一工具链**：调用仓库现有 `vite-plus@1.4.0` 的 `vp build`，不新增 Webpack、React/Vue 插件或项目根依赖。消费者使用纯 JavaScript 的 Vue `h()` / React `createElement()`，无需 SFC/JSX 转换。
- **真实包而非源码捷径**：先 `vp pack`，消费者通过当前项目 `npm pack --offline` 制作的临时 tarball 安装 `@adui/normalize.css`；核对产物来自唯一 CSS 根导出。组件库与框架只安装在 Git 忽略的临时消费目录，`--ignore-scripts`、`--no-save`、`--package-lock=false`，不改动本库 `package.json` 或锁文件。
- **两组对照**：同一个消费者生成 `native`（只使用框架与组件库样式）和 `package`（在库样式之前引入真实 `@adui/normalize.css`）两份独立 Vite+ 生产构建，避免 CSS 提取后在多页面共享 chunk 中相互污染。两页相同原生元素与 UI Button/Input，组件库主题与版本一致。
- **自动化检查只针对构建**：两组生产构建均可完成、T2 输出包含 R-003 CSS、根导出与已安装依赖版本正确、T0/T2 页面源码隔离；**不把构建成功冒充浏览器渲染或 UI 组件库交互兼容 PASS**。
- **手工复测**：提供可选的 `--keep` 保留 Git 忽略的临时工程，通过两个本地 `vp dev` 端口在同一浏览器中观察按钮、输入框、字重、焦点和 UI 样式，并记录精确版本与 T0/T2 对比。临时产物不进入 `files: ["dist"]`，普通 `npm run test:offline` 不触发网络安装。
- **阶段门槛**：先实现可单独执行的 `npm run test:ecosystem -- vue-element` / `react-antd`，实际运行结果由维护者 Windows 本地决定。需要 npm registry 时如实提示网络依赖，不将 NOT_RUN 说成 PASS。所有新测试均无 CI、无发布行为。

### 2.12 W-06 生态生产构建实测与离线清单修复（2026-11-04）

维护者已经在 Windows 实际执行 Vue 3 + Element Plus 与 React + Ant Design 两组 `test:ecosystem`，均完成真实 tarball 安装与两个隔离 Vite+ **生产构建**：Vue T0/T2 静态 CSS 分别 360171/360362 字节；React T0/T2 分别 0/192 字节。React 的 0 字节是构建时静态 CSS 结果，不能排除 Ant Design 在浏览器运行时生成样式。Vue `--keep` 再次执行通过，临时消费者保留供真实浏览器比较。

同轮离线 Node 29/30 PASS、1 FAIL；原因是旧 `tests/package.node.test.mjs` 严格断言六项测试清单，而 `package.json` 已加入第七项 `ecosystem-contract.node.test.mjs`。仅同步断言的预期字符串，不改执行脚本或产品 CSS。**修复后尚未重跑完整离线测试**；浏览器 UI/交互、其他框架及目标旧版浏览器结果仍待测试，W-06 Issue #7 不结项。

### 2.13 W-06 Vue/Element Plus Chrome 156 静态生态对照（2026-11-04）

维护者在完成 Vue 3.5.44 + Element Plus 2.14.7 的真实 npm tarball Vite+ 双生产构建之后，提供 T0（`localhost:5174`）与 T2（`localhost:5175`）的 Chrome 156 页面/DevTools 截图。两边 `ui.buttonMounted`、`ui.inputMounted` 均为 `true`，Element Plus Button/Input 外观一致；`b-600`、`strong-600`、`b-700`、`strong-700` 均计算为 `fontWeight: 900`、`fontSize: 16px`、`fontFamily: Noto Sans SC`，`code` 均为 `fontWeight: 400`、`fontSize: 13px`、`fontFamily: monospace`。**本环境静态 UI 与五项计算样式对照 PASS（截图）**；此结论不等于组件输入/焦点交互 PASS，也不代表 React/Ant Design 或其他浏览器支持已确认。两组共有 Vue esm-bundler feature flag 警告、favicon 404，不视为 Normalize 引起的样式失败。详情见[生态记录](research/W06_ECOSYSTEM_LOCAL_VERIFICATION.md)，Issue #7 保持 Open。

### 2.14 W-06 React + Ant Design Chrome 156 静态 UI 对照（2026-11-04）

维护者完成 React+Ant Design 真实 tarball 的隔离 Vite+ 生产构建后，又提供 Chrome 156 的 T0/T2 页面与 Console 截图。Ant Design Button/Input 在两组均挂载，四项 b/strong 计算字重均 900，code 为 13px/monospace，五个样式测量点、组件静态外观一致。记录 **React 19.3.1 + Ant Design 6.6.8 的 Chrome 156 静态 UI PASS（截图）**，不等于 CSS-in-JS 全组件或键盘/输入行为通过。当前 Vue+Element Plus、React+Ant Design 的 Chrome 156 静态对照均已 PASS，但完整 F-009 还缺其他生态、浏览器与实际交互，且修复后的离线测试尚未复验。见[生态证据](research/W06_ECOSYSTEM_LOCAL_VERIFICATION.md)。

### 2.15 W-06 第四批：Vue + TDesign 独立生态对照（2026-11-04）

前一轮 Vue + Element Plus、React + Ant Design 的真实 npm tarball Vite+ 生产构建与 Chrome 156 T0/T2 静态样式均已有 PASS 证据。维护者最新 Windows `npm run test:offline` **30/30 PASS**，确认此前测试脚本清单断言已修复；不需要重做这些既有通过项。

下一批只在已有 `tests/ecosystem-fixtures.mjs` 的 `ecosystemCases` 新增 **`vue-tdesign`**：固定 `vue@3.5.44` 和 `tdesign-vue-next@1.20.10`，引用 TDesign Vue Next 官方 CSS 入口 `tdesign-vue-next/es/style/index.css`，用 Vue `createApp` / `h()` 生成 TDesign Button/Input，继续避免引入 `.vue`、JSX、额外 Vite 插件或新的根依赖。按照现有隔离消费者测试脚本，从真实 `vp pack` CSS tarball 安装并生成 native/T2 两组独立 Vite+ 生产构建；T2 只增加 `import "@adui/normalize.css"`。安装和临时清理逻辑复用现有实现，不扩大 CSS 包出口或修改产品规则。

自动构建门槛是两组 Vite+ 构建与真实 CSS 保留；浏览器门槛是相同 Chrome/系统环境的 T0/T2 Button/Input 成功挂载、R-003/R-004 五个计算样式点以及实际焦点/输入表现单独核验。测试场景以官方包的实际导出为准，错误不得解释成 Normalize 兼容失败。此测试脚本在开发分支提交后状态为 **NOT_RUN**，直到维护者 Windows 实际执行。未来 Tailwind Preflight 与 UnoCSS Reset 仍按各自引入顺序独立研究，不与 UI 库混合测试。

### 2.16 W-06 / F-010 双 Reset 互不污染的实际测试资产（2026-11-04）

TDesign 对照已获维护者完成反馈，后续直接验证第三方 Reset。开发分支新增 `tests/reset-fixtures.mjs`、`tests/reset-consumer.mjs`、`tests/reset-contract.node.test.mjs`，并在 `package.json` 中添加手动 `test:reset` 与离线测试引用。每个被测 Reset 在 Git 忽略的独立临时消费者中使用真实 `vp pack` tarball，仅以 CSS 导入顺序区分 `baseline`、`normalize-first` 和 `normalize-last`；Tailwind Preflight、UnoCSS v4、UnoCSS compat **互不同时加载**。继续复用 Vite+ 1.4.0 和当前唯一 CSS 根导出；默认 Normalize CSS 仍只有 R-003，未增加 Layer、Reset 或其他产品规则。

**测试结果边界**：代码及生成隔离关系已静态核对；维护者 Windows 上的第三方依赖安装、生产构建与浏览器渲染/交互未运行。后续依据 [F-010 独立执行指南](research/W06_RESET_LOCAL_VERIFICATION.md) 保存实际产物哈希、计算样式和 CSS Cascade 胜出规则，不能将 `b,strong` 重复的 `bolder` 声明自动视为破坏性冲突。

**W-05 首版准入结果（2026-11-04）**：36 条候选的**评审决定**已获得维护者批准；本章后续规则准入流程只用于未来新增或重新提出的候选，不代表需要继续向首版补足 36 条 CSS。已实现且唯一准入 R-003；R-004 继续保留原生等宽字体字号，其他候选不进入默认入口。具体分组及测试证据见 [W-05 结项索引](research/W05_RULE_ACCEPTANCE.md)。

## 3. CSS 规则准入流程（拟议）

1. **问题**：列出浏览器/版本、HTML Fixture、原生样式偏差及用户可见问题。
2. **证据**：复现差异并记录可查询的标准/浏览器行为来源。
3. **候选**：给出最小修复选择器和声明，分析对无关元素及组件库的影响。
4. **分类**：真正的浏览器差异放 Normalize；设计偏好放对应可选模块；无法证明必要则暂不加入。
5. **验证**：目标引擎真实浏览器对照、键盘和系统偏好检查、组件库回归、CSS 静态检查。
6. **记录**：关联 FR/NFR、适用范围、已验证浏览器、风险与对应测试用例。

本流程尚无自动执行代码，不能把以上步骤当作已建立的流水线。

## 4. 设计边界与示例

### Normalize

- 候选原则：保留原生可访问性与语义样式；不为视觉一致性而默认清空 button/list/heading。
- 对过时规则不得照搬；逐条核实是否仍存在现代浏览器差异。
- 可使用低特异性选择器，但需确认其不会弱化必要的可访问性行为。

### Reset（可选）

- 可能包含边框盒模型、媒体元素布局约束等；**是否移除通用 margin/padding 要单独评审**。
- 对 `fieldset`、`dialog`、`details`、列表和原生控件必须检查默认体验。

### A11y（可选）

- 不应使用无条件 `outline: none`。
- `:focus-visible`、`prefers-reduced-motion`、`forced-colors` 等是否涉及全局覆盖须先测试。
- 减少动画不应随意通过全局 `!important` 抹除所有应用动画；针对用户偏好采用更窄的范围与可回退行为。

### Forms（可选）

- 审视输入字体、尺寸、触摸交互、原生验证状态；避免影响组件库自定义按钮与输入框。
- 不默认使用 `:user-invalid` 改写所有表单背景或边框。

### Cascade Layers（首版已决定）

- [ADR-0002](adr/0002-cascade-layers.md) 已接受：**首版默认 CSS 不内建 `@layer`**。
- 仅逐条评估 `:where()` 的必要性和 CSS 优先级；不能承诺消费者不受导入顺序影响。
- 命名层、组合入口与可选模块属于后续独立设计议题。

## 5. 数据模型、状态机、接口与并发

本项目作为静态 CSS 包，**不需要数据库、持久化数据模型、运行时 API、鉴权、事务或并发状态机**。唯一需要的结构化数据是设计和测试时的规则元数据（格式待定）。

## 6. 测试设计（未来工作）

| 用例类别     | 场景                                                                | 需求            | 状态   |
| ------------ | ------------------------------------------------------------------- | --------------- | ------ |
| 规则静态审查 | 默认模块禁止高侵入全局声明；选择器和注释合理                        | FR-001、NFR-001 | 未实现 |
| 原生语义     | button、input、select、textarea、fieldset、details、dialog、summary | FR-001/002/004  | 未实现 |
| 浏览器差异   | Chromium / Firefox / WebKit 前后对照                                | NFR-002/003     | 未实现 |
| 交互无障碍   | 键盘焦点、高对比度、减少动画设置                                    | FR-003          | 未实现 |
| 组件库回归   | Element Plus / Ant Design / TDesign 的表单与弹窗等                  | NFR-007         | 未实现 |
| 包导出检查   | npm tarball 中所有公开路径存在且可解析                              | FR-005/006      | 未实现 |
| 体积与许可证 | 原始/Gzip 比较、许可证归属与发布清单                                | NFR-004/006     | 未实现 |

**禁止**用单元文本检查代替浏览器对照并宣称兼容性通过。

## 7. 异常与向后兼容

- 不支持特性的浏览器优先维持可用的原生交互，不使用不必要的破坏性覆盖。
- 规则变更若可能影响消费者样式，应视为潜在破坏性变更，提供变更说明和回归证据。
- 发布导出路径、版本策略和升级说明在真实打包与测试环境确定后再冻结。

## 8. 补充研究（规则证据尚未批准）

- [规则候选](research/RULE_REVIEW.md)、[首批证据审查](research/RULE_EVIDENCE_BATCH1.md) 与 [竞品研究](research/COMPETITOR_REVIEW.md)：用于规则证据审查，不代表实现。
- [浏览器支持矩阵](research/BROWSER_REVIEW.md) 和 [表单规则研究](research/FORM_CONTROLS_REVIEW.md)：最低**测试目标已批准**，但未做任何实际浏览器测试；不代表已完成正式支持验证。
- [ADR-0002](adr/0002-cascade-layers.md)：**Accepted**，首版不内建 `@layer`。
- [ADR-0003](adr/0003-mvp-package-contract.md)：**Accepted**，单一默认 CSS 入口；具体构建行为待验证。
- [ADR-0004](adr/0004-browser-support-policy.md)：**Accepted**，Baseline 2023 为特性准入参考；[七项最低测试目标](research/BASELINE_2023_MAPPING.md) 已批准并复核时间线，正式支持声明尚待实测。
- [ADR-0005](adr/0005-viteplus-toolchain.md)：**Accepted**，开发工具链统一 Vite+；[工具链研究](research/VITEPLUS_TOOLCHAIN_REVIEW.md) 仅查阅官方文档，未运行。
- [开发准入清单](research/REVIEW_GATE.md) 与 [实施计划](plans/MVP_IMPLEMENTATION_PLAN.md)：任务和实施门槛。
- [第三批规则证据审查](research/RULE_EVIDENCE_BATCH3.md)：排版、Reset、系统偏好等剩余 17 条规则的来源与风险。

## 9. 未决事项

Baseline 2023 映射候选版本能否在实际浏览器和 OS 上兑现；纯 CSS 在 Vite+ 内采用哪种打包方式；开发工具链实际版本、组件库 Fixture 版本与 npm 发行支持范围。**首版不发布 `all.css`，默认不内置 `@layer` 的架构选择已经 Accepted，不再视为未决选型。**

**更新约定**：对外 CSS 导出、模块边界、单条关键规则、测试设计变化时维护本文件；高层变化同步 [ARCHITECTURE](ARCHITECTURE.md) 与 [ADR](adr/0001-css-base-strategy.md)。
