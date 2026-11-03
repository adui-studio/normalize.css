# Vite+ 本地 Harness：开发前设计与准入规范

- **状态**：已开始在独立开发分支实施 W-03；**文件和 Node 自测已有，Vite+ 未运行、浏览器实测未完成、包构建未进行**。
- **日期**：2026-11-03
- **任务**：[W-03 / Issue #4](https://github.com/adui-studio/normalize.css/issues/4)
- **正式依据**：[ADR-0005](../adr/0005-viteplus-toolchain.md)、[MVP 计划](MVP_IMPLEMENTATION_PLAN.md)、[W-02 复现指南](../research/R003_R004_LOCAL_VERIFICATION.md)
- **原则**：最小依赖、纯 CSS 产物、先证明 UA 差异再修复、不增加任何 CI。

## 1. 官方能力与边界

| 工具 | 在本项目中的未来用途 | 实际核验状态 |
| --- | --- | --- |
| `vp fmt --check` / `vp check` | 格式与静态检查；要核验 CSS 规则覆盖能力 | 官方命令存在；仓库未执行 |
| `vp test` | 由 Vite+ 自带 Vitest 验证规则元数据/包契约；无需单独安装基础 Vitest | 仅核对官方文档 |
| `vp dev` | 预览原生 HTML 和组件集成 Fixture | 没有创建 Fixture |
| `vp pack` | W-04 检查纯 CSS npm 入口及打包产物 | 支持 CSS bundling，但 CSS-only、无 JS 产物需实测 |
| `vp build` | 构建供验证的应用 Fixture | **不等同于**静态 CSS 包发布打包 |

来源：[Vite+ Check](https://viteplus.dev/guide/check)、[Test](https://viteplus.dev/guide/test)、[Pack](https://viteplus.dev/guide/pack)、[Getting Started](https://viteplus.dev/guide/)。

Vite+ 官方当前 `vp test` 文档的 Node 要求为 `^22.18.0 || ^24.11.0 || >=26.0.0`。实际开发时应复核版本与环境并写入锁文件，不得臆造用户本机当前状态。普通 `vp test` 不替代真实浏览器测试；浏览器模式如需 Playwright provider 或浏览器驱动，应按实际需求另行评审。自定义 `package.json` 脚本需用 `vp run <name>`，不能假定覆盖同名内置命令。

## 2. 最小文件布局建议（**以下文件尚未创建**）

```text
package.json
vite.config.ts
fixtures/
  r003-native.html         # T0：UA 原生结果，只有父级字重 Fixture 样式
  r003-candidate.html      # T1：单独加入候选 R-003 样式
  r004-native.html         # T0：monospace 用户字号偏好
  r004-risk-review.html    # T1：仅用于比较可能破坏用户设置的候选
  integration/             # T2：只有真正存在默认包入口后才添加
tests/
  contract.test.ts         # 开发期元数据与入口约束；不是 CSS 视觉测试
```

这只是未来的最小内部测试资产建议，**不是公共包接口或已实现目录**。避免直接运行 `vp create` / `vp migrate` 覆盖现有文档仓库，也不为单条规则先建大型 React/Vue 工程。

## 3. W-03 的实际开发步骤（需独立授权）

1. 检查 `vp --version`、`node --version`、包管理器与 OS；锁定 Vite+ 版本。
2. 根据上面布局做最小工具与 Fixture 配置；不重复添加 ESLint、Prettier、Vitest。
3. 分别运行并记录 `vp fmt --check`、`vp check`、`vp test` 的真实结果；记录工具未检查到的 CSS 内容，不能将“静态检查通过”写成“浏览器兼容通过”。
4. 使用 `vp dev` 提供 T0 原生、T1 单规则、T2 集成对照；真实浏览器中检查 `b` 和 `strong` 父级字重 400 / 600 / 700。
5. 记录 Chrome/Edge 120、Firefox 121、Safari 17.2 与对应核心移动目标的完整版本、OS、UA 规则、计算值、截图、失败及未测试项。
6. 由 W-04 独立验证 `vp pack` 的纯 CSS 产物、`exports`、`sideEffects` 和实际 Vite+/Webpack 消费者；不能使用 `vp build` 成功代替包构建验证。

旧版浏览器只建议使用隔离的本地离线环境；不要登录真实账号或将其替换为日常默认浏览器。真实 Safari/iOS 与 Playwright WebKit 不可混为一谈。

## 4. 执行结果的记录格式（规划）

| 字段 | 必填 |
| --- | --- |
| 任务 / 规则 / 输入 | W-03、R-003/R-004、T0/T1/T2 |
| 工具/浏览器/OS | 完整工具版本、浏览器构建、系统与设备 |
| 实际操作 | 使用的原生页面、作者 CSS、加载顺序、命令 |
| 实际证据 | 计算值、交互结果、截图或日志位置 |
| 结论 | `PASS` / `FAIL` / `BLOCKED` / `NOT_RUN` |
| 后续行动 | 修复/排除/重新复现/补充设备 |

**W-03 退出门槛**：工具版本明确，真实本地命令可运行、T0/T1 流程可复现、结果可审查、环境缺口有记录、无 CI。仅有设计文档或 `vp check` 通过都不足以关闭 Issue #4。

**当前实际结果（2026-11-03）**：已创建 `package.json`、`vite.config.ts`、`fixtures/index.html`、R-003/R-004 T0/T1 HTML、`fixtures/probe.js`、`tests/fixtures.test.ts`、`tests/fixtures.node.test.mjs`、`tests/package.node.test.mjs`、`tests/package-smoke.node.test.mjs`、`tests/probe.node.test.mjs`、`tests/r003-evidence.mjs` 和 `tests/r003-evidence.node.test.mjs`。已运行 Node 原生测试 **18/18 通过**（Fixture 4、元数据 3、探针 2、合成 CSS 包离线安装 1、R-003 合成证据/CLI 8）和 JS 语法检查；当前容器 Node 22.16.0 低于 Vite+ 所需版本且 npm Registry DNS 不通，**未运行 vp check/test/dev，亦未生成锁文件**。Chromium 144 `--dump-dom` 超时，未获得 UA 计算值。R-003 仍只有候选规则 Fixture、没有发布 CSS，W-03 保持未完成。

后续在具备 Node ≥22.18.0 和可用 npm 网络的环境，执行安装、提交锁文件并运行 `vp check` / `vp test` / `vp dev`，再逐项补录最低浏览器版本结果。
