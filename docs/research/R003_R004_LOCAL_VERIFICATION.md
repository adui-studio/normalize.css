# R-003 / R-004 最低版本本地验证执行指南

- **状态**：维护者已在 Chrome 156 实测 T0/T1 Fixture，且 R-003 原始 JSON 自动比较得到 `NO_COMPUTED_DIFFERENCE`；详见[运行记录](LOCAL_BROWSER_RUN_20261104.md)。**最低目标旧版浏览器及移动端仍未测试**。
- **日期**：2026-11-03
- **关联**：[R-003 / R-004 证据卡](RULE_EVIDENCE_R003_R004.md) · [Baseline 2023 最低测试目标](BASELINE_2023_MAPPING.md) · [浏览器矩阵](BROWSER_REVIEW.md) · [Issue #2](https://github.com/adui-studio/normalize.css/issues/2) · [Issue #3](https://github.com/adui-studio/normalize.css/issues/3)
- **约束**：维护者已授权开发；Vite+ 是开发工具链（[ADR-0005](../adr/0005-viteplus-toolchain.md)）；检查仅在**本地手动运行，不增加 CI**。

## 1. 目标版本的官方获取线索（并不代表环境已经具备）

| 目标环境                                 | 官方路径与版本依据                                                                                                                                                                                                               | 本次验证状态                       | 使用限制                                                                     |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| Chrome 120（桌面）                       | [Chrome for Testing 官方版本目录](https://github.com/GoogleChromeLabs/chrome-for-testing/blob/main/data/latest-versions-per-milestone-with-downloads.json) 的 milestone 120 提供 `120.0.6099.109`，含 Windows、macOS、Linux 构建 | **仅核对索引，未下载/运行**        | 记录实际完整版本；CfT 不等于已经覆盖普通 Chrome 用户配置                     |
| Edge 120（桌面）                         | 已接受最低测试目标 120；当前**没有验证可用的官方旧版 Edge 离线发行物**                                                                                                                                                           | **环境待确认**                     | 不能直接把 CfT 120 的结果当成 Edge 120 实测                                  |
| Firefox 121（桌面）                      | [Mozilla 官方 Firefox 121.0 发行归档](https://archive.mozilla.org/pub/firefox/releases/121.0/) 提供各系统目录与校验清单                                                                                                          | **仅核对归档目录，未下载/运行**    | 历史安装包应核对来源与校验值，不覆盖正常浏览器用户配置                       |
| Safari 17.2（macOS）                     | [Apple 官方发布说明](https://developer.apple.com/documentation/safari-release-notes/safari-17_2-release-notes) 记载 2023-12-11，版本 `17.2 (19617.1.17)`；适用 Sonoma、Ventura、Monterey                                         | **无真实 Safari 17.2 测试记录**    | 必须记录真实 Safari 完整版本、macOS 版本及构建号；Playwright WebKit 不能替代 |
| Chrome Android 120 / Firefox Android 121 | Baseline 固定映射已批准为测试目标                                                                                                                                                                                                | **缺少历史版本设备与官方包源核验** | 仅桌面 UA 相同不等于 Android 已通过；记录 Android 版本、设备和浏览器构建     |
| Safari iOS 17.2                          | Apple 发布说明确认 iOS 17.2 平台                                                                                                                                                                                                 | **无真实 iOS 17.2 设备测试**       | 必须记录 iOS/设备/浏览器构建；macOS Safari 构建号不可直接套用到 iOS          |

**安全注意**：2023 年的浏览器早已不再是当前安全版本。将来的旧版复现应在隔离的、本地离线 Fixture 环境中进行，不登录真实账号、不访问不可信外网、不覆盖日常默认浏览器。此处不包含下载安装命令。

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

T1b **不属于已批准的发布规则、不改变 R-004 默认排除决定**。维护者已在 **Chrome 156** 实测并提供截图：T0/T1 中四个元素均为 **13px**，T1b 均为 **16px**，T1b 的 `fontFamily` 均为 `monospace, monospace`；当前值与探针记录一致。详见 [运行记录 §3.2](LOCAL_BROWSER_RUN_20261104.md)。这只证明本次环境的计算样式差异；用户独立等宽字号配置、其他目标浏览器和 CJK 字形回归仍未验证。

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

## 5. R-003 T0/T1 JSON 比较器（已获 Chrome 156 证据，最低目标未测）

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

CLI 退出状态码：`0` 为输入有效且 T1 满足预期，`1` 为候选不符，`2` 为输入不合法。比较器此前已用合成证据覆盖关键输入校验；维护者近期完整离线 Node 23/23 PASS。2026-11-04 维护者实际运行 Chrome 156 T0/T1 JSON 比较，得到 `NO_COMPUTED_DIFFERENCE`，详见[记录 §2.1](LOCAL_BROWSER_RUN_20261104.md)；**Chrome/Edge 120、Firefox 121、Safari 17.2 仍无真实运行证据**。UA 字符串存在版本简化风险，实际完整版本/OS/DevTools UA 声明来源及字形渲染仍需独立记录。

## 6. 2026-11-04 首轮实际观察

[首次 Vite+ / Chrome 156 本地运行记录](LOCAL_BROWSER_RUN_20261104.md) 已转录 R-003 六组计算字重无差异与 R-004 13px/16px 的异常对照；Chrome 156 不属于 Chrome 120 最低测试目标，不能代替历史浏览器。R-004 T1 的 CSSOM 与当前计算值已由维护者复核，T1b 还观察到 16px；具体获胜样式和用户等宽字号偏好仍需单独验证，不可据此准入候选。R-003 Chrome 156 的 JSON 自动比较已完成，仅证明该环境六组字重无差异。

## 7. 执行与规则准入门槛

- 证据来源的固定 SHA 和确切发行版本是两种不同证据；不能直接从源码推定所有 OS/设备表现。
- 先跑 T0，证明真实问题；再在相同条件跑 T1；最后才进行 T2 和 UI 生态回归。
- R-003 的最小修复只有在目标旧版真实复现、且 T1 对原生语义/组件库不存在重大回归时，才能提交规则准入评审。
- R-004 当前是**低侵入的排除决定**；如需改变，应提新规则提案，不能静默修改。
- 如果旧版环境无法获取，标记 `BLOCKED`；在支持目标未修订或缺少替代证据时，不能宣称兼容验证通过。
- 维护者已在 Windows 本机完成 Vite+ 运行及 Chrome 156 的部分真实浏览器测试；最低目标版本仍未执行。**不得新增 CI**，也不得以 Chrome 156 或合成数据代替最低版本兼容性证明。
