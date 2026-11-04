# W-06 · Vue / React / TDesign 实际生态消费对照

**状态（2026-11-04）**：维护者 Windows 最新 `npm run test:offline` 已实测 **30/30 PASS、0 FAIL**，确认此前旧清单断言错误已修复。Vue 3 + Element Plus、React + Ant Design 的真实 tarball Vite+ 生产构建以及 Chrome 156 T0/T2 静态 UI 对照均已 PASS（终端日志和截图），其组件完整键盘/输入交互与其他浏览器仍待验证。新增 **Vue 3 + TDesign Vue Next 1.20.10** 独立消费脚本，已核对生成 JavaScript 语法及 T0/T2 仅差 Normalize CSS 导入；**TDesign 实际安装、生产构建和浏览器 UI 仍 NOT_RUN**。本轮代码变更后的完整离线测试也尚待重新执行。

## 验证范围

| 组合                   | 固定版本                                 | 页面元素                                 | 实际结果                                     |
| ---------------------- | ---------------------------------------- | ---------------------------------------- | -------------------------------------------- |
| Vue + Element Plus     | Vue 3.5.44、Element Plus 2.14.7          | 原生 b/strong/code、ElButton、ElInput    | 构建 PASS；Chrome 156 静态 UI PASS；交互未测 |
| React + Ant Design     | React/React DOM 19.3.1、Ant Design 6.6.8 | 原生 b/strong/code、Button、Input        | 构建 PASS；Chrome 156 静态 UI PASS；交互未测 |
| Vue + TDesign Vue Next | Vue 3.5.44、TDesign Vue Next 1.20.10     | 原生 b/strong/code、TDesign Button/Input | 构建 NOT_RUN；浏览器 NOT_RUN                 |

版本仅用于**测试复现**，不是对用户项目的最低或最高兼容承诺。分别从官方 npm 公开包的稳定发布记录选取；不依赖 CDN，不使用未固定的 `latest`。TDesign 已加入本地生态消费脚本但仍未实际运行；Tailwind Preflight、UnoCSS Reset 仍属后续独立批次，均不得宣布兼容通过。

## 一、生产构建验证

在正式仓库根目录使用 PowerShell：

```powershell
git pull --ff-only origin feat/viteplus-local-harness
vp pack

npm run test:offline

npm run test:ecosystem -- vue-element
npm run test:ecosystem -- react-antd
npm run test:ecosystem -- vue-tdesign
```

`test:offline` 只运行**不联网的纯 Node 契约**，不会下载 Vue/React；`test:ecosystem` 是**明确手动触发**的网络/本地 npm cache 消费测试：

1. 使用当前 `dist/normalize.css` 的真实 npm tarball，不直接引用源码。
2. 在 Git 忽略的 `node_modules/.cache/adui-ecosystem-*` 临时目录安装指定版本 Vue/React 与对应 UI 库；禁用 npm lifecycle scripts，不创建根项目 lockfile，不改变根项目 dependencies。
3. 用仓库现有 Vite+ 1.4.0 分别构建两个**完全隔离**的消费应用：`native` 不加载本库，`package` 在 UI 库样式之前导入 `@adui/normalize.css`。
4. 检查两份 Vite+ 生产构建都输出 HTML；T2 CSS 产物仍包含 R-003 `b,strong { font-weight:bolder }`；安装后 CSS 与本仓库 `vp pack` 产物逐字节一致。
5. 默认测试结束清理临时目录；失败请保留终端日志。**这只验证构建/导入，不验证最终组件渲染或键盘交互**。

如果 npm registry 不可用或 Vite+ 实际构建失败，记录完整报错并将案例标记 FAIL / BLOCKED，不将其视为浏览器兼容性失败。

## 2026-11-04 · 离线 30/30 已复验，TDesign 进入测试准备

维护者随后在 Windows 再次运行 `npm run test:offline`，终端明确显示 **30 tests / 30 pass / 0 fail / 0 skip**，耗时 1101.97ms；这确认此前 `tests/package.node.test.mjs` 旧清单断言问题已解决。以下较早的 29/30 和“修复后待运行”段落保留为**当时的故障历史**，不代表最新状态。

基于原有 `ecosystemCases`，本轮新增 `vue-tdesign`，锁定 `vue@3.5.44` + `tdesign-vue-next@1.20.10`，采用官方样式路径 `tdesign-vue-next/es/style/index.css`，仅把 TDesign Button/Input 接入现有 Vue `h()` 页面。来源：[TDesign Vue Next 官方 npm 包](https://www.npmjs.com/package/tdesign-vue-next)与[官方仓库](https://github.com/Tencent/tdesign-vue-next)。现有 Vite+、临时消费者、真实 npm tarball 以及 T0/T2 生成逻辑均复用，**没有新增根依赖、JS 运行时和 CI**。

**本次已做的检查**：读取 GitHub 最新文件，解析三份 JS 源码及三个生成的生态入口；T0/T2 JS 除 `import "@adui/normalize.css"` 外完全相同，`.t-button` / `.t-input` 选择器和固定版本已经纳入离线契约。由于执行容器无法连通 GitHub，**未执行新代码的真实 Node/Vite+ 运行**；新增 TDesign 场景仅为开发完成、真实构建和浏览器待测。之前的 30/30 PASS 只属于修改 TDesign 测试之前的代码版本。

## 2026-11-04 · Windows 实际命令记录

维护者提供真实 PowerShell 输出，已确认：

| 命令 / 场景                                    | 结果                   | 说明                                                                                                                                                                                       |
| ---------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run test:offline`（修复前）               | **29/30 PASS，1 FAIL** | 新增 `ecosystem-contract.node.test.mjs` 后，旧测试 `tests/package.node.test.mjs:95` 对 `scripts["test:offline"]` 做旧清单**严格全等**比较；实际七项文件清单已正确运行，新契约测试 2/2 PASS |
| `npm run test:ecosystem -- vue-element`        | **PASS**               | T0 CSS **360171** 字节；T2 CSS **360362** 字节；真实包成功导入 Vite+ 生产构建                                                                                                              |
| `npm run test:ecosystem -- react-antd`         | **PASS**               | T0 静态 CSS **0** 字节；T2 静态 CSS **192** 字节；真实包成功导入 Vite+ 生产构建。Ant Design CSS-in-JS 可能在浏览器运行时注入样式，0 字节不等于无组件样式                                   |
| `npm run test:ecosystem -- vue-element --keep` | **PASS**               | 两份生产构建再次成功；隔离消费者目录保留用于后续真实浏览器对照                                                                                                                             |

**已实施的最小修复**：仅将 `tests/package.node.test.mjs` 中的 `test:offline` 预期字符串更新为与 `package.json` 一致的七项清单；不改变运行命令、产品 CSS、依赖或生态构建逻辑。**修复后 30/30 尚未在维护者环境执行**，不得推断通过。

保留的临时目录（仅本次运行，清理前可直接使用）：

```text
D:\Workspace\adui-studio\normalize.css\node_modules\.cache\adui-ecosystem-tLDzuZ
```

以上路径来自维护者终端，不作为永久路径或重新运行的固定名称。后续浏览器 T0/T2 仍应检查组件是否挂载、外观、焦点与 R-003 计算字重；`F-009` 生态完整回归保持部分完成，Issue #7 Open。

## 2026-11-04 · Vue + Element Plus / Chrome 156 截图对照

维护者提供两张页面及 DevTools Console 截图：`http://localhost:5174/` 为 T0 原生组，`http://localhost:5175/` 为 T2 CSS 包组。截图证据不包含键盘交互日志。可核实：

- 两页 `ui.buttonMounted: true`、`ui.inputMounted: true`；Element Plus 按钮、输入框均可见，静态外观一致。
- 两页五个计算样式行完全一致：`b-600`、`strong-600`、`b-700`、`strong-700` 的 `fontWeight` 均为 `"900"`、`fontSize` 均为 `"16px"`、`fontFamily` 均为 `"Noto Sans SC"`；`code` 的 `fontWeight` 为 `"400"`、`fontSize` 为 `"13px"`、`fontFamily` 为 `"monospace"`。
- Console UA 包含 `Chrome/156.0.0.0`、`Windows NT 10.0; Win64; x64`，但 UA 不能单独确认 Windows 实际发行版。
- 两页均存在 Vue esm-bundler feature flags 未显式注入的警告，以及本地 `favicon.ico` 404。它们是共同出现的测试环境提示，不构成 Normalize 样式冲突证据；本次不增加产品 CSS、依赖或构建配置来清理这些非阻塞提示。

**判定**：结合已通过的真实 tarball 生产构建，可将 **Vue 3.5.44 + Element Plus 2.14.7 在 Chrome 156 的 T0/T2 静态渲染和五项计算样式对照**记为 **PASS（截图）**。**未验证** Vue 键盘焦点、实际输入交互，React+Ant Design 的浏览器对照，以及 Edge、Firefox、Safari 和移动端的完整生态回归。W-06 F-009 继续部分完成，Issue #7 保持 Open。修复后的 `npm run test:offline` 完整重跑仍待维护者结果。

## 2026-11-04 · React + Ant Design / Chrome 156 截图对照

维护者在 Vue + Element Plus 对照后，继续提交 React + Ant Design 的两张真实页面与 DevTools Console 截图，按既定测试顺序分别为 T0 原生消费组和 T2 实际 `@adui/normalize.css` 消费组。两张截图均显示 Chrome UA `Chrome/156.0.0.0` 及 Windows NT 平台标识。网页地址没有完整出现在截图中，因此不能单凭截图独立确认端口；依据本轮此前的 T0/T2 构建与启动约定判读。

- 两页均渲染 Ant Design 的主按钮和输入框，截图显示 `ui.buttonMounted: true`、`ui.inputMounted: true`，两页可见静态外观一致。
- 两页的五行探针值完全一致：`b-600`、`strong-600`、`b-700`、`strong-700` 的计算 `fontWeight: "900"`、`fontSize: "16px"`、`fontFamily: "Noto Sans SC"`；`code` 的 `fontWeight: "400"`、`fontSize: "13px"`、`fontFamily: "monospace"`。
- 两页均出现 React DevTools 的开发环境推荐信息，未观察到能归因于 Normalize 的独有 CSS 控制台错误。截图没有提供运行时 CSS-in-JS 样式表逐条审计或全部视觉像素差异报告。
- 此前维护者已实测该组合真实 tarball 的 Vite+ 双生产构建 PASS（原生组静态 CSS 0 字节、T2 静态 CSS 192 字节）；本次截图补上**浏览器静态渲染证据**。Ant Design 的其他组件、按钮点击、输入操作与键盘焦点未实际记录。

**判定**：**React 19.3.1 + React DOM 19.3.1 + Ant Design 6.6.8 在 Chrome 156 的 T0/T2 静态 UI 和五项计算样式对照 PASS（维护者截图）**。Vue + Element Plus 同一浏览器的静态对照也已 PASS。**F-009 整体验收仍未完成**：组件交互、TDesign、Tailwind Preflight / UnoCSS Reset、其他浏览器均不得据此标为已通过。修复后的 `npm run test:offline` 仍无本机完整重跑日志。

## 二、真实浏览器 T0/T2 对照

为了保留隔离项目供 JetBrains 与浏览器手工查看，添加 `--keep`：

```powershell
npm run test:ecosystem -- vue-element --keep
```

终端将打印临时消费者目录。以实际打印路径为准，在**两个 PowerShell 终端**分别进入对应子目录：

```powershell
# 首先替换为测试输出里真实打印的目录
$consumerDir = 'D:\Workspace\adui-studio\normalize.css\node_modules\.cache\adui-ecosystem-实际目录'

# 终端 A：T0，不加载 @adui/normalize.css
Set-Location (Join-Path $consumerDir 'native')
vp dev --port 5174

# 终端 B：另开一个 PowerShell，使用相同 $consumerDir
Set-Location (Join-Path $consumerDir 'package')
vp dev --port 5175
```

打开 `http://localhost:5174/` 与 `http://localhost:5175/`，确保 **同一浏览器、缩放和系统设置**。两页 HTML 相同，入口 JavaScript 的唯一预期差异是 T2 第一行 `import "@adui/normalize.css"`。

检查：`b`/`strong` 在父级 600/700 的计算字重、`code` 字号、UI Button/Input 的外观、默认焦点与输入操作，并查看页面 `#probe-output` JSON 的 `ui.buttonMounted`、`ui.inputMounted` 都是 `true`。如果组件没有实际挂载，不能把构建成功视为生态兼容 PASS。

随后以相同方式执行 `react-antd --keep`。Ant Design 使用 CSS-in-JS，部分组件样式可能由 JavaScript 在浏览器运行时注入，不能只看构建时静态 CSS 文件推断完整渲染。

保留测试目录位于 Git 忽略的 `node_modules/.cache/`。复核后停止两个 Vite+ 开发服务，并**仅删除运行输出明确打印的临时消费者目录**；不要删除仓库的根 `node_modules`。

## 三、结论记录与边界

每组记下框架、UI 库精确版本、浏览器/OS、T0/T2 的 JSON 和是否有 CSS/布局/交互差异。只有真实执行才允许 PASS。若发现异常，区分包未加载、UI 库组件未挂载、组件 CSS 先后顺序和本库 R-003 的实际影响。

本次不修改 `src/normalize.css`、根导出、运行时依赖，也不增加 CI 或 npm 发布；W-06 Issue #7 继续 Open。
