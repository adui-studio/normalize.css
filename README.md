# @adui/normalize.css

**简体中文** · [English](README.en.md)

轻量、低侵入、基于明确规则依据的现代 CSS Normalize 基础库。

`@adui/normalize.css` 只修正经过评审的浏览器默认样式差异，尽量保留 HTML 原生语义、用户偏好及现有组件样式。提供纯 CSS 产物，**无运行时 JavaScript 依赖**。

> **发布状态：** 首版候选版本为 `0.0.1`，已完成 MVP 开发与维护者验收，**尚未正式发布到 npm**。下方的包管理器安装命令将在首次发布后可用；当前可以从仓库源码构建试用。

## 特性

- **默认克制**：不清空全部元素的间距，不强制设置根字号、主题或按钮外观。
- **尊重原生行为**：保留等宽字体的浏览器默认设置，不覆盖键盘焦点及系统无障碍偏好。
- **纯 CSS 交付**：单一包根入口，产物由 Vite+ 构建，不附加运行时 JavaScript。
- **规则可追溯**：每条正式规则都经过用途、作用范围和兼容风险评审。
- **便于组合**：适用于原生 HTML，以及使用 CSS 导入能力的 Vue、React 等应用；与其他 Reset 混用时仍需评估层叠顺序。

## 安装与使用

### 安装（npm 正式发布后）

```sh
pnpm add @adui/normalize.css
# 或
npm install @adui/normalize.css
```

在能够解析 CSS 包导入的应用入口中引入，建议放在应用自定义样式之前：

```js
import "@adui/normalize.css";
```

当前唯一公开设计入口是 `@adui/normalize.css`，对应 `dist/normalize.css`。项目尚未发布 npm 时，请按下文从仓库构建，不要将上述安装示例视为现已可下载的包。

### 当前 `0.0.1` 实现

首版默认 Normalize **仅包含一条 CSS 规则（R-003）**：

```css
b,
strong {
  font-weight: bolder;
}
```

该规则保留 `b`、`strong` 相对于父元素的加粗语义，用于处理部分历史浏览器的默认样式差异。规则背景与验证依据见 [R-003 / R-004 证据记录](docs/research/RULE_EVIDENCE_R003_R004.md)。

首版**不提供** `reset.css`、`a11y.css`、`forms.css` 或 `all.css` 等子路径；它们是后续可选模块的设计方向，不属于当前已实现或可导入的功能。默认样式也不内置 `@layer`。

## 兼容性与设计边界

项目以 **Baseline 2023** 作为 CSS 特性评审参考，结合规则来源、浏览器差异及本地回归结果决定是否纳入。它**不等于**对某个浏览器最低版本作出公开兼容承诺。

已完成的验证包含纯 CSS 打包、真实 npm tarball 本地安装、Vite+ 生产消费以及部分浏览器和框架对照。尚未形成所有历史目标浏览器与操作系统的逐项可审计通过记录，因此不在此声明具体最低浏览器版本。详情见 [浏览器支持策略](docs/adr/0004-browser-support-policy.md) 与 [W-06 验收记录](docs/research/W06_ACCEPTANCE_INDEX.md)。

## 本地开发

仓库使用 **Vite+ 1.4.0** 和 **pnpm 12.15.0**。Node.js 版本要求为 `^22.18.0 || ^24.11.0 || >=26.0.0`。

```sh
git clone https://github.com/adui-studio/normalize.css.git
cd normalize.css
pnpm install --frozen-lockfile

pnpm exec vp pack   # 构建 dist/normalize.css
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
