# W-06 / Preflight / UnoCSS Reset 源码审查记录

- **审查日期**：2026-11-04
- **状态**：上游源码已核对；规则冲突为**待浏览器验证的风险预测**，不是兼容性测试通过记录。
- **关联**：[HARNESS §6](../HARNESS.md)、[REQUIREMENTS](../REQUIREMENTS.md)、[SDD](../SDD.md)
- **范围**：TDesign Vue Next 的 Reset 边界、Tailwind CSS v4 Preflight、UnoCSS Reset tailwind-v4 / tailwind-compat；不涉及本项目 CSS 实现。

## 1. 已固定的上游源码证据

以下是本次审查所用的 **Git 提交快照**，并非已安装的 npm 版本或当前产品支持范围。以后实际执行 Fixture 时，仍须记录**安装版本、锁文件、发布包 CSS 哈希、打包产物**，不能自动将主分支源码等同于 npm 发布产物。

| 方案             | 固定快照                                                                                               | 本次核对文件                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tailwind CSS     | [2626ae6](https://github.com/tailwindlabs/tailwindcss/commit/2626ae6ceddf36069ab6d55c53a5857c1e2e360a) | [index.css](https://github.com/tailwindlabs/tailwindcss/blob/2626ae6ceddf36069ab6d55c53a5857c1e2e360a/packages/tailwindcss/index.css)、[preflight.css](https://github.com/tailwindlabs/tailwindcss/blob/2626ae6ceddf36069ab6d55c53a5857c1e2e360a/packages/tailwindcss/preflight.css)                                                                                                                                                    |
| UnoCSS           | [f8d08ca](https://github.com/unocss/unocss/commit/f8d08ca55176955a331911b2fd55738fe6c7c493)            | [tailwind-v4.css](https://github.com/unocss/unocss/blob/f8d08ca55176955a331911b2fd55738fe6c7c493/packages-presets/reset/tailwind-v4.css)、[tailwind-compat.css](https://github.com/unocss/unocss/blob/f8d08ca55176955a331911b2fd55738fe6c7c493/packages-presets/reset/tailwind-compat.css)、[Wind4 选项定义](https://github.com/unocss/unocss/blob/f8d08ca55176955a331911b2fd55738fe6c7c493/packages-presets/preset-wind4/src/index.ts) |
| TDesign Vue Next | [9325818](https://github.com/Tencent/tdesign-vue-next/commit/9325818db2a69debce4df5bdf126dafdbebe1f56) | [getting-started.md](https://github.com/Tencent/tdesign-vue-next/blob/9325818db2a69debce4df5bdf126dafdbebe1f56/packages/tdesign-vue-next/site/docs/getting-started.md)                                                                                                                                                                                                                                                                  |

## 2. 已确认的源码事实

1. **TDesign**：官方入门 FAQ 说明自 0.17.0 起不再默认引入 `reset.less`，如需要可单独加载 `tdesign-vue-next/dist/reset.css`。因此 W-06 的 T0/T1/T2 必须清点真实 CSS 清单；不应默认声称“所有 TDesign 安装方式都没有额外 Reset”。
2. **Tailwind v4**：其 `index.css` 先定义 `@layer theme, base, components, utilities`，再将 `preflight.css` 作为 `base` 层导入。**这一事实只适用于对应入口**，直接使用独立 CSS 文件时需要核实自己的 `layer(...)` 包装和最终产物。源码内还含需由 Tailwind 处理的 `--theme(...)` 表达式，必须验证构建后是否正确解析。
3. **UnoCSS tailwind-v4**：该文件本身没有 `@layer` 声明；独立加载后是否处于层内取决于消费者的 CSS 导入/构建方式。它具有与 Tailwind v4 相似的全局 Reset，但字体等声明并非完全一致，不能将两个产物视作二进制或语义完全相同。
4. **UnoCSS tailwind-compat**：其独立入口基于较早的 Tailwind 风格。按钮专用规则注释掉了 `background-color: transparent`；按钮光标设置、placeholder 色值及部分 `hidden` 处理也不同。不能当作 `tailwind-v4.css` 的仅更名版本。
5. **UnoCSS presetWind4**：选项声明中的 `preflights.reset` 默认是 `true`。若加载独立 `@unocss/reset` 又启用该预设默认 Reset，会破坏单一 Reset 的实验条件。

## 3. 冲突候选与测试优先级（推断，待实测）

| 优先级 | 元素/属性                                                                  | 源码观察                                                                                                                      | 需要证明或否证的问题                                         |
| ------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| P0     | TDesign Button/Input 的 `box-sizing`、`border`、`font`、`background-color` | Tailwind v4 / UnoCSS tailwind-v4 均有较广泛的盒模型与表单重置；TDesign Reset 可独立引入                                       | 是否存在不受控的全局 Reset；组件库样式是否被覆盖             |
| P0     | CSS Cascade Layers                                                         | Tailwind 标准入口进入 `base` 层；UnoCSS 独立 Reset 文件不自带 `@layer`                                                        | 正反导入顺序是否真正改变优先级；未分层作者样式是否优先       |
| P0     | `[hidden]` 与 `[hidden="until-found"]`                                     | Tailwind v4 / UnoCSS tailwind-v4 使用特定选择器加 `display: none !important`；compat 入口的 `display: none` 没有 `!important` | 隐藏行为与业务强制显示的优先级是否不同；不得破坏 until-found |
| P1     | `h1`–`h6`、`ol`、`ul`、margin/padding                                      | Tailwind v4 / UnoCSS tailwind-v4 清理标题字体与列表标记，且全局去除间距                                                       | 是否违背本项目“默认不清除所有间距、不抹除原生语义”的设计红线 |
| P1     | `button`、`[role="button"]` 的 cursor                                      | compat 提供 `cursor: pointer`，Tailwind v4 默认光标策略不同                                                                   | 用户可感知的悬浮态、disabled 光标是否出现区别                |
| P1     | `input::placeholder`、`textarea::placeholder`                              | compat 使用固定浅灰色；v4 体系采用不同的占位符颜色策略                                                                        | 与组件库输入框颜色、深色模式/强制色是否冲突                  |
| P2     | `img`、`video`、`svg` 的 `display` / `max-width`                           | 多个 Reset 具有块级展示及宽度限制                                                                                             | 是否影响图标、组件内部 SVG 或图片纵横比                      |

**归因提醒**：规则出现不等于发生了冲突；必须根据真实加载顺序、origin、importance、layer、specificity、作用域和声明次序判断。独立 UnoCSS Reset 默认无层这一点与 Tailwind 标准入口的 `base` 层是结构差异，不应只交换 import 文本就宣称已验证顺序敏感性。

## 4. 下一步验证的最小证据

- **先 W-06**：冻结 TDesign/Vue/浏览器版本；列出所有加载样式与来源；完成 Chromium、Firefox、WebKit 的 T0/T1/T2 计算样式、截图和交互。若不存在真实 `@adui/normalize.css` npm 产物，T2 标记 **阻塞**，不得冒用临时路径。
- **再 Tailwind**：仅加载 Preflight，比较 B0/B1/B2；确认 `@layer base` 是否存在、`--theme(...)` 是否由实际构建处理，记录最终 CSS。
- **再 UnoCSS**：仅加载一种 `@unocss/reset` 文件，并排除 Wind4 内置 Reset；C0/C1/C2 和 C-compat 分开执行。优先对照 Button、Input、`[hidden]` 与标题、列表。
- **每组结果**：记录“源码已核对 / 浏览器已运行 / 结论 / 未覆盖”四类不同事实。差异出现后先归因，不直接修改默认 Normalize 规则。

## 5. 决策边界

本次仅是技术研究。尚未批准 `@layer` 的正式使用方式、默认 Normalize 规则、最低浏览器版本与 npm 公开导出；仓库仍无 CSS 源码、可执行 Fixtures、已发布包、真实跨浏览器验证。**不安装依赖、不增加 CI、不据此宣称兼容性通过。**
