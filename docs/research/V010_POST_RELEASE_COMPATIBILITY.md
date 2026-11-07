# v0.1.0 发行后兼容性证据与补测矩阵

**核查日期**：2026-11-07  
**已发行源码**：`v0.1.0` → `cd28baaa5bf0a2af995053a7a35147e7392265a4`  
**发行事实**：[GitHub Release v0.1.0](https://github.com/adui-studio/normalize.css/releases/tag/v0.1.0) 已正式发布（非 Draft / Prerelease）；用户在 npm 官方 Registry 查询到 `0.1.0` 且 `latest=0.1.0`，`dist.shasum=09ad11dc9c52538941fb8bdf5629f4841411dde3`，与最终发包前预览一致。  
**决策边界**：[ADR-0006](../adr/0006-v01-default-scope-and-compatibility-risk.md) 方案 A：默认仍为 R-003/R-007/R-008，可选 Reset / Forms / A11y / All 继续显式引入；不宣称未经逐版本验证的最低浏览器版本。

## 一、已有证据按类型分层

| 证据来源                                  | 实际事实                                                                                                                                                                               | 不能据此证明                                                             |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 维护者 Windows 发行候选验收               | `8bb687f4deda6a5373b53e8c4d45eba34736207a` 上 `verify:mvp` **64/64 PASS**，格式 94/94、Lint 22 文件无错误，8 张 HTML Fixture 构建成功；合并后 `main@cd28baaa` 的打包预览摘要与候选相同 | 所有浏览器的视觉、焦点、系统偏好与真实设备兼容                           |
| npm Registry + GitHub 发行核验            | 官方 npm `latest=0.1.0`、SHA-1 / SHA-512 integrity 均与最终预览一致；附注 Tag / GitHub Release 均指向发行源码                                                                          | 任意新的跨浏览器行为 PASS                                                |
| 旧阶段的六项独立生态 / Reset 构建         | 仓库 HARNESS 已归档 **3 个组件库 + 3 个 Reset 的生产构建 PASS**，绑定历史源码 `main@10eae4cb6a58ee1278b94ae4037cba01d853387d`                                                          | 本次 `v0.1.0` 发布 SHA 对这六项已经重跑；构建 PASS 不等于浏览器交互 PASS |
| PR #28 / Issue #18 的 Chrome 156 管理验收 | Windows Chrome 156 的 M0/M1 静态样式、CSSOM 与 Network 局部证据，键盘和原生交互由维护者签收；其后维护者也确认跨浏览器管理验收通过                                                      | 未提供原始逐平台构建号、JSON 和系统偏好附件的环境已达到独立可审计 PASS   |

## 二、本轮独立 Chromium 对照（真实执行，范围受限）

**环境**：Debian Linux，Chromium **144.0.7559.96**，Playwright 驱动的无头浏览器，2026-11-07。浏览器沙箱不允许访问本地 HTTP 和 `file://` 导航，因此使用 `page.set_content` 载入与发行 Tag **逐字节一致**的 M0/M1 HTML Fixture 内容，移除无法访问的外部 `link` / `script` 引用后，按 `normalize → reset → forms → a11y` 顺序将逐字节一致的 CSS 注入内存 CSSOM，并运行仓库探针。对 5 份产品 CSS、两份 HTML 和 `modules-probe.js` 使用 `git hash-object` 核对 Git Blob SHA，与 `v0.1.0` 的文件 Blob SHA 全部一致。

**结果：21 / 21 个具体检查通过**，覆盖：

- CSSOM 四模块注入、Reset `box-sizing`、标题/正文/列表边距、列表 marker 保留、SVG 宽度约束、表格折叠。
- Forms 按作者上下文继承 18px，原生控件 `appearance:auto`，`hidden` 保留。
- Checkbox / Radio / Input 的基本操作，Details 展开、Dialog `showModal` / Esc 关闭。
- `Tab` 触发的 `:focus-visible` 可见轮廓；在 Chromium **模拟** `prefers-reduced-motion: reduce` 时根滚动从 `smooth` 变 `auto`；模拟 `forced-colors: active` 时媒体查询被识别。

**必须保留的限制**：这次**没有走真实 HTTP / npm tarball / `all.css` 的 `@import` 请求链**，CSS 注入不等同于实际浏览器通过网络加载包；强制颜色与减少动态效果为 Playwright 模拟，不是真实 Windows 系统设置；Linux Chromium 144 不能代表 Chrome 156 Windows、Firefox、Safari、移动设备，更不能证明旧 WebKit / Blink 最低版本。因此仅将上述 21 项标为**本环境 / 本方法实测 PASS**，其它维度保留 `EVIDENCE_MISSING` 或历史管理验收标注。

## 三、当前真实仓库已有的专项命令（不新增依赖或 CI）

以下脚本在 `package.json` 已存在，`verify:mvp` **并不包含**单独的生态 / Reset 场景。执行前请确认当前仓库 HEAD / 依赖状态；脚本会在 `node_modules/.cache` 建立隔离消费者，并可能按固定版本从 npm 获取第三方依赖。

```powershell
git switch main
git pull --ff-only origin main
git rev-parse HEAD
pnpm install --frozen-lockfile
pnpm exec vp pack

# Vue 3 + Element Plus / TDesign；React + Ant Design
node tests/ecosystem-consumer.mjs vue-element
node tests/ecosystem-consumer.mjs vue-tdesign
node tests/ecosystem-consumer.mjs react-antd

# Tailwind Preflight 与两种 UnoCSS Reset
node tests/reset-consumer.mjs tailwind-preflight
node tests/reset-consumer.mjs unocss-tailwind-v4
node tests/reset-consumer.mjs unocss-tailwind-compat

git status --short
git rev-parse HEAD
```

**验收判定**：每一组须有独立 PASS 日志，并记录准确 HEAD、真实安装的包版本、构建退出码及 CSS 输出。它们只验证生产构建、真实 npm tarball 导入和有限样本的选择器/样式，**不证明组件按钮、输入、焦点、层叠或重叠 Reset 的真实视觉兼容**。

## 四、真实浏览器 M0/M1 与生态/Reset 剩余证据

项目已有 `fixtures/modules-native.html`（M0）和 `fixtures/modules-all.html`（M1），以及 T0/T2 默认规则页面。可在 Windows 本地启动：

```powershell
pnpm exec vp pack
pnpm exec vp dev
```

在真实浏览器打开 `/fixtures/modules-native.html` 与 `/fixtures/modules-all.html`，记录浏览器完整 Build / OS / 设备；在 Console 采集 `window.__aduiModuleCapture()`；结合 Network 验证实际 `all.css` 已加载及模块代表声明确实生效。**Vite+ 可能内联 CSS `@import`，无需强制要求四个独立网络请求**。实际键盘 Tab、Details、Dialog、表单、系统 forced-colors 与减少动态效果需要独立检查。

| 测试维度                                        | 当前状态                                                 | 继续补证                                                               |
| ----------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| Windows Chrome 156 M0/M1                        | 已有 PR #28 的有限静态证据和维护者交互验收               | 若要用于正式支持承诺，补浏览器完整版本、原始 JSON / 实际系统偏好与截图 |
| Chromium 144 / Linux Headless                   | **21/21 本次有界测试 PASS**                              | 真实 HTTP `all.css` 导入链、完整 CSSOM / 网络与真实系统偏好            |
| Firefox 当前版本、Safari 当前版本               | 维护者旧阶段报告跨浏览器管理验收，但缺独立版本化原始附件 | T0/T2、M0/M1、原生交互与聚焦、版本/OS、计算样式 JSON                   |
| Safari 17.2 / 旧 Blink 120（可获得时）          | ADR-0006 限定风险接受，并非该特定版本 PASS               | R-007 / R-008 的真实差异与作者样式优先级                               |
| iOS Safari / Android Chrome / Firefox           | 没有本轮逐设备原始证据                                   | 设备/OS/浏览器构建、表单/焦点/强制颜色/动态偏好                        |
| Vue Element Plus、Vue TDesign、React Ant Design | 六项历史隔离构建的生态部分可追溯                         | 用最终 `v0.1.0` 重跑三个场景，再用真实浏览器比对按钮、输入、焦点       |
| Tailwind CSS / UnoCSS Reset 三种组合            | 六项历史隔离构建的 Reset 部分可追溯                      | 用最终 `v0.1.0` 重跑三个场景，分别核对导入顺序及获胜 CSS 声明          |

**结果记录原则**：`PASS` 必须附准确版本、环境、样本与原始日志；`MANUAL_ACCEPTED` 是维护者管理确认；`NOT_RUN` 或 `EVIDENCE_MISSING` 不自动升级为通过。发现回归先定位具体规则/导入顺序，再决定是否启动新版本修复。不得为了扩大规则数量修改默认 Normalize，也不得新增 CI。

## 五、发行后 CSSOM 真实导入补证（开发中，2026-11-07）

维护者已在 Windows `main@691525255b8cb585e7412e17e3d29de15a4fa520` 上执行三组 Vue/React 与三组 Tailwind/UnoCSS Reset 的**真实 tarball 隔离生产构建，6/6 PASS**。原始日志和 PowerShell 汇总误报的根因记录于 [Issue #18](https://github.com/adui-studio/normalize.css/issues/18#issuecomment-6699745295)。这六项属于**构建证据**，不作为浏览器交互、视觉或 CSS 层叠 PASS。

为补足本文件第二节所述的 HTTP `all.css` 缺口，本轮在现有 `fixtures/modules-probe.js` 中增加同源 CSSOM 模块声明观察，纯辅助逻辑位于 `fixtures/modules-cssom.js`。探针读取 M1 的 `link.sheet.cssRules`，递归追踪标准 `@import` 的 `CSSImportRule.styleSheet` 与打包器内联后的嵌套规则，分别判断 Normalize、Reset、Forms、A11y 的代表性声明。M0 仍无 `modules-css` 链接，M0/M1 的 DOM、作者样式和被测产品 CSS 均不改动。

本轮只完成**代码与有界单测候选**：Node 模拟覆盖四模块存在、单模块缺失、空样式表及 CSSOM 访问异常；Chromium 内联 CSS 的代表性声明识别已执行并通过。尤其在 Chromium CSSOM 中，`*::before` 可能序列化为 `::before`，Reset 检查因此只按伪元素片段与 `box-sizing: border-box` 匹配。浏览器容器对 `127.0.0.1` HTTP 导航返回 `ERR_BLOCKED_BY_ADMINISTRATOR`，**未完成本轮真实 HTTP 测试，也未在维护者 Windows 上执行分支完整 `vp check` / `verify:mvp`**。

维护者本机复验（PowerShell）：

```powershell
pnpm install --frozen-lockfile
pnpm run verify:mvp
pnpm exec vp dev
```

在 `vp dev` 输出的本地 HTTP 地址打开 `/fixtures/modules-native.html` 和 `/fixtures/modules-all.html`；分别在 DevTools Console 执行 `window.__aduiModuleCapture()` 并导出 JSON。M0 预期 `stylesheet === null`；M1 预期 `pageProtocol === "http:"`（或 HTTPS）、`stylesheet.loaded === true`、`stylesheet.cssom.complete === true`，四个模块标记均为 `true` 且 `error === null`。同时通过 Network 确认 `all.css` 及内联/独立子导入无失败响应，比较 Reset/Forms 计算样式，再实际操作 Tab、Details、Dialog、原生表单与系统偏好。

**限制**：CSSOM 声明完整性不是 HTTP 状态证明，也不能替代可见焦点、实际键盘交互或真实 Safari/Firefox/移动端结果。若在某个浏览器拿不到 CSSOM（例如跨源安全限制），会返回 `complete:false` 与 `error`，该场景记录为待调查，不自动判定 CSS 本身错误。新辅助脚本不属于 npm 包，且不增加依赖、CI 或产品 CSS。

## 六、跨浏览器 M0/M1 证据导出与离线对照（新开发分支，待维护者验收）

本轮针对 Firefox、Safari、移动浏览器缺少可重复归档 JSON 的问题，复用现有 M0/M1 页面和 `window.__aduiModuleCapture()`，不修改已发行产品 CSS。两页新增同一“保存当前 JSON 证据”按钮，浏览器将当前静态快照生成本地 `adui-modules-m0-*.json` / `adui-modules-m1-*.json`。数据追加 `capturedAt`（UTC 时间戳）及 `viewport`（视口宽高和像素比），不发送远程请求、不写本地持久化存储。浏览器可能打开 JSON 而非直接下载；此时可从已有 `#module-output` 复制数据。下载文件含 UA、页面路径与环境信息，归档或分享前注意审查设备隐私。

### 1. 本地验收与采样

```powershell
git rev-parse HEAD
pnpm install --frozen-lockfile
pnpm run verify:mvp
pnpm exec vp build
pnpm exec vp dev
```

在 `vp dev` 实际打印的 HTTP 地址依次访问 `/fixtures/modules-native.html`（M0）与 `/fixtures/modules-all.html`（M1）。**同一组两页必须使用同一浏览器、同一设备、相同系统偏好和同一服务来源**，各点击“保存当前 JSON 证据”，再在本机运行：

```powershell
node tests/modules-evidence.mjs "./m0.json" "./m1.json"
```

文件路径替换为实际下载位置。对照器只读取本地 JSON，不安装依赖、不连接网络；输出 `PROBE_PASS` / `PROBE_FAIL`、逐项检查与失败原因。退出码分别是 `0` / `1`；参数错误或 JSON 结构不合法为 `2`。本轮检查同一 UA、HTTP(S) 协议、媒体偏好、M1 样式加载与四模块 CSSOM、Reset 盒模型与表格、Forms 18px 字号继承、原生 hidden，以及 reduced-motion 下根滚动行为。对于样式差异采用**各模块的预期值**，不能把 M0/M1 全部计算样式相等作为通过依据。

### 2. Firefox / Safari / 移动端专项注意

- 桌面 Firefox、macOS Safari、iOS Safari 和 Android Chrome/Firefox **分别记录**浏览器产品完整版本、OS 版本、设备型号、浏览器设置与准确 HEAD；UA 字符串本身不足以独立证明版本。
- 手机需要从可信局域网访问开发机实际监听地址，必要时按当前 Vite+ 支持的启动参数开放局域网监听并配置本机防火墙；不要把本地调试服务器暴露到公网，也不要假定 `localhost` 指向开发电脑。
- 真实键盘 Tab / `:focus-visible`、Details、Dialog 打开和 Esc、表单选择/输入、文件控件、列表 marker，以及系统强制颜色和减少动态效果的**真实切换**，仍需分别记录手工结果及截图。移动软键盘/触屏不能自动替代实体键盘验收。
- 若需测试系统偏好开启前后行为，按每种偏好状态**重新导出完整 M0/M1 一对文件**，不要把开启与关闭状态混合比较。导出按钮的点击会改变当前焦点，因此导出的 `focus` 字段不能单独证明 Tab 焦点效果。
- Network 应独立确认 `all.css` 及其内联或独立 `@import` 均加载成功；单凭 `link.sheet` 与 CSSOM 代表规则不是完整 HTTP 证据。现有 M1 用的是仓库 `src/all.css`，**不是 npm Registry tarball 安装后的页面**。

### 3. 验证状态与边界

当前新对照器已在隔离 Node 22.16.0 环境执行 **6/6 合成测试 PASS**（正常、缺失模块、reduced-motion、不同 UA/媒体偏好、file/未加载、非法数据）。这不等于真实 Firefox/Safari/iOS/Android HTTP 和交互测试通过。本分支完整 Windows `verify:mvp`、`vp build`、真实浏览器导出与实际用户设备结果均 **NOT_RUN / 待维护者补证**；不得把 `PROBE_PASS` 或维护者管理签收扩展成公开的最低浏览器支持保证。此变更仅涉及 Fixture、离线对照器、既有离线测试和文档，未增加运行时 JS、依赖、CI、产品 CSS 或 npm 版本。

## 七、v0.1.0 跨浏览器交互验收执行清单（2026-11-07，PR #41 后续）

### 1. 已取得的 Chrome 156 静态证据

维护者于 2026-11-07 上传了从 PR #41 M0/M1 页面导出的两份 JSON（M0：`2026-11-07T01:42:13.369Z`；M1：`2026-11-07T01:43:14.742Z`）。对照器按真实文件内容执行，返回 **`PROBE_PASS`、19/19、0 FAIL**，详情见 [PR #41 验收评论](https://github.com/adui-studio/normalize.css/pull/41#issuecomment-6700540428)。UA 显示 Windows + Chrome/156.0.0.0；两页均为 HTTP、2560×1271、DPR 1、`forcedColors=false`、`reducedMotion=false`。M0 无本库 CSS；M1 `all.css` 已被浏览器识别，CSSOM 四模块均有代表性声明，Reset、Forms、hidden 与当前滚动偏好的有限静态计算值符合预期。

**边界**：该 JSON 的 `focus` 来自点击“保存当前 JSON 证据”后的按钮焦点，M0/M1 的 `focusVisible` 值不能据此作为等条件 Tab/键盘 PASS；没有 Network 独立响应、Dialog/Details 交互、强制颜色与减少动态开启场景的证据。原始 JSON 未公开入库；不要将这一对 Chrome 样本复用为 Firefox/Safari/移动端 PASS。

### 2. 可直接执行的人工操作矩阵

每一行都在**相同环境、相同偏好**的 M0 与 M1 两页实际操作，并另行截图或记录屏幕行为；`PROBE_PASS` 不能自动填写下表。

| 验收项 | 手工步骤与预期 | 当前状态 |
| --- | --- | --- |
| HTTP / CSS 导入 | 在 M1 DevTools Network 重新加载，核对 `all.css` 响应成功（若 Vite+ 内联 `@import`，不要求出现 4 个独立请求），与 M0 的无导入形成对照；记录 URL、状态和失败请求 | **NOT_RUN**（已有 link/CSSOM 快照，不是 Network 响应） |
| Tab / 焦点轮廓 | 从页面实际按 Tab 聚焦 `#module-button`、`#module-link`；观察可见焦点；在焦点仍在页面时截图或记录 `#module-output`，不要用点击导出按钮后的焦点替代键盘证据 | **NOT_RUN** |
| Details / Summary | 用 Tab 聚焦 `summary`，按 Enter 和 Space 展开/折叠；marker 和键盘行为应正常，M0/M1 无异常回归 | **NOT_RUN** |
| Dialog | 点击“打开原生 Dialog”；确认原生模态层出现；先按 Esc 关闭，再重新打开用原生“关闭”按钮关闭；记录两种路径 | **NOT_RUN** |
| Forms | 实际在 input/textarea 输入、用键盘选择 select、勾选 checkbox/radio，检查 fieldset、legend、file 控件原生功能；比较两页正常操作 | **NOT_RUN** |
| Reduced Motion | 在操作系统实际切换减少动态效果；分别在每种状态重新导出完整 M0/M1 一对 JSON；开启时 M1 `rootScrollBehavior=auto`，M0 保持作者 `smooth`；记录 OS 与设置路径 | **NOT_RUN**（仅关闭状态 JSON） |
| Forced Colors | 仅在支持的真实环境开启/关闭强制颜色模式，重新采样两页并观察焦点颜色、表单与可读性；不支持则记 N/A，不将模拟值冒充系统切换 | **NOT_RUN**（仅关闭状态 JSON） |

### 3. 平台和版本记录模板

先在 PR #41 记录**测试前、测试后**完整 `git rev-parse HEAD`，及 `pnpm run verify:mvp`、`pnpm exec vp build` 的准确结果。然后按平台分开填写以下表格，未实际执行的保留 `NOT_RUN`：

| 平台 | M0/M1 JSON 静态对照 | Network | 键盘 / Dialog / Details / Forms | 系统偏好 | 版本证据 |
| --- | --- | --- | --- | --- | --- |
| Windows Chrome 156 | **PASS，19/19** | NOT_RUN | NOT_RUN | 关闭状态已采样；开启场景 NOT_RUN | UA 有主版本，完整补丁号未核实 |
| Windows Firefox | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | 待记录 |
| macOS Safari | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | 待记录 |
| iOS Safari / Android 浏览器 | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | 待记录 |

Safari 的正式验证应使用 Apple 的实际 Safari 环境；WebKit 自动化不能未经说明替代正式 Safari 版本。手机与开发机使用可信局域网地址访问（不要认为手机 `localhost` 指向开发电脑），必要时再按实际 Vite+ CLI 支持能力开放局域网绑定，切勿暴露公网。

### 4. 本次 PR 的合并门槛

- **已满足**：Chrome 156 的有限静态 JSON 对照 `19/19 PROBE_PASS`。
- **尚未补齐**：PR #41 最新 HEAD 的完整 Windows 工程执行日志、`vp build`、至少一轮实际键盘/原生控件/Network 人工验收。
- **不因本 PR 推断**：Firefox、Safari、移动设备或系统偏好全矩阵均已通过；不足的项始终为 `NOT_RUN` 或 `EVIDENCE_MISSING`。
- **保持**：PR #41 Draft、未合并；待维护者提交结果并明确同意合并才进行合并。此次仅补测试证据说明，不改变 `src/*.css`、npm 包、依赖、CI、Tag 或 Release。

## 八、跨浏览器阶段维护者管理验收结项（2026-11-07）

**本轮最终反馈**：维护者已明确表示“跨浏览器兼容性验证完成”。PR #40 与 PR #41 已合并，最新对应的测试与文档资产位于 `main@949683c2cf2be82c8f6898ef83afcd635d0ac607`。此处将**项目管理验收**标为完成；前面各节按发生时间记录的 `NOT_RUN` / `EVIDENCE_MISSING` 是当时的证据快照，并未因一次管理确认而自动升级为**逐平台原始证据 PASS**。

已能独立追溯的证据：维护者 Windows 的三项 Vue/React 生态加三项 Tailwind/UnoCSS Reset 隔离生产构建 **6/6 PASS**；Chrome 156 的 M0/M1 HTTP 页面导出真实 JSON 经离线比较 **19/19 `PROBE_PASS`**（[PR #41 实际结果](https://github.com/adui-studio/normalize.css/pull/41#issuecomment-6700540428)）；Linux Chromium 144 使用内存注入与媒体模拟的限定检查 **21/21 PASS**。三组测试的原始方法、目标和适用范围不相同，不能累计为统一的“全浏览器通过次数”。

本轮用户反馈确认跨浏览器工作已经完成，但**并未新增每一个 Firefox / Safari / iOS / Android 设备完整版本、原始 JSON、Network、系统偏好切换和全部交互逐项结果**。对外的最低浏览器版本承诺仍依照 [ADR-0006](../adr/0006-v01-default-scope-and-compatibility-risk.md) 的限定风险接受策略，不扩大声明，不将管理验收等同于对所有真实设备的独立审计证明。

**结项后的下一步**：不再为重复验收而继续增加浏览器 Fixture 或测试脚本；转向[下一轮需求与规则准入计划](../plans/POST_V010_ACCEPTANCE_AND_NEXT_ITERATION.md)。只有在新 UA 差异或可选模块真实兼容冲突出现并满足准入 Gate 后，才讨论单条 CSS 修改。现行 Normalize 三规则、四个可选 CSS 入口、六个导出、npm `0.1.0`、Tag/Release、依赖、CI 均不修改。
