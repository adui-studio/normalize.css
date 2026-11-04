# HARNESS — 执行、验证与反馈环境

**当前状态：只有规划文档，没有可执行 Harness。** 仓库中尚无 package.json、测试框架、构建脚本、CI、浏览器 Fixtures、发布产物。不得把本页命令示例称为已验证可运行。

## 1. Harness 目标

形成可重复的闭环：理解需求 → 影响分析 → 制定验证矩阵 → 最小修改 → 检查 → 定位失败 → 修复重验 → 记录结果。优先建立可复现的本地检查和人工验收记录；本项目不增加 CI，避免仅凭经验声称跨浏览器兼容。

## 2. 当前可以执行的审查（无新增工具）

- 确认 GitHub 仓库仅在文档阶段修改 Markdown，保留 MIT LICENSE。
- 对照 [CODEBASE_MAP](CODEBASE_MAP.md) 的真实路径核查存在性。
- 审核相对链接、需求 ID、ADR 状态及“未实现/已验证”措辞。
- 审核文档是否引用不存在的命令、Skill、workflow 或发布版本。
- 把上述**人工检查**与未来程序化文档校验明确区分。

## 3. 开发阶段拟建设的验证层级

| 层级 | 拟议检查 | 预期产物 | 当前状态 |
| --- | --- | --- | --- |
| 依赖/环境 | Node 与包管理器版本锁定、安装重现 | 环境说明、锁文件 | 未选型 |
| 格式与静态 | Markdown、CSS 格式、语法、规则约束 | 可定位的检查报告 | 未实现 |
| 规则单元 | 某声明存在/缺失及导出边界 | 单元测试报告 | 未实现 |
| 真实浏览器 | Chromium、Firefox、WebKit 的差异 Fixture | 浏览器版本及结果、截图 | 未实现 |
| 无障碍体验 | 键盘焦点、系统减少动画/高对比度 | 行为回归记录 | 未实现 |
| 组件库兼容 | Element Plus、Ant Design、TDesign 选定示例 | 对照截图及误差分析 | 未实现 |
| 打包发布 | CSS 公开导出、包文件清单、许可证、大小 | npm tarball 验证报告 | 未实现 |
| 本地执行 | 按需执行回归，保留浏览器、文件版本及差异记录 | 可审查的本地报告 | 未实现 |

## 4. 规划命令与真实命令的界线

未来**可以考虑**使用以下命令名称，但仓库目前**不存在对应 npm scripts，不能执行或宣称通过**：

```sh
npm run lint
npm run test
npm run test:browser
npm run build
npm run check
```

工具链要在 [SDD](SDD.md)、[需求](REQUIREMENTS.md) 的最低验证能力确认后再选，避免为了命令名称反向引入依赖。

## 5. Fixture 最小范围（规划）

1. 基础文档语义：headings、lists、hr、abbr、pre/code、details/summary。
2. 表单：button、input 各类型、select、textarea、fieldset/legend、原生校验。
3. 原生交互：dialog、popover、focus-visible、hidden/hidden=until-found。
4. 系统偏好：forced-colors、prefers-contrast、prefers-reduced-motion。
5. 组件库：Element Plus、Ant Design、TDesign 中按钮、输入、弹窗、表格的典型页面。

每一项需同时记录 **浏览器版本、操作步骤、期待行为、实际结果**。浏览器引擎覆盖不能由 CSS 解析测试代替。

## 6. W-06、Tailwind 与 UnoCSS 独立对照计划（未执行）

**目标**：先完成 W-06 TDesign 的跨浏览器 native/package 比较，再分别验证 Tailwind Preflight 与 UnoCSS Reset 的加载顺序、层级和冲突。关联 FR-001/006/007、NFR-001/002/003/007。以下是计划，不是已经完成的测试。

### 6.1 共用约束

- 冻结并记录组件库、Vue、Tailwind、UnoCSS、Normalize、浏览器、操作系统与包管理器的具体版本；统一 DOM、视口、DPR、缩放、字体及操作步骤。
- 先核对 W-06 中 `native` 与 `package` 的真实 CSS 来源、解析路径、文件哈希、npm tarball 或本地包证据。在包尚未发布/可解析时不能声称“真实 npm 包通过”。
- **每个对照组只启用一种第三方 Reset**。TDesign 组不混入 Tailwind/UnoCSS；Tailwind 组不引入 UnoCSS；UnoCSS 组不引入 Tailwind。
- 不仅核对源码 import 次序，还要核对构建后的 CSS 声明、网络资源、来源行及 `@layer` 首次创建顺序。
- 使用 UnoCSS `presetWind4` 时，排查其内置 `preflights.reset`，防止与 `@unocss/reset` 重复加载。

### 6.2 测试矩阵

| 组 | 唯一 CSS 变化 | 状态 |
| --- | --- | --- |
| T0 | TDesign 组件基线；不加载待测 Normalize | 待执行 |
| T1 | TDesign + 已核实来源的 native Normalize | 待执行 |
| T2 | TDesign + 已核实来源的 package Normalize | 待执行 |
| B0 | 仅 Tailwind v4 Preflight（不加载 UnoCSS） | 待执行 |
| B1 | Normalize → Tailwind v4 Preflight | 待执行 |
| B2 | Tailwind v4 Preflight → Normalize | 待执行 |
| C0 | 仅 `@unocss/reset/tailwind-v4.css` | 待执行 |
| C1 | Normalize → UnoCSS Reset tailwind-v4 | 待执行 |
| C2 | UnoCSS Reset tailwind-v4 → Normalize | 待执行 |

补充的 **C-compat 独立批次**仅使用 `@unocss/reset/tailwind-compat.css`，重复基线、正序、反序三种情况；不能与 `tailwind-v4.css`、`tailwind.css` 或 Tailwind Preflight 叠加。B/C 使用相同的原生 HTML Fixture；如需追加 TDesign 共存测试，应另开隔离组。

### 6.3 浏览器、元素和交互

1. TDesign：目标覆盖 **Chromium、Firefox、WebKit**，每个引擎至少验证 Button、Input，并扩展 Select、Dialog、Table；记录默认、hover、focus-visible、disabled、键盘交互及弹窗开关。
2. 原生 HTML：`b`、`strong`、`code`、标题、段落、列表、按钮、输入框、表格、`dialog`、`img` 和 `[hidden]`。
3. 按元素记录适用的计算样式：`font-family`、`font-size`、`font-weight`、`line-height`、`box-sizing`、`margin`、`padding`、`border`、`display`、`appearance`、`outline`、`cursor`。
4. 现有 W-06 截图仅可确认截图范围内的 Chromium 环境中 TDesign Button/Input 已挂载、所示值看起来一致；Vue Feature Flags 属独立构建警告。不能推导真实 npm 发布包及跨引擎通过。

### 6.4 CSS 冲突归因

在同一来源与重要性条件下，记录 Cascade Layers、选择器特异性、作用域接近程度与声明顺序。普通作者声明中未分层样式优先于分层样式，分层 `!important` 的优先关系则反向。**交换 import 顺序并不必然改变最终样式**。

发现差异时逐项记录元素及状态、期望/实际、命中声明和最终胜出声明的文件/行号、层名、重要性、特异性、产物加载顺序，并分类为预期 Reset 覆盖、意外规则冲突、组件库回归、浏览器差异或环境污染。

### 6.5 完成条件与证据模板

- TDesign：T0/T1/T2 在三个目标引擎的来源、计算样式、关键交互、截图及差异分析齐全。
- Tailwind：B0/B1/B2 的产物 CSS、层声明和正反顺序结果齐全。
- UnoCSS：C0/C1/C2、单独的 C-compat 批次及 Reset 隔离证据齐全。
- 每条记录必须包含：组编号、包与文件版本/哈希、浏览器及系统版本、视口、导入及产物顺序、目标元素/状态、截图、计算样式、命中规则、预期与实际、结论、复现步骤。
- 缺少真实包入口、浏览器或测试环境时记为 **阻塞/未执行**，不可记为通过。

参考：[Tailwind Preflight](https://tailwindcss.com/docs/preflight) · [UnoCSS Style Reset](https://unocss.dev/guide/style-reset) · [UnoCSS Wind4 Preset](https://unocss.dev/presets/wind4) · [MDN Cascade Layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)。

## 7. 安全和发布门禁（规划）

- 审核第三方规则的许可证及改写过程；不引入未经审批的远程字体、图片或跟踪请求。
- 所有公开入口必须能在实际发布包内解析，默认入口不得隐式导入可选增强。
- 浏览器关键回归、许可证、发布文件清单和版本说明全部确认后，才可申请发布。
- npm 权限、版本发布、GitHub Release 和发布凭据的实际操作均需另行授权；本项目不增加 CI。

## 8. 故障报告格式

记录：任务/需求编号、环境及浏览器版本、最小复现页面、实际/预期差异、受影响入口、测试证据、原因分析、修复结果、无法验证事项。

**更新约定**：新增真实脚本、测试、运行环境或 CI 后，以可执行命令替换本页规划内容；如未运行必须明确记录原因。