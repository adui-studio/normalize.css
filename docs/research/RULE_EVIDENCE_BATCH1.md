# 首批规则证据审查：规范、历史缺陷与复现门槛

**日期**：2026-11-03  
**状态**：资料核验完成一部分；所有候选仍 **未实测、未批准、未实现**。  
**范围**：R-003、R-004、R-007～R-011、R-017～R-019、R-031（共 11 条）。  
**关联**：[规则总表](RULE_REVIEW.md)、[浏览器矩阵](BROWSER_REVIEW.md)、[SDD](../SDD.md)、FR-001、FR-007、NFR-001/002/003/007。

## 1. 证据类型，必须区分

| 证据类别 | 说明 | 能下的结论 | 禁止推论 |
| --- | --- | --- | --- |
| S — WHATWG / CSS 规范 | 标准对原生渲染的建议或要求 | 合理的原生行为参考、特性边界 | 所有浏览器已经实现且完全相同 |
| B — 浏览器 Bug / 提交 | 上游缺陷和具体修复的历史记录 | 相关问题被跟踪或有补丁落地 | 补丁已进入每个受支持的稳定版本 |
| U — 第三方 Normalize 源码 | 维护者曾选择的样式修复策略 | 候选规则与可能存在的历史动机 | 当前依然需要且完全无副作用 |
| T — 本项目真实测试 | 指定浏览器/OS/版本、最小 Fixture、实际观察 | 可以评价具体浏览器下的行为 | 尚未运行，因此本轮没有 T 证据 |

**当前只有 S/B/U 类资料，不存在 T 类测试结果。** WHATWG HTML Rendering 章节主要提出用户代理的预期/建议性默认渲染；不能把它解释成所有 UA 已实现。

## 2. 首批规则的具体发现

| ID | 规范/上游事实（非本项目实测） | 本次分类建议 | 后续验证问题 |
| --- | --- | --- | --- |
| R-003 | WHATWG Rendering 建议 `b`、`strong` 使用 `font-weight: bolder`，CSSTools 源码也使用这一意图 | 保留“优先核验” | 嵌套粗体与继承字重在具体 UA 是否出现可复现分歧？ |
| R-004 | WHATWG Rendering 建议 `code`、`kbd`、`samp` 默认等宽；`pre` 还具有预格式化行为。其规范示例没有直接要求统一 `font-size: 1em` | 保留“优先核验”，仅调查额外字号修正是否有必要 | 原生等宽字相对缩放、字号、中文/CJK、代码控件是否存在差异？ |
| R-007 | WHATWG Rendering 建议带 `title` 的 `abbr` 使用虚线下划线。WebKit Bug 277889 于 **2024-09-09** 记录补丁提交并关闭 | 从“优先核验”调整为“暂缓（上游旧缺陷已修复）” | 该修复具体进入哪个 Safari 版本？触摸端 `title` 是否有可用反馈？ |
| R-008 | WebKit Bug 195016：旧 Safari 的 `table` 默认边框颜色与单元格不同；**2024-12-15** 已提交修复并关闭 | 降为“暂缓（WebKit 历史修复已落地）” | 目标版 Safari 是否表现一致？Blink 当前是否还有差异？标准/怪异模式如何？ |
| R-009 | WHATWG `hr` 的建议性 UA 样式包含边框、默认颜色、间距及 `size` 映射；不能从规范直接推出必须统一 `height:0` | 降为“暂缓（风险/范围待审）” | `hr` 在默认与 `size`/自定义边框下的布局差异是否真实存在？ |
| R-010 | WHATWG 对 `progress` 的原生外观建议提到 `inline-block` 及 **`vertical-align: -0.2em`**；强制 baseline 不一定是修复，可能改变平台表现 | 降为“暂缓（对照原生规范）” | 各平台进度条与文本基线如何表现？要求严格相同是否真有必要？ |
| R-011 | WHATWG 对一般 `summary` 有 block 处理，而对有效的 `details > summary:first-of-type` 建议 list-item 与 disclosure marker 行为；无条件全局 `summary` list-item 过宽 | 降为“暂缓（选择器边界）” | 多个 summary、未嵌入 details、marker 与键盘操作是否有非预期变化？ |
| R-017 | WHATWG 的 dialog 默认建议使用系统语义色 **`Canvas` 与 `CanvasText`**，并区分 `:modal` 和 backdrop；旧源码直接写 white/black 不符合低侵入目标 | 继续“排除默认” | 暗色模式、forced-colors、Modal、popover、top layer 要维持原生行为 |
| R-018 | WHATWG 提供 `dialog:not([open])` 隐藏的建议性样式，且另有 popover-open 等状态。不能假定额外覆盖总是必要 | 继续“暂缓”，并限制复现范围 | 使用 show()/showModal()、关闭、popover 组合时是否存在真实缺陷？ |
| R-019 | WHATWG 与 MDN 明确区分 `hidden` 和 `hidden="until-found"`。某些 display 值会导致后者不能在查找或片段导航时揭示 | 继续“排除默认” | 不需要全局强制隐藏规则；未来可将普通/直到找到两种状态做兼容用例 |
| R-031 | WHATWG 建议 `:focus-visible { outline: auto; }`，但可选增强不应抹去焦点、取代应用自身的交互语义 | 继续作为 A11y“可选设计” | 键盘/鼠标区分、forced-colors、组件焦点和可访问性如何回归？ |

**这里的调整是调查优先级，不是最终决定“某条规则永远不需要”。**

## 3. 高价值一手资料

### WHATWG HTML Living Standard

- [Rendering：Phrasing content](https://html.spec.whatwg.org/multipage/rendering.html#phrasing-content-3)：R-003 / R-004 / R-007 / R-031。
- [Rendering：`hr`](https://html.spec.whatwg.org/multipage/rendering.html#the-hr-element)：R-009。
- [Rendering：`details` 与 `summary`](https://html.spec.whatwg.org/multipage/rendering.html#the-details-and-summary-elements)：R-011。
- [Rendering：`progress`](https://html.spec.whatwg.org/multipage/rendering.html#the-progress-element)：R-010。
- [Rendering：`dialog` 默认样式](https://html.spec.whatwg.org/multipage/rendering.html#flow-content-3)：R-017 / R-018。
- [Interaction：hidden](https://html.spec.whatwg.org/multipage/interaction.html#the-hidden-attribute)：R-019。
- [MDN：hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden)：R-019 布局与 `until-found` 限制。

### 浏览器原始缺陷记录

- [WebKit Bug 277889](https://bugs.webkit.org/show_bug.cgi?id=277889)：`abbr[title]` 的虚线下划线，2024-09-09 记录 `283368@main` 提交，状态 RESOLVED FIXED。
- [WebKit Bug 195016](https://bugs.webkit.org/show_bug.cgi?id=195016)：table border color，2024-12-15 记录 `287861@main` 提交，状态 RESOLVED FIXED。
- 两项修复的**稳定版首次包含版本仍待确认**；不要从 WebKit main 提交日期反推 Safari 发布版本。

### 候选规则源文件

- [CSSTools normalize.css](https://github.com/csstools/normalize.css/blob/main/normalize.css)
- [modern-normalize CSS](https://github.com/sindresorhus/modern-normalize/blob/main/modern-normalize.css)

这两个文件提供候选设计的历史上下文，但是否适合本项目须经独立复现和许可证检查。

## 4. 下一阶段的最小复现记录（待实施）

| Fixture | 必须保存的输入 | 必须观察的结果 | 关联规则 |
| --- | --- | --- | --- |
| F-001 | 不加作者 CSS 的 b/strong 嵌套、代码标签、abbr/title；字号缩放与自定义字体 | 计算字重/字体/字号、下划线外观；移动端触摸反馈 | R-003/004/007 |
| F-002 | 标准模式与怪异模式 table、含 size 的 hr、行内 progress | 边框颜色、hr 外盒尺寸、文本基线；默认 VS 候选单规则 | R-008/009/010 |
| F-003 | details 内首个/第二个 summary、独立 summary | marker、键盘可展开性、display 与焦点 | R-011 |
| F-005 | modal/nonmodal dialog、close、popover、浅/深色和 forced-colors | 是否意外变色、隐藏状态、top layer、Esc、焦点循环 | R-017/018 |
| F-006 | 普通 hidden 与 until-found，页面查找、hash 导航 | beforematch、属性移除、内容揭示、布局盒 | R-019 |
| F-007 | 键盘 Tab、鼠标、触摸、强制颜色 | 焦点可见性及可回退性 | R-031 |

每个 Fixture 必须先保存 **Baseline（不加载本库）**，再记录 **Candidate（仅一条规则）**，最后 **Integration（组件库与 Reset 叠加）**。对差异已消失的规则应拒绝默认引入，而不是为了满足候选数量而保留。

## 5. 结论与待确认

- 本轮**没有**确认应当采纳哪条 CSS 实现规则。
- R-007 和 R-008 的历史 WebKit 问题已有明确上游修复记录；后续必须先评估目标版本是否需要额外补丁。
- R-009、R-010、R-011 的规则范围与 WHATWG 原生建议存在需要解释的差异，不应立即引入。
- R-017、R-019 的默认排除理由得到规范依据支持。
- 最低浏览器支持版本、移动端 WebView、真实 Safari 测试范围尚未批准。
- 本项目不添加 CI；所有未来测试仅在用户明确批准进入开发阶段后于本地执行。

## 6. 第二轮 UA 源码与用户偏好核查（2026-11-03）

R-003 / R-004 的精确浏览器源码快照、历史修复时间线、最小 Fixture 与暂定准入结论已独立整理在 [RULE_EVIDENCE_R003_R004.md](RULE_EVIDENCE_R003_R004.md)。本轮新增发现：Chromium M135 和 WebKit 2025 年均向 WHATWG 的 `bolder` 期待对齐；等宽字号偏好是浏览器提供给用户的设置，统一 `font-size:1em` 会覆盖它。

**本文及专项卡仍是 S/B/U 研究，不包含本项目 T 类浏览器实测、实现代码、可运行 CSS 或最终规则批准。**
