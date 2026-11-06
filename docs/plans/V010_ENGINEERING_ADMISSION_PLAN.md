# v0.1.0 · 工程准入预检与验收执行计划

**建立日期**：2026-11-06  
**任务**：[Issue #18](https://github.com/adui-studio/normalize.css/issues/18)  
**仓库核查基线**：`main@52d7d78685f58c0eee963638b3d5d0427cc94ca6`。当前 `package.json` 版本仍为 `0.0.3`；已发布 `v0.0.3` 的源提交为 `f5c08642e1ab6eaa1cb3d84782485f0298ae77be`。  
**文档状态**：工程准入**执行计划 / 待维护者本机实测**，不是 `0.1.0` 发行候选，也不是已通过验收的结果。  
**已生效决策**：[ADR-0006（Accepted）](../adr/0006-v01-default-scope-and-compatibility-risk.md) 方案 A：默认 Normalize 冻结 R-003/R-007/R-008；显式可选 Reset/Forms/A11y/All 不变；接受旧 Safari/Blink 的限定风险，未经逐版本证据不公开最低支持承诺。  
**关联**：[HARNESS](../HARNESS.md) · [RELEASING](../RELEASING.md) · [SDD](../SDD.md) · [项目上下文](../PROJECT_CONTEXT.md) · [v0.0.3 浏览器归档](../research/V003_OPTIONAL_MODULE_BROWSER_ACCEPTANCE.md)。

## 一、范围与不可越过的边界

本轮只做 **现有 `v0.0.3` 代码在当前 `main` 上的工程预检方案**，不提前制造一个假设的 `0.1.0` 发布提交：

- 不修改 `src/normalize.css`、`src/reset.css`、`src/forms.css`、`src/a11y.css`、`src/all.css`，不修改六个 CSS-only `exports` 的实际内容。
- 不修改 `package.json#version`、`pnpm-lock.yaml`、Vite+ 配置、生产包接口、依赖、`tests/` 与 `fixtures/`；不新增任何 CI。
- 不运行 `release:publish`、`npm publish`，不创建/移动 Tag 或创建 Release；禁止擅自以 `0.1.0` 占用 npm 版本。
- 历史 `v0.0.3` 发行 SHA 上的 61/61、PR #28 阶段维护者反馈的 64/64，以及 `vp check` 90 文件 / 22 个 Lint 文件无错误，**是不同代码快照上的已报告结果**；不能据此宣布当前 HEAD 或未来 `0.1.0` 已验证。
- 既有浏览器跨平台验收由维护者作出管理确认，但缺少部分浏览器/设备/系统偏好的逐项原始附件；ADR-0006 已批准限定风险接受，而非补写不存在的旧 Safari / Blink 实测结果。

## 二、对现有脚本的实际核查结果

| 入口 / 文件                                  | 当前已存在的真实行为                                                     | 是否在 `pnpm run verify:mvp` 内 | 准入意义                                   |
| -------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------- | ------------------------------------------ |
| `vp check`                                   | 格式与 Lint 检查                                                         | **是**                          | 本次 HEAD 的本机静态验证                   |
| `vp test`                                    | `tests/**/*.test.ts`（当前包含 8 个 Fixture 契约用例）                   | **是**                          | Vitest 契约与结构检查；不是浏览器测试      |
| `vp pack`                                    | `vite.config.ts` 只以 `src/normalize.css` 生成 `dist/normalize.css`      | **是**                          | 默认发行 CSS，非完整 HTML Fixture 构建     |
| `pnpm run test:offline`                      | 9 份 Node 测试文件，包括默认和可选模块、Fixture、历史证据等              | **是**                          | 静态/合成/离线契约；实际测试条数以终端为准 |
| `pnpm run test:package`                      | 真实 tarball、离线安装、6 个 CSS exports、文件白名单、禁止意外子路径     | **是**                          | npm 真实分发结构                           |
| `pnpm run test:consumer`                     | 真实 tarball 在隔离消费者中导入 `all.css` 并使用 Vite+ 生产构建          | **是**                          | 包装配方与 CSS 组合路径验证                |
| `npm pack --dry-run --json --ignore-scripts` | 预览包文件、大小、元数据；**不发布**                                     | **是**                          | 发包清单预检；预期 10 文件                 |
| `pnpm exec vp build`                         | `vite.config.ts` 明列 8 个历史 HTML Fixture 入口，输出到 `dist-fixtures` | **否**                          | 必须额外执行；它不包含新 M0/M1 两页        |
| `node tests/ecosystem-consumer.mjs <case>`   | 独立 Vue/React 组件消费者，打包默认 Normalize 并比较导入前后             | **否**                          | 生态叠加专项；需分别给定 case              |
| `node tests/reset-consumer.mjs <case>`       | 独立 Tailwind/UnoCSS Reset，含原生、先导入和后导入三种对照               | **否**                          | 双重 Reset/导入顺序风险；需分别给定 case   |
| `pnpm exec vp dev` + T0/T2、M0/M1 页面       | 真实浏览器的计算样式、CSSOM、键盘、原生控件和系统偏好                    | **否**                          | 人工证据，不以自动化计数代替               |

**关键边界**：`verify:mvp` 不包含 `vp build`、生态组件专项、Reset 叠加专项或真机浏览器。`vp build` 只构建当前 `vite.config.ts` 列出的 8 页，不自动包括 `modules-native.html` / `modules-all.html`；这两页可通过 `vp dev` 使用。不要因 8 页构建 PASS 就宣称 M0/M1 构建 PASS。

### 2.1 版本强绑定与未来变更注意

- 当前 `tests/package.node.test.mjs` 明确断言 `pkg.version === "0.0.3"`。
- 当前 `tests/package-real.node.test.mjs` 明确断言 `manifest.version === "0.0.3"`；真实 tarball 的名称/版本/导出还必须与安装后的包一致。
- `tests/package-smoke.node.test.mjs` 的 `0.0.0-smoke.0` 是**故意独立的合成测试包版本**，不能因未来真实版本变化而替换。
- 以后若**另行批准** `0.1.0` 候选，必须以最终分支实际文件为准，最小同步 `package.json`、上面两处版本字面量、README 中英文、CHANGELOG 与适用发行文档；不得假设锁文件要手工变更，需通过冻结安装结果判断。
- 本预检**不执行以上版本迁移**；任何测试结果都要区分“对 `0.0.3` 源码预检”和“对未来 `0.1.0` 候选完整验证”。

## 三、维护者 Windows PowerShell 预检步骤（现行 main）

> 下列命令是**准备执行的验收流程**，本研究阶段尚未在维护者本机运行。每项实际输出、退出码、开始/结束时间和执行前后的 Git SHA 由维护者保存。`npm pack` 的预检不等于 npm publish。

```powershell
git fetch origin
git switch main
git pull --ff-only origin main

git rev-parse HEAD
git status --short
node --version
pnpm --version

pnpm install --frozen-lockfile
pnpm run verify:mvp
pnpm exec vp build

git diff --check
git status --short
git rev-parse HEAD
```

**判定办法**：

1. 记录实际 `HEAD`，确认执行过程中没有切分支或产生新提交；对当次 SHA 做结果绑定。此文档建立时远端 `main` 为 `52d7d78685f58c0eee963638b3d5d0427cc94ca6`，若运行前 HEAD 已前进，以**真实运行时 SHA** 为准，重新核对变更范围。
2. `pnpm install --frozen-lockfile` 需成功；不得通过静默更新锁文件或依赖来掩盖环境问题。
3. `verify:mvp` 的每个子命令均需以退出码 0 结束。真实测试数量、文件数、npm tarball 路径/清单以输出为准，**不固定写成必须 64/64**。
4. `vp build` 应为 **8 个 `vite.config.ts` 明列的正式 Fixture 页面**成功构建；查看输出日志和 `dist-fixtures` 实际文件，而不是拿 `vp pack` 的 `dist/normalize.css` 冒充。
5. `git diff --check` 无错误、`git status --short` 无意外改动；若检查输出异常，记录、修复原因后重新运行，不删除或跳过失败项。
6. 上述结果仅判定**当前 `main` 的工程基线预检**，并非允许发布 `0.1.0`。

## 四、隔离消费者与 Reset 专项（独立于核心离线 Gate）

**已有脚本的真实前置条件**：先完成 `pnpm install --frozen-lockfile` 和 `pnpm exec vp pack`。两类脚本会在仓库 `node_modules/.cache` 下创建隔离目录，使用 `npm` 安装固定版本的 UI/Reset 第三方依赖，**可能需要联网或已缓存包**。它们不是零网络风险的纯离线 `verify:mvp`；安装失败时应区分网络/Registry/权限/依赖问题与 CSS 真实回归。

```powershell
# Vue + Element Plus / Vue + TDesign / React + Ant Design
node tests/ecosystem-consumer.mjs vue-element
node tests/ecosystem-consumer.mjs vue-tdesign
node tests/ecosystem-consumer.mjs react-antd

# Tailwind CSS v4 Preflight / UnoCSS 两种 Reset
node tests/reset-consumer.mjs tailwind-preflight
node tests/reset-consumer.mjs unocss-tailwind-v4
node tests/reset-consumer.mjs unocss-tailwind-compat
```

这六个命令都是**已有脚本及其现有 case 名称**，不是新增测试实现。它们主要核查**默认 Normalize**与组件库/其它 Reset 的组合。对用户显式同时使用 `reset.css`、`forms.css`、`a11y.css` 或 `all.css` 的生态集成，这六个脚本**不能直接证明所有 opt-in 场景通过**；可结合已有 M0/M1 实测、真实消费者构建与有针对性的人工组件检查，发现确切冲突后再提出测试扩充需求。禁止把默认模块的历史 W-06 结果当作完整可选模块新矩阵。

## 五、浏览器人工验收的有效证据边界

- 默认 Normalize：先 `pnpm exec vp pack`，再 `pnpm exec vp dev`；在**同一浏览器/OS/设备**打开 `/fixtures/t2-native.html`（T0 原生）和 `/fixtures/t2-package.html`（T2 真实打包默认 CSS），保存原始 JSON，再运行 `node tests/t2-evidence.mjs .\t2-native.json .\t2-package.json`。15 个探针及 CSSOM 比较器只代表其约定的规则/行为范围。
- 可选 All：同一 `vp dev` 服务下打开 `/fixtures/modules-native.html`（M0）和 `/fixtures/modules-all.html`（M1 导入仓库 `src/all.css`），保存原始 `window.__aduiModuleCapture()` 返回值与版本/OS/设备信息，并单独记录交互、键盘焦点、`forced-colors` / `prefers-reduced-motion` 的实际触发状态；这**不是**真实 npm tarball 安装的重复验证。
- 对照只包含确实执行的浏览器、系统与环境；旧 Safari 17.x、Chrome/Edge 120 如缺特定版本数据，按 ADR-0006 **接受限定风险且不公开最低版本保证**，不凭厂商历史修复说明填“通过”。
- 管理验收（PR #28 已由维护者确认）与可独立审计的逐设备日志分开存档。没有真实故障时不用为补满历史版本数而修改产品 CSS。

## 六、下一版本独立 Gate：不可提前视为通过

| 关口                | 当前状态                                          | 本阶段可做 / 不可做                                                |
| ------------------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| ADR-0006 D-01、D-02 | **Accepted**                                      | 三条默认范围已冻结，历史兼容风险限定接受                           |
| D-03                | **历史管理验收与部分浏览器证据已存在**            | 复用有效证据、补缺口；不能宣称所有目标旧版本逐项 PASS              |
| D-04                | **未来 `0.1.0` 的准确发布 SHA 尚不存在/未获批准** | 只建立命令与日志模板；不可复用旧版 61/61 或 64/64 填写             |
| D-05                | **已有限定公开措辞政策**                          | 后续版本 README / npm 文案按真实结果核对，不新增未经证实的兼容保证 |
| D-06                | **版本升级/发布尚未授权**                         | 不改版本号、不发 npm、不建 Tag/Release                             |
| D-07                | **设计原则持续有效**                              | 保持 CSS-only、显式 opt-in、无 CI                                  |

### 每次实际运行的最小归档模板

```text
执行日期/时区：
Git HEAD（前）：
Git HEAD（后）：
Node / pnpm / Vite+：
操作系统与终端：
冻结安装：PASS / FAIL / 未执行（退出码）：
verify:mvp：PASS / FAIL / 未执行（Vitest / Node / tarball / consumer 实际数量）：
vp build：PASS / FAIL / 未执行（输出页面）：
隔离生态/Reset 六项：每项 PASS / FAIL / 未执行（依赖版本、错误摘要）：
真实浏览器：品牌、完整版本、OS/设备、T0/T2 或 M0/M1、原始 JSON/截图路径：
git diff --check / git status --short：
意外变更与原因：
未关闭风险及负责人：
结论：当前 main 工程预检 / 未来候选验收（必须明确区分）：
```

## 七、本研究本身的验证状态

**已通过 GitHub 源文件核对**：`main` 的实际 `package.json` 命令、`vite.config.ts` 八页构建配置、`tests/package.node.test.mjs` / `tests/package-real.node.test.mjs` 强绑定、真实包/`all.css` 消费测试、`tests/ecosystem-consumer.mjs` 和 `tests/reset-consumer.mjs` 参数及隔离依赖安装方式、已接受 ADR-0006 和当前 HARNESS/RELEASING 记录。

**尚未执行**：本地 `pnpm install`、`vp check`、`verify:mvp`、`vp build`、隔离生态/Reset 和真实浏览器；本研究不生成新的自动化 PASS 数字，也不构成 `0.1.0` 启动/发布授权。

**下阶段**：维护者在当前 `main` 执行第三节工程预检并提供 SHA/日志；独立验收后再审是否启动 `0.1.0` 候选版本开发、需要补哪些精确测试和公开文档。不得将“继续”视为已经同意升版或发布。
