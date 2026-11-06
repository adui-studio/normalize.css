# v0.1.0 发行后兼容性证据与补测矩阵

**核查日期**：2026-11-07  
**已发行源码**：`v0.1.0` → `cd28baaa5bf0a2af995053a7a35147e7392265a4`  
**发行事实**：[GitHub Release v0.1.0](https://github.com/adui-studio/normalize.css/releases/tag/v0.1.0) 已正式发布（非 Draft / Prerelease）；用户在 npm 官方 Registry 查询到 `0.1.0` 且 `latest=0.1.0`，`dist.shasum=09ad11dc9c52538941fb8bdf5629f4841411dde3`，与最终发包前预览一致。  
**决策边界**：[ADR-0006](../adr/0006-v01-default-scope-and-compatibility-risk.md) 方案 A：默认仍为 R-003/R-007/R-008，可选 Reset / Forms / A11y / All 继续显式引入；不宣称未经逐版本验证的最低浏览器版本。

## 一、已有证据按类型分层

| 证据来源 | 实际事实 | 不能据此证明 |
| --- | --- | --- |
| 维护者 Windows 发行候选验收 | `8bb687f4deda6a5373b53e8c4d45eba34736207a` 上 `verify:mvp` **64/64 PASS**，格式 94/94、Lint 22 文件无错误，8 张 HTML Fixture 构建成功；合并后 `main@cd28baaa` 的打包预览摘要与候选相同 | 所有浏览器的视觉、焦点、系统偏好与真实设备兼容 |
| npm Registry + GitHub 发行核验 | 官方 npm `latest=0.1.0`、SHA-1 / SHA-512 integrity 均与最终预览一致；附注 Tag / GitHub Release 均指向发行源码 | 任意新的跨浏览器行为 PASS |
| 旧阶段的六项独立生态 / Reset 构建 | 仓库 HARNESS 已归档 **3 个组件库 + 3 个 Reset 的生产构建 PASS**，绑定历史源码 `main@10eae4cb6a58ee1278b94ae4037cba01d853387d` | 本次 `v0.1.0` 发布 SHA 对这六项已经重跑；构建 PASS 不等于浏览器交互 PASS |
| PR #28 / Issue #18 的 Chrome 156 管理验收 | Windows Chrome 156 的 M0/M1 静态样式、CSSOM 与 Network 局部证据，键盘和原生交互由维护者签收；其后维护者也确认跨浏览器管理验收通过 | 未提供原始逐平台构建号、JSON 和系统偏好附件的环境已达到独立可审计 PASS |

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

| 测试维度 | 当前状态 | 继续补证 |
| --- | --- | --- |
| Windows Chrome 156 M0/M1 | 已有 PR #28 的有限静态证据和维护者交互验收 | 若要用于正式支持承诺，补浏览器完整版本、原始 JSON / 实际系统偏好与截图 |
| Chromium 144 / Linux Headless | **21/21 本次有界测试 PASS** | 真实 HTTP `all.css` 导入链、完整 CSSOM / 网络与真实系统偏好 |
| Firefox 当前版本、Safari 当前版本 | 维护者旧阶段报告跨浏览器管理验收，但缺独立版本化原始附件 | T0/T2、M0/M1、原生交互与聚焦、版本/OS、计算样式 JSON |
| Safari 17.2 / 旧 Blink 120（可获得时） | ADR-0006 限定风险接受，并非该特定版本 PASS | R-007 / R-008 的真实差异与作者样式优先级 |
| iOS Safari / Android Chrome / Firefox | 没有本轮逐设备原始证据 | 设备/OS/浏览器构建、表单/焦点/强制颜色/动态偏好 |
| Vue Element Plus、Vue TDesign、React Ant Design | 六项历史隔离构建的生态部分可追溯 | 用最终 `v0.1.0` 重跑三个场景，再用真实浏览器比对按钮、输入、焦点 |
| Tailwind CSS / UnoCSS Reset 三种组合 | 六项历史隔离构建的 Reset 部分可追溯 | 用最终 `v0.1.0` 重跑三个场景，分别核对导入顺序及获胜 CSS 声明 |

**结果记录原则**：`PASS` 必须附准确版本、环境、样本与原始日志；`MANUAL_ACCEPTED` 是维护者管理确认；`NOT_RUN` 或 `EVIDENCE_MISSING` 不自动升级为通过。发现回归先定位具体规则/导入顺序，再决定是否启动新版本修复。不得为了扩大规则数量修改默认 Normalize，也不得新增 CI。
