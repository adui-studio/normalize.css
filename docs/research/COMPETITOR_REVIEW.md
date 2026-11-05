# Normalize/Reset 竞品源码对照

**状态**：研究草案，研究时间 2026-11-03；仅阅读公开源码/README，不代表测试其跨浏览器兼容性。

| 对象                                                                                                           | 源码核验的定位                                                             | 可借鉴                 | 应避免照搬                       |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------- | -------------------------------- |
| [CSSTools Normalize](https://github.com/csstools/normalize.css/blob/main/normalize.css)                        | 跨浏览器基础差异；多数规则使用低特异性 `:where()`；另提供 opinionated 版本 | 按浏览器差异审查规则   | 历史兼容补丁、硬编码 dialog 视觉 |
| [modern-normalize](https://github.com/sindresorhus/modern-normalize/blob/main/modern-normalize.css)            | 简洁规则，含 box-sizing、全局 margin、字体偏好                             | 控制体积与现代默认     | 将通用设计偏好视为纯 Normalize   |
| [sanitize.css](https://github.com/csstools/sanitize.css/blob/main/README.md)                                   | 基础样式与 forms/typography/reduce-motion 等可选文件                       | 模块化、规则注释       | 全局排版、背景、自动主题         |
| [browserux.css](https://github.com/Effeilo/browserux.css/blob/main/README.md)                                  | v5 CSS Layers + 原生交互 + 系统偏好 + 模块化 bundles                       | 原生交互和渐进增强测试 | 默认重绘表单、滚动条、dialog     |
| [Tailwind Preflight](https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/preflight.css) | 为 utility-first 重置标题、列表、margin/padding/border 等                  | 冲突测试               | 全局 Reset 进入默认入口          |
| [UnoCSS Reset](https://github.com/unocss/unocss/tree/main/packages-presets/reset)                              | 分发多种 Reset，其构建脚本复制 CSSTools Normalize、sanitize.css 样式       | 多方案共存测试         | 视为全部由 UnoCSS 独立发明的规则 |

**规则来源**必须记录源文件、许可证和固定提交 SHA，且需要确认语义/用途一致；**成熟竞品已采用的同用途规则免逐浏览器重复实测**，对本库独有风险仍做针对性检查；不要复制完整第三方样式。相关包的许可证并不相同：CSSTools Normalize、sanitize.css 声明 CC0-1.0，modern-normalize、browserux.css 及部分 Tailwind/UnoCSS 包声明 MIT；后续实际借用须复核具体文件。

## 2026-11-05 · 成熟竞品证据复用的维护者决定

- 本项目唯一 R-003（`b, strong { font-weight: bolder; }`）已出现在 [necolas/normalize.css](https://github.com/necolas/normalize.css/blob/master/normalize.css)、[modern-normalize 3.0.0 固定版本](https://app.unpkg.com/modern-normalize@3.0.0/files/modern-normalize.css)，并与 [WHATWG HTML 建议渲染样式](https://html.spec.whatwg.org/multipage/rendering.html#phrasing-content-3) 一致。
- 维护者决定：**同选择器、同声明、同用途且低侵入的成熟竞品规则，复用已有标准和上游证据，不再要求逐浏览器重复验证该规则**。不自动采纳其他 35 条候选，更不批量复制竞品全套 Reset。
- 仍须区分第三方实际采纳、规范依据、本库自身包装/层叠风险与完整目标版本实测结果；不能将竞品现行支持声明转换成本库七项历史版本 PASS。具体执行口径见 [ADR-0004](../adr/0004-browser-support-policy.md) 与 [P-05](W07_P05_BROWSER_EVIDENCE_MATRIX.md)。

## 本项目的明确定位

默认 CSS 只纳入必要且可证明的跨浏览器差异修复；Reset、Forms、A11y 是可选设计。对浏览器引擎、UI 组件、无障碍和原生语义的影响，需要通过 [规则准入表](RULE_REVIEW.md) 与 [浏览器矩阵](BROWSER_REVIEW.md) 独立验收。

**补充限制**：第三方更新频率、README 宣称的兼容性或测试脚本存在性，不能替代本项目真正执行的浏览器检查。
