# Baseline 2023 浏览器版本映射：固定数据核查

- **日期**：2026-11-03
- **状态**：**数据和时间线已核查；核心版本获维护者批准作为最低测试目标；本项目浏览器实测未执行，正式兼容性声明未发布**
- **关联**：[ADR-0004 Accepted](../adr/0004-browser-support-policy.md) · [W-01](../plans/MVP_IMPLEMENTATION_PLAN.md) · [浏览器矩阵](BROWSER_REVIEW.md) · [Issue #2](https://github.com/adui-studio/normalize.css/issues/2)

## 1. 一手数据来源

- 维护方：W3C WebDX Community Group 项目 [baseline-browser-mapping](https://github.com/web-platform-dx/baseline-browser-mapping)。
- 本次锁定的上游 Git 提交：[f0a635b134cdeef3b82804a057bcb96796d42a2f](https://github.com/web-platform-dx/baseline-browser-mapping/commit/f0a635b134cdeef3b82804a057bcb96796d42a2f)，提交时间 2026-11-02 22:56:31 UTC。
- 数据文件：[static/all_versions_array_with_supports.json](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/static/all_versions_array_with_supports.json)。
- 版本对应数据与函数说明：[源代码](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/src/index.ts) 与 [README](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/README.md)。
- 本次源码包 `package.json` 声明版本 **2.11.35**。
- **核查方法**：最初从静态数组按 `year >= 2023` 提取结果；本轮进一步读取同一 SHA 的 [`src/data/timeline.js`](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/src/data/timeline.js) 与 [`src/index.ts`](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/src/index.ts)，按照 `targetYear:2023` 对应的 **2023-12-31** 截止时间，选择七个核心浏览器当时最后一条生效的版本记录，结果与静态数组一致。**这是一项针对官方源码数据的独立核算，并非运行 npm 包的 `getCompatibleVersions()` 函数；本轮未安装包、未运行浏览器。**

## 2. 核心浏览器特性映射与已批准的最低测试目标

| 浏览器 | `targetYear:2023` 固定快照对应版本 | 首次记录发布日期 |
| --- | --- | --- |
| Chrome | **120** | 2023-12-05 |
| Chrome Android | **120** | 2023-12-05 |
| Edge | **120** | 2023-12-07 |
| Firefox | **121** | 2023-12-19 |
| Firefox Android | **121** | 2023-12-19 |
| Safari macOS | **17.2** | 2023-12-11 |
| Safari iOS | **17.2** | 2023-12-11 |

**决策状态**：维护者已确认上表七项作为首版**最低兼容性验收目标**；**不是已经实际验证通过的最低支持版本**。还须核对真实系统与设备、CSS 原生差异及规则回归。若某目标环境无法通过或无法测试，应如实标记，并在发布前明确降低支持承诺或发起新的 ADR 修订。

## 3. Apple 官方对 Safari 17.2 平台的确认

[Safari 17.2 官方发行说明](https://developer.apple.com/documentation/safari-release-notes/safari-17_2-release-notes) 明确发布日 2023-12-11，适用于 iOS 17.2、iPadOS 17.2、macOS Sonoma、macOS Monterey 与 macOS Ventura。Apple 的 [Safari 17.2 安全公告](https://support.apple.com/en-us/120300) 也明确独立浏览器更新适用于 Monterey 与 Ventura。

这只确认平台**可用性**；不能据此宣称本项目在这些 OS / 设备上通过了任何测试。真实 Safari、WKWebView 与 iOS 版本仍需区分，并记录实际构建号。

## 4. 为什么不能直接宣布已经支持这些版本

1. Baseline 衡量**特性可用性**，不是 UA 默认样式的一致性和实际可访问性。
2. `:where()` 等单项语法支持，并不代表整个 CSS 包与框架的级联规则兼容。
3. 首个 CSS 产物尚不存在，无法验证同一个选择器在 Chrome/Firefox/Safari 的影响。
4. Safari macOS 与 iOS 的最低 OS 支持前提需要另行查询官方发行说明；本轮尚未确认。
5. WebView2、Android System WebView、微信/X5 等不在七个核心家族直接映射结果之内；不能借共享引擎自动承诺兼容。
6. Playwright WebKit 与品牌 Safari 不完全等同，真实移动设备/系统版本需要显式检查。

## 5. W-01 仍需完成的工作

- [x] 固定映射数据来源与上游 SHA、记录研究日期。
- [x] 提取七个核心家族的 Baseline 2023 特性兼容映射版本。
- [x] 按同一固定上游 SHA 的 `timeline.js` 和 `targetYear:2023` 截止时间交叉核验版本映射。
- [x] 维护者同意将七项映射版本作为首版最低测试目标（**非兼容性通过**）。
- [x] 查阅 Apple 官方确认 Safari 17.2 的 macOS/iOS/iPadOS 可用平台家族。
- [ ] 如需完全复核工具库 API 行为，在获准开发/安装后以固定包版本直接运行 `getCompatibleVersions({targetYear:2023})` 并比对当前核算；本轮仅运行了对源码数据的独立检查。
- [ ] 核对实际可获得的 Safari 17.2 / iOS 17.2 / macOS Monterey、Ventura、Sonoma 测试设备、具体系统构建号，以及最小支持硬件条件。
- [ ] 明确 Firefox ESR 是否单独承诺，以及能否获取用于验证的版本。
- [ ] 确认 Android WebView / WebView2 / 微信相关容器的支持定位与测试能力。
- [ ] 逐项完成实际浏览器 UA、键盘、表单、a11y、组件库和系统偏好回归，才可冻结正式支持承诺。

**现阶段 W-01 已完成版本目标决策与官方数据核查，但尚无目标浏览器/OS 的兼容实测；不得关闭 [Issue #2](https://github.com/adui-studio/normalize.css/issues/2)。**
