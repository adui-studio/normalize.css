# R-003 / R-004 规则证据卡：粗体语义与等宽字体字号

- **日期**：2026-11-03
- **状态**：上游标准与 UA 源码研究完成第一轮；**R-003 已取得 Chrome 120 的 4 组差异、Firefox 121 与 Chrome 156 的 0 组差异证据；其余最低目标未测，未批准 CSS 实现**。
- **关联**：FR-001、FR-007、NFR-001/002/007 · [规则总表](RULE_REVIEW.md) · [Baseline 2023 映射](BASELINE_2023_MAPPING.md) · [本地复现执行指南](R003_R004_LOCAL_VERIFICATION.md) · [MVP 实施计划](../plans/MVP_IMPLEMENTATION_PLAN.md) · [Issue #3](https://github.com/adui-studio/normalize.css/issues/3)。

## 1. 证据状态

| 类别                      | 本次证据                                          | 结论能力                                     |
| ------------------------- | ------------------------------------------------- | -------------------------------------------- |
| S — 标准                  | WHATWG HTML Living Standard                       | 规范对建议性 UA 默认渲染的期待               |
| B — 浏览器 Bug / 上游提交 | Chromium StrongBolder、WebKit 289297              | 某版本/分支历史默认行为与修复时点            |
| U — UA 源码快照           | Chromium、Gecko、WebKit 固定版本/提交             | 该源代码快照写明的 UA 样式                   |
| U — 竞品源代码            | modern-normalize、CSSTools normalize.css 固定 SHA | 上游维护者采用的策略，不能证明当前修复仍必要 |
| T — 本项目真实测试        | Chrome 120/156、Firefox 121 R-003 JSON            | Chrome 120 有差异；Gecko 121 无差异          |

本卡包含 S/B/U 类研究证据，以及**Chrome 120、Firefox 121、Chrome 156 的有限 T 类实际计算样式数据**；源码不是浏览器运行结果，这些单环境结果也不等于全部目标平台已验收。

## 2. R-003 — `b` / `strong` 字重

### 2.1 标准期待

[WHATWG HTML Rendering §15.3.4 Phrasing content](https://html.spec.whatwg.org/multipage/rendering.html#phrasing-content-3) 对 UA 建议样式明确写出：

```css
b,
strong {
  font-weight: bolder;
}
```

这里的 `bolder` 是相对于父元素计算的粗细，不等于固定的 `bold`。依据 [MDN font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-weight)，典型映射中父级 400/500 时 `bolder` 得到 700；父级 600/700/800/900 时 `bolder` 得到 900。固定 `bold` 则为 700。

因此，普通 400 父级下 `bold` 与 `bolder` 通常结果相同；**必须使用继承粗细为 600 或 700 的父级，才能暴露两种 UA 声明的计算值差异**。

### 2.2 浏览器上游证据

| 引擎 / 版本证据                                    | UA 源码或 Bug 记录                                                                                                                                                                                                                                                                                                                                                  | 已知行为                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Chromium 120.0.6099.109                            | [固定版本 html.css](https://github.com/chromium/chromium/blob/120.0.6099.109/third_party/blink/renderer/core/html/resources/html.css#L1158-L1160)                                                                                                                                                                                                                   | `strong, b { font-weight: bold }`                                                              |
| Chromium M135                                      | [StrongBolder 功能记录](https://chromium.googlesource.com/chromium/src/%2B/cf5d8a7575e96c938296a9ca04291c00b4bf601c/third_party/blink/renderer/platform/runtime_enabled_features.json5) 说明 M135 默认启用；[M135 html.css](https://github.com/chromium/chromium/blob/135.0.7049.41/third_party/blink/renderer/core/html/resources/html.css#L1222-L1228) 含特性开关 | 新行为为 `bolder`；保留关闭功能时的 `bold` 回退                                                |
| Gecko 2023-10-19 源码提交（早于 Firefox 121 发布） | [固定提交 html.css](https://github.com/mozilla/gecko-dev/blob/325bc7b486ea4df80f4029af6ec2001a339c234e/layout/style/res/html.css)                                                                                                                                                                                                                                   | 已写为 `b, strong { font-weight: bolder }`；**该 SHA 仍不是 Firefox 121 精确发行标签**         |
| WebKit 2025-03-08                                  | [WebKit commit 2f7d04c](https://github.com/WebKit/WebKit/commit/2f7d04cbae67d35d6c3f2830cb134313c9b0dde1) / [Bug 289297](https://bugs.webkit.org/show_bug.cgi?id=289297)                                                                                                                                                                                            | WebKit 同步到规范 `bolder`；Bug 描述修复前 Safari 18.4 Technology Preview 的嵌套粗体结果为 700 |
| WebKit 2023-12-10（支持目标时期的源码快照）        | [固定提交 html.css](https://github.com/WebKit/WebKit/blob/e9d3bfd635935ca09fd161b9bccba90c413a1602/Source/WebCore/css/html.css)                                                                                                                                                                                                                                     | `strong, b { font-weight: bold; }`；**不是 Safari 17.2 正式发行源码/实机结果**                 |
| WebKit 当前源码（2026-10-28）                      | [固定提交 html.css](https://github.com/WebKit/WebKit/blob/5d3798558c9272ebe643e05fa67e0e68107c287a/Source/WebCore/css/html.css#L1426-L1428)                                                                                                                                                                                                                         | 已写为 `strong, b { font-weight: bolder }`                                                     |

[Chrome 135 官方稳定版发布说明](https://developer.chrome.com/release-notes/135) 的发布日期为 2025-04-01；[Safari 18.4 官方发行说明](https://developer.apple.com/documentation/safari-release-notes/safari-18_4-release-notes) 的发布日期为 2025-03-31。WebKit 补丁早于 Safari 18.4 正式发行，但 Apple 发行说明未单独列出该 Bug，因此**不能只凭日期就把 Safari 18.4 首次包含版本标为已实证**。

### 2.3 与本项目 Baseline 2023 的关系

维护者已经批准 Baseline 2023 映射的 Chrome/Edge 120、Firefox 121、Safari 17.2（含相应移动核心家族）作为**首版最低测试目标**，详见 [BASELINE_2023_MAPPING](BASELINE_2023_MAPPING.md)。Chrome 120 与 Firefox 121 已获得 R-003 的真实计算样式证据，**仍没有**完整目标矩阵或正式兼容性声明。

- Chromium 120 的 UA 源码确实使用固定 `bold`，与 HTML 标准的 `bolder` 有差别。
- [Firefox 121 官方发布日为 2023-12-19](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/121)。原先引用 2023-12-22 的 Gecko 快照晚于发行日；已改用**更早的 2023-10-19 源码**（使用 `bolder`）作为历史依据。**此源码证据不能替代浏览器实测；Firefox 121 现已有 T0/T1 实际计算样式数据（见 §2.9），但完整构建 ID 与 UA 样式来源仍待核对**。
- [WebKit 2023-12-10 固定提交](https://github.com/WebKit/WebKit/blob/e9d3bfd635935ca09fd161b9bccba90c413a1602/Source/WebCore/css/html.css) 也明确写为 `font-weight: bold`，这增强了 Safari 17.2 时期旧行为的源码证据；**它不是 Safari 17.2 精确发行标签或实机运行结果**。2025 年 WebKit Bug 又提供了该历史行为的修复时间线。
- W-01 已把七项版本定为**最低测试目标**，因此 R-003 不能仅因 2025 年浏览器已修复就排除，必须在最低目标版本中优先验证；是否进入默认 CSS 仍以真实复现、低侵入与组件库回归为门槛。

### 2.4 最小复现 Fixture（已实现；Chrome 156 已运行，最低目标未运行）

```html
<div class="weight-600">
  <span>普通文本</span>
  <b id="bold">嵌套 b</b>
  <strong id="strong">嵌套 strong</strong>
</div>
<div class="weight-700">
  <span>普通文本</span>
  <b>嵌套 b</b>
  <strong>嵌套 strong</strong>
</div>
```

```css
.weight-600 {
  font-weight: 600;
}
.weight-700 {
  font-weight: 700;
}
```

观察项：

1. 不加载作者 CSS 时，记录浏览器 UA 样式声明及实际计算 `font-weight`。
2. 分别记录父级 600、700 时 `b` / `strong` 的 `getComputedStyle().fontWeight`。
3. 如需比较像素字重，另选具备 100–900 字重轴的固定本地可变字体；不得依赖某台设备偶然安装的字体。
4. 同时记录无库 Baseline、仅单条候选声明、实际包入口三种状态。
5. 真实 Safari/iOS 与 Playwright WebKit 分开记录。

### 2.5 首版最低目标下的复现验收矩阵（Chrome 120、Firefox 121 桌面已实测）

| 测试环境                                   | UA 源码预期（不是实测）           | parent=400 | parent=600                  | parent=700                  | 阻塞条件                                                                    |
| ------------------------------------------ | --------------------------------- | ---------- | --------------------------- | --------------------------- | --------------------------------------------------------------------------- |
| Chrome 120 / Edge 120 / Chrome Android 120 | Blink 120 预计 `bold`             | 700        | **700（对比规范应为 900）** | **700（对比规范应为 900）** | 分别确认各真实发行版本和 Android 平台                                       |
| Firefox 121 / Firefox Android 121          | Gecko 2023 年源码预计 `bolder`    | 700        | 900                         | 900                         | 必须核对实际发行版本，不能以 main/某日源码冒充 release                      |
| Safari 17.2 / Safari iOS 17.2              | WebKit 2023-12-10 源码预计 `bold` | 700        | **700（对比规范应为 900）** | **700（对比规范应为 900）** | 需要真实 Safari 17.2 / iOS 17.2 或明示不可得、不能用 Playwright WebKit 冒充 |

父级 600/700 是关键分叉，而父级 400 下多数引擎可能同为 700。CSS `bolder` 对父级 600/700 的计算目标为 900，参阅 [MDN font-weight relative weights](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-weight)。

若旧版本 UA 实测确认为 `bold` 而添加候选声明，须在同版继续验证 Candidate 与 Integration，不可只测试 `getComputedStyle` 的数值而忽略原生字重/选择器冲突及真实字体可用性。

### 2.6 暂定准入结论

**准入状态：首版必测的条件性候选，未批准 CSS 实现。**

候选最小声明为 `b, strong { font-weight: bolder; }`，但不立即写入 CSS。

- 当前首版目标已包含 Chromium M135 之前和 WebKit 修复之前的版本；**上游源码证据支持必须优先验证这一条**。若精确目标版本真实 Fixture 复现差异，再经 a11y/组件库回归，可以提交最小修复的实现评审。
- 如果未来维护者正式变更最低支持目标，或目标旧版本的真实行为与源码预期不一致，则重新评审；不得以现代版本行为替代旧版测试。
- R-003 当前升级为**首版最低目标必测的条件性候选**，但没有获得 CSS 准入、测试通过或实现授权。

### 2.7 Chrome 156 原始 JSON 对照结果（2026-11-04）

维护者对真实 Fixture 导出的 T0/T1 JSON 执行 `node tests/r003-evidence.mjs`，得到 `NO_COMPUTED_DIFFERENCE`、`differences: 0`、`candidateFailures: 0`。两份原始附件经独立解析，`b`、`strong` 在父级 400/600/700 下的 T0/T1 计算值依次都为 700/900/900；每组字体上下文一致。

**证据级别**：本项目 T 类、Chrome 156 单一环境的真实计算样式对照；不是助手独立操作浏览器，也不是 Chrome 120、Firefox 121 或 Safari 17.2 的验收。原始 JSON 不提交公开仓库，附件指纹、文件字段及验证限制记录在[本机运行记录 §2.1](LOCAL_BROWSER_RUN_20261104.md)。

**准入结论不变**：当前 Chrome 156 未观察到候选规则产生额外计算值变化，**不把 R-003 加入默认 Normalize**；Chrome 120 后续已复现差异（见 §2.8），仍须核对 UA 来源、可访问性与生态兼容，其他最低浏览器版本也需实测。

### 2.8 Chrome 120 真实 T0/T1 计算样式差异（2026-11-04）

维护者使用 Browser Workshop v1.0.0 启动 Chrome for Testing **120.0.6099.109 / Windows 11 25H2**，提供 `chrome://version` 截图与原始 T0/T1 JSON。助手对上传的两份 JSON 独立解析：父级 400 下 `b` / `strong` 都为 700（T0/T1 相同）；父级 **600、700** 下，T0 都为 **700**，而 T1 都为 **900**，共计**四个计算值差异**，候选结果不符为零。字体上下文一致，字号 16px、字体族为 `"Microsoft YaHei"`。

**证据等级**：Chrome 120 桌面 CfT、单一 Windows 环境、真实计算样式对照；这是对旧版 Blink UA 行为与候选修复效果的**实测支持**。助手随后在独立 Linux Node.js 22.16.0 容器中，根据仓库当前 `tests/r003-evidence.mjs`、`tests/evidence-file.mjs` 的实际内容复制临时模块并执行真实比较，得到 `COMPUTED_DIFFERENCE_OBSERVED`、`differences: 4`、`candidateFailures: 0`、退出码 0（详见[运行记录 §2.3](LOCAL_BROWSER_RUN_20261104.md)）。维护者 Windows 本机运行该批文件的 CLI 日志尚未收到。完整版本以截图而非简化 UA 为准，原始附件的 SHA-256 和详细环境限制见[运行记录 §2.2](LOCAL_BROWSER_RUN_20261104.md)。

**继续准入评审而非直接实现**：需从 DevTools Styles 明确 UA 获胜声明，补充嵌套字重、显式用户样式/焦点与 UI 组件库回归；Edge 120、Firefox 121、Safari 17.2 与移动端不得借用 Chrome 120 的结果。当前正式 Normalize CSS 未实现，R-003 仍是有真实差异证据的条件性候选。

### 2.9 Firefox 121 T0/T1 真实对照（2026-11-04）

维护者已在 Windows 执行 `node tests/r003-evidence.mjs` 对 Firefox 121 两份 JSON 进行比较，终端返回 `NO_COMPUTED_DIFFERENCE`、`differences: 0`、`candidateFailures: 0`。助手独立读取两份原始附件，核对六组数据：父级 400 时 `b`、`strong` 的 T0/T1 均为 700；父级 600 和 700 时两页均为 900。T0/T1 的字体上下文完全一致，字体族为 `sans-serif`，字号 16px。原始文件 SHA-256 见[运行记录 §2.4](LOCAL_BROWSER_RUN_20261104.md)。

**证据边界**：Firefox 121 的 UA 字符串与页面角色一致，真实计算样式结果符合旧 Gecko 源码预期；已另行提供 `about:support` Build ID `20231211174248`（见[记录 §3.2.1](LOCAL_BROWSER_RUN_20261104.md)）；UA 规则获胜声明、真实字体渲染及 UI 组件库回归仍未验证。R-003 是否加入产品默认 CSS 仍需单独准入评审；当前不实施。

## 3. R-004 — `code` / `kbd` / `samp` / `pre` 等宽字体与字号

### 3.1 标准与浏览器默认行为

[WHATWG HTML Rendering §15.3.4](https://html.spec.whatwg.org/multipage/rendering.html#phrasing-content-3) 对内联代码元素建议使用 `font-family: monospace`；对 `pre` 还建议块级显示与 `white-space: pre`。标准没有要求把这些元素统一设置 `font-size: 1em`。

固定 UA 源码快照也显示：

- [Chromium 120](https://github.com/chromium/chromium/blob/120.0.6099.109/third_party/blink/renderer/core/html/resources/html.css#L1166-L1174)：`code/kbd/samp` 与 `pre` 使用 `monospace`；没有为这些目标元素设置 `font-size: 1em`。
- [Gecko 2023-10-19](https://github.com/mozilla/gecko-dev/blob/325bc7b486ea4df80f4029af6ec2001a339c234e/layout/style/res/html.css)：`code/kbd/samp` 使用 `-moz-fixed`，属于 Gecko 的固定宽度字体映射；没有统一 `font-size:1em`。该提交不是精确 Firefox 121 release tag。
- [WebKit 2026-10-28](https://github.com/WebKit/WebKit/blob/5d3798558c9272ebe643e05fa67e0e68107c287a/Source/WebCore/css/html.css#L1434-L1443)：使用 `monospace`，`pre` 具有 `white-space: pre`；没有设置目标元素的 `font-size:1em`。

### 3.2 关键发现：等宽字体字号偏好是用户设置，不应自动抹平

[MDN font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-family#monospace_font_size) 说明浏览器通常为比例字体和等宽字体保留不同的默认字号偏好；等宽字体默认字号可能小于比例字体。UA 对 `code` / `pre` 设置 `font-family: monospace` 时，浏览器会尊重用户的 monospace 字号设置。

MDN 同时指出，显式 `font-size` 或 `font-family: monospace, monospace` 会绕过这一单独偏好，使其回到继承字号。这种行为在主流浏览器中可互操作，但并非 CSS 规范要求所有作者都必须覆盖。

因此：

- `font-size: 1em` 不是“纯修复字号差异”的无害声明；它可能覆盖用户有意设置的较小等宽字体字号。
- `font-family: monospace, monospace` 是历史兼容技巧，也会绕过该偏好。
- 把系统 monospace 替换为固定 `ui-monospace/SFMono-Regular/Consolas/Menlo` 字体栈，会改变平台字体和字符回退行为；这属于排版选择，不是默认 Normalize 必需行为。
- `font-size: 1em` 对元素计算字号的效果是继承父级计算字号（参见 [MDN font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-size)）；是否应当覆盖用户单独的等宽字号偏好，必须是明确的可选视觉决策。

### 3.3 上游竞品当前仍保留的规则（不是准入证据）

- [modern-normalize 固定提交](https://github.com/sindresorhus/modern-normalize/blob/27c3f5fe3109b4041a835a0fa569e09c77022bf8/modern-normalize.css#L72-L84)：为 `code/kbd/samp/pre` 指定跨平台字体栈和 `font-size:1em`。
- [CSSTools normalize.css 固定提交](https://github.com/csstools/normalize.css/blob/0774d1043e07ba868f157ff7bb1cd0bbb0a2871c/normalize.css#L75-L78)：使用 `font-family: monospace, monospace` 与 `font-size:1em`。

上游保留这些声明说明其产品选择，不能证明它们适合本项目低侵入默认入口。

### 3.4 最小复现 Fixture（设计稿，尚未运行）

```html
<div class="text-context">
  正文 <code id="inline-code">const value = 1;</code>
  <kbd id="keyboard">Ctrl</kbd>
  <samp id="sample">OK</samp>
</div>
<pre id="pre-context">
const value = 1;
console.log(value);</pre>
```

```css
.text-context {
  font-size: 1rem;
}
#pre-context {
  font-size: 1.5rem;
}
```

需要分别使用：

1. 默认浏览器等宽字号偏好；
2. 用户主动把 monospace 字号设小的浏览器配置；
3. 中文、英文、符号混排与缺字回退；
4. 仅加载 UA 样式、显式 `font-size:1em`、`monospace, monospace`、指定字体栈四种对照。

记录计算字号、实际字体、视觉大小、用户偏好是否生效及跨平台 CJK 回退。

### 3.5 Chrome 156 首轮实际对照（2026-11-04）

维护者提供的 R-004 T0/T1/T1b 截图与 Console 证据见 [本机运行记录 §3.2](LOCAL_BROWSER_RUN_20261104.md)：

- `code` / `kbd` / `samp` / `pre` 的父级计算字号均为 `16px`。
- T0 原生 `monospace` 与 T1（增加 `font-size: 1em`）的自身计算字号均为 **13px**。
- T1b 相比 T1 只增加 `font-family: monospace, monospace`，四个元素的自身计算字号均为 **16px**，字体族报告为 `monospace, monospace`，探针与页面当前计算字号一致。
- 该观察与独立等宽字体字号机制一致，但**不能代表用户设置效果、最低目标 Chrome/Edge 120、Firefox 121、Safari 17.2 或移动端行为**。未完成字体文件实际渲染/无障碍回归，也没有为 R-004 正式发布 CSS。

### 3.5.1 Firefox 121 实测补充（2026-11-04）

维护者在 Firefox 121.0 的三个现有 R-004 Fixture 分别读取探针 JSON：`code`、`kbd`、`samp`、`pre` 四元素在 T0/T1/T1b 的父级字号与自身字号均为 `16px`。T0/T1 的计算字体族为 `monospace`，T1b 的字体族为 `monospace, monospace`。这些数据来自维护者的 PowerShell 表格输出，**三份原始 JSON 未在本轮上传**，因此没有助手独立 JSON 校验。详见[本机运行记录 §3.2.1](LOCAL_BROWSER_RUN_20261104.md)。

同时，维护者上传的 Firefox `about:support` 文件经独立核对为 **121.0 / Build ID 20231211174248 / release / Windows_NT 10.0 26200**；公开文档不纳入完整本机支持信息。该证据补齐 R-003 Firefox 的版本标识，但仍没有 CSS UA 获胜来源和用户自定义等宽字号偏好实测。

**判断边界**：Firefox 121 本次默认配置下，重复字体族仅改变报告的 `fontFamily`，未改变计算字号；Chrome 156 的 T1b 曾从 13px 变为 16px。二者不构成统一字号策略安全的证明，不能按一次观测反推所有配置或实际字形。**R-004 默认不采纳的决策保持不变**。

### 3.6 暂定准入结论

**准入状态：默认不采纳统一字号；如需改变须另行评审。**

- 默认 Normalize 暂不声明 `font-size:1em`。
- 默认 Normalize 不指定跨平台代码字体栈，也不使用 `monospace, monospace` 绕过用户偏好。
- 保留浏览器的通用等宽字体与字号偏好。
- 若未来确有统一代码排版的需求，作为独立可选 Typography/Reset 设计另行评审；这不属于当前首版默认入口。

## 4. 当前决策对 W-01 / W-02 的影响

1. W-01 已将 Baseline 2023 的七项映射版本确认为**首版最低测试目标**；Chrome for Testing 120 已取得真实差异证据，其余目标浏览器仍需各自发行版本的运行证据。
2. W-02 的 R-003 已取得 CfT 120、Firefox 121 与 Chrome 156 的真实计算样式对照；仍需 Edge 120、Safari 17.2 与移动端。R-004 已在 Chrome 156 观察到 T1b 计算字号变化，仍须测试用户 monospace 字号偏好是否保留。
3. Chrome 120 的四组差异支持 R-003 进入进一步准入评审，但不足以证明所有最低目标浏览器行为；两个候选均不得因此直接进入正式 CSS。
4. 本卡引用维护者提供的 **Chrome 156、CfT 120 截图、Firefox 121 CLI 输出及三组 T0/T1 JSON**，不是助手独立执行浏览器；尚无 Safari、Edge 120、真实字体加载回归或完整浏览器矩阵。

**结论**：R-003 是首版已批准最低版本目标下的**必测条件性 Normalize 候选**；R-004 的字号统一会覆盖用户偏好，当前不应进入默认 Normalize。两个候选均未实现正式 Normalize；R-004 已在 Chrome 156 局部实测，但未通过完整浏览器矩阵，Issue #3 保持 Open。
