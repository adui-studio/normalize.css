# CSS 规则准入审查（研究草案）

**状态**：全部待评审 / 未实现；R-003、R-004 已有部分真实浏览器测量，未完成准入评审或兼容矩阵。  
**日期**：2026-11-03。**关联**：FR-001、FR-007、NFR-001、NFR-002、NFR-007。  
**研究来源**：[竞品对照](COMPETITOR_REVIEW.md) · [浏览器矩阵](BROWSER_REVIEW.md) · [首批规则证据审查](RULE_EVIDENCE_BATCH1.md) · [表单规则研究](FORM_CONTROLS_REVIEW.md) · [排版、Reset 与系统偏好规则审查](RULE_EVIDENCE_BATCH3.md)。

## 准入原则

- **优先核验**：可能是跨浏览器 UA 差异，但必须先复现、标明浏览器及 OS 版本。
- **暂缓**：历史规则或风险/证据不足，不能为了兼容的名义先添加。
- **可选设计**：盒模型、排版或视觉偏好，仅在 Reset / Forms / A11y 独立模块审议。
- **排除默认**：违背默认低侵入、无障碍或原生语义的全局样式。

## 36 条研究候选

| ID    | 修正意图                         | 推荐归属                              | 初步状态                                      |
| ----- | -------------------------------- | ------------------------------------- | --------------------------------------------- |
| R-001 | HTML 行高统一                    | 待定                                  | 暂缓                                          |
| R-002 | iOS 方向变化文字调整             | 待定                                  | 暂缓                                          |
| R-003 | b/strong 字重                    | Normalize（若最低目标旧版实测有差异） | **开发版已实现 R-003；发布准入仍待验证**      |
| R-004 | code/kbd/samp/pre 等宽字体与字号 | 默认不采纳；可选排版另评              | 暂缓；统一字号可能覆盖用户 monospace 字号偏好 |
| R-005 | small 字号                       | 待定                                  | 暂缓                                          |
| R-006 | sub/sup 行高                     | 待定                                  | 暂缓                                          |
| R-007 | abbr 标记下划线                  | Normalize                             | 暂缓                                          |
| R-008 | table 默认边框颜色               | Normalize                             | 暂缓                                          |
| R-009 | hr 高度与盒模型                  | Normalize                             | 暂缓                                          |
| R-010 | progress 垂直对齐                | Normalize                             | 暂缓                                          |
| R-011 | summary 列表项显示               | Normalize                             | 暂缓                                          |
| R-012 | 表单控件 margin                  | 待定                                  | 暂缓                                          |
| R-013 | search 输入框外观                | 待定                                  | 暂缓                                          |
| R-014 | WebKit 搜索装饰                  | 待定                                  | 暂缓                                          |
| R-015 | file 选择按钮伪元素              | 待定                                  | 暂缓                                          |
| R-016 | placeholder 默认颜色与透明度     | 待定                                  | 暂缓                                          |
| R-017 | 强制重绘 dialog 主题             | 默认外                                | 排除默认                                      |
| R-018 | 未打开 dialog 的显示状态         | 待定                                  | 暂缓                                          |
| R-019 | 强制隐藏所有 [hidden]            | 默认外                                | 排除默认                                      |
| R-020 | body margin 清零                 | Reset                                 | 可选设计                                      |
| R-021 | 全局 border-box                  | Reset                                 | 可选设计                                      |
| R-022 | 标题字号和字重重置               | Reset                                 | 可选设计                                      |
| R-023 | 列表 marker/缩进清零             | Reset                                 | 可选设计                                      |
| R-024 | 媒体元素块级显示与宽高           | Reset                                 | 可选设计                                      |
| R-025 | table border-collapse            | Reset                                 | 可选设计                                      |
| R-026 | 表单字体继承                     | Forms                                 | 可选设计                                      |
| R-027 | 表单背景边框和圆角               | Forms 待定                            | 暂缓                                          |
| R-028 | 全局 :user-invalid 样式          | Forms 待定                            | 暂缓                                          |
| R-029 | 全局强制减少动效 !important      | 默认外                                | 排除默认                                      |
| R-030 | 无条件 outline:none              | 默认外                                | 排除默认                                      |
| R-031 | :focus-visible 的有限增强        | A11y                                  | 可选设计                                      |
| R-032 | 全局主题和滚动条                 | 默认外                                | 排除默认                                      |
| R-033 | 关闭 iOS 点击高亮                | 默认外                                | 排除默认                                      |
| R-034 | 全局 word-break:break-all        | 默认外                                | 排除默认                                      |
| R-035 | 全局 accent-color                | Forms 待定                            | 暂缓                                          |
| R-036 | 强制全局字体栈                   | 默认外                                | 排除默认                                      |

**注意**：优先核验仅是调研排序，任何一条都没有获得进入默认 CSS 的批准。经 [首批证据审查](RULE_EVIDENCE_BATCH1.md)，R-007/008/009/010/011 的优先级由“优先核验”降为“暂缓”；这是历史 Bug 与规范层面的研究结论，不是跨浏览器实测结果。

## 每条规则必须附带的证据

规则 ID、关联需求、来源与固定 SHA、最小原生 HTML Fixture、标准/浏览器 Bug、问题浏览器/OS/版本、未加载 CSS 时的原生行为、最小规则方案、影响范围/特异性、与默认语义和无障碍的关系、组件库叠加测试、结果截图/操作日志、回退方案、审核结论及责任人。

## 关键拒绝准则

1. 目标浏览器当前已经一致、没有可复现差异。
2. 规则主要是设计偏好，却放进默认 Normalize。
3. 改变焦点可见性、原生表单、系统字体放大、对话框或隐藏行为。
4. 不能说明第三方组件库及 Tailwind/UnoCSS Reset 的叠加风险。
5. 缺少真实验证，却在 README 中描述为兼容性修复。

特别注意 `hidden="until-found"`：使用 `display:none` 可能破坏页面查找揭示和片段定位，参见 [MDN hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden)。

## 规划 Fixture（尚不存在）

F-001：标题、文字、abbr、代码字体、缩放；F-002：hr/table/progress；F-003：details/summary/键盘焦点；F-004：search/file/button/select/textarea/fieldset；F-005：dialog/popover/暗色偏好；F-006：hidden/until-found；F-007：减少动画/高对比度；F-008：媒体/列表/表格；F-009：Element Plus、Ant Design、TDesign；F-010：独立和叠加 Tailwind Preflight / UnoCSS Reset。

**规则资料研究覆盖**：36 条初始候选均有首轮来源/风险分类；R-003/R-004 的专项证据见 [R003/R004 证据卡](RULE_EVIDENCE_R003_R004.md)。R-003 已有 Chrome 120/156、Firefox 121 的实测计算值；R-004 已有 Chrome 156、Firefox 121 的局部字号观测，但尚无正式 CSS 准入决议。

**验收状态**：已在独立开发分支实现唯一 R-003 规则；R-004 采用浏览器默认字体字号，不加入产品 CSS。完整兼容矩阵和发行验收仍未完成；其余研究候选不得直接作为实现任务清单。
