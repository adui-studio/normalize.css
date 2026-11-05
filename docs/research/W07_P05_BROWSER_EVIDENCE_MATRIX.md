# W-07 / P-05 · 首版浏览器支持证据矩阵与补证路径

- **建立日期**：2026-11-05
- **工作项**：[W-07 / Issue #8](https://github.com/adui-studio/normalize.css/issues/8)
- **实施环境**：开发分支 `feat/viteplus-local-harness`；候选包 `@adui/normalize.css@0.0.1`，`private:true`，仅含 R-003 的一条正式 CSS 规则
- **状态**：**证据盘点与本地补证步骤已建立；对外最低浏览器版本尚未冻结，不构成公开兼容性保证**
- **来源优先级**：[ADR-0004 七项最低目标](../adr/0004-browser-support-policy.md) → [W-06 正式验收索引](W06_ACCEPTANCE_INDEX.md) → [浏览器历史证据](LOCAL_BROWSER_RUN_20261104.md) → 各项原始结果
- **红线**：不伪造旧版本设备/浏览器数据、不据 T0/T1 推断正式包 T2 通过、不新增产品 CSS、依赖、CI 或发布动作

## 1. 已批准的七项最低测试目标：目前证据盘点

以下为 **ADR-0004 已批准的验收目标**，并非已验证最低支持版本。状态仅描述**当前仓库可定位证据的覆盖程度**。W-06 已获维护者**管理验收**并关闭 Issue #7；回归执行层面可能已完成，但缺乏逐环境附录时不能倒填 PASS，也不能断言维护者没有测过。

1. **Chrome 桌面 120 — PARTIAL（仅 R-003 T0/T1）**。Windows 11 上 Chrome for Testing `120.0.6099.109` 的 T0/T1 六组计算字重中 **4 组由 700 变为 900**，另外 2 组不变；差异已用独立比较器核对。**尚无最低版本使用正式 `dist/normalize.css` 的 T2、原生交互、生态/Reset 全套逐项附件**。CfT 不等同于 Chrome Android，也不代表所有 Chrome 发行渠道。
2. **Edge 桌面 120 — EVIDENCE_MISSING（最低版本）**。未见 Edge 120 的版本/OS、T0/T2 JSON 或人工交互逐项记录；不能用 Chrome 120 或新版 Edge 替代。
3. **Firefox 桌面 121 — PARTIAL（仅 R-003 T0/T1）**。维护者实际运行 `tests/r003-evidence.mjs`，六组 T0/T1 计算字重 **0 差异、0 候选错误**；UA 标识 Firefox 121.0，但未独立取得完整构建元数据；**缺正式 T2 的同环境对照及适用交互逐项附件**。
4. **Safari macOS 17.2 — EVIDENCE_MISSING**。没有能确认真实品牌 Safari 17.2、macOS 版本、T0/T2 样式与操作结果的归档；Playwright WebKit 不算品牌 Safari 验证。
5. **Chrome Android 120 — EVIDENCE_MISSING**。没有相应 Android 设备/系统版本和 Chrome 120 构建的 T0/T2 附件；桌面 Chrome 与移动视口模拟不能替代。
6. **Firefox Android 121 — EVIDENCE_MISSING**。没有相应 Android 设备/系统版本和 Firefox 121 构建的 T0/T2 附件；桌面 Firefox 121 的证据不能直接外推。
7. **Safari iOS 17.2（iOS 17.2）— EVIDENCE_MISSING**。没有真实设备/对应 iOS 17.2 与 Safari 版本的 T0/T2 附件；macOS Safari 或桌面 WebKit 不能替代。

**独立参考，不算上述七项低版本全面通过**：Chrome 156（Windows）已有**真实 T0/T2** 的 CSS link 挂载和 10 项计算样式一致截图；原生 dialog 打开/Esc 关闭、键盘焦点、`hidden="until-found"` 查找揭示有维护者人工 PASS 反馈。Vue + Element Plus、React + Ant Design 的 Chrome 156 静态对照与三种独立 Reset 的 9/9 构建等已在 W-06 归档。此证据只能支持**各自限定环境/子项**，不是 Edge、Safari 或移动最低目标的通过证明。

## 2. 尽可能复用已有材料：先补证，再考虑重测

**不重做 W-06 的已签收工作**。优先寻找以前运行产生的版本截图、T0/T2 的 `#probe-output` JSON、原生交互记录以及与日期/设备对应的结果表。可用且可核验的旧证据直接填入第 4 节模板；没有证据的行标记 `EVIDENCE_MISSING`（“仓库未见”），**不是武断声明测试未执行**。

若确需补测，先确认最低版本的**实际可获得环境**。已停止维护的旧版浏览器存在安全风险：只在受控隔离环境、本地测试页面中使用，不访问互联网真实账号和不可信网站，也不覆盖日常浏览器配置。Windows 本机已验证的 Chrome for Testing 120 和 Firefox 121 可作为先行补充 T2 的环境；**Edge 120、真实 Safari 17.2 和移动旧版环境是否可获得尚未确认**。任何缺失环境不能用新版本或模拟 UA 假装具备。

可参考官方说明：

- [Chrome for Testing](https://developer.chrome.com/docs/automation-and-testing)：支持按版本固定浏览器二进制，但旧版仅用于测试
- [Apple Safari 17.2 Release Notes](https://developer.apple.com/documentation/safari-release-notes/safari-17_2-release-notes)：真实 Safari 17.2 的平台与构建信息
- [Playwright 浏览器说明](https://playwright.dev/docs/browsers)：Playwright WebKit 衍生自 WebKit 源码，不等同于品牌 Safari；移动设备模拟也不等于真实设备

## 3. 已有本地 Fixture：最低实际补证步骤

在开发分支项目根目录的 PowerShell 中（不新建脚本、不安装新工具）：

```powershell
vp pack
vp dev
```

同一**真实目标浏览器/相同配置**中，分别访问：

- **T0 原生页面**：`http://localhost:5173/fixtures/t2-native.html`
- **T2 真正候选包产物**：`http://localhost:5173/fixtures/t2-package.html`

**必须先运行 `vp pack`**；T2 使用实际 `../dist/normalize.css`，不使用单规则 T1 页代替。浏览器内复制每个页面 `#probe-output` 的 JSON，记录 T2 的 `packageStylesheet.href` 和 `loaded:true`，并核对 Network 中 CSS 已成功加载。T0 不应有候选包 CSS。可在 DevTools Console 用现有 DOM 查看，不写入外部文件：

```js
const evidence = JSON.parse(document.querySelector("#probe-output").textContent);
console.log(evidence);
```

**注意**：`navigator.userAgent` 可能采用简化的 `Chrome/120.0.0.0`；另行通过浏览器“关于”或版本页面截图记录**完整浏览器版本**、OS/设备和日期。移动设备应使用可达的本地测试服务器地址，**设备自己的 localhost 不是 Windows 开发机**；验证局域网访问、防火墙和隔离要求后再测，不假定手机能访问上面的 PC localhost。

验收时必须分别判断：

1. **加载真实性**：T2 的 `packageStylesheet.loaded === true`、Network 正常，确认实际加载的是本库生成的 200 B 单 CSS；否则不得记 PASS。
2. **R-003 字重**：记录六个 `b/strong` 测量点、父级 400/600/700、字号和字体上下文。**不要求 T0/T2 字重必须相同**：旧 Chrome 120 中 `bolder` 相较 UA 默认值产生预期变化，恰是修复证据；不可把所有差异判为回归。需核对计算值与相对字重语义、是否存在非预期影响，并与该环境的 T0/T1 历史数据对照。
3. **R-004 不变性**：`code/kbd/samp/pre` 的计算字号与字体族在同环境 T0/T2 应保持一致；不可偷偷强制 `1em` 或覆盖等宽偏好。
4. **原生交互与系统偏好**：复用 [W-06 T0/T2 操作指南](W06_T2_LOCAL_VERIFICATION.md) 记录真实 Tab/焦点、表单、`details`、`dialog`、`hidden="until-found"` 与适用系统偏好。特定旧浏览器**自身不支持**的原生能力需单独记为“本机原生能力不支持”，不得误归因于 Normalize；若需要把该功能列为公开承诺，则必须另行裁定其兼容范围。
5. **框架及 Reset**：已由 W-06 验收的子项目复用原证据；如要宣称**某最低版本**与 Vue/React/TDesign、Tailwind/UnoCSS 组合兼容，则仍需该版本的可追溯相应测试记录，不能由 Chrome 156 构建/截图推断。

这项工作先针对 P-05 补齐**最小版本/加载/计算样式证据**；其他系统交互及生态边界仍依 [ADR-0004](../adr/0004-browser-support-policy.md) 和 W-06 已签核范围判断，不在此文擅自降低原验收要求。

## 4. 每个目标环境的证据填写模板

按每个浏览器/设备建立一条记录（可以先在本地维护，确认不包含敏感信息后再归档）：

```text
target: Chrome Desktop 120 / Edge Desktop 120 / Firefox Desktop 121 / Safari macOS 17.2 / Chrome Android 120 / Firefox Android 121 / Safari iOS 17.2
actual_browser_name:
actual_full_version:
browser_channel_or_build:
os_name_and_full_version:
device_or_emulator_and_model:
test_date:
environment_type: real browser / official testing binary / simulator（明确区别）
source_revision_or_package_version: @adui/normalize.css@0.0.1
t0_url_and_evidence_file:
t2_url_and_evidence_file:
t2_css_loaded: PASS / FAIL / NOT_VERIFIED
r003_six_weight_rows: actual results and expected differences
r004_four_monospace_rows: actual results and any unexpected differences
native_interaction_scope_and_results:
framework_reset_scope_and_results:
screenshots_or_original_logs:
deviations_and_issue_links:
verdict: PASS / FAIL / PARTIAL / EVIDENCE_MISSING
reviewed_by_and_review_date:
```

**状态定义**：`PASS` 表示该条记录列出的适用测试范围有对应环境和可复核结果；`PARTIAL` 表示仅部分项目有证据；`EVIDENCE_MISSING` 表示当前仓库找不到足以独立判断的原始附件；`FAIL` 表示实际操作不符合经批准的预期。`NOT_RUN` 只能在明确确认未执行时使用，不能把管理验收时未提交日志的项目自动写成 `NOT_RUN`。

## 5. 完成条件、风险与裁定路径

- **P-05 不能直接 PASS**：七项已批准最低目标中，目前只有 Chrome 120 / Firefox 121 的 R-003 早期 T0/T1 局部数据，Chrome 156 的 T0/T2 和集成局部证据不属于所有目标版本。
- **优先行动**：整理既有 W-06 跨浏览器签收时的真实版本、OS、设备和 T0/T2 原始归档；能证明的项才标 PASS。仅有旧版 R-003 T0/T1 的两项优先补正式 T2 数据。
- **环境确实无法提供时**：保持目标证据缺口，不虚构版本。可在说明风险及实际覆盖范围后**另行申请维护者批准**修订 ADR-0004 的目标与正式发行支持声明；不得以“谨慎描述”悄悄跳过已经批准的测试目标。
- **对外声明**：只有审核了环境证据或正式修订 ADR/验收标准后，才将对应版本写入 README、npm 页面或 Release 的“最低支持版本”。截至本轮不对外宣称这些最低版本已完整 PASS。
- **安全/发布边界**：保留 `version:"0.0.1"`、`private:true`、产品 CSS 不变；不添加 CI、依赖、发布脚本，不执行 npm publish、Git Tag、Release 或 main 合并。

**P-05 本轮交付**：基于仓库事实的七项证据盘点、原有 Fixture 复用指南、统一取证字段及待维护者后续裁定事项。**没有新增浏览器实际测试结果，P-05 仍 OPEN**。
