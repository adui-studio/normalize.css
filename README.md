# @adui/normalize.css

[![npm version](https://img.shields.io/npm/v/%40adui%2Fnormalize.css?style=flat-square&logo=npm&logoColor=white&color=cb3837)](https://www.npmjs.com/package/@adui/normalize.css)
[![npm downloads/month](https://img.shields.io/npm/dm/%40adui%2Fnormalize.css?style=flat-square&logo=npm&logoColor=white&label=downloads%2Fmonth&color=0891b2)](https://www.npmjs.com/package/@adui/normalize.css)
[![GitHub release](https://img.shields.io/github/v/release/adui-studio/normalize.css?style=flat-square&logo=github&logoColor=white&color=2563eb)](https://github.com/adui-studio/normalize.css/releases/latest)
[![MIT license](https://img.shields.io/github/license/adui-studio/normalize.css?style=flat-square&color=64748b)](LICENSE)
[![CSS only](https://img.shields.io/badge/runtime-CSS--only-0f766e?style=flat-square)](package.json)

**简体中文** · [English](README.en.md)

面向现代 Web 应用的轻量、模块化 CSS 标准化库。以经过评审的浏览器默认样式差异为修正对象，尽可能保留 HTML 原生语义、用户偏好及应用已有样式。

项目提供**默认 Normalize** 与显式可选的 **Reset、Forms、A11y** 模块，全部以纯 CSS 交付，**无运行时 JavaScript 依赖**。

**当前正式版本：** [v0.1.0](https://github.com/adui-studio/normalize.css/releases/tag/v0.1.0) · [npm](https://www.npmjs.com/package/@adui/normalize.css) · [更新日志](CHANGELOG.md)

## 特性

- **低侵入默认样式**：仅包含经过评审的必要规则，不统一清除元素间距、根字体、主题或控件外观。
- **模块化引入**：按需选择 Normalize、Reset、Forms、A11y，或显式引入完整组合。
- **尊重原生行为**：保留原生语义、焦点交互、列表标记和系统无障碍偏好；可选增强不会全局禁用动画。
- **可追溯的规则依据**：重要规则的用途、浏览器依据、影响范围及风险记录于项目文档。
- **纯 CSS 分发**：支持能够解析 CSS 包导入的工具链；无运行时 JavaScript 依赖。

## 安装

使用 pnpm：

```sh
pnpm add @adui/normalize.css
```

或使用 npm：

```sh
npm install @adui/normalize.css
```

在应用入口引入默认样式，通常应位于应用自定义样式之前：

```js
import "@adui/normalize.css";
```

默认入口**不会**自动引入 Reset、Forms 或 A11y。

## 模块与导入方式

| 导入路径                            | 作用                                                    |
| ----------------------------------- | ------------------------------------------------------- |
| `@adui/normalize.css`               | 默认 Normalize，仅包含 R-003、R-007、R-008              |
| `@adui/normalize.css/normalize.css` | 默认 Normalize 的显式别名                               |
| `@adui/normalize.css/reset.css`     | 可选布局 Reset：盒模型、部分间距、媒体尺寸与表格布局    |
| `@adui/normalize.css/forms.css`     | 可选表单排版：字体继承、控件间距及部分原生控件布局      |
| `@adui/normalize.css/a11y.css`      | 可选无障碍增强：可见焦点、强制颜色与减少动态偏好        |
| `@adui/normalize.css/all.css`       | 完整组合入口，依次引入 Normalize → Reset → Forms → A11y |

### 按需组合

可以在默认 Normalize 基础上引入需要的模块，例如：

```js
import "@adui/normalize.css";
import "@adui/normalize.css/forms.css";
```

如需全部模块，**只引入组合入口**，不再重复引入单独模块：

```js
import "@adui/normalize.css/all.css";
```

`all.css` 使用相对 CSS `@import` 组织模块，使用时应确保应用构建工具支持该处理方式。已经使用 Tailwind Preflight 或 UnoCSS Reset 的项目通常不需要再叠加本库的 Reset 或 `all.css`，以免重复修改全局布局样式。

### 默认 Normalize

当前默认入口仅包含以下三条规则：

```css
b,
strong {
  font-weight: bolder;
}

:where(abbr[title]) {
  text-decoration: underline dotted;
}

:where(table) {
  border-color: currentColor;
}
```

- **R-003**：保持 `b`、`strong` 的相对字重。
- **R-007**：为带 `title` 的 `abbr` 设置点状下划线。
- **R-008**：使 `table` 边框颜色遵循当前文字颜色。

R-007 和 R-008 使用 `:where()` 降低选择器特异性。规则取舍及历史兼容性风险见 [ADR-0006](docs/adr/0006-v01-default-scope-and-compatibility-risk.md)。

### 可选 Reset

`reset.css` 提供全局 `border-box` 盒模型，包括 `::before`、`::after` 伪元素，并调整部分页面间距、媒体最大宽度和表格布局。

```js
import "@adui/normalize.css/reset.css";
```

Reset 会改变现有布局的计算方式，建议根据项目已有的样式基础决定是否引入。它不会统一清除标题字号、字重或列表标记。

### 可选 Forms 与 A11y

`forms.css` 主要提供表单字体继承和必要的布局规范，不统一重绘按钮、输入框等原生控件。其部分规则会影响表单控件的外边距。

`a11y.css` 使用 `:focus-visible` 增强焦点提示，配合 `forced-colors` 使用系统色，并在 `prefers-reduced-motion: reduce` 时将根元素滚动行为设为 `auto`。它**不取消原生焦点，也不全局禁用动画**。

`:focus-visible` 的匹配遵循浏览器启发式，并不只与键盘操作有关；输入框等可编辑元素在指针聚焦后也可能匹配。详情见 [A11y 行为说明](docs/research/A11Y_FOCUS_VISIBLE_CONTRACT_20261107.md)。

## 浏览器兼容性

项目以 **Baseline 2023** 作为 CSS 特性评审参考，而非对特定浏览器最低版本的公开支持承诺。

已有验证涉及 CSS 打包、实际 npm 包消费、Vite+ 生产构建，以及部分浏览器和组件生态对照；但现有可审计记录尚未覆盖全部目标浏览器、设备、操作系统和系统偏好场景，因此**不公布未经逐版本证据支持的最低浏览器版本**。

具体范围与证据限制参见 [浏览器支持策略](docs/adr/0004-browser-support-policy.md) 和 [发行后兼容性记录](docs/research/V010_POST_RELEASE_COMPATIBILITY.md)。对于组件库及其他 CSS Reset，请在目标应用中核对导入顺序、级联层、选择器特异性和交互行为。

## 本地开发与验证

项目使用 **Vite+ 1.4.0** 与 **pnpm 12.15.0**；Node.js 版本范围为 `^22.18.0 || ^24.11.0 || >=26.0.0`。

```sh
git clone https://github.com/adui-studio/normalize.css.git
cd normalize.css
pnpm install --frozen-lockfile

pnpm exec vp pack
pnpm exec vp dev
```

执行现有本地质量检查及 Fixture 构建：

```sh
pnpm run verify:mvp
pnpm exec vp build
```

`verify:mvp` 包含格式、Lint、测试、CSS 打包、真实 npm tarball 消费检查及 npm 打包预览；`vp build` 构建本地 Fixture 页面。这些命令**不会发布 npm 包**。项目不使用 CI，相关验证由维护者在本地执行。

详见 [本地验收与交付说明](docs/MVP_0_0_1_HANDOFF.md)。

## 文档

- [需求说明](docs/REQUIREMENTS.md) · [架构设计](docs/ARCHITECTURE.md) · [详细设计](docs/SDD.md)
- [规则评审](docs/research/W05_RULE_ACCEPTANCE.md) · [兼容性验收](docs/research/W06_ACCEPTANCE_INDEX.md)
- [代码地图](docs/CODEBASE_MAP.md) · [项目上下文](docs/PROJECT_CONTEXT.md)
- [更新日志](CHANGELOG.md) · [发行规范](docs/RELEASING.md)

## npm 下载趋势

<a href="https://www.npmjs.com/package/@adui/normalize.css">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/chart/npm/@adui/normalize.css.svg?days=30&amp;bg=transparent&amp;border=false&amp;mode=dark" />
    <img src="https://shieldcn.dev/chart/npm/@adui/normalize.css.svg?days=30&amp;bg=transparent&amp;border=false&amp;mode=light" alt="@adui/normalize.css 近 30 天 npm 下载趋势" width="760" />
  </picture>
</a>

图表由第三方服务动态生成，可能存在缓存延迟。

## 参与贡献

欢迎通过 [GitHub Issues](https://github.com/adui-studio/normalize.css/issues) 报告浏览器差异、组件冲突或提出规则建议。涉及 CSS 行为的提案应提供适用浏览器与版本、复现方式、预期结果及潜在的布局或无障碍影响。

提交前请阅读 [AGENTS.md](AGENTS.md) 与 [Pull Request 模板](.github/pull_request_template.md)。项目遵循最小必要改动原则，不新增 CI 或自动发布工作流。

## 许可证

[MIT](LICENSE) · Copyright © 2026 ADui Studio.
