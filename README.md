# @adui/normalize.css

[![npm version](https://img.shields.io/npm/v/%40adui%2Fnormalize.css?style=flat-square&logo=npm&logoColor=white&color=cb3837)](https://www.npmjs.com/package/@adui/normalize.css)
[![npm downloads/month](https://img.shields.io/npm/dm/%40adui%2Fnormalize.css?style=flat-square&logo=npm&logoColor=white&label=downloads%2Fmonth&color=0891b2)](https://www.npmjs.com/package/@adui/normalize.css)
[![GitHub release](https://img.shields.io/github/v/release/adui-studio/normalize.css?style=flat-square&logo=github&logoColor=white&color=2563eb)](https://github.com/adui-studio/normalize.css/releases/latest)
[![MIT license](https://img.shields.io/github/license/adui-studio/normalize.css?style=flat-square&color=64748b)](LICENSE)
[![CSS only](https://img.shields.io/badge/runtime-CSS--only-0f766e?style=flat-square)](package.json)

**简体中文** · [English](README.en.md)

轻量、低侵入、基于明确规则依据的现代 CSS Normalize 基础库。

`@adui/normalize.css` 只修正经过评审的浏览器默认样式差异，尽量保留 HTML 原生语义、用户偏好及现有组件样式。提供纯 CSS 产物，**无运行时 JavaScript 依赖**。

> **版本说明：** npm 最新正式版为 **[`0.1.0`](https://github.com/adui-studio/normalize.css/releases/tag/v0.1.0)**（已核对 npm `latest`、包摘要、附注 Git Tag 与 GitHub Release）。默认 Normalize 保持 R-003/R-007/R-008；Reset、Forms、A11y 及 `all.css` 继续显式可选，这些模块最早在 `0.0.3` 发布。历史 `0.0.1` 仅含 R-003，`0.0.2` 首次包含三条默认规则。浏览器兼容性以[发行后实测矩阵](docs/research/V010_POST_RELEASE_COMPATIBILITY.md)为准，不承诺未经逐版本验证的最低浏览器版本。

## 特性

- **默认克制**：不清空全部元素的间距，不强制设置根字号、主题或按钮外观。
- **尊重原生行为**：保留等宽字体的浏览器默认设置，不覆盖键盘焦点及系统无障碍偏好。
- **纯 CSS 交付**：根入口继续由 Vite+ 构建，可选模块以静态 CSS 源文件随 npm 包发布，不附加运行时 JavaScript。
- **规则可追溯**：每条正式规则都经过用途、作用范围和兼容风险评审。
- **完整且可组合**：默认 Normalize、独立 Reset、Forms、A11y 及 `all.css` 组合入口；适用于原生 HTML、Vue、React，并保留按需选择的能力。

## 安装与使用

### 从 npm 安装

```sh
pnpm add @adui/normalize.css
# 或
npm install @adui/normalize.css
```

在能够解析 CSS 包导入的应用入口中引入，建议放在应用自定义样式之前：

```js
import "@adui/normalize.css";
```

默认根入口 `@adui/normalize.css` 仍对应 `dist/normalize.css`。下列模块自 **npm `0.0.3`** 起可公开安装使用；`0.0.2` 及更早版本不提供这些新子路径。

### 默认 Normalize 规则（自 `0.0.2` 起）

`0.0.1` 只包含 R-003；**已正式发布的 `0.0.2`** 新增 R-007、R-008，总计三条规则：

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

R-003 保留相对字重；R-007 对含 `title` 的缩写补齐点状下划线；R-008 将表格边框颜色与当前文字颜色对齐。后两者采用低特异性的 `:where()`。**`0.0.3` 默认入口仍保持这三条规则**；发行源码已通过 Windows 工程验证，但未完成全部目标浏览器的真实 T0/T2 矩阵，不承诺未经验证的最低浏览器版本。 背景见 [规则证据](docs/research/RULE_EVIDENCE_R003_R004.md) 与 [默认规则范围审核](docs/research/DEFAULT_NORMALIZE_V01_READINESS.md)。

### `0.0.3` 已发布：模块与导入路径

| 引入路径                            | 内容与影响范围                                                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `@adui/normalize.css`               | **默认 Normalize**，保持已发布的 R-003 / R-007 / R-008 三条低侵入规则；不自动执行 Reset              |
| `@adui/normalize.css/normalize.css` | 默认 Normalize 的显式别名，功能与根入口相同                                                          |
| `@adui/normalize.css/reset.css`     | 可选布局 Reset：`border-box`、主体及常见文本间距、媒体最大宽度、表格折叠；保留列表 marker 与原生焦点 |
| `@adui/normalize.css/forms.css`     | 可选表单排版：字体继承、外边距、fieldset/legend、标准文件按钮字体；不移除原生控件外观                |
| `@adui/normalize.css/a11y.css`      | 可选无障碍增强：键盘焦点可见、强制颜色模式、减少动态偏好下关闭根平滑滚动；不全局禁用动画             |
| `@adui/normalize.css/all.css`       | 显式完整组合包，按 Normalize → Reset → Forms → A11y 导入上述模块                                     |

**按需组合（推荐）：**

```js
import "@adui/normalize.css";
import "@adui/normalize.css/forms.css";
```

**需要全部模块时，二选一使用组合入口，不要同时重复引入单模块：**

```js
import "@adui/normalize.css/all.css";
```

`all.css` 使用相对 `@import` 引入随包分发的 CSS 文件；Vite+ 等支持 CSS `@import` 内联的打包器可处理它们。默认入口**没有** `@layer`、全局主题、根字号覆盖、强制按钮外观或 `!important`。可选 Reset 会改变页面间距和表格布局，已有 Tailwind Preflight/UnoCSS Reset 的项目通常**不应再叠加** `reset.css` 或 `all.css`，避免重复重置。

## 兼容性与设计边界

项目以 **Baseline 2023** 作为 CSS 特性评审参考，结合规则来源、浏览器差异及本地回归结果决定是否纳入。它**不等于**对某个浏览器最低版本作出公开兼容承诺。

已完成的验证包含纯 CSS 打包、真实 npm tarball 本地安装、Vite+ 生产消费以及部分浏览器和框架对照。尚未形成所有历史目标浏览器与操作系统的逐项可审计通过记录，因此不在此声明具体最低浏览器版本。详情见 [浏览器支持策略](docs/adr/0004-browser-support-policy.md) 与 [W-06 验收记录](docs/research/W06_ACCEPTANCE_INDEX.md)。

## npm 下载趋势

<a href="https://www.npmjs.com/package/@adui/normalize.css">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/chart/npm/@adui/normalize.css.svg?days=30&amp;bg=transparent&amp;border=false&amp;mode=dark" />
    <img src="https://shieldcn.dev/chart/npm/@adui/normalize.css.svg?days=30&amp;bg=transparent&amp;border=false&amp;mode=light" alt="@adui/normalize.css 近 30 天 npm 下载趋势" width="760" />
  </picture>
</a>

图表由第三方服务根据 npm 下载数据动态生成，显示可能存在缓存延迟。

## 本地开发

仓库使用 **Vite+ 1.4.0** 和 **pnpm 12.15.0**。Node.js 版本要求为 `^22.18.0 || ^24.11.0 || >=26.0.0`。

```sh
git clone https://github.com/adui-studio/normalize.css.git
cd normalize.css
pnpm install --frozen-lockfile

pnpm exec vp pack   # 构建默认 dist/normalize.css；可选模块直接来自 src/*.css
pnpm exec vp dev    # 启动本地 Fixture 预览
```

运行完整的本地质量检查和 Fixture 构建：

```sh
pnpm run verify:mvp
pnpm exec vp build
```

`verify:mvp` 包括格式/Lint、单元与离线测试、CSS 打包、真实 tarball 消费及 npm 打包**预览**；`vp build` 构建本地 Fixture 页面到 `dist-fixtures/`。两者都**不会发布 npm 包**，项目也不配置 CI。完整测试范围及历史实测记录见 [MVP 验收清单](docs/MVP_0_0_1_HANDOFF.md)。

## 文档

- [需求与验收标准](docs/REQUIREMENTS.md) · [总体架构](docs/ARCHITECTURE.md) · [详细设计](docs/SDD.md)
- [规则评审结论](docs/research/W05_RULE_ACCEPTANCE.md) · [浏览器与生态验收](docs/research/W06_ACCEPTANCE_INDEX.md)
- [本地测试与交付说明](docs/MVP_0_0_1_HANDOFF.md) · [代码地图](docs/CODEBASE_MAP.md)
- [更新日志](CHANGELOG.md) · [项目现状](docs/PROJECT_CONTEXT.md)

## 参与贡献

欢迎通过 [GitHub Issues](https://github.com/adui-studio/normalize.css/issues) 提交浏览器差异、规则建议和文档问题。规则变更请说明浏览器依据、影响范围、可能的样式或无障碍风险，并尽量提供可复现用例和测试结果。

提交变更前请阅读 [AGENTS.md](AGENTS.md) 和 [Pull Request 模板](.github/pull_request_template.md)。项目要求最小必要改动，**不新增 CI 或自动发布工作流**。

## 许可证

[MIT](LICENSE) · Copyright © 2026 ADui Studio.
