# ADR-0003 — 首个可用版本的模块与 npm 导出边界

- **状态**：Proposed（待维护者批准）
- **日期**：2026-11-03
- **关联**：[REQUIREMENTS](../REQUIREMENTS.md) · [SDD](../SDD.md) · [ARCHITECTURE](../ARCHITECTURE.md) · [ADR-0001](0001-css-base-strategy.md) · [ADR-0002](0002-cascade-layers.md)
- **当前事实**：没有 `package.json`、没有 CSS 产物、没有实际 npm 包、没有浏览器回归测试。

## 1. 问题

面对默认 Normalize、可选 Reset / A11y / Forms 和组合 `all.css`，首个可用版本应承诺多少公共入口？过早公开路径会形成兼容性义务；过多的默认/组合入口可能引发重复重置、层叠顺序与组件库冲突。

## 2. 备选方案

| 方案 | 公共范围 | 好处 | 主要代价 |
| --- | --- | --- | --- |
| A：只冻结默认 Normalize 与规则证据（**当前建议**） | `@adui/normalize.css`，可按评审决定显式 `/normalize.css` 别名 | 边界最小，符合 FR-001/006/007 的 MVP 意图，减小测试矩阵 | Reset/Forms/A11y 不能在首版使用，需后续独立评审 |
| B：默认 + 三个可选模块同一版推出 | 默认 + `/reset.css`、`/forms.css`、`/a11y.css` | 模块化故事完整 | 每个入口都需要浏览器与组件库回归、包导出验证 |
| C：同时发布组合 `/all.css` | 以上 + all.css | 一次导入便捷 | 重复导入、顺序、规则冲突风险增加；“all”语义较难长期稳定 |

**提出方案 A，不代表批准或开始开发。** 现有 FR-002/003/004/005 与 SDD 路径保持“待评审、未实现”，并非从长期设计中删除。

## 3. 候选契约（不能用于安装）

- **默认只承担 Normalize**：仅对有证据的浏览器差异进行最小修正，不隐式导入 Reset、Forms、A11y。
- **API 尽量简单**：先评审 `@adui/normalize.css` 的 CSS 导入行为；如需显式 `@adui/normalize.css/normalize.css`，必须先说明兼容收益与重复入口维护成本。
- **可选模块未来独立**：建议其为“增量样式”，既不偷偷包含 Normalize，也不隐式互相引入。实际导入语义和顺序需用 Bundler 与原生 HTML 检验后冻结。
- **组合 `all.css` 暂缓**：不在未完成重复引入与冲突验证时公布；若未来提供需定义它包含的具体模块、版本及与独立入口互斥的规则。
- **不得提前承诺 CSS Layers**：[ADR-0002](0002-cascade-layers.md) 仍是 Proposed；首个可用版本的任何入口都不得把未采纳的 `@layer` 当作已存在的契约。
- **无 JS 运行时**：设计目标是静态 CSS；不能因为 Node 的 `exports` 机制存在，就声称所有构建工具能直接解析包根路径到 CSS 文件。

## 4. npm 包导出与 tree shaking 的具体风险

[Node.js Packages — exports](https://nodejs.org/api/packages.html) 提供精确公共子路径及封装机制，但不保证每个 CSS 构建器都以相同方式处理 CSS 入口。须在发布前分别验证 Vite/Vite+、Webpack、CSS `@import` 和产物中所有公开路径。

[Webpack tree shaking 文档](https://webpack.js.org/guides/tree-shaking/) 明确指出：仅为了副作用导入的 CSS，如果 `sideEffects:false` 被错误设置，可能在生产构建时被丢弃。因此建议**不要设 `sideEffects:false`**；若使用显式数组，应考虑 `"**/*.css"` 等模式，并在实际产物中验证。此处只是设计风险，不是已确定的 `package.json`。

需独立确认：
1. 根入口实际解析成 CSS 的工具链支持情况。
2. `exports` 与可能存在的 `style` 字段、`main` 字段的职责是否会重复/冲突。
3. 静态 CSS 的副作用标记是否使打包器保留样式。
4. 按需入口、样式导入顺序、重复导入及消费者覆盖是否满足低侵入目标。
5. npm tarball 的公开文件列表、MIT LICENSE、README 与样式内容对应关系。

## 5. 验收门槛与后续动作

**进入实现前（仅文档评审）**：
- 维护者明确选择 A/B/C，并说明可选模块发布顺序；
- 明确最低浏览器范围、是否覆盖 iOS/Android WebView；
- 冻结独立入口与组合入口的语义，避免重复 CSS 注入；
- ADR-0001/0002/0003 的冲突已处理、状态可追踪。

**进入开发后才可能实际验证**：
- 最小真实 CSS 文件、npm 打包与 Vite/Vite+/Webpack 或纯 CSS 导入对照；
- 本地浏览器基线、组件库、移动端、系统偏好回归；
- 真实 `sideEffects`、exports、gzip/raw 体积和用户覆盖测试。

## 6. 非目标与风险

不提供设计系统、组件库、浏览器 Polyfill、主题或强侵入默认 Reset。版本号、npm 发布权限、具体入口名称仍未确认。项目明确不增加 CI；任何后续自动化检查也仅可在用户明确批准的开发范围内进行本地运行。

**当前结论**：只建议将“默认 Normalize + 可追溯证据”作为首个可用版本范围，决策 **Proposed**；未实现、未测试、未发布。
