# SDD — 详细设计草案

**状态：首版公开 CSS 契约已批准 / 未实现**。ADR-0001～0005 已 Accepted；W-03 开发分支已有 Vite+ 清单、配置及本地 Fixture/测试，但仍无正式 CSS、npm 导出或发行产物。

## 1. 设计范围与需求映射

| 候选模块  | 需求                    | 拟议接口/职责        | 实现状态 |
| --------- | ----------------------- | -------------------- | -------- |
| Normalize | FR-001、NFR-001         | 默认标准化样式表     | 未实现   |
| Reset     | FR-002                  | 显式导入的 Reset     | 未实现   |
| A11y      | FR-003                  | 焦点与系统偏好增强   | 未实现   |
| Forms     | FR-004                  | 原生表单增强         | 未实现   |
| Combined  | FR-005                  | 显式组合入口         | 未实现   |
| Exports   | FR-006                  | npm 导出映射         | 未实现   |
| 规则追踪  | FR-007、NFR-002/003/007 | 兼容性证据与回归用例 | 未实现   |

## 2. 首版正式设计契约（尚不可使用）

| 导入路径（候选）                | 返回内容                                | 副作用边界                                  |
| ------------------------------- | --------------------------------------- | ------------------------------------------- |
| `@adui/normalize.css`           | **首版唯一已批准的 CSS 入口**（未实现） | 只包含有证据的 Normalize，且不内置 `@layer` |
| `@adui/normalize.css/reset.css` | Reset CSS                               | **首版延期**；未来版本单独决策              |
| `@adui/normalize.css/a11y.css`  | A11y CSS                                | **首版延期**；未来版本单独决策              |
| `@adui/normalize.css/forms.css` | Forms CSS                               | **首版延期**；未来版本单独决策              |
| `@adui/normalize.css/all.css`   | 经评审的组合 CSS                        | **首版延期**；未来版本单独决策              |

首版只规划 `@adui/normalize.css` 根入口，**不发布四个候选子路径**；未来版本可重新评审。开发工具链统一 Vite+（[ADR-0005](adr/0005-viteplus-toolchain.md)），但 CSS-only 的 `vp pack` 产物适配仍需在 W-04 实测，不能提前承诺 JS 入口或已编译 CSS。目前 `package.json` 已配置 `files: ["dist"]` 和 `sideEffects: ["**/*.css"]` 并通过离线打包文件清单预检，但**没有可用 CSS、exports 或生产构建证明**。具体 exports、CSS 文件名与编译方式仍须在实际开发后做构建验证，参阅 [ADR-0003](adr/0003-mvp-package-contract.md)、[W-04 包交付验收研究](plans/CSS_PACKAGE_DELIVERY_REVIEW.md) 和 [实施计划](plans/MVP_IMPLEMENTATION_PLAN.md)。

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

### Cascade Layers（首版已决定）

- [ADR-0002](adr/0002-cascade-layers.md) 已接受：**首版默认 CSS 不内建 `@layer`**。
- 仅逐条评估 `:where()` 的必要性和 CSS 优先级；不能承诺消费者不受导入顺序影响。
- 命名层、组合入口与可选模块属于后续独立设计议题。

## 5. 数据模型、状态机、接口与并发

本项目作为静态 CSS 包，**不需要数据库、持久化数据模型、运行时 API、鉴权、事务或并发状态机**。唯一需要的结构化数据是设计和测试时的规则元数据（格式待定）。

## 6. 测试设计（未来工作）

| 用例类别     | 场景                                                                | 需求            | 状态   |
| ------------ | ------------------------------------------------------------------- | --------------- | ------ |
| 规则静态审查 | 默认模块禁止高侵入全局声明；选择器和注释合理                        | FR-001、NFR-001 | 未实现 |
| 原生语义     | button、input、select、textarea、fieldset、details、dialog、summary | FR-001/002/004  | 未实现 |
| 浏览器差异   | Chromium / Firefox / WebKit 前后对照                                | NFR-002/003     | 未实现 |
| 交互无障碍   | 键盘焦点、高对比度、减少动画设置                                    | FR-003          | 未实现 |
| 组件库回归   | Element Plus / Ant Design / TDesign 的表单与弹窗等                  | NFR-007         | 未实现 |
| 包导出检查   | npm tarball 中所有公开路径存在且可解析                              | FR-005/006      | 未实现 |
| 体积与许可证 | 原始/Gzip 比较、许可证归属与发布清单                                | NFR-004/006     | 未实现 |

**禁止**用单元文本检查代替浏览器对照并宣称兼容性通过。

## 7. 异常与向后兼容

- 不支持特性的浏览器优先维持可用的原生交互，不使用不必要的破坏性覆盖。
- 规则变更若可能影响消费者样式，应视为潜在破坏性变更，提供变更说明和回归证据。
- 发布导出路径、版本策略和升级说明在真实打包与测试环境确定后再冻结。

## 8. 补充研究（规则证据尚未批准）

- [规则候选](research/RULE_REVIEW.md)、[首批证据审查](research/RULE_EVIDENCE_BATCH1.md) 与 [竞品研究](research/COMPETITOR_REVIEW.md)：用于规则证据审查，不代表实现。
- [浏览器支持矩阵](research/BROWSER_REVIEW.md) 和 [表单规则研究](research/FORM_CONTROLS_REVIEW.md)：最低**测试目标已批准**，但未做任何实际浏览器测试；不代表已完成正式支持验证。
- [ADR-0002](adr/0002-cascade-layers.md)：**Accepted**，首版不内建 `@layer`。
- [ADR-0003](adr/0003-mvp-package-contract.md)：**Accepted**，单一默认 CSS 入口；具体构建行为待验证。
- [ADR-0004](adr/0004-browser-support-policy.md)：**Accepted**，Baseline 2023 为特性准入参考；[七项最低测试目标](research/BASELINE_2023_MAPPING.md) 已批准并复核时间线，正式支持声明尚待实测。
- [ADR-0005](adr/0005-viteplus-toolchain.md)：**Accepted**，开发工具链统一 Vite+；[工具链研究](research/VITEPLUS_TOOLCHAIN_REVIEW.md) 仅查阅官方文档，未运行。
- [开发准入清单](research/REVIEW_GATE.md) 与 [实施计划](plans/MVP_IMPLEMENTATION_PLAN.md)：任务和实施门槛。
- [第三批规则证据审查](research/RULE_EVIDENCE_BATCH3.md)：排版、Reset、系统偏好等剩余 17 条规则的来源与风险。

## 9. 未决事项

Baseline 2023 映射候选版本能否在实际浏览器和 OS 上兑现；纯 CSS 在 Vite+ 内采用哪种打包方式；开发工具链实际版本、组件库 Fixture 版本与 npm 发行支持范围。**首版不发布 `all.css`，默认不内置 `@layer` 的架构选择已经 Accepted，不再视为未决选型。**

**更新约定**：对外 CSS 导出、模块边界、单条关键规则、测试设计变化时维护本文件；高层变化同步 [ARCHITECTURE](ARCHITECTURE.md) 与 [ADR](adr/0001-css-base-strategy.md)。
