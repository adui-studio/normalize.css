# W-07 / P-05 · 首版浏览器支持证据矩阵与补证路径

- **建立日期**：2026-11-05
- **工作项**：[W-07 / Issue #8](https://github.com/adui-studio/normalize.css/issues/8)
- **实施环境**：开发分支 `feat/viteplus-local-harness`；候选包 `@adui/normalize.css@0.0.1`，`private:true`，仅含 R-003 的一条正式 CSS 规则
- **状态**：**证据盘点与本地补证步骤已建立；对外最低浏览器版本尚未冻结，不构成公开兼容性保证**
- **来源优先级**：[ADR-0004 七项最低目标](../adr/0004-browser-support-policy.md) → [W-06 正式验收索引](W06_ACCEPTANCE_INDEX.md) → [浏览器历史证据](LOCAL_BROWSER_RUN_20261104.md) → 各项原始结果
- **红线**：不伪造旧版本设备/浏览器数据、不据 T0/T1 推断正式包 T2 通过、不新增产品 CSS、依赖、CI 或发布动作

**W-01 历史系统前提资料（2026-11-05）**：已补录 Firefox 121 桌面/Android、Chrome Android 120、Safari 17.2 的历史 OS/设备前提，见 [Baseline 映射研究](BASELINE_2023_MAPPING.md)；Edge 120 的历史最低系统与测试设备仍缺失。**这次只新增厂商资料，没有新增任意一项目标的正式 T0/T2 PASS，以下矩阵状态不变。**

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

### 2.1 W-06 Issue #7 历史评论追溯（2026-11-05）

本次进一步检查 [W-06 Issue #7](https://github.com/adui-studio/normalize.css/issues/7) 的 **22 条讨论评论**，并与已归档的研究文档交叉核对：

- [Chrome 156 原生 T0/T2 回归](https://github.com/adui-studio/normalize.css/issues/7#issuecomment-6622389292) 和 [原生交互反馈](https://github.com/adui-studio/normalize.css/issues/7#issuecomment-6622546287)：证明该浏览器子范围曾被测试，不提供旧版 Edge/Safari/移动版结果。
- [Vue + Element Plus 的 Chrome 156 截图](https://github.com/adui-studio/normalize.css/issues/7#issuecomment-6624388748) 与 [React + Ant Design 的 Chrome 156 截图](https://github.com/adui-studio/normalize.css/issues/7#issuecomment-6624575902)：是两个生态消费者的静态 UI 证据，不能推导七个最低目标均已验证。
- [UnoCSS tailwind-v4 页面来源记录](https://github.com/adui-studio/normalize.css/issues/7#issuecomment-6625719207) 与 [Tailwind Preflight Chrome 156 静态对照](https://github.com/adui-studio/normalize.css/issues/7#issuecomment-6626094865)：有独立构建、页面来源或静态计算结果，但不是目标版本的完整跨浏览器附件。
- [维护者反馈跨浏览器回归完成](https://github.com/adui-studio/normalize.css/issues/7#issuecomment-6626947676) 和 [W-06 正式结项记录](https://github.com/adui-studio/normalize.css/issues/7#issuecomment-6627029759)：管理结论明确，**未附七项最低目标逐环境的浏览器构建号、OS/设备、T0/T2 原始 JSON/截图附件清单**。

**追溯结论**：本次没有从 Issue 评论补充得到可直接将某个最低目标由 `PARTIAL` / `EVIDENCE_MISSING` 改为 `PASS` 的新证据。**这是仓库附件可用性判断，不是推翻 W-06 的人工验收或断言测试从未执行。**

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

### 3.1 第一批：只补 Chrome 120 / Firefox 121 的真实 T2

此批优先使用维护者此前已成功启动的 **Chrome for Testing 120.0.6099.109** 和 **Firefox 121.0**；**先核对实际环境是否仍在**，并确认受控隔离安全条件。若不存在或无法安全运行，不要求强行下载安装旧浏览器，保持待验证。

1. 在实际目标浏览器中拍摄“关于浏览器”或版本页，记录完整版本、操作系统、取证日期；不要仅靠简化的 UA 字符串。
2. 每个浏览器分别打开本页第 3 节的 T0、T2 地址；在两页确认探针完成标记（`document.documentElement.dataset.probeStatus === "complete"`），把 **`#probe-output` 的全部 JSON** 分别复制为 T0 和 T2 记录，并保留浏览器版本截图。
3. T2 必须确认 `packageStylesheet.loaded === true`、`href` 指向 `../dist/normalize.css`，以及 Network 真实 CSS 加载成功；T0 不应加载本库 CSS。若失败，本轮标为加载失败，**不要继续给样式判 PASS**。
4. 比较两组 JSON 中相同 `id` 的 `parentFontWeight`、`fontWeight`、`parentFontSize`、`fontSize`、`fontFamily`。**Chrome 120 预期**：在与先前原始数据一致的字体上下文下，`b-600`、`strong-600`、`b-700`、`strong-700` 有从 700 到 900 的已知修复变化；父级 400 的两组不变。**Firefox 121 预期**：同一浏览器环境 T0/T2 的六组字重均无新增差异。实际结果不同应完整记录并诊断，不能按预期直接填 PASS。
5. `code/kbd/samp/pre` 在各自浏览器的 T0/T2 字体族和字号应保持一致；适用原生交互遵循 W-06 人工验证范围，不得仅凭静态 JSON 声称所有键盘/无障碍功能通过。
6. 每个环境归档 **版本截图 + T0 JSON + T2 JSON + CSS Network 证据 + 实测结论**。若只补齐静态样式，标注“R-003/R-004 + CSS 加载子项 PASS”，**整个最低浏览器版本仍为 PARTIAL，不能扩大为全面支持声明**。

浏览器运行环境及历史 T0/T1 来源参考 [R-003/R-004 实测指南](R003_R004_LOCAL_VERIFICATION.md) 与 [原始浏览器运行记录](LOCAL_BROWSER_RUN_20261104.md)。这两项可先形成一份可复核的正式包闭环；剩余 Edge、真实 Safari 和移动端仍独立决策，不因共享内核自动通过。

### 3.2 新增离线 T0/T2 证据比较器（仅静态探针）

维护者后续在同一浏览器中收集两个页面的原始 `#probe-output`，并分别保存为本机 `t2-native.json`、`t2-package.json` 后，可运行：

```powershell
node tests/t2-evidence.mjs ./t2-native.json ./t2-package.json
```

此工具复用既有 `tests/evidence-file.mjs` 的 256 KiB JSON 读取限制，只验证已保存证据：T0/T2 页面身份、同一 UA、10 项 Probe、T2 真实 CSS link 挂载标记、R-003 的 `bolder` 相对字重、R-004 的原生等宽字体/字号不变性。退出码 **0**（`PROBE_PASS`）、**1**（样式不符或 CSS 未挂载）、**2**（非法文件/角色/版本）明确区分。

**限定范围**：静态 JSON 和 `link.sheet` 标记不能代替 Network 的实际响应内容、真实浏览器完整构建版本、OS/设备、键盘/系统偏好实测，也不能单凭静态 PASS 宣称完整浏览器支持。**新比较器与离线测试已编写，尚未经过维护者 Windows 的完整测试**。详见 [MVP 本地交付清单](../MVP_0_0_1_HANDOFF.md)。

### 3.3 CSSOM 内容核验防误判（最新开发补丁）

之前 `packageStylesheet.loaded === true` 仅表示 DOM 中的 `link.sheet` 存在，**空 CSS 或错误 CSS 也可能被标记已挂载**；尤其在浏览器 UA 本身就有正确 `bolder` 时，T0/T2 即使零差异也不足以证明真实 R-003 规则已经进入页面。

现在本地 Fixture 的 T2 探针额外记录从**同源 CSSOM** 读取的规则数组：规则类型、选择器、`font-weight` 值、声明数量、声明优先级。离线比较器要求**恰好一条普通 `b,strong {font-weight:bolder}` 规则，无 `!important` 和额外声明**；如果样式表虽已挂载但规则为空、规则错误或 CSSOM 不可访问，则返回 `STYLESHEET_CONTENT_MISMATCH`（退出码 1），而非 `PROBE_PASS`。旧版未带 CSSOM `rules` 字段的 JSON 会按证据不足拒绝（退出码 2），需要从更新后的 Fixture 重新导出。

这个补丁**不触及产品 CSS 或最终包文件**。CSSOM 可验证浏览器解析后的规则形态，**不能替代 Network 对响应来源和原始字节的核验**，也不代表目标浏览器实机运行已经通过。本轮仍等待维护者最终 Windows/浏览器统一验收。

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
