# 第三批规则证据审查：排版、Reset、系统偏好

**日期**：2026-11-03  
**状态**：资料研究 / 待评审；**未执行任何真实浏览器测试、未批准 CSS 规则或模块接口。**  
**覆盖范围**：R-001、002、005、006、020～025、029、030、032～036，共 **17** 条。  
**关联**：[规则总表](RULE_REVIEW.md) · [首批审查](RULE_EVIDENCE_BATCH1.md) · [表单审查](FORM_CONTROLS_REVIEW.md) · FR-001/002/003/004/007 · NFR-001/002/003/007。

## 1. 证据边界

本文件使用 WHATWG HTML、CSSWG、MDN、Webpack 等规范、文档和工具说明作为**设计依据（S/U）**，并非本项目的浏览器实际结果（T）。规范建议的 UA 默认样式不代表所有具体浏览器/OS/版本都已经一致。任何规则都不得仅凭第三方 Reset 的存在性纳入默认 Normalize。

## 2. 剩余 17 条规则

| ID                                | 本轮依据与风险判断                                                                                                                                                                                                                                                    | 分类（沿用总表）    | 未来需要证明什么                                                            |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------- |
| R-001 HTML 行高统一               | 根元素 `line-height` 常是设计排版决策；默认设置可能影响高度、文字换行和组件库继承                                                                                                                                                                                     | 暂缓                | 是否存在现代 UA 中可复现的必要差异，而非视觉偏好                            |
| R-002 移动端文字调整              | [MDN text-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-size-adjust) 指出该属性控制移动端文字放大机制，且部分平台有不同支持；强制 `none` 可能降低可读性                                                                     | 暂缓                | iOS/Android 横竖屏、文字放大、缩放和实际 WebView 的问题是否可复现           |
| R-005 `small` 字号                | [WHATWG HTML Rendering](https://html.spec.whatwg.org/multipage/rendering.html) 对内联文字的默认呈现有建议；固定字号会覆盖设计与字体尺度                                                                                                                               | 暂缓                | 不加载作者样式时是否确实有目标引擎差异                                      |
| R-006 `sub/sup` 行高和位置        | [CSSWG FAQ](https://wiki.csswg.org/faq/) 指出上下标、嵌套及字体相关行为兼容性复杂，改用 `font-variant-position` 也不能直接替代既有 UA 表现                                                                                                                            | 暂缓                | 上下标嵌套、行高、化学式和数学排版是否存在必要修复                          |
| R-020 `body { margin:0 }`         | 移除页面默认留白是布局 Reset；不是浏览器 Bug 的天然修复                                                                                                                                                                                                               | 可选 Reset          | 宿主应用是否明确选择该重置，对现有页面的影响                                |
| R-021 全局 `border-box`           | [MDN box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-sizing)：默认 `content-box`，部分表单控件自身已是 `border-box`；统一可能改动消费者尺寸计算                                                                                 | 可选 Reset          | 普通盒、表格、按钮、搜索框、第三方组件计算盒尺寸                            |
| R-022 移除标题排版                | 标题默认字重/字号体现 HTML 语义层级；清零是 Tailwind 式设计体系的选择                                                                                                                                                                                                 | 可选 Reset          | 标题可理解性、正文与标题层级、UI 库 typography                              |
| R-023 移除列表 marker / 缩进      | 可能让导航列表更易定制，但会改变有序列表编号和语义视觉提示                                                                                                                                                                                                            | 可选 Reset          | `ol/ul/li`、嵌套、屏幕阅读器、导航与内容列表                                |
| R-024 媒体块级与流式尺寸          | [MDN replaced elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_sizing/Aspect_ratios)：图像/视频依赖内在尺寸与比例；全局 `display:block`、`max-width` 会改变内联布局                                                                              | 可选 Reset          | image/video/audio/canvas/svg、图表、表格和响应式布局                        |
| R-025 `border-collapse:collapse`  | 表格边框分隔方式是视觉/布局选择，而非 Normalize 必然修复                                                                                                                                                                                                              | 可选 Reset          | 表格边框、caption、复杂表格、组件表格                                       |
| R-029 全局禁用动画 `!important`   | [MDN reduced-motion 指南](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using_for_accessibility) 明确降低动效不等于移除所有动画                                                                                                               | 排除默认            | 仅在具体场景按用户偏好降低非必要动效，不破坏事件/状态                       |
| R-030 无条件 `outline:none`       | [MDN outline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/outline) 指出会移除浏览器原生焦点指示，存在键盘无障碍风险                                                                                                                         | 排除默认            | 不添加破坏性规则；原生焦点保留                                              |
| R-032 统一全局主题/滚动条         | [MDN color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme) 说明它影响原生控件、滚动条和画布颜色；[forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors) 有额外覆盖行为 | 排除默认            | 各宿主自身的浅/深色、forced-colors 和系统偏好                               |
| R-033 取消所有 iOS 点击高亮       | 无差别禁用触控反馈会抹去平台提示，不属于纯 UA 差异修复                                                                                                                                                                                                                | 排除默认            | 不能作为默认修复；若有特别交互需由应用单独处理                              |
| R-034 全局 `word-break:break-all` | [MDN word-break](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/word-break) 说明它对非 CJK 单词的断行行为影响明显；不同语言文本需要不同规则                                                                                                    | 排除默认            | 英文长词、URL、中文/日文/韩文、泰文及窄容器                                 |
| R-035 `accent-color`              | [MDN accent-color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/accent-color) 将其定义为控件强调色，属于视觉设计决策，且特性不是所有主流环境都具完整支持                                                                                     | 暂缓 / Forms 待评审 | 是否存在明确的可选视觉设计需求，以及 checkbox/radio/range/progress 的可用性 |
| R-036 强制系统字体栈              | 改变应用字体是排版产品决策，可能影响多语言字符、度量和组件库                                                                                                                                                                                                          | 排除默认            | 保留消费者自有字体和系统回退方式                                            |

本轮没有改变 [规则总表](RULE_REVIEW.md) 的任何初步分类；只补充基于来源的评审理由。

## 3. 拟议 Fixture（未创建）

| 未来本地场景                                                | 对应规则                  | 主要风险                       |
| ----------------------------------------------------------- | ------------------------- | ------------------------------ |
| F-001：标题、small、嵌套 sub/sup、文字缩放、移动方向变化    | R-001/002/005/006/022/036 | 行高、字号、语义视觉           |
| F-008：正文、媒体、嵌套列表、表格、国际化文本               | R-020～025、R-034         | 尺寸、marker、换行和内容可读性 |
| F-007：Tab/焦点、减少运动、forced-colors、浅/深色、触摸反馈 | R-029/030/032/033/035     | 原生交互和系统偏好             |
| F-009：Vue/React + Element Plus、Ant Design、TDesign        | 上述所有可选候选          | 样式优先级、视觉回归与布局破坏 |
| F-010：与 Tailwind Preflight / UnoCSS Reset 分别叠加        | R-020～025 等             | 重复 Reset、导入顺序和覆盖     |

所有验证均应按 [bug-reproduction-brief Skill](../../.agents/skills/bug-reproduction-brief/SKILL.md) 的原始流程记录环境、最小 Fixture、预期/实际、复现结果和未知项，且在用户明确进入开发阶段后**仅在本地执行**。

## 4. 三批规则审查全景

- 首批 11 条：R-003/004/007/008/009/010/011/017/018/019/031。
- 第二批 8 条：R-012～016、R-026～028。
- 本批 17 条：R-001/002/005/006、R-020～025、R-029/030、R-032～036。

以上覆盖 36 条初始候选的**资料研究**，不意味着 36 条浏览器差异已得到证明、修复方案已通过、或任何候选进入正式产品。

## 5. 残留阻塞

最低支持的 Safari/iOS、Firefox/ESR、Chromium、Android WebView 版本；真实可操作的 Baseline 和单规则对照 Fixture；生态回归版本；每条修复是否具有可复现必要性；许可证和 Rule ID → 测试证据链。上述在本阶段均未完成。
