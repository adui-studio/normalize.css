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

## 2026-11-05 · MVP 发布后：Normalize CSS 本体的竞品规则重新评估（待审方案）

> **澄清范围**：本节研究的是 `src/normalize.css` 的**实际规则集合**，不是 npm `keywords` 或 README。维护者指出：已经发布的 `0.0.1` 默认 CSS 只有 `b, strong { font-weight: bolder; }`，希望参照竞品“取其精华、去其糟粕”，形成更具实际价值的下一代规则方案。
>
> **决策状态**：竞品代码已核对，下面是**重新评审建议**，**没有推翻 W-05 已批准的首版 36 条去留结论**，更不代表这些规则已实现或通过本项目测试。旧版本 `0.0.1` 无法原地替换；新的 CSS 规则必须走新的变更与发布版本，**与仅修复 npm 元数据的 Draft PR #16（0.0.2）分开**。

### 一、实际对照源码及固定快照

| 竞品及核对的源码快照 | 观察到的 CSS 策略 | 借鉴点与不宜照搬内容 |
| --- | --- | --- |
| [necolas/normalize.css 8.0.1](https://github.com/necolas/normalize.css/blob/fc091cce1534909334c1911709a39c22d406977b/normalize.css) | 传统跨浏览器兼容，包含 html、hr、abbr、表单、IE 时代修复 | 保留历史 Bug 线索；不照搬 IE/旧 Edge 专项补丁和全局 body margin 重置 |
| [modern-normalize 3.0.1](https://github.com/sindresorhus/modern-normalize/blob/076c61bd806ba4770a8d766d8e63903e4fb0dfa6/modern-normalize.css) | 较简洁，同时重设 box-sizing、根字体栈、body margin、表单样式 | 借鉴精简、规则注释；盒模型/字体/间距是设计偏好，不能冒充无侵入 Normalize |
| [CSSTools normalize.css](https://github.com/csstools/normalize.css/blob/0774d1043e07ba868f157ff7bb1cd0bbb0a2871c/normalize.css) | 多数元素规则采用 `:where()`，涉及 abbr、table、hr、summary、progress、表单和 dialog | 借鉴低特异性、逐条浏览器差异审查；dialog 颜色/外观以及旧 WebKit 规则不可直接抄用 |
| [CSSTools sanitize.css](https://github.com/csstools/sanitize.css/blob/09f98b4c1e4f008805fb5947ff9bd1a9d8ab46ad/sanitize.css) | 更完整的 CSS 基础层，包含 box-sizing、背景不重复、tab、导航列表、媒体样式等 | 借鉴基础层的**模块组织**；大范围 opinionated 样式不能自动进入默认模块 |
| [Tailwind Preflight](https://github.com/tailwindlabs/tailwindcss/blob/6430ecba9788983e77493c36c3c9442b2d3f2cca/packages/tailwindcss/preflight.css) | utility-first 的全局 Reset：标题、列表、按钮、媒体、表单等 | 作为**叠加/冲突回归对照组**；不是默认 Normalize 实现清单 |
| [browserux.css 5.0.1](https://github.com/Effeilo/browserux.css/blob/ad66eef36a4124d59496e289f557b7accc5e02d0/browserux.css) | CSS Layers、设计令牌、色彩主题、系统偏好、原生 UI、对话框动效等 | 借鉴可选增强和用户偏好回归的思路；不引入其主题、tokens、全局交互重绘或默认 `@layer` |

源码核对不等于本项目已复现实机浏览器差异。借鉴**思路与用途**而不是复制一整套竞品文件；具体采纳时核对许可证、规则适用范围及版本。

### 二、36 条既有规则的下一版本候选分类

| 原规则/场景 | 竞品共性与有用之处 | 下一阶段建议 | 不直接进入当前默认 CSS 的原因 |
| --- | --- | --- | --- |
| **R-003** `b,strong` 相对字重 | necolas、modern-normalize、CSSTools 均包含相同意图 | **保留已实现** | 已在 `0.0.1` 发布，不需要重复开发 |
| **R-007** `abbr[title]` 点线下划线 | necolas、CSSTools 均有 | **默认 Normalize 优先复审** | 仓库已记录 2024 年 WebKit 上游修复，先排除已过时的补丁；不要求对成熟规则无意义地重复七环境历史测试 |
| **R-008** `table` 的 `border-color: currentColor` | modern-normalize、CSSTools 均有 | **默认 Normalize 优先复审** | 仓库已记录 WebKit 修复，需明确规则是否仍对目标环境产生实际净收益；不能把“竞品有”直接等同“必须加” |
| **R-009** `hr` 盒模型/高度 | necolas、CSSTools 均有 | **默认 Normalize 次级复审** | 可能影响原生分隔线高度、边框与 `size` 属性；不能无条件统一 |
| **R-011** `summary { display:list-item }` | necolas、modern-normalize、CSSTools 均有 | **只复审受限选择器** | 无条件匹配所有 `summary` 范围过宽；应保留 `details` 折叠、marker 和键盘交互 |
| **R-010** `progress` 的 `vertical-align:baseline` | necolas、modern-normalize、CSSTools 均有 | **暂缓** | WHATWG 对原生对齐的建议不必然是 baseline，可能改变原生视觉 |
| **R-001/002/004/005/006** 根行高、移动文字调整、等宽字体/字号、small、上下标 | 多家竞品含这些老规则或设计偏好 | **维持默认暂缓** | 字体、字号、排版、可读性和用户偏好影响较大；尤其已明确排除 `monospace,monospace` 与 `font-size:1em` |
| **R-012～016** 表单 margin、search appearance、WebKit 搜索/文件控件、placeholder | 传统 Normalize 中普遍存在 | **保留研究，优先在 Forms 中按需选用** | 存在原生控件视觉和系统偏好差异，第三方 UI 组件库可能冲突 |
| **R-020～025** body margin、全局 border-box、标题/列表/媒体/table 重置 | modern-normalize、sanitize、Preflight 有对应样式 | **明确归属可选 Reset** | 这是布局/视觉 Reset 而不是必须修复的浏览器 UA Bug |
| **R-026** 表单字体继承 | modern-normalize、Preflight 等采用 | **优先纳入可选 Forms 设计审查** | 会改变原生控件尺寸和组件库字体；需要显式 opt-in |
| **R-031** 有限 `:focus-visible` 增强 | 部分可选 A11y 方案支持 | **可选 A11y** | 保留现有原生焦点，不在默认库中强制覆盖 |
| **R-017/019/029/030/032～034/036** dialog 强制主题、hidden 强制隐藏、动效全禁、outline:none、主题/滚动条、点击高亮、全局断词/字体 | 某些综合 Reset/UX 库采用 | **维持排除默认** | 侵入性强，可能破坏 `hidden="until-found"`、原生对话框、键盘焦点或用户系统偏好 |

R-018、R-027、R-028、R-035 等未列为当前优先项，仍沿用 [36 条规则评审](RULE_REVIEW.md) 的原决定；**不是遗漏后自动准入**。

### 三、推荐的实现路线（不是实现指令）

1. **只改进真正的 Normalize**：先形成 R-007、R-008 的“成熟规则当前必要性”复核结论，接着评估 R-009 与范围受限的 R-011。优先审查**是否会意外改变现代 UA 正常行为**，不为了凑规则数加入。
2. **单独设计可选模块**：Reset 优先考虑明确 opt-in 的 `box-sizing`、`body margin` 等；Forms 优先研究 `font:inherit` 与文件上传按钮。二者在新公开子路径可用之前，**必须更新 ADR/SDD、exports 契约、实际 tarball/消费者测试、README**；不得先在文档宣称可安装。
3. **低侵入约束不变**：默认不加全局 `@layer`、不清空全部间距、无全局字体栈/主题/滚动条/动画禁用；不因竞品使用了 `:where()` 就给所有元素无条件降特异性。每条规则的选择器和层叠级别仍要审查。
4. **验证分级**：对 WHATWG 和成熟竞品已广泛采用、**相同选择器/声明/用途**的规则，可按维护者 P-05 决定复用既有浏览器规范依据，免逐浏览器重复历史验证；但新组合、导出路径、叠加 Reset、组件库、键盘交互与特有风险仍应使用现有本机 Harness 做相应回归，不能谎称未经执行的七环境 PASS。
5. **版本隔离**：已发布 `0.0.1` 不变；Draft PR #16 的 `0.0.2` 仅为 Keywords 元数据修复；如果启动新增默认 CSS 规则或可选模块，应**新建独立功能任务与发行版本评审**（例如先评估 `0.1.0`），不夹带在 Keywords 补丁中。

**待评审的核心取舍**：是否坚持“默认 Normalize 极简 + Reset/Forms/A11y 可选”，还是明确批准改为更完整、较具主张性的基础样式库。当前五项 ADR 和 W-05 已批准前者；如决定改变，需先修订设计/规则准入，再实现 CSS，且不得悄悄改写历史记录或重新发布旧版。

