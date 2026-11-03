# SDD — 详细设计草案

**状态：待评审 / 未实现**。所有文件路径、入口和 CSS 规则均为候选设计；本仓库目前没有对应代码。

## 1. 设计范围与需求映射

| 候选模块 | 需求 | 拟议接口/职责 | 实现状态 |
| --- | --- | --- | --- |
| Normalize | FR-001、NFR-001 | 默认标准化样式表 | 未实现 |
| Reset | FR-002 | 显式导入的 Reset | 未实现 |
| A11y | FR-003 | 焦点与系统偏好增强 | 未实现 |
| Forms | FR-004 | 原生表单增强 | 未实现 |
| Combined | FR-005 | 显式组合入口 | 未实现 |
| Exports | FR-006 | npm 导出映射 | 未实现 |
| 规则追踪 | FR-007、NFR-002/003/007 | 兼容性证据与回归用例 | 未实现 |

## 2. 对外契约草案（不代表已可使用）

| 导入路径（候选） | 返回内容 | 副作用边界 |
| --- | --- | --- |
| `@adui/normalize.css` | Normalize 基础 CSS | 不隐式附加 Reset/A11y/Forms |
| `@adui/normalize.css/reset.css` | Reset CSS | 仅显式使用时生效 |
| `@adui/normalize.css/a11y.css` | A11y CSS | 仅显式使用时生效 |
| `@adui/normalize.css/forms.css` | Forms CSS | 仅显式使用时生效 |
| `@adui/normalize.css/all.css` | 经评审的组合 CSS | 不应产生重复/互斥规则 |

具体 `package.json` exports、文件名、CSS 编译方式和 `sideEffects` 标记，均须在开始开发前审定。**这些候选路径不意味着首版必须全部发布**；参阅 [ADR-0003](adr/0003-mvp-package-contract.md)。

## 3. CSS 规则准入流程（拟议）

1. **问题**：列出浏览器/版本、HTML Fixture、原生样式偏差及用户可见问题。
2. **证据**：复现差异并记录可查询的标准/浏览器行为来源。
3. **候选**：给出最小修复选择器和声明，分析对无关元素及组件库的影响。
4. **分类**：真正的浏览器差异放 Normalize；设计偏好放对应可选模块；无法证明必要则暂不加入。
5. **验证**：目标引擎真实浏览器对照、键盘和系统偏好检查、组件库回归、CSS 静态检查。
6. **记录**：关联 FR/NFR、适用范围、已验证浏览器、风险与对应测试用例。

本流程尚无自动执行代码，不能把以上步骤当作已建立的流水线。

## 4. 设计边界与示例

### Normalize

- 候选原则：保留原生可访问性与语义样式；不为视觉一致性而默认清空 button/list/heading。
- 对过时规则不得照搬；逐条核实是否仍存在现代浏览器差异。
- 可使用低特异性选择器，但需确认其不会弱化必要的可访问性行为。

### Reset（可选）

- 可能包含边框盒模型、媒体元素布局约束等；**是否移除通用 margin/padding 要单独评审**。
- 对 `fieldset`、`dialog`、`details`、列表和原生控件必须检查默认体验。

### A11y（可选）

- 不应使用无条件 `outline: none`。
- `:focus-visible`、`prefers-reduced-motion`、`forced-colors` 等是否涉及全局覆盖须先测试。
- 减少动画不应随意通过全局 `!important` 抹除所有应用动画；针对用户偏好采用更窄的范围与可回退行为。

### Forms（可选）

- 审视输入字体、尺寸、触摸交互、原生验证状态；避免影响组件库自定义按钮与输入框。
- 不默认使用 `:user-invalid` 改写所有表单背景或边框。

### Cascade Layers（候选）

- 层名提案：`adui.normalize`、`adui.reset`、`adui.a11y`、`adui.forms`。
- 每个独立入口必须声明一致顺序；明确未分层样式、`!important`、Tailwind/UnoCSS 预设间交互；相关用例验证后再接受。

## 5. 数据模型、状态机、接口与并发

本项目作为静态 CSS 包，**不需要数据库、持久化数据模型、运行时 API、鉴权、事务或并发状态机**。唯一需要的结构化数据是设计和测试时的规则元数据（格式待定）。

## 6. 测试设计（未来工作）

| 用例类别 | 场景 | 需求 | 状态 |
| --- | --- | --- | --- |
| 规则静态审查 | 默认模块禁止高侵入全局声明；选择器和注释合理 | FR-001、NFR-001 | 未实现 |
| 原生语义 | button、input、select、textarea、fieldset、details、dialog、summary | FR-001/002/004 | 未实现 |
| 浏览器差异 | Chromium / Firefox / WebKit 前后对照 | NFR-002/003 | 未实现 |
| 交互无障碍 | 键盘焦点、高对比度、减少动画设置 | FR-003 | 未实现 |
| 组件库回归 | Element Plus / Ant Design / TDesign 的表单与弹窗等 | NFR-007 | 未实现 |
| 包导出检查 | npm tarball 中所有公开路径存在且可解析 | FR-005/006 | 未实现 |
| 体积与许可证 | 原始/Gzip 比较、许可证归属与发布清单 | NFR-004/006 | 未实现 |

**禁止**用单元文本检查代替浏览器对照并宣称兼容性通过。

## 7. 异常与向后兼容

- 不支持特性的浏览器优先维持可用的原生交互，不使用不必要的破坏性覆盖。
- 规则变更若可能影响消费者样式，应视为潜在破坏性变更，提供变更说明和回归证据。
- 发布导出路径、版本策略和升级说明在真实打包与测试环境确定后再冻结。

## 8. 补充研究（均未批准）

- [规则候选](research/RULE_REVIEW.md)、[首批证据审查](research/RULE_EVIDENCE_BATCH1.md) 与 [竞品研究](research/COMPETITOR_REVIEW.md)：用于规则证据审查，不代表实现。
- [浏览器支持矩阵](research/BROWSER_REVIEW.md) 和 [表单规则研究](research/FORM_CONTROLS_REVIEW.md)：未冻结最低版本，不代表完成测试。
- [ADR-0002](adr/0002-cascade-layers.md)：CSS Layers 默认策略仍待决策。
- [ADR-0003](adr/0003-mvp-package-contract.md)：MVP 公开入口与 sideEffects 风险的备选设计，仍为 Proposed。
- [第三批规则证据审查](research/RULE_EVIDENCE_BATCH3.md)：排版、Reset、系统偏好等剩余 17 条规则的来源与风险。

## 9. 未决事项

浏览器最低版本；是否发布 `all.css`；是否采用 `@layer`；是否需要更细的模块拆分；首次发布支持范围；CSS 格式化和测试工具；组件库 Fixture 版本。

**更新约定**：对外 CSS 导出、模块边界、单条关键规则、测试设计变化时维护本文件；高层变化同步 [ARCHITECTURE](ARCHITECTURE.md) 与 [ADR](adr/0001-css-base-strategy.md)。