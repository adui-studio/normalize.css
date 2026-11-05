# 第二批 CSS 规则证据审查：原生表单与占位符

**日期**：2026-11-03  
**状态**：标准与兼容数据研究；未运行真实浏览器测试，未批准任何 CSS 实现。  
**范围**：R-012～R-016、R-026～R-028（8 条）；关联 FR-001/004/007、NFR-001/002/007。  
**流程依据**：本仓库已纳入的原版 [bug-reproduction-brief](../../.agents/skills/bug-reproduction-brief/SKILL.md)：先区分现象与假设，记录最小复现、环境、预期和实际，禁止在确认问题前编写修复。

## 一、规则级结论（不是实测结论）

| ID | 主要证据 | 初步判断 | 待验证 |
| --- | --- | --- | --- |
| R-012 表单 margin | [WHATWG HTML：Form controls](https://html.spec.whatwg.org/multipage/rendering.html#form-controls) | 普通表单 margin 标准化须先证明不同 UA 仍有差异；维持暂缓 | button/input/select/textarea 的原生计算 margin 与文本基线 |
| R-013 搜索框外观 | [WHATWG HTML](https://html.spec.whatwg.org/multipage/rendering.html#form-controls) 和 [MDN appearance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/appearance) | 不在默认 Normalize 中全局设置 `appearance:none`，否则可能移除原生交互提示 | 搜索取消按钮、内边距、触摸、暗色模式 |
| R-014 WebKit 搜索装饰 | [MDN WebKit Extensions](https://developer.mozilla.org/en-US/docs/Web/CSS/WebKit_Extensions) | 厂商私有伪元素不形成跨引擎稳定契约，维持暂缓 | search 的清除按钮与键盘/辅助技术行为 |
| R-015 文件选择按钮 | [MDN ::file-selector-button](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::file-selector-button) / [BCD](https://github.com/mdn/browser-compat-data/blob/main/css/selectors/file-selector-button.json) | 标准伪元素已广泛支持；旧 `::-webkit-file-upload-button` 不应仅因历史存在就进入默认模块 | file 上传控件字体、按钮聚焦、交互区域和组件库冲突 |
| R-016 placeholder 颜色与透明度 | [MDN ::placeholder](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::placeholder) / [BCD](https://github.com/mdn/browser-compat-data/blob/main/css/selectors/placeholder.json) | 浏览器默认配色可能不同，但不一定是应统一的默认视觉；维持暂缓 | 当前 Gecko/Blink/WebKit 的计算 color、opacity、forced-colors |
| R-026 表单字体继承 | [WHATWG HTML：Form controls](https://html.spec.whatwg.org/multipage/rendering.html#form-controls) | 应作为可选 Forms 的设计偏好，不自动影响 UI 组件库 | 原生与 Element Plus/AntD/TDesign 字体覆盖 |
| R-027 清空表单样式 | [MDN appearance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/appearance) | 会干扰 select 箭头、原生 checkbox/radio、系统颜色；维持暂缓，不加入默认 Normalize | 聚焦、禁用、暗色/高对比、触摸响应 |
| R-028 `:user-invalid` 规则 | [MDN :user-invalid](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:user-invalid) | 校验视觉属于 Forms 或应用设计偏好，不加入默认 Normalize；维持暂缓 | 是否仅在交互后反馈、错误可读性和辅助技术 |

## 二、CSS 特性支持起点（来自 MDN Browser Compatibility Data）

读取日期：2026-11-03。以下仅表示**标准未前缀写法**首次支持的版本，不等于具体浏览器默认渲染已经一致。

| 特性 | Chrome | Firefox | Safari (macOS) | Safari iOS |
| --- | ---: | ---: | ---: | ---: |
| `::file-selector-button` | 89 | 82 | 14.1 | 14.5 |
| `::placeholder` | 57 | 51 | 10.1 | 按 BCD mirror |
| `appearance` | 84 | 80 | 15.4 | 15.4 |

数据来源：[file-selector-button.json](https://github.com/mdn/browser-compat-data/blob/main/css/selectors/file-selector-button.json)、[placeholder.json](https://github.com/mdn/browser-compat-data/blob/main/css/selectors/placeholder.json)、[appearance.json](https://github.com/mdn/browser-compat-data/blob/main/css/properties/appearance.json)。

**重要例外：** 某些历史文档写 Firefox 为 placeholder 统一设置 `opacity: .54`。但 [MDN issue #37477](https://github.com/mdn/content/issues/37477)（2025-01-02）指出这类描述对当时 Gecko 已过时，应按实际浏览器版本检查计算 `color` 与 `opacity`；不能把历史值当作本库修复的事实依据。

## 三、最小复现设计（尚未实现）

### F-004 — 原生表单

1. Baseline：不加载作者 CSS 的 HTML，包含 button、text/search/file 输入框、select、textarea、fieldset。
2. Environment：记录浏览器完整版本、OS、WebView/真实 Safari、文字缩放、系统颜色偏好。
3. Candidate：只加入一条待审规则，观察计算样式、按钮 affordance、Tab、Esc、焦点可见性。
4. Integration：对应真实版本的 Element Plus、Ant Design、TDesign，再分别测试 Tailwind Preflight、UnoCSS Reset。
5. Evidence：保留 HTML Fixture、复现步骤、期望/实际、是否重复复现、导入顺序与截图。

### F-007 — placeholder / 表单校验

- 对比 Firefox、Chromium、Safari 的原生计算值与视觉色差，不推断成统一需要修复。
- 检查正常、disabled、readonly、forced-colors、字体放大。
- `:invalid` 与 `:user-invalid` 分开，避免对尚未交互的用户提前显示错误。
- 表单视觉风格不能由默认 Normalize 隐式加载。

## 四、提交反馈

实际复现时采用已配置的 [浏览器兼容性 Issue Form](../../.github/ISSUE_TEMPLATE/bug-report.yml)；讨论引入新规则时使用 [规则提案 Issue Form](../../.github/ISSUE_TEMPLATE/rule-proposal.yml)。这两个入口只规范证据收集，不意味着问题已被证实或修复。

**结论**：R-012～R-016 与 R-026～R-028 本轮没有任何一条获准进入 Normalize，分类维持原状；没有执行 CSS、浏览器测试或 CI。
