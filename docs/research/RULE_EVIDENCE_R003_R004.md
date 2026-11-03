# R-003 / R-004 规则证据卡：粗体语义与等宽字体字号

- **日期**：2026-11-03
- **状态**：上游标准与 UA 源码研究完成第一轮；**未执行本项目真实浏览器测试、未批准 CSS 实现**。
- **关联**：FR-001、FR-007、NFR-001/002/007 · [规则总表](RULE_REVIEW.md) · [Baseline 2023 映射](BASELINE_2023_MAPPING.md) · [MVP 实施计划](../plans/MVP_IMPLEMENTATION_PLAN.md) · [Issue #3](https://github.com/adui-studio/normalize.css/issues/3)。

## 1. 证据状态

| 类别 | 本次证据 | 结论能力 |
| --- | --- | --- |
| S — 标准 | WHATWG HTML Living Standard | 规范对建议性 UA 默认渲染的期待 |
| B — 浏览器 Bug / 上游提交 | Chromium StrongBolder、WebKit 289297 | 某版本/分支历史默认行为与修复时点 |
| U — UA 源码快照 | Chromium、Gecko、WebKit 固定版本/提交 | 该源代码快照写明的 UA 样式 |
| U — 竞品源代码 | modern-normalize、CSSTools normalize.css 固定 SHA | 上游维护者采用的策略，不能证明当前修复仍必要 |
| T — 本项目真实测试 | **不存在** | 目前不能宣布兼容性差异已实测 |

本卡仅为 S/B/U 类证据，不包含 T 类结果。源码不是浏览器运行结果；发行分支和操作系统字体偏好可能与当前主分支不同。

## 2. R-003 — `b` / `strong` 字重

### 2.1 标准期待

[WHATWG HTML Rendering §15.3.4 Phrasing content](https://html.spec.whatwg.org/multipage/rendering.html#phrasing-content-3) 对 UA 建议样式明确写出：

```css
b, strong { font-weight: bolder; }
```

这里的 `bolder` 是相对于父元素计算的粗细，不等于固定的 `bold`。依据 [MDN font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-weight)，典型映射中父级 400/500 时 `bolder` 得到 700；父级 600/700/800/900 时 `bolder` 得到 900。固定 `bold` 则为 700。

因此，普通 400 父级下 `bold` 与 `bolder` 通常结果相同；**必须使用继承粗细为 600 或 700 的父级，才能暴露两种 UA 声明的计算值差异**。

### 2.2 浏览器上游证据

| 引擎 / 版本证据 | UA 源码或 Bug 记录 | 已知行为 |
| --- | --- | --- |
| Chromium 120.0.6099.109 | [固定版本 html.css](https://github.com/chromium/chromium/blob/120.0.6099.109/third_party/blink/renderer/core/html/resources/html.css#L1158-L1160) | `strong, b { font-weight: bold }` |
| Chromium M135 | [StrongBolder 功能记录](https://chromium.googlesource.com/chromium/src/%2B/cf5d8a7575e96c938296a9ca04291c00b4bf601c/third_party/blink/renderer/platform/runtime_enabled_features.json5) 说明 M135 默认启用；[M135 html.css](https://github.com/chromium/chromium/blob/135.0.7049.41/third_party/blink/renderer/core/html/resources/html.css#L1222-L1228) 含特性开关 | 新行为为 `bolder`；保留关闭功能时的 `bold` 回退 |
| Gecko 2023-12-22 源码提交 | [固定提交 html.css](https://github.com/mozilla/gecko-dev/blob/ba41dea33f6c9315cebece2f7a9d64a95b054897/layout/style/res/html.css#L507-L509) | 已写为 `b, strong { font-weight: bolder }`；该 SHA 不是 Firefox 121 精确发行标签 |
| WebKit 2025-03-08 | [WebKit commit 2f7d04c](https://github.com/WebKit/WebKit/commit/2f7d04cbae67d35d6c3f2830cb134313c9b0dde1) / [Bug 289297](https://bugs.webkit.org/show_bug.cgi?id=289297) | WebKit 同步到规范 `bolder`；Bug 描述修复前 Safari 18.4 Technology Preview 的嵌套粗体结果为 700 |
| WebKit 当前源码（2026-10-28） | [固定提交 html.css](https://github.com/WebKit/WebKit/blob/5d3798558c9272ebe643e05fa67e0e68107c287a/Source/WebCore/css/html.css#L1426-L1428) | 已写为 `strong, b { font-weight: bolder }` |

[Chrome 135 官方稳定版发布说明](https://developer.chrome.com/release-notes/135) 的发布日期为 2025-04-01；[Safari 18.4 官方发行说明](https://developer.apple.com/documentation/safari-release-notes/safari-18_4-release-notes) 的发布日期为 2025-03-31。WebKit 补丁早于 Safari 18.4 正式发行，但 Apple 发行说明未单独列出该 Bug，因此**不能只凭日期就把 Safari 18.4 首次包含版本标为已实证**。

### 2.3 与本项目 Baseline 2023 的关系

本项目固定快照给出的 Baseline 2023 特性兼容候选版本是 Chrome 120、Edge 120、Firefox 121、Safari 17.2（含相应移动核心家族），详见 [BASELINE_2023_MAPPING](BASELINE_2023_MAPPING.md)。

- Chromium 120 的 UA 源码确实使用固定 `bold`，与 HTML 标准的 `bolder` 有差别。
- Firefox 121 对应的 Gecko 2023-12-22 源码快照使用 `bolder`，但不是精确 release tag。
- WebKit 2025 年 Bug 证明 Safari 18.4 Technology Preview 修复前仍有旧行为；Safari 17.2 更早，具有相同历史行为的可能性很高，但**本次没有 Safari 17.2 的精确 UA 源码/实机结果**。
- 固定 Baseline 2023 是 CSS 特性准入参考，**不自动等于本库最低浏览器支持承诺**。只有 W-01 最终把这些旧版本纳入支持范围，才需要按它们继续完成该规则的发行版本复现。

### 2.4 最小复现 Fixture（设计稿，尚未运行）

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
.weight-600 { font-weight: 600; }
.weight-700 { font-weight: 700; }
```

观察项：
1. 不加载作者 CSS 时，记录浏览器 UA 样式声明及实际计算 `font-weight`。
2. 分别记录父级 600、700 时 `b` / `strong` 的 `getComputedStyle().fontWeight`。
3. 如需比较像素字重，另选具备 100–900 字重轴的固定本地可变字体；不得依赖某台设备偶然安装的字体。
4. 同时记录无库 Baseline、仅单条候选声明、实际包入口三种状态。
5. 真实 Safari/iOS 与 Playwright WebKit 分开记录。

### 2.5 暂定准入结论

<badge>条件性候选，未批准</badge>

候选最小声明为 `b, strong { font-weight: bolder; }`，但不立即写入 CSS。

- 如果 W-01 最终支持范围包含 Chromium M135 之前、WebKit 修复之前的稳定版本，且精确版本的真实 Fixture 复现差异，则这条规则具有明确 Normalize 价值。
- 如果正式最低支持版本均晚于相应修复版本，且目标环境实测一致，则不应继续保留这条历史修复。
- 在最低支持范围和实际复现确定前，R-003 保留为条件性优先核验项，不算通过、不算已实现。

## 3. R-004 — `code` / `kbd` / `samp` / `pre` 等宽字体与字号

### 3.1 标准与浏览器默认行为

[WHATWG HTML Rendering §15.3.4](https://html.spec.whatwg.org/multipage/rendering.html#phrasing-content-3) 对内联代码元素建议使用 `font-family: monospace`；对 `pre` 还建议块级显示与 `white-space: pre`。标准没有要求把这些元素统一设置 `font-size: 1em`。

固定 UA 源码快照也显示：
- [Chromium 120](https://github.com/chromium/chromium/blob/120.0.6099.109/third_party/blink/renderer/core/html/resources/html.css#L1166-L1174)：`code/kbd/samp` 与 `pre` 使用 `monospace`；没有为这些目标元素设置 `font-size: 1em`。
- [Gecko 2023-12-22](https://github.com/mozilla/gecko-dev/blob/ba41dea33f6c9315cebece2f7a9d64a95b054897/layout/style/res/html.css#L512-L516)：`code/kbd/samp` 使用 `-moz-fixed`，即 Firefox 的固定宽度字体映射；没有统一 `font-size:1em`。
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
<pre id="pre-context">const value = 1;
console.log(value);</pre>
```

```css
.text-context { font-size: 1rem; }
#pre-context { font-size: 1.5rem; }
```

需要分别使用：
1. 默认浏览器等宽字号偏好；
2. 用户主动把 monospace 字号设小的浏览器配置；
3. 中文、英文、符号混排与缺字回退；
4. 仅加载 UA 样式、显式 `font-size:1em`、`monospace, monospace`、指定字体栈四种对照。

记录计算字号、实际字体、视觉大小、用户偏好是否生效及跨平台 CJK 回退。

### 3.5 暂定准入结论

<badge>默认不采纳，待实际验证</badge>

- 默认 Normalize 暂不声明 `font-size:1em`。
- 默认 Normalize 不指定跨平台代码字体栈，也不使用 `monospace, monospace` 绕过用户偏好。
- 保留浏览器的通用等宽字体与字号偏好。
- 若未来确有统一代码排版的需求，作为独立可选 Typography/Reset 设计另行评审；这不属于当前首版默认入口。

## 4. 当前决策对 W-01 / W-02 的影响

1. W-01 必须明确正式最低浏览器版本是否覆盖旧 UA 字重行为；Baseline 2023 的特性映射不能单独作出这个决定。
2. W-02 的 R-003 需要真实旧版最低支持浏览器和现代浏览器对照；R-004 需要测试用户 monospace 字号偏好是否保留。
3. 在真实浏览器验证前，两个候选均不得进入 CSS。
4. 本卡没有执行 Playwright、Safari、Firefox、Chrome、字体加载或计算样式测试。

**结论**：R-003 是依最低支持版本而定的条件性 Normalize 候选；R-004 的字号统一会覆盖用户偏好，当前不应进入默认 Normalize。两项都未实现、未实测、未关闭 Issue #3。
