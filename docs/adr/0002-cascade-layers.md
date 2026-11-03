# ADR-0002 — 默认 Normalize 是否内置 Cascade Layers

- **状态**：Accepted（2026-11-03，维护者明确同意方案 B）
- **日期**：2026-11-03
- **关联**：[ADR-0001](0001-css-base-strategy.md) · [架构](../ARCHITECTURE.md) · [SDD](../SDD.md) · [浏览器研究](../research/BROWSER_REVIEW.md)

## 背景

模块化 CSS 的加载顺序、零特异性以及与 Tailwind/UnoCSS 的共存，都会影响宿主作者样式的优先级。目前仓库没有 CSS 源码和浏览器 Fixture，不应该提前把 Layers 选为正式对外契约。

## 候选

| 选项 | 优点 | 风险 |
| --- | --- | --- |
| A：默认 CSS 内建命名 `@layer` | 通常便于用户未分层普通规则覆盖 | 与第三方层声明的首次顺序、`!important` 反转、旧浏览器的规则忽略问题 |
| B：默认 CSS 不内建 Layers（**首版已接受方案**） | 最接近普通 CSS 导入语义，避免默认引入额外层结构 | 仍需控制选择器特异性及导入顺序 |
| C：同时发布有层/无层版本 | 使用者自由选择 | 增加产物/导出/重复引入的维护成本 |

## 已核实的层叠事实

参见 [MDN Cascade Layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)：

1. 同源普通声明中，**未分层**规则优先于**分层**规则。
2. 对 `!important` 声明，层顺序反转：较早声明的层中 important 规则优先于较晚的层，分层 important 优先于未分层 important。
3. 层顺序由第一次创建决定，后续重新声明不能排序已有层。
4. `:where()` 将选择器特异性降为零，但不能消除层、重要性或加载顺序问题。

## 决策（已接受，尚未实现）

首版默认 Normalize 入口**不内置 `@layer`**；逐条评估 `:where()` 的适用性、覆盖行为及低版本特性边界。用户可以研究在消费端 CSS 中自行包装导入到层，但这涉及 `@import` 的顺序与构建器语义，尚未验证，不能作为已支持功能宣传。

## 必须完成的验证（将来仅本地进行）

- Layer 内外普通声明的优先级以及 `!important` 反转。
- 同层/跨层 `:where()` 和组件类名选择器的覆盖效果。
- 多个独立 CSS 模块的首次层声明顺序和重复导入行为。
- Tailwind Preflight、UnoCSS Reset 与现有组件库的冲突场景。
- CSS `@import` 自定义分层与 JS 引入样式的差异。
- 不支持 `@layer` 时有无整段样式被忽略的风险；实际 Safari/iOS 的验证范围。

## 接受记录与验证界限

2026-11-03 维护者明确接受方案 B；ADR-0001 同样已接受。上述层叠测试仍是**实际实现和发布前的验收条件**，不是将 ADR 状态保持 Proposed 的理由。此决策仅约束首版默认入口；未来如需分层可选产物，应新增决策而非静默改动。未经另行开发授权，不编写 CSS；永不增加 CI，发布须单独授权。
