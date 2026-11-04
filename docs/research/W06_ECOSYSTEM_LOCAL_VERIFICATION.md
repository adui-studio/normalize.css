# W-06 · Vue / React 实际生态消费对照

**状态（2026-11-04）**：本地测试脚本、隔离 T0/T2 生成逻辑和离线契约已实现；**尚未执行真实 Vue/React 生产构建或浏览器交互测试**。不得用“脚本存在”推断 UI 组件库兼容性 PASS。

## 验证范围

| 组合               | 固定版本                                 | 页面元素                              | 实际结果 |
| ------------------ | ---------------------------------------- | ------------------------------------- | -------- |
| Vue + Element Plus | Vue 3.5.44、Element Plus 2.14.7          | 原生 b/strong/code、ElButton、ElInput | NOT_RUN  |
| React + Ant Design | React/React DOM 19.3.1、Ant Design 6.6.8 | 原生 b/strong/code、Button、Input     | NOT_RUN  |

版本仅用于**测试复现**，不是对用户项目的最低或最高兼容承诺。分别从官方 npm 公开包的稳定发布记录选取；不依赖 CDN，不使用未固定的 `latest`。TDesign / Tailwind Preflight / UnoCSS Reset 属 W-06 后续批次，不在本次宣布通过。

## 一、生产构建验证

在正式仓库根目录使用 PowerShell：

```powershell
git pull --ff-only origin feat/viteplus-local-harness
vp pack

npm run test:offline

npm run test:ecosystem -- vue-element
npm run test:ecosystem -- react-antd
```

`test:offline` 只运行**不联网的纯 Node 契约**，不会下载 Vue/React；`test:ecosystem` 是**明确手动触发**的网络/本地 npm cache 消费测试：

1. 使用当前 `dist/normalize.css` 的真实 npm tarball，不直接引用源码。
2. 在 Git 忽略的 `node_modules/.cache/adui-ecosystem-*` 临时目录安装指定版本 Vue/React 与对应 UI 库；禁用 npm lifecycle scripts，不创建根项目 lockfile，不改变根项目 dependencies。
3. 用仓库现有 Vite+ 1.4.0 分别构建两个**完全隔离**的消费应用：`native` 不加载本库，`package` 在 UI 库样式之前导入 `@adui/normalize.css`。
4. 检查两份 Vite+ 生产构建都输出 HTML；T2 CSS 产物仍包含 R-003 `b,strong { font-weight:bolder }`；安装后 CSS 与本仓库 `vp pack` 产物逐字节一致。
5. 默认测试结束清理临时目录；失败请保留终端日志。**这只验证构建/导入，不验证最终组件渲染或键盘交互**。

如果 npm registry 不可用或 Vite+ 实际构建失败，记录完整报错并将案例标记 FAIL / BLOCKED，不将其视为浏览器兼容性失败。

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
