# W-06 · Tailwind Preflight 与 UnoCSS Reset 独立回归

**更新日期**：2026-11-04  
**状态**：独立消费 Fixture 与 CLI 已写入开发分支；本轮只核对源文件和纯函数生成的隔离关系，**未在维护者 Windows 实际安装第三方包、执行 Vite+ 构建或浏览器交互**。不得把已生成测试代码标为 F-010 PASS。

**前置**：维护者在本轮对话中确认 TDesign 对照已完成；其具体浏览器、日志、截图、结果尚未同步到 W-06 记录。以下任务直接推进 F-010，**不要求重复 TDesign**。

## 1. 测试边界与版本

| 独立场景 | 仅安装在临时消费者中的固定直接依赖 | 实际加载的唯一第三方 Reset |
| --- | --- | --- |
| `tailwind-preflight` | `tailwindcss@4.3.4`、`@tailwindcss/vite@4.3.4` | `tailwindcss/theme.css`（主题变量，并非另一套 Reset）与 `tailwindcss/preflight.css`，后者属于 `base` 层 |
| `unocss-tailwind-v4` | `@unocss/reset@66.12.0` | `@unocss/reset/tailwind-v4.css` |
| `unocss-tailwind-compat` | `@unocss/reset@66.12.0` | `@unocss/reset/tailwind-compat.css` |

版本为**拟执行的精确直接依赖版本**，并非本轮已完成 npm 安装；间接依赖由实际安装记录为准。UnoCSS 组**不安装 `unocss`、不启动 presetWind4、不引入 Tailwind Preflight**。Tailwind 组不引入 `@unocss/reset`。Vite+ 继续使用当前仓库已固定的 `vite-plus@1.4.0`，无新增根项目开发/运行时依赖。

各场景生成三个独立页面，且共用相同 HTML、探针 JS 与视口：

- `baseline`：仅加载该场景自己的 Reset；
- `normalize-first`：先 Normalize，再当前 Reset；
- `normalize-last`：先当前 Reset，再 Normalize。

只反转同一场景两份样式的导入顺序；Tailwind 的层声明始终首先建立，Preflight 在 `base` 层。**层优先级可能使两种顺序结果相同，这本身是有意义的观测，不得强行制造差异**。

## 2. Windows PowerShell 实际执行步骤

在仓库根目录（**开发分支 `feat/viteplus-local-harness`，不要在仅有文档的 main 运行**）：

```powershell
git switch feat/viteplus-local-harness
git pull --ff-only origin feat/viteplus-local-harness

vp pack
npm run test:offline
vp check

# 首先只运行 Tailwind，实际安装仅发生在 Git 忽略的临时目录
npm run test:reset -- tailwind-preflight --keep

# Tailwind 测试完成后，再独立运行 UnoCSS v4
npm run test:reset -- unocss-tailwind-v4 --keep

# compat 另开独立批次，不与 v4 同时加载
npm run test:reset -- unocss-tailwind-compat --keep
```

以上**均为待由维护者本地运行的命令**，不是本轮执行记录。脚本使用真实 `vp pack` + 当前项目 npm tarball，确保 `@adui/normalize.css` 通过真实包的根 CSS 导出解析；独立临时消费者用 Vite+ 分别构建三个入口。每组只安装当前场景所需包，`npm install --ignore-scripts --no-save --package-lock=false`，不会写根目录 `package.json` 或创建 CI。

命令成功时输出每组 CSS 字节数、SHA-256、是否存在 CSS Layer，以及临时目录位置；该信息保存在临时目录 `reset-report.json`，**只证明包解析与构建**。临时目录位于 `node_modules/.cache/adui-reset-*`，已 Git 忽略；脚本 `--keep` 会保留用于手动观察，未加 `--keep` 则清理对应本次新建的目录。脚本不下载浏览器、不上传/发布 npm、不运行 npm 安装脚本。

## 3. 浏览器对照操作

每条命令返回的 `Kept consumer:` 后面是**实际临时目录**。以下使用 Tailwind 示例；UnoCSS 两组各自从自己的独立输出目录启动，不得复用同一浏览器页面或 CSS 文件。

```powershell
$consumerDir = '将这里替换为命令实际输出的 adui-reset-* 路径'

# 分别打开三个 PowerShell 终端：
Set-Location (Join-Path $consumerDir 'baseline')
vp dev --port 5180
```

另两个终端在同一个 `$consumerDir` 的 `normalize-first` 与 `normalize-last` 子目录，分别运行 `vp dev --port 5181`、`vp dev --port 5182`。在同一浏览器、同一 OS、同一系统字体和缩放下访问三个端口。

浏览器控制台可读取 `window.__aduiResetEvidence`，页面也会显示相同 JSON。至少检查：`h1`/列表 margin、font-weight、list marker，`b` 与 `strong`（父级 600）、code、button/input 的背景/边框/焦点、hidden 与 until-found、原生 dialog/details。需要进一步记录 DevTools Styles/Computed 中的**最终命中声明和 CSS Layer**，因为仅记录计算值无法证明声明来源。

建议按 `baseline → normalize-first → normalize-last` 保存三个 JSON 与对应截图；比较只在**同一场景内部**进行，不将 Tailwind 与 UnoCSS 组合到一个页面。若存在浏览器工具可采集完整 CSSOM/样式表来源，也要保存产物样式内容与哈希。

## 4. 结果判定与故障定位

| 分类 | 判定条件 |
| --- | --- |
| `BUILD_PASS` | 三套隔离 Vite+ 生产构建成功、真实 CSS tarball 已解析，且 Reset 样式进入产物 |
| `BROWSER_PASS` | 同一浏览器下预期/实际交互与布局对照完备，所有变化有来源和理由，无非预期回归 |
| `EXPECTED_DUPLICATE` | `b, strong { font-weight: bolder }` 同时来自已安装的 Normalize 和本场景 Preflight/Reset，效果相同且不损害行为 |
| `CONFLICT` | 存在非预期变化，并有胜出声明、顺序、特异性/层级和最小复现证据 |
| `NOT_RUN / BLOCKED` | 缺真实安装、实际产物或浏览器交互证据；工具链失败另登记环境阻塞 |

特别注意：**本库当前只有 R-003 的 `b/strong` 规则**，在待测三种 Reset 中均已存在类似声明。预期很可能只是重复而非互相冲突，但需要看浏览器实际计算样式、T0/T2 来源以及打包结果。不要把源代码重复直接当成 FAIL，也不要把 CSS 构建成功当成 F-010 整体 PASS。

### 失败与边界情况

- Tailwind 使用 `@tailwindcss/vite` 编译 `--theme(...)` 等表达式：若 Vite+ 插件与当前依赖树不兼容，保留失败日志，先判定为**测试环境/插件阻塞**，不要降级为手工替换 CSS 规则或新增项目根依赖。
- `@unocss/reset` 安装包的 `exports` 若与版本不符，应检查**实际安装包**，不擅自改用 `unocss` 或新增 presetWind4。
- `npm run test:offline` 只验证纯 Node 文件契约；新增 Reset 代码后的完整 PASS 必须由维护者执行后更新。此前 30/30 仅是旧代码版本的已确认结果。
- npm 包尚为 `private: true`、`0.0.0` 的开发 tarball，不代表公开 npm 发布。测试过程中不增加 CI、发布/部署或修改正式 Normalize CSS。
- WebKit 自动化与真实 Safari 17.2 必须分别记录；本次环境未自动安装浏览器。

## 5. 相关文件与依据

- [reset-fixtures.mjs](../../tests/reset-fixtures.mjs)：独立 CSS/HTML/探针生成器；
- [reset-consumer.mjs](../../tests/reset-consumer.mjs)：真实 tarball + Vite+ 三组生产构建命令；
- [reset-contract.node.test.mjs](../../tests/reset-contract.node.test.mjs)：无需网络的 Fixture 隔离契约；
- [既有生态测试记录](W06_ECOSYSTEM_LOCAL_VERIFICATION.md)；[W-06 Issue #7](https://github.com/adui-studio/normalize.css/issues/7)；
- [Tailwind 官方 Preflight](https://tailwindcss.com/docs/preflight)；[UnoCSS 官方 Reset](https://unocss.dev/guide/style-reset)；[Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction)。

**下一条有效更新应来自真实命令输出和浏览器结果，而不是继续累加未运行的测试计划。**
