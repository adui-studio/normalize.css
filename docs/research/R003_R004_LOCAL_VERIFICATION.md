# R-003 / R-004 最低版本本地验证执行指南

- **状态**：维护者已在 Chrome 156 实测 T0/T1（`NO_COMPUTED_DIFFERENCE`），并用 Browser Workshop 启动 Chrome for Testing 120.0.6099.109，上传的两份原始 JSON 已独立核对出 **4 组计算字重差异**；详见[运行记录](LOCAL_BROWSER_RUN_20261104.md)。**Edge 120、Safari 17.2 与移动端仍未测试**。
- **日期**：2026-11-03
- **关联**：[R-003 / R-004 证据卡](RULE_EVIDENCE_R003_R004.md) · [Baseline 2023 最低测试目标](BASELINE_2023_MAPPING.md) · [浏览器矩阵](BROWSER_REVIEW.md) · [Issue #2](https://github.com/adui-studio/normalize.css/issues/2) · [Issue #3](https://github.com/adui-studio/normalize.css/issues/3)
- **约束**：维护者已授权开发；Vite+ 是开发工具链（[ADR-0005](../adr/0005-viteplus-toolchain.md)）；检查仅在**本地手动运行，不增加 CI**。

## 1. 目标版本的官方获取线索（并不代表环境已经具备）

| 目标环境                                 | 官方路径与版本依据                                                                                                                                                                                                               | 本次验证状态                       | 使用限制                                                                     |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| Chrome 120（桌面）                       | [Chrome for Testing 官方版本目录](https://github.com/GoogleChromeLabs/chrome-for-testing/blob/main/data/latest-versions-per-milestone-with-downloads.json) 的 milestone 120 提供 `120.0.6099.109`，含 Windows、macOS、Linux 构建 | **已取得 T0/T1 JSON；差异 4 组**   | 记录实际完整版本；CfT 不等于已经覆盖普通 Chrome 用户配置                     |
| Edge 120（桌面）                         | 已接受最低测试目标 120；当前**没有验证可用的官方旧版 Edge 离线发行物**                                                                                                                                                           | **环境待确认**                     | 不能直接把 CfT 120 的结果当成 Edge 120 实测                                  |
| Firefox 121（桌面）                      | [Mozilla 官方 Firefox 121.0 发行归档](https://archive.mozilla.org/pub/firefox/releases/121.0/) 提供各系统目录与校验清单                                                                                                          | **已实测 T0/T1，零差异**           | 历史安装包应核对来源与校验值，不覆盖正常浏览器用户配置                       |
| Safari 17.2（macOS）                     | [Apple 官方发布说明](https://developer.apple.com/documentation/safari-release-notes/safari-17_2-release-notes) 记载 2023-12-11，版本 `17.2 (19617.1.17)`；适用 Sonoma、Ventura、Monterey                                         | **无真实 Safari 17.2 测试记录**    | 必须记录真实 Safari 完整版本、macOS 版本及构建号；Playwright WebKit 不能替代 |
| Chrome Android 120 / Firefox Android 121 | Baseline 固定映射已批准为测试目标                                                                                                                                                                                                | **缺少历史版本设备与官方包源核验** | 仅桌面 UA 相同不等于 Android 已通过；记录 Android 版本、设备和浏览器构建     |
| Safari iOS 17.2                          | Apple 发布说明确认 iOS 17.2 平台                                                                                                                                                                                                 | **无真实 iOS 17.2 设备测试**       | 必须记录 iOS/设备/浏览器构建；macOS Safari 构建号不可直接套用到 iOS          |

**安全注意**：2023 年的浏览器早已不再是当前安全版本。将来的旧版复现应在隔离的、本地离线 Fixture 环境中进行，不登录真实账号、不访问不可信外网、不覆盖日常默认浏览器。此处不包含下载安装命令。

### 1.1 无虚拟机的 Windows 本机验证（待执行）

维护者目前没有虚拟机。对 Chrome 120 可采用**官方 Chrome for Testing (CfT) 历史版解压目录 + 独立浏览器配置目录 + 暂时断开电脑外网**的本地复现方式，不需覆盖日常 Chrome，也不新增测试依赖。这是**在真实 Windows 宿主运行旧浏览器**，不能冒充虚拟机/沙箱隔离。

**安全门槛**：Chrome 120 不再自动接收修复，Chromium [安全 FAQ](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/security/faq.md) 明确警告不可用 CfT 旧版访问不可信网站。优先在下载完成后临时断开 Wi-Fi、以太网及 VPN 的外部连接，再运行旧版浏览器；本地 `localhost` 通常仍可访问。若无法让外网断开，**不要把独立 profile 或拒绝连接的代理视为安全隔离**；可以标记 `BLOCKED` 并先继续其他研究。不得加入 `--no-sandbox` 或 `--disable-web-security`；禁止访问真实账号、外部网站或加载任何第三方资源。

浏览器下载地址来自 [Chrome for Testing 固定 milestone 120 的官方 JSON](https://github.com/GoogleChromeLabs/chrome-for-testing/blob/main/data/latest-versions-per-milestone-with-downloads.json)，对应 Windows x64 为 `120.0.6099.109`。先在联网状态下，仅下载并解压（PowerShell；不会修改现有 Chrome）：

```powershell
$version = "120.0.6099.109"
$root = Join-Path $env:LOCALAPPDATA "adui-normalize-browser-tests\chrome-120"
$zip = Join-Path $root "chrome-win64.zip"
New-Item -ItemType Directory -Force -Path $root | Out-Null

Invoke-WebRequest -Uri "https://storage.googleapis.com/chrome-for-testing-public/$version/win64/chrome-win64.zip" -OutFile $zip
Expand-Archive -Path $zip -DestinationPath $root -Force

$chrome = Join-Path $root "chrome-win64\chrome.exe"
if (-not (Test-Path $chrome)) { throw "Chrome for Testing executable not found" }
Get-FileHash -Path $zip -Algorithm SHA256
& $chrome --version
```

`Get-FileHash` 只生成下载文件的本地指纹，**不等于已与官方校验值比对**。实际版本仍应从运行后的 `chrome://version` 记录。下载目录位于 `LOCALAPPDATA`，不在项目仓库内；不要提交浏览器二进制或 profile。

在已启动 `vp dev`、外网已暂时断开后，从另一终端执行：

```powershell
$root = Join-Path $env:LOCALAPPDATA "adui-normalize-browser-tests\chrome-120"
$chrome = Join-Path $root "chrome-win64\chrome.exe"
if (-not (Test-Path $chrome)) { throw "Chrome for Testing executable not found" }
$profile = Join-Path $root "r003-profile"
$chromeArgs = @(
  "--user-data-dir=$profile"
  "--no-first-run"
  "--no-default-browser-check"
  "--disable-extensions"
  "--disable-background-networking"
  "--proxy-server=http://127.0.0.1:9"
  "http://localhost:5173/fixtures/r003-native.html"
)
& $chrome @chromeArgs
```

此处的无响应代理仅作为附加限制：Chromium 对 `localhost` 有[隐式代理绕过规则](https://chromium.googlesource.com/chromium/src/+/HEAD/net/docs/proxy.md)，所以本地 Fixture 应仍可直接访问；**代理参数本身不等于禁用所有网络访问**，真实外网断开更重要。保持浏览器原有 sandbox，不安装扩展，不绑定个人 Chrome profile。

进入 T0、T1 页面后，确认 `document.documentElement.dataset.probeStatus === "complete"`。各自通过 DevTools Console 导出 JSON（同样脚本分别执行两次；自动按页面生成文件名）：

```js
(() => {
  const data = JSON.parse(document.querySelector("#probe-output").textContent);
  const name = location.pathname.endsWith("r003-native.html")
    ? "r003-native-120.json"
    : "r003-candidate-120.json";
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
})();
```

T1 地址：`http://localhost:5173/fixtures/r003-candidate.html`。文件放在本机 Downloads 或临时目录，不加入公开仓库。浏览器关闭后恢复电脑网络，再运行现有比较器（路径按实际下载位置调整）：

```powershell
$native = Join-Path $HOME "Downloads\r003-native-120.json"
$candidate = Join-Path $HOME "Downloads\r003-candidate-120.json"
node tests/r003-evidence.mjs $native $candidate
```

**验收与限制**：记录 `chrome://version` 的完整版本、操作系统、原生与候选的六组计算字重、比较器输出及浏览器 UA 样式来源。**本次维护者已经在 Chrome 120 实测 T0/T1**：父级 600/700 时 T0=700、T1=900，共四个计算值差异；但自动比较 CLI 的实际终端输出、UA 来源、字体真实渲染仍待补充。Edge 120、Firefox 121、Safari 17.2 和移动端均需要各自独立验证。

### 1.2 Browser Workshop v1.0.0 实测注意事项

维护者在 Windows 上使用 `E:\bws\bws.exe` 导入并启动 Chrome for Testing 120.0.6099.109，版本页截图确认独立 BWS Profile；R-003 T0/T1 已成功访问，原始 JSON 已交付（[结果与指纹](LOCAL_BROWSER_RUN_20261104.md)）。

**命令行问题**：本次截图顶部出现 `--disable-extensions`、`--disable-background-networking`、`--proxy-server=...` 三个浏览器标签；版本页的命令行也有 URL 后跟 `--` 的痕迹。它们似乎被 BWS 作为**网页地址**传递，不能据此认为这些开关已生效。后续优先使用最简单、可复现的 BWS 启动命令，不传原生开关：

```powershell
cd E:\bws
.\bws.exe r chrome@120 "http://localhost:5173/fixtures/r003-native.html" --profile r003
```

T1 使用同一个 Chrome 120 窗口手工访问 `http://localhost:5173/fixtures/r003-candidate.html`。若要真正限定旧版浏览器的外网暴露，**先由操作系统临时断开外网，仅保留 localhost 测试**；BWS Profile 隔离与这些浏览器参数不构成虚拟机或沙箱。不要访问不可信网站、不要关闭 Chrome Sandbox，不使用指纹伪装以免影响真实 UA 取证。

### 1.3 Firefox 121.0：Browser Workshop 已验证（2026-11-04）

维护者在 Windows 上以 Firefox 121.0 完成 R-003 T0/T1 采集，运行 `node tests/r003-evidence.mjs` 得到 `NO_COMPUTED_DIFFERENCE`、`differences: 0`、`candidateFailures: 0`。六组 T0/T1 计算值一致：父级 400 对应 700，父级 600/700 对应 900；字号均为 16px，字体族为 `sans-serif`。详见[本机验证记录 §2.4](LOCAL_BROWSER_RUN_20261104.md)。维护者另外提供的 `about:support` JSON 确认 `buildID: 20231211174248`（release）；UA 样式声明来源和实际字形尚未验证。

官方来源：[Mozilla Firefox 121.0 Windows 64-bit 发行归档](https://ftp.mozilla.org/pub/firefox/releases/121.0/win64/en-US/) 与 [SHA256SUMS](https://ftp.mozilla.org/pub/firefox/releases/121.0/SHA256SUMS)。其他 Windows 电脑需要复测时，先尝试 Browser Workshop v1.0.0 官方 Firefox 源：

```powershell
cd E:\bws
.\bws.exe ls -R firefox@121
.\bws.exe i firefox@121.0
.\bws.exe show firefox@121.0
```

如果远程源解析失败，可从官方归档下载 Firefox 121 安装包并核对 SHA-256，再尝试 `.\bws.exe i --from-file "E:\bws\downloads\Firefox Setup 121.0.exe" firefox@121.0`。BWS 能否直接解析该 NSIS 安装器尚未验证；不可将旧安装器直接运行到日常系统 Firefox 目录。

运行仓库 `vp dev` 后，暂时断开外网，只访问本地页面：

```powershell
cd E:\bws
.\bws.exe r firefox@121.0 "http://localhost:5173/fixtures/r003-native.html" --profile r003-ff121
```

在同一个 Firefox 版本与 Profile 中打开 `http://localhost:5173/fixtures/r003-candidate.html`，分别从 `#probe-output` 导出 T0/T1 JSON，关闭浏览器、恢复网络后执行：

```powershell
$native = Join-Path $HOME "Downloads\r003-native-ff121.json"
$candidate = Join-Path $HOME "Downloads\r003-candidate-ff121.json"
node tests/r003-evidence.mjs $native $candidate
```

禁止指纹伪造、关闭 Sandbox 或在旧浏览器登录账号；BWS Profile 不构成系统级隔离。Firefox 121 结果不能代替 Android Firefox、Edge 或 Safari 的独立证据。

## 2. R-003：最低版本的观测设计

沿用 [证据卡 §2.4](RULE_EVIDENCE_R003_R004.md) 的最小 HTML 结构和仅控制父级字体粗细的 Fixture 样式，**不要将 Fixture 样式与待审查的 Normalize 修复混为一谈**。

### 三类输入

1. **T0 原生对照**：不加载任何 Normalize 或第三方 Reset，仅设置用于复现的父级粗细 400、600、700。
2. **T1 单规则候选**：与 T0 完全相同，仅额外加入待评审的 `b, strong { font-weight: bolder; }`（只在获准开发/测试后执行；本轮不创建 CSS 文件）。
3. **T2 集成对照**：将来使用实际发布候选的默认 Normalize 入口，在 Vue/React 与选定 UI 组件库/Reset 场景重测。当前没有 CSS 产物，**T2 不可运行**。

### 观测对象及预期（来源推导，非运行结果）

| 父级计算粗细 | 旧 UA `bold` 理论结果 | 标准 `bolder` 理论结果 | 差异           |
| ------------ | --------------------- | ---------------------- | -------------- |
| 400          | 700                   | 700                    | 无（基础对照） |
| 600          | 700                   | 900                    | **关键断点**   |
| 700          | 700                   | 900                    | **关键断点**   |

对于 `b`、`strong` 分别记录：

- DevTools _Styles_ 中来源于 UA 还是作者声明、当前 `font-weight` 的获胜规则；
- DevTools _Computed_ 中的计算粗细数值，父级对应数值；
- 在真实可变字体/具备 900 字重字体环境下的视觉对照。**计算值 900 不证明设备实际渲染了 900 字体文件**；
- 双重嵌套（例如 `strong` 内再嵌套 `strong`）以及用户明确设置 `font-weight: normal` 时的覆盖行为；
- 兼容性问题是否涉及 `!important`、CSS Layers、UI 组件库选择器优先级（不得为了“修复”添加全局重要性覆盖）。

任何版本行为与预期不符时，保留原始证据；不得为了符合研究假设而调整记录。

## 3. R-004：尊重用户等宽字号偏好

使用 [证据卡 §3.4](RULE_EVIDENCE_R003_R004.md) 的 `code/kbd/samp/pre` 内容，分别观察默认等宽字号偏好，以及浏览器允许的**用户自定义等宽字体字号**。若某浏览器不提供可操作的独立字号偏好，标记为“未能验证”，不得臆造设置界面。

对照 T0 原生 UA，及未来仅供**风险评估**的候选 `font-size: 1em`、`monospace, monospace`。记录 `font-family`、`font-size` 计算值、CJK/符号回退字体及用户设置生效情况。

**产品决策不变**：首版默认入口不添加 R-004 的统一字号或强制字体栈，不应仅凭这些候选在竞品中存在而将其准入。

## 3.1 2026-11-04 追加诊断：单一等宽字体族与独立字号偏好

维护者在 Chrome 156、Windows 的 R-004 T1 DevTools 中核验：`document.readyState === "complete"`、`#risk-review-only` 存在、其 CSSOM 确实含 `code, kbd, samp, pre { font-size: 1em; }`；父级字号为 `16px`，当前计算字号与探针记录均为 `13px`。因此**已排除“样式节点不存在”和“探针读取后字号才变更”这两种解释**；尚未核验 DevTools Styles 的获胜声明及各设置的具体原因。

外部依据：

- [MDN font-family — Monospace font size](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-family#monospace_font_size)：浏览器常使用不同的普通文字和等宽文字默认字号；单独指定 `monospace` 可触发等宽字号偏好，`monospace, monospace` 会绕过这项机制。**绕过用户偏好是风险，不是默认 Normalize 的当然目标。**
- [Chromium Blink FontBuilder](https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink/renderer/core/css/resolver/font_builder.cc)：字体族切换及等宽字体尺寸存在专门的计算路径；不能仅凭源码推断所有浏览器版本的确切数值。

为避免同时更改多个变量，新增三个明确分离的对照：

| 页面                             | 测试 CSS                                                                    | 作用                 |
| -------------------------------- | --------------------------------------------------------------------------- | -------------------- |
| `r004-native.html`（T0）         | 无作者字号/字体族规则                                                       | 原生对照             |
| `r004-risk-review.html`（T1）    | `font-size: 1em`                                                            | 原有单声明风险对照   |
| `r004-family-review.html`（T1b） | 与 T1 相同的 `font-size: 1em`，**额外** `font-family: monospace, monospace` | 隔离重复字体族的影响 |

T1b **不属于已批准的发布规则、不改变 R-004 默认排除决定**。维护者已在 **Chrome 156** 实测并提供截图：T0/T1 中四个元素均为 **13px**，T1b 均为 **16px**，`fontFamily` 为 `monospace, monospace`。**Firefox 121** 的 PowerShell JSON 表格进一步显示 T0/T1/T1b 四元素均为 **16px**，T1b 仅字体族发生变化；三个 Firefox 原始 JSON 尚未上传。见[运行记录 §3.2 与 §3.2.1](LOCAL_BROWSER_RUN_20261104.md)。这些结果只证明各自环境的计算样式；用户独立等宽字号配置、Chrome 120、Safari、移动端及 CJK 字形回归仍未验证。

## 4. 逐次执行记录模板（开发后使用）

| 字段                         | 必填内容                                                       |
| ---------------------------- | -------------------------------------------------------------- |
| 规则 ID / Fixture / 运行日期 | R-003 或 R-004；T0/T1/T2；实际时间                             |
| 浏览器及构建号               | 名称、**完整版本**、是否为 CfT/官方发行版、实验特性是否开启    |
| OS / 设备 / 宿主             | macOS、Windows、Linux、Android、iOS 完整版本和必要设备标识     |
| 测试环境                     | 本地离线 Fixture 位置、字体、浏览器独立偏好设置、来源/校验情况 |
| 输入                         | 原生/候选/集成，父级粗细，CSS 导入顺序；涉及的所有作者 CSS     |
| 观察结果                     | DevTools Styles/Computed 数值，实际渲染差异，截图或必要日志    |
| 结果状态                     | `PASS` / `FAIL` / `BLOCKED` / `NOT_RUN`（不能用空白代表通过）  |
| 问题和复现信息               | 与预期不一致的最小条件、复现频次、版本、回退方案               |
| 审核结论                     | 是否证明 UA 差异仍存在，是否可归入默认 Normalize，以及下一步   |

所有环境各自独立记录；**不允许**以 Chrome 120 测试替代 Edge 120、以桌面 Chrome 替代 Android Chrome、以 Playwright WebKit 替代 Safari 17.2。

## 5. R-003 T0/T1 JSON 比较器（Chrome 120、Firefox 121 已实测）

维护者授权开发后，已在独立 PR #9 实现 `tests/r003-evidence.mjs`。在**同一真实浏览器**分别打开 `/fixtures/r003-native.html`（T0）与 `/fixtures/r003-candidate.html`（T1），将各自 `probe-output` 中显示的完整 JSON 保存为本地临时文件（**原始环境标识数据不直接提交公开仓库**），再执行：

```sh
node tests/r003-evidence.mjs r003-native.json r003-candidate.json
```

该比较器验证 UA 字符串相同、页面身份、六个测量元素、父级字重 400/600/700、计算字重，以及两个输入的字号/字体家族一致性。结果分为：

| 结果                           | 含义                                  | 注意                            |
| ------------------------------ | ------------------------------------- | ------------------------------- |
| `COMPUTED_DIFFERENCE_OBSERVED` | T0/T1 有计算字重差异，T1 达到候选预期 | **不是** UA 源头/实际渲染已验证 |
| `NO_COMPUTED_DIFFERENCE`       | 两者计算字重一致，T1 达到预期         | **不是** 旧版兼容性已通过       |
| `CANDIDATE_MISMATCH`           | T1 没有达到候选的预期计算值           | 需定位 CSS 获胜规则、采集条件   |
| 输入拒绝                       | 记录不完整、UA/字体上下文不一致       | 不得把无效样本记为通过          |

CLI 退出状态码：`0` 为输入有效且 T1 满足预期，`1` 为候选不符，`2` 为输入不合法。比较器此前已用合成证据覆盖关键输入校验；维护者近期完整离线 Node 23/23 PASS。2026-11-04 维护者实际运行 Chrome 156 T0/T1 JSON 比较，得到 `NO_COMPUTED_DIFFERENCE`，详见[记录 §2.1](LOCAL_BROWSER_RUN_20261104.md)；**Chrome 120、Firefox 121 已有真实运行证据，Edge 120、Safari 17.2 与移动端仍待实测**。UA 字符串存在版本简化风险，实际完整版本/OS/DevTools UA 声明来源及字形渲染仍需独立记录。

## 6. 2026-11-04 首轮实际观察

[首次 Vite+ / Chrome 156 本地运行记录](LOCAL_BROWSER_RUN_20261104.md) 已转录 R-003 六组计算字重无差异与 R-004 13px/16px 的异常对照；Chrome 156 不属于 Chrome 120 最低测试目标，不能代替历史浏览器。R-004 T1 的 CSSOM 与当前计算值已由维护者复核，T1b 还观察到 16px；具体获胜样式和用户等宽字号偏好仍需单独验证，不可据此准入候选。R-003 Chrome 156 的 JSON 自动比较已完成，仅证明该环境六组字重无差异。

## 7. 执行与规则准入门槛

- 证据来源的固定 SHA 和确切发行版本是两种不同证据；不能直接从源码推定所有 OS/设备表现。
- 先跑 T0，证明真实问题；再在相同条件跑 T1；最后才进行 T2 和 UI 生态回归。
- R-003 的最小修复只有在目标旧版真实复现、且 T1 对原生语义/组件库不存在重大回归时，才能提交规则准入评审。
- R-004 当前是**低侵入的排除决定**；如需改变，应提新规则提案，不能静默修改。
- 如果旧版环境无法获取，标记 `BLOCKED`；在支持目标未修订或缺少替代证据时，不能宣称兼容验证通过。
- 维护者已在 Windows 本机完成 Vite+ 运行及 Chrome 120、Firefox 121 的 R-003 局部真实测试；完整最低目标矩阵仍未完成。**不得新增 CI**，也不得以 Chrome 156 或合成数据代替最低版本兼容性证明。
