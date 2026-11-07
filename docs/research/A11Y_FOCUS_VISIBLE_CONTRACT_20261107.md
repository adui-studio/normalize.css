# A11y · :focus-visible 启发式与可选模块边界审查

**日期**：2026-11-07  
**追踪**：[Issue #45](https://github.com/adui-studio/normalize.css/issues/45)  
**核对基线**：`main@72e2c0b8d6883b2e21fea326ee3e28687cf00abc`；已发布 `@adui/normalize.css@0.1.0`  
**性质**：资料和已发布 CSS 语义审查、文案修订候选，**不是新增 CSS 规则或已确认的组件兼容缺陷**。

## 一、实际产品行为（以仓库源码为准）

`src/a11y.css` 是显式引入的可选模块，不会从默认 `@adui/normalize.css` 隐式加载；`all.css` 会引入它。该文件目前只有三组样式：

| 声明 | 生效边界 | 不得承诺 |
| --- | --- | --- |
| `:where(:focus-visible)` → `outline: 2px solid currentColor`、`outline-offset: 2px` | 浏览器决定焦点元素是否匹配伪类；作者可在应用层定制 | **不是“只有键盘才能匹配”**；不保证所有鼠标聚焦都没有轮廓，也不确保在任意组件样式之上生效 |
| `@media (forced-colors: active)` → `:where(:focus-visible) { outline-color: Highlight; }` | 命中系统强制颜色媒体条件时指定系统色，实际绘制可能受 UA 强制颜色处理 | 不能从声明本身推出任何高对比度主题中一定足够可见 |
| `@media (prefers-reduced-motion: reduce)` → `:root { scroll-behavior: auto; }` | 在该媒体条件下影响根元素的滚动行为；级联仍适用 | 不会全局关闭组件动画、过渡或独立滚动容器的平滑滚动 |

注意：现行 `src/a11y.css` 注释 `Keyboard focus stays visible without changing mouse-only focus behavior.` 可能被理解成“鼠标无法触发 `:focus-visible`”。**本次只修订对外文档，不修改 `src/` 源码文件**，待用户明确授权编辑产品 CSS 文件（即使仅注释）时再改正对应内部注释。

## 二、上游标准与关键事实（非本项目浏览器实测）

1. [CSS Selectors 4 §9.4](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo) 将 `:focus-visible` 的匹配判断交给用户代理的焦点提示启发式；文本输入等可接受键盘输入的元素即使来自指针焦点，也可能需要轮廓。该条列出的启发式属于**非规范性建议**，不同浏览器实现与用户偏好可能不同。
2. [W3C WCAG 技术 C45](https://www.w3.org/WAI/WCAG22/Techniques/css/C45.html) 同样明确：鼠标/指针通常不触发，但可接受键盘输入的元素（例如 `input`）是例外；C45 是**满足 WCAG 的技术示例，不是必须按此实现的唯一规范**。
3. [WebKit 的 :focus-visible 行为说明](https://webkit.org/blog/12179/the-focus-indicated-pseudo-class-focus-visible/) 举例说明文本输入框的可见焦点指示与最初使用鼠标/键盘无关。它支持行为设计理解，**不能推导所有 Safari 版本已经过本仓库验收**。
4. [MDN CSS specificity / :where()](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity)：`:where()` 为 `0-0-0` 特异性。`0-0-0` **不意味着**层叠不受 CSS origin、`@layer`、`!important` 和加载顺序影响。
5. [MDN forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors)：强制颜色模式下 `outline-color` 等颜色属性可能被浏览器按系统调色板替换。仅检查计算值与 `matchMedia` 不等价于真实屏幕上的对比度/焦点可见性。

## 三、用户侧使用契约（中英文 README 同步）

- **键盘焦点**：A11y 为实际匹配 `:focus-visible` 的元素提供低特异性轮廓，主要服务键盘和其他需要焦点提示的交互方式。
- **指针与文本输入**：鼠标聚焦 `input` 或 `textarea` 时依然可能出现轮廓，这是 UA 启发式行为而不是单独的库缺陷。
- **组件级定制**：如果 Element Plus、TDesign、Ant Design 等组件有自己的焦点指示，应核对真实级联赢家，避免无依据地使用 `outline: none` 或用 `!important` 抢占组件设计。
- **系统偏好**：本库会在 forced-colors 条件下尝试使用系统色，在 reduced-motion 条件下只调整根滚动；这不构成完整的无障碍认证或特定浏览器最低版本保证。

## 四、复用现有 M0/M1 的定向验证清单（无需再建 Fixture）

当前 `fixtures/modules-native.html` 和 `fixtures/modules-all.html` 已包含 `button`、文本 `input`、`textarea`；`window.__aduiModuleCapture()` 可读取焦点目标、`:focus-visible` 匹配结果、outline 及媒体偏好。先在本地构建 `pnpm exec vp pack`，以实际 `pnpm exec vp dev` 的 HTTP 地址打开两页。M0 原生、M1 显式加载 `all.css`；无需为本 Issue 新增脚本。

| 操作 | 观察 | 通过/例外判定 |
| --- | --- | --- |
| 真实 Tab 聚焦 `module-button` | `focus.id`、`focusVisible`、`outlineWidth/Style/Color`、视觉截图 | 预期提供清晰焦点提示；如页面作者覆盖则需检查规则来源，不可仅看 `matches()` |
| 鼠标点击 `module-button` 与可输入 `module-input` | 同字段及输入是否可编辑 | **允许**文本框由鼠标聚焦后 `:focus-visible=true`；不以“点击后都不显示”为验收条件 |
| 作者自定义 `:focus-visible`（仅在应用或 DevTools 临时声明） | CSS origin、layer、specificity、source order 与最终 `outline` | 不直接修改本仓库产品 CSS；记录真实获胜声明和应用覆盖能力 |
| Windows 真正开启强制颜色 | 系统主题、`media.forcedColors`、焦点实际可见性 | 需真实 OS 主题和截图；浏览器 DevTools 模拟与真机结果分开 |
| 真正开启减少动画 | `media.reducedMotion`、`rootScrollBehavior` | 仅核验视口根滚动；别把独立组件动画继续运行视为本库失效 |

**记录要求**：浏览器完整 build、OS 和主题、页面 URL、M0/M1 JSON 或截图、键鼠操作顺序、CSS 加载与 DevTools 来源；敏感本地路径可脱敏。若缺实际交互/原始数据，记录 `EVIDENCE_MISSING` 或维护者报告，不写成逐浏览器独立 `PASS`。

## 五、研究决定与尚未完成的事项

- **研究结论**：`:focus-visible` 的指针例外已经由标准和浏览器资料解释；**目前没有证据证明已发布 A11y CSS 存在必须修复的功能性 Bug**。因此建议当前规则 **KEEP**，先同步中英文用户说明。
- **此次修改**：仅 README.md/README.en.md 与工程研究/上下文/验收指引文档，产品 `src/a11y.css` 注释及声明、公开 CSS exports、依赖、CI、版本和 Tag/Release **不变**。
- **待确认**：Windows 真实 forced-colors、reduced-motion、文本框 pointer-focus 的版本化样本；真实组件样式层叠冲突是否存在；是否授权将 `src/a11y.css` 内部英文注释修改为更准确的 UA heuristic 描述。
- **关闭条件**：维护者认可本次对外契约澄清，且未报告具体回归，可按“研究完毕、产品声明不变”结项；若提交真实可复现问题，再另立最小缺陷修复范围。此文档本身不是完整浏览器验收 PASS。
