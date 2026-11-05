# Baseline 2023 浏览器版本映射：固定数据核查

- **日期**：2026-11-03
- **状态**：**数据和时间线已核查；核心版本获维护者批准作为最低测试目标；本项目浏览器实测未执行，正式兼容性声明未发布**
- **关联**：[ADR-0004 Accepted](../adr/0004-browser-support-policy.md) · [W-01](../plans/MVP_IMPLEMENTATION_PLAN.md) · [浏览器矩阵](BROWSER_REVIEW.md) · [Issue #2](https://github.com/adui-studio/normalize.css/issues/2)

## W-01 维护者验收补记（2026-11-05）

维护者在项目会话明确反馈“已经核实完了，验证过了”。**按该确认，将 W-01 的 Baseline 2023 版本映射、历史系统/设备来源研究及核心/条件性宿主分层视作维护者已验收的研究交付**，由 [Issue #2](https://github.com/adui-studio/normalize.css/issues/2) 记录结项。本确认不代表本工具独立运行了旧版浏览器，也不意味着仓库已经收到七个目标环境的完整版本、OS、设备、T0/T2 原始附件。

**验收边界**：本文件的固定版本和厂商资料保持原有来源等级；此前未能核实的 Edge 120 历史安装条件、具体可用设备和 WebView/ESR 测试数据不得凭本句补成事实。正式最低浏览器兼容承诺仍受 [W-07 #8 / P-05](https://github.com/adui-studio/normalize.css/issues/8) 的逐环境证据或另行批准的 ADR 修订约束；W-01 研究结项并不自动解除公开发行门禁。

## 1. 一手数据来源

- 维护方：W3C WebDX Community Group 项目 [baseline-browser-mapping](https://github.com/web-platform-dx/baseline-browser-mapping)。
- 本次锁定的上游 Git 提交：[f0a635b134cdeef3b82804a057bcb96796d42a2f](https://github.com/web-platform-dx/baseline-browser-mapping/commit/f0a635b134cdeef3b82804a057bcb96796d42a2f)，提交时间 2026-11-02 22:56:31 UTC。
- 数据文件：[static/all_versions_array_with_supports.json](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/static/all_versions_array_with_supports.json)。
- 版本对应数据与函数说明：[源代码](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/src/index.ts) 与 [README](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/README.md)。
- 本次源码包 `package.json` 声明版本 **2.11.35**。
- **核查方法**：最初从静态数组按 `year >= 2023` 提取结果；本轮进一步读取同一 SHA 的 [`src/data/timeline.js`](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/src/data/timeline.js) 与 [`src/index.ts`](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/src/index.ts)，按照 `targetYear:2023` 对应的 **2023-12-31** 截止时间，选择七个核心浏览器当时最后一条生效的版本记录，结果与静态数组一致。**这是一项针对官方源码数据的独立核算，并非运行 npm 包的 `getCompatibleVersions()` 函数；本轮未安装包、未运行浏览器。**

## 2. 核心浏览器特性映射与已批准的最低测试目标

| 浏览器          | `targetYear:2023` 固定快照对应版本 | 首次记录发布日期 |
| --------------- | ---------------------------------- | ---------------- |
| Chrome          | **120**                            | 2023-12-05       |
| Chrome Android  | **120**                            | 2023-12-05       |
| Edge            | **120**                            | 2023-12-07       |
| Firefox         | **121**                            | 2023-12-19       |
| Firefox Android | **121**                            | 2023-12-19       |
| Safari macOS    | **17.2**                           | 2023-12-11       |
| Safari iOS      | **17.2**                           | 2023-12-11       |

**决策状态**：维护者已确认上表七项作为首版**最低兼容性验收目标**；**不是已经实际验证通过的最低支持版本**。还须核对真实系统与设备、CSS 原生差异及规则回归。若某目标环境无法通过或无法测试，应如实标记，并在发布前明确降低支持承诺或发起新的 ADR 修订。

## 3. Apple 官方对 Safari 17.2 平台的确认

[Safari 17.2 官方发行说明](https://developer.apple.com/documentation/safari-release-notes/safari-17_2-release-notes) 明确发布日 2023-12-11，适用于 iOS 17.2、iPadOS 17.2、macOS Sonoma、macOS Monterey 与 macOS Ventura。Apple 的 [Safari 17.2 安全公告](https://support.apple.com/en-us/120300) 也明确独立浏览器更新适用于 Monterey 与 Ventura。

Apple 还在同一 [Safari 17.2 发行说明](https://developer.apple.com/documentation/safari-release-notes/safari-17_2-release-notes) 标明桌面 Safari 17.2 版本标识为 **19617.1.17**。这只确认官方发布信息和平台**可用性**；不能据此宣称本项目在这些 OS / 设备上通过了测试。真实 Safari、WKWebView 与 iOS 版本仍需区分，**不能将桌面 Safari 版本标识直接当成 iOS 的完整构建号**。

Chrome 120 和 Firefox 121 的官方历史版本获取线索及测试边界另见 [本地验证执行指南](R003_R004_LOCAL_VERIFICATION.md)；本轮未下载或执行浏览器。

## 3.1 2026-11-05 · 七项目标的历史系统与设备条件（厂商资料核查）

**范围**：本节只确认指定历史浏览器版本的系统或设备安装前提，**不等于本库 CSS 已在该环境实测**，也不更改 WebDX 固定的七项目标。

| 最低测试目标        | 已核对的厂商资料（与实际测试分离）                                                                                                                                                                                                                                                                                                     | 真实项目验证                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Chrome 桌面 120     | [Google Chrome 兼容时间线](https://support.google.com/chrome/a/answer/7100626?hl=en) 指明 Windows 7/8/8.1 最后支持 Chrome 109；Windows 10/11 可作为 120 的候选测试系统。该页面持续更新，**不能用当前 macOS/Linux 要求推断 120 的历史最低系统**。                                                                                       | Windows 11 的 CfT 120.0.6099.109 已有局部 R-003 T0/T1；正式 CSS T2 与其他 OS 未获完整证据 |
| Edge 桌面 120       | [Microsoft Edge 支持系统](https://learn.microsoft.com/zh-cn/deployedge/microsoft-edge-supported-operating-systems) 属动态清单。Windows 10/11 是待核实的候选测试系统；**尚未找到针对 Edge 120 的固定发行时系统要求和官方旧版安装源**。                                                                                                  | 目标版本未有原始 T0/T2；不得借 Chrome 测试代替                                            |
| Firefox 桌面 121    | [Mozilla 121.0 专属系统要求](https://www.mozilla.org/en-US/firefox/121.0/system-requirements/)：Windows 10+、macOS 10.15+；Linux 另外要求 glibc 2.17+、GTK+ 3.14+ 等运行组件。                                                                                                                                                         | Windows Firefox 121 有局部 R-003 T0/T1；正式 T2 与非 Windows 仍缺                         |
| Safari macOS 17.2   | [Apple Safari 17.2 发行说明](https://developer.apple.com/documentation/safari-release-notes/safari-17_2-release-notes)：macOS Monterey、Ventura、Sonoma，桌面浏览器版本标识 19617.1.17；设备须另满足相应 macOS 安装前提。                                                                                                              | 无确认的品牌 Safari 17.2 实机与正式 T2                                                    |
| Chrome Android 120  | Google [2023 年 Chrome 支持公告](https://support.google.com/chrome/thread/243346420/sunsetting-chrome-support-for-android-7-0-nougat?hl=en) 指明 Chrome 119 是 Android 7 最后一版，**Chrome 120 要求 Android 8.0+**；[历史发布记录](https://chromereleases.googleblog.com/2023/12/chrome-for-android-update.html) 列出 120.0.6099.43。 | 无 Android 120 真机和正式 T0/T2                                                           |
| Firefox Android 121 | Mozilla [Firefox Android 121.0 专属系统要求](https://www.mozilla.org/en-US/firefox/android/121.0/system-requirements/)：**Android 5.0+**。                                                                                                                                                                                             | 无 Android 121 真机和正式 T0/T2                                                           |
| Safari iOS 17.2     | Safari 17.2 要求 iOS 17.2；Apple [iOS 17 官方发布公告](https://www.apple.com/newsroom/2023/09/ios-17-is-available-today/) 确认 iPhone XS 及以后兼容机型。iPadOS 17.2 同见 Safari 发行说明，但目前**不是第八个最低测试目标**。                                                                                                          | 无真实 iPhone/iOS 17.2 的 Safari 与正式 T0/T2                                             |

**来源时点风险**：Chrome Enterprise、Edge 系统要求文档可能随新版更新；这里只引用可追溯的历史淘汰信息，未从现行的 Mac、Android、Linux 门槛倒推 2023 年旧版要求。Firefox 121 与 Safari 17.2 的专属版本文档证据等级更直接。

**仍待完成**：Edge 120 的旧版安装系统要求与可信测试环境；桌面 Chrome 120 在其他 OS 的精确历史条件；实际可用的 Safari/iOS/Android 设备、OS 构建号及旧版浏览器隔离；Firefox ESR 和 WebView 宿主支持政策；七项目标正式 CSS T0/T2、交互及框架回归。**不能把本节标记为七项目标兼容 PASS**。

## 4. 为什么不能直接宣布已经支持这些版本

1. Baseline 衡量**特性可用性**，不是 UA 默认样式的一致性和实际可访问性。
2. `:where()` 等单项语法支持，并不代表整个 CSS 包与框架的级联规则兼容。
3. 已有唯一 R-003 的真实 CSS 产物，但尚无全部七项目标浏览器的正式 T2 原始验证；局部 T0/T1 不等于整体兼容 PASS。
4. Safari 17.2 的系统系列与 iOS 17 兼容 iPhone 范围已可查证，但实际设备和完整 OS 构建、产品 CSS 回归仍缺失。
5. WebView2、Android System WebView、微信/X5 等不在七个核心家族直接映射结果之内；不能借共享引擎自动承诺兼容。
6. Playwright WebKit 与品牌 Safari 不完全等同，真实移动设备/系统版本需要显式检查。

## 5. W-01 仍需完成的工作

- [x] 固定映射数据来源与上游 SHA、记录研究日期。
- [x] 提取七个核心家族的 Baseline 2023 特性兼容映射版本。
- [x] 按同一固定上游 SHA 的 `timeline.js` 和 `targetYear:2023` 截止时间交叉核验版本映射。
- [x] 维护者同意将七项映射版本作为首版最低测试目标（**非兼容性通过**）。
- [x] 查阅 Apple 官方确认 Safari 17.2 的 macOS/iOS/iPadOS 可用平台家族。
- [ ] 如需完全复核工具库 API 行为，在获准开发/安装后以固定包版本直接运行 `getCompatibleVersions({targetYear:2023})` 并比对当前核算；本轮仅运行了对源码数据的独立检查。
- [x] 厂商资料已核对 Firefox 121 桌面、Firefox Android 121、Chrome Android 120、Safari 17.2 的系统条件与部分设备型号边界（不代表实测）。
- [ ] 核对实际可获得的 Safari 17.2 / iOS 17.2 / macOS Monterey、Ventura、Sonoma 测试设备、具体系统构建号，以及最小支持硬件条件；Edge 120 固定系统条件仍待核实。
- [ ] 明确 Firefox ESR 是否单独承诺，以及能否获取用于验证的版本。
- [ ] 确认 Android WebView / WebView2 / 微信相关容器的支持定位与测试能力。
- [ ] 逐项完成实际浏览器 UA、键盘、表单、a11y、组件库和系统偏好回归，才可冻结正式支持承诺。

**2026-11-05 当前结项口径**：维护者已确认 W-01 研究核实与验证完成，Issue #2 按**版本/系统边界研究交付**归档；上方未勾选的逐环境设备取证和发布验证项目保留为历史缺口，统一转入 W-07 #8/P-05，不代表自动 PASS。
