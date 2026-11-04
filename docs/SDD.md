# SDD — 详细设计草案

**状态：首版公开 CSS 契约已批准，正在实施最小开发版本**。ADR-0001～0005 已 Accepted；基于 Chrome 120 的真实 R-003 字重差异，首批实现仅加入 `b`/`strong` 的 `bolder` 修正，并明确排除 R-004 的等宽字体字号调整。开发包继续保持 `private: true`，不等于已发布或完成兼容验收。

## 1. 设计范围与需求映射

| 候选模块  | 需求                    | 拟议接口/职责        | 实现状态 |
| --------- | ----------------------- | -------------------- | -------- |
| Normalize | FR-001、NFR-001         | 默认标准化样式表     | 已实现   |
| Reset     | FR-002                  | 显式导入的 Reset     | 未实现   |
| A11y      | FR-003                  | 焦点与系统偏好增强   | 未实现   |
| Forms     | FR-004                  | 原生表单增强         | 未实现   |
| Combined  | FR-005                  | 显式组合入口         | 未实现   |
| Exports   | FR-006                  | npm 导出映射         | 已配置   |
| 规则追踪  | FR-007、NFR-002/003/007 | 兼容性证据与回归用例 | 部分完成 |

## 2. 首版正式设计契约（尚不可使用）

| 导入路径（候选）                | 返回内容                                | 副作用边界                                  |
| ------------------------------- | --------------------------------------- | ------------------------------------------- |
| `@adui/normalize.css`           | **首版唯一已批准的 CSS 入口**（未实现） | 只包含有证据的 Normalize，且不内置 `@layer` |
| `@adui/normalize.css/reset.css` | Reset CSS                               | **首版延期**；未来版本单独决策              |
| `@adui/normalize.css/a11y.css`  | A11y CSS                                | **首版延期**；未来版本单独决策              |
| `@adui/normalize.css/forms.css` | Forms CSS                               | **首版延期**；未来版本单独决策              |
| `@adui/normalize.css/all.css`   | 经评审的组合 CSS                        | **首版延期**；未来版本单独决策              |

首版只规划 `@adui/normalize.css` 根入口，**不发布四个候选子路径**；未来版本可重新评审。开发工具链统一 Vite+（[ADR-0005](adr/0005-viteplus-toolchain.md)），但 CSS-only 的 `vp pack` 产物适配仍需在 W-04 实测，不能提前承诺 JS 入口或已编译 CSS。目前 `package.json` 已配置 `files: ["dist"]`、`sideEffects: ["**/*.css"]` 与唯一根 CSS `exports`，`src/normalize.css` 经 `vp pack` 输出 `dist/normalize.css`；已做标准库构建和离线安装局部验证，并已完成真实 tarball 与独立 Vite+ 生产消费验证；完整浏览器、组件库和发布验收仍未完成。具体 exports、CSS 文件名与编译方式仍须在实际开发后做构建验证，参阅 [ADR-0003](adr/0003-mvp-package-contract.md)、[W-04 包交付验收研究](plans/CSS_PACKAGE_DELIVERY_REVIEW.md) 和 [实施计划](plans/MVP_IMPLEMENTATION_PLAN.md)。

### 2.1 首个最小交付切片（2026-11-04 开发决策）

- **首批源文件**：`src/normalize.css`，只纳入 R-003：`b, strong { font-weight: bolder; }`。依据真实 Chrome for Testing 120.0.6099.109 T0/T1 对照（父级 600/700 时四组计算字重由 700 → 900），Firefox 121 / Chrome 156 中候选无额外计算值变化；[证据卡](research/RULE_EVIDENCE_R003_R004.md)。
- **明确不纳入**：R-004 `font-size: 1em`、重复 `monospace`、统一代码字体栈；不添加 Reset、Forms、A11y、全局视觉规则、`@layer`、`!important`。
- **开发期根入口**：`package.json` 的唯一 `exports["."]` 指向 `./dist/normalize.css`；仍 `private: true`、版本 `0.0.0`，不能公开发布。Vite+ 继续承担开发与本机检查；维护者实际验证 `vp pack` 可以独立打包 CSS，而原 CSS-entry `vp build` 因默认关闭 CSS 拆分而失败；当前由 `vp pack` 输出根导出产物，`vp build` 负责构建测试 Fixture。修订后需本机复测。
- **验证边界**：构建字节完整性、文件封装、离线 npm smoke 可以本地验证；实际消费端的 Vite+ 生产构建现已通过；WebKit/Safari、Edge/移动端、组件库及最终 CSS 准入仍应在对应 W-06/W-07 审核。维护者当前要求停止额外字体偏好专项测试，按浏览器原生行为使用。

### 2.2 统一 Vite+ 命令与 CSS-only 构建（2026-11-04）

维护者明确要求使用 Vite+ 原生命令 `vp dev`、`vp build`、`vp pack`，替代 `npm run build` 调用 Node 文件复制脚本。三条命令功能不同（[Vite+ Build](https://viteplus.dev/guide/build)、[Dev](https://viteplus.dev/guide/dev)、[Pack](https://viteplus.dev/guide/pack)）：

- `vp dev`：仍从项目根目录启动本地 Vite 开发服务器，访问现有 `/fixtures/`；不发布 CSS。
- `vp build`：现已修订为六张现有 HTML Fixture 的预览构建，输出到 `dist-fixtures/`；不进入 npm 包。此前直接以 CSS 作为库构建入口在 Vite+ 1.4.0 本机失败，实际根因与修正见 §2.3。
- `vp pack`：已在维护者 Windows Vite+ 1.4.0 实测可直接以 CSS 为唯一入口生成单个文件（原验证输出 `dist-pack/normalize.css`），现改为输出 `dist/normalize.css`，作为唯一 npm 根导出目标；修订配置仍需重新运行。
- `vp pack` 不是 `npm pack`：真正检查 npm tarball 应使用 `npm pack --dry-run`，任何发布仍需维护者单独授权。

不增加发布用 JS、额外打包依赖、公开子路径或 CI；保留 `private: true`。`vp pack` 已是正式候选 CSS 产物构建命令，但是否可以公开发布仍受 tarball、消费端和兼容性验收约束。

### 2.3 Vite+ 1.4.0 本机实测后的构建职责修订（2026-11-04）

维护者在 Windows 报告：`vp check` PASS（55 个文件格式、11 个文件 Lint）、`vp test` 6/6、`npm run test:offline` 25/25、`vp dev` 成功启动、`vp pack` **成功生成仅一个** `dist-pack/normalize.css`（约 200 字节，无 JS），唯独 `vp build` 报错：`When "build.cssCodeSplit: false" is set, "rolldownOptions.input" should not include CSS files.`。原 `dist/normalize.css` 时间早于该次失败构建，不能视为 `vp build` 的产物。

根因是 `build.lib` 默认 `cssCodeSplit: false`，与直接作为构建入口的 CSS 文件发生冲突。既然 `vp pack` 的 CSS-only 入口已在真实 Vite+ 1.4.0 上产出准确的单 CSS 文件，**不再将 `vp build` 当作库发布构建命令**：

- `vp dev`：浏览器访问现有 `/fixtures/`，供本地原生对照。
- `vp build`：使用 Vite 多页面 HTML 输入构建现有六张 Fixture 页面，输出到**私有**的 `dist-fixtures/`，不进入 npm 包；其 HTML/JS 仅用于测试，不属于 CSS 库运行时依赖。
- `vp pack`：直接以 `src/normalize.css` 为唯一入口，输出到 **`dist/normalize.css`**；开发包 `exports["."]` 保持指向此文件，且不添加 JS 包装和其他公开子路径。
- `npm pack`：独立的 npm tarball 清单检查，不能与 `vp pack` 混为一谈。

本次 Vite+ 命令配置修订后，仍需维护者重新执行 `vp build`、`vp pack` 和离线测试，核实 HTML 预览与 CSS 发布产物各自只有预期内容；未执行的测试不得记为通过。保留 `private: true` 和禁用 CI、发布的约束。

### 2.4 W-04 真实包离线安装检查（2026-11-04）

W-03 已验收后，W-04 下一项最小必要检查是 **`vp pack` 的真实 `dist/normalize.css`，而非合成 CSS 烟测**。为不打断普通单测，在 `npm run test:offline` 之外提供单独的 `npm run test:package`（先运行 `vp pack`）：

- 对完整当前仓库执行 `npm pack --offline --ignore-scripts --json`，将临时 tarball 定向到系统临时目录；不调用 `npm publish`。
- 核对真实包的 `LICENSE`、`README.md`、`dist/normalize.css`、`package.json`，拒绝发布测试资产、源码和 JS 包装文件。
- 从临时 tarball 离线安装到新的独立临时消费目录，对照实际构建 CSS 的字节、根 `exports`、`sideEffects` 和未公开子路径限制；清理全部临时内容。
- 此项**仅覆盖实际打包、安装和文件解析**，并不等于 Vite+/Webpack 生产消费者的 CSS 副作用保留和页面视觉效果已通过。后两项仍需独立验证。

新增测试应当不依赖网络、无新增依赖，且没有生成任何 GitHub Actions 或 CI。实际运行结果以维护者的本机输出为准。

### 2.5 W-04 独立 Vite+ 生产消费者（开发中／尚未执行）

新增独立的 `npm run test:consumer`：在已经 `vp pack` 的前提下，重新对真实仓库 `npm pack --offline`，安装到 `node_modules/.cache/` 下临时隔离的小型 Vite+ 应用；复用项目固定的 `vite-plus@1.4.0`，不安装第二套构建工具。应用的 JS 入口使用 `import "@adui/normalize.css"`，执行真实 `vp build`，再检查 `dist/assets/*.css` 是否包含 R-003 的 `b,strong { font-weight:bolder }`；结束后清理临时目录。该测试用于 P-02 的生产构建 CSS 保留证据，**不证明浏览器渲染和 UI 框架兼容**。

维护者后来在 Windows Vite+ 1.4.0 实测 `npm run test:consumer` 1/1 PASS。其验证范围是生产 CSS 保留，开发态及页面实际计算样式仍归 W-06；Webpack 专项验收已按 §2.7 取消。

### 2.6 W-04 Windows 真实验收与行尾规则（2026-11-04）

维护者确认 `vp pack` 输出唯一 `dist/normalize.css`（约 200 字节）；`npm run test:package` **1/1 PASS**，验证完整仓库真实 tarball 的文件白名单、导出、离线安装与子路径封装；`npm run test:consumer` **1/1 PASS**，验证独立 Vite+ 1.4.0 **生产**消费应用的 CSS 导入未被丢弃。W-04 的 P-01/P-06/P-07/P-09 已满足当前包契约；P-02 生产 CSS 保留子项已通过，但 Vite+ 开发态与浏览器实际渲染未测试；P-03 Webpack 5 已由维护者调整为范围外，不属于 W-04 阻塞。详见[W-04 §7.6](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

维护者反映 Windows 上反复 `vp check --fix` 是 CRLF→LF 行尾纠正。新增 `.gitattributes` 的 `* text=auto eol=lf` 与 `.editorconfig` 的 `end_of_line = lf`、UTF-8 和末尾换行规定，**不修改产品 CSS**。这解决后续 Git 检出与编辑器保存的统一策略，但是否消除既有工作区行尾问题，仍待维护者拉取后执行 `vp check` 核对；不对第三方 Skills 执行大规模 renormalize。

### 2.7 W-04 范围调整与完成结论（2026-11-04）

维护者重申**工程统一 Vite+**；生成和消费标准 CSS 不依赖 Webpack。撤销上一轮未执行的 Webpack 5 测试，并从 `package.json` 删除 `test:webpack`、从 `tests/` 删除相关脚本，不增加其他依赖。外部消费者可以使用自己的工具链，但本项目**不以某一外部工具链的生产构建作为必过验收**。

W-04 仅要求 `vp pack` CSS-only 真实产物、npm 根 `exports`、文件白名单、`sideEffects`、零运行时依赖、真实 tarball 独立安装与 Vite+ 生产消费验证。维护者已实测 `npm run test:package` 1/1、`npm run test:consumer` 1/1，故**开发分支上的包交付契约已满足**。Vite+ 开发态、浏览器直接加载和 UI 组件库样式回归仍应在 W-06 验证；正式 npm 发布须经 W-07 单独批准。

此次调整只收敛测试范围，**不修改** ADR-0003 的唯一根入口、CSS 语义、`private: true`、已有包元数据或发布授权。[W-04 最新 DoD](plans/CSS_PACKAGE_DELIVERY_REVIEW.md#77-最新范围决策只使用-vite撤销-webpack-强制验收2026-11-04) 为当前实施基准。

## 3. CSS 规则准入流程（拟议）

1. **问题**：列出浏览器/版本、HTML Fixture、原生样式偏差及用户可见问题。
2. **证据**：复现差异并记录可查询的标准/浏览器行为来源。
3. **候选**：给出最小修复选择器和声明，分析对无关元素及组件库的影响。
4. **分类**：真正的浏览器差异放 Normalize；设计偏好放对应可选模块；无法证明必要则暂不加入。
5. **验证**：目标引擎真实浏览器对照、键盘和系统偏好检查、组件库回归、CSS 静态检查。
6. **记录**：关联 FR/NFR、适用范围、已验证浏览器、风险与对应测试用例。

本流程尚无自动执行代码，不能把以上步骤当作已建立的流水线。

## 4. 设计边界与示例

### Normalize

- 候选原则：保留原生可访问性与语义样式；不为视觉一致性而默认清空 button/list/heading。
- 对过时规则不得照搬；逐条核实是否仍存在现代浏览器差异。
- 可使用低特异性选择器，但需确认其不会弱化必要的可访问性行为。

### Reset（可选）

- 可能包含边框盒模型、媒体元素布局约束等；**是否移除通用 margin/padding 要单独评审**。
- 对 `fieldset`、`dialog`、`details`、列表和原生控件必须检查默认体验。

### A11y（可选）

- 不应使用无条件 `outline: none`。
- `:focus-visible`、`prefers-reduced-motion`、`forced-colors` 等是否涉及全局覆盖须先测试。
- 减少动画不应随意通过全局 `!important` 抹除所有应用动画；针对用户偏好采用更窄的范围与可回退行为。

### Forms（可选）

- 审视输入字体、尺寸、触摸交互、原生验证状态；避免影响组件库自定义按钮与输入框。
- 不默认使用 `:user-invalid` 改写所有表单背景或边框。

### Cascade Layers（首版已决定）

- [ADR-0002](adr/0002-cascade-layers.md) 已接受：**首版默认 CSS 不内建 `@layer`**。
- 仅逐条评估 `:where()` 的必要性和 CSS 优先级；不能承诺消费者不受导入顺序影响。
- 命名层、组合入口与可选模块属于后续独立设计议题。

## 5. 数据模型、状态机、接口与并发

本项目作为静态 CSS 包，**不需要数据库、持久化数据模型、运行时 API、鉴权、事务或并发状态机**。唯一需要的结构化数据是设计和测试时的规则元数据（格式待定）。

## 6. 测试设计（未来工作）

| 用例类别     | 场景                                                                | 需求            | 状态   |
| ------------ | ------------------------------------------------------------------- | --------------- | ------ |
| 规则静态审查 | 默认模块禁止高侵入全局声明；选择器和注释合理                        | FR-001、NFR-001 | 未实现 |
| 原生语义     | button、input、select、textarea、fieldset、details、dialog、summary | FR-001/002/004  | 未实现 |
| 浏览器差异   | Chromium / Firefox / WebKit 前后对照                                | NFR-002/003     | 未实现 |
| 交互无障碍   | 键盘焦点、高对比度、减少动画设置                                    | FR-003          | 未实现 |
| 组件库回归   | Element Plus / Ant Design / TDesign 的表单与弹窗等                  | NFR-007         | 未实现 |
| 包导出检查   | npm tarball 中所有公开路径存在且可解析                              | FR-005/006      | 未实现 |
| 体积与许可证 | 原始/Gzip 比较、许可证归属与发布清单                                | NFR-004/006     | 未实现 |

**禁止**用单元文本检查代替浏览器对照并宣称兼容性通过。

## 7. 异常与向后兼容

- 不支持特性的浏览器优先维持可用的原生交互，不使用不必要的破坏性覆盖。
- 规则变更若可能影响消费者样式，应视为潜在破坏性变更，提供变更说明和回归证据。
- 发布导出路径、版本策略和升级说明在真实打包与测试环境确定后再冻结。

## 8. 补充研究（规则证据尚未批准）

- [规则候选](research/RULE_REVIEW.md)、[首批证据审查](research/RULE_EVIDENCE_BATCH1.md) 与 [竞品研究](research/COMPETITOR_REVIEW.md)：用于规则证据审查，不代表实现。
- [浏览器支持矩阵](research/BROWSER_REVIEW.md) 和 [表单规则研究](research/FORM_CONTROLS_REVIEW.md)：最低**测试目标已批准**，但未做任何实际浏览器测试；不代表已完成正式支持验证。
- [ADR-0002](adr/0002-cascade-layers.md)：**Accepted**，首版不内建 `@layer`。
- [ADR-0003](adr/0003-mvp-package-contract.md)：**Accepted**，单一默认 CSS 入口；具体构建行为待验证。
- [ADR-0004](adr/0004-browser-support-policy.md)：**Accepted**，Baseline 2023 为特性准入参考；[七项最低测试目标](research/BASELINE_2023_MAPPING.md) 已批准并复核时间线，正式支持声明尚待实测。
- [ADR-0005](adr/0005-viteplus-toolchain.md)：**Accepted**，开发工具链统一 Vite+；[工具链研究](research/VITEPLUS_TOOLCHAIN_REVIEW.md) 仅查阅官方文档，未运行。
- [开发准入清单](research/REVIEW_GATE.md) 与 [实施计划](plans/MVP_IMPLEMENTATION_PLAN.md)：任务和实施门槛。
- [第三批规则证据审查](research/RULE_EVIDENCE_BATCH3.md)：排版、Reset、系统偏好等剩余 17 条规则的来源与风险。

## 9. 未决事项

Baseline 2023 映射候选版本能否在实际浏览器和 OS 上兑现；纯 CSS 在 Vite+ 内采用哪种打包方式；开发工具链实际版本、组件库 Fixture 版本与 npm 发行支持范围。**首版不发布 `all.css`，默认不内置 `@layer` 的架构选择已经 Accepted，不再视为未决选型。**

**更新约定**：对外 CSS 导出、模块边界、单条关键规则、测试设计变化时维护本文件；高层变化同步 [ARCHITECTURE](ARCHITECTURE.md) 与 [ADR](adr/0001-css-base-strategy.md)。
