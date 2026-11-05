# MVP v0.0.1 · 开发交付与人工验收清单

- **版本**：`@adui/normalize.css@0.0.1`
- **安全设置**：`private: true`，**禁止误发布**
- **所在分支**：`main`（通过 PR #1/#9 合并；原开发分支 `feat/viteplus-local-harness` 保留为历史来源）
- **开发状态**：**维护者于 2026-11-05 明确确认 MVP 最终验收完成（维护者签收）**。当前仓库尚未归档最近一次测试断言变更提交 `80f637ed` 之后的完整 `verify:mvp` 原始输出，因此签收不等于本工具独立复验，也不表示七项目标浏览器均有完整原始证据。
- **发布状态**：已合并 `main`（PR #1：`1d1e9b5c`；PR #9：`f92e9457`），但未执行 `npm publish`、未创建 Git Tag/Release、**无 CI**
- **依据**：[ADR-0003 首版唯一入口](adr/0003-mvp-package-contract.md)、[W-05 规则准入](research/W05_RULE_ACCEPTANCE.md)、[W-06 管理验收](research/W06_ACCEPTANCE_INDEX.md)、[W-07 发行门槛](research/W07_RELEASE_GATES.md)

## MVP 实际交付的内容

| 需求                         | 首版实现                                                                              | 不包含                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| FR-001 · 默认 Normalize      | `src/normalize.css` 中的 **R-003**：`b,strong {font-weight:bolder}`                   | 不增加 W-05 已否决/暂缓的 35 条候选规则                    |
| FR-006 · 单一 CSS 公开根入口 | `exports["."] = "./dist/normalize.css"`；`files:["dist"]`；`sideEffects:["**/*.css"]` | 不暴露 JS、`reset.css`、`a11y.css`、`forms.css`、`all.css` |
| FR-007 · 规则证据与可复核性  | R-003 原始对照、T0/T1 比较器、T0/T2 **正式打包产物证据比较器**、离线 Node 单测        | 不把静态探针通过等同于全部浏览器支持                       |
| 本地交付                     | Vite+ 1.4.0、pnpm 12.15.0、可复用 Fixture、真实 tarball 离线安装与 Vite+ 消费测试     | 不增加运行时 JS、根依赖、CI 或自动发布                     |

**重点**：首版 CSS 只有一条规则是**W-05 经维护者批准的主动设计结果**，不是漏实现的 35 条。补充没有浏览器证据的规则会改变已冻结首版行为与组件库风险，因此本轮不修改默认 CSS。

## 维护者运行一次完整本地验收

在 Windows PowerShell 的仓库根目录执行：

```powershell
git switch main
git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm run verify:mvp
git status --short
```

`verify:mvp` 是**本地人工运行的 npm script，不是 CI**，依次执行：

1. `vp check`（格式与 Lint，**只读，不使用 --fix**）
2. `vp test`（Vitest）
3. `pnpm run test:offline`（原生 Node，包括新 T0/T2 比较器合成用例）
4. `vp pack`（唯一 CSS 发布产物）
5. `pnpm run test:package`（真实 tarball 离线安装）
6. `pnpm run test:consumer`（独立 Vite+ 生产消费）
7. `npm pack --dry-run --json --ignore-scripts`（只读预打包清单，**不是发布**）

**单独补做的 Fixture 构建检查（未包含在 `verify:mvp` 中）**：当前 `vite.config.ts` 声明了八张 HTML Fixture；离线测试仅在 `dist-fixtures/` 目录已存在时核对构建输出。因此 `verify:mvp` 全绿**不能单独证明 `vp build` 通过**。维护者在上述验收之后另行执行：

```powershell
pnpm exec vp build
```

应确认 `dist-fixtures/` 中具有 `index`、`r003-native`、`r003-candidate`、`r004-native`、`r004-risk-review`、`r004-family-review`、`t2-native`、`t2-package` 八张页面；保留实际构建日志，失败时不得将 Fixture 构建记作 PASS。此为现有 Vite+ 命令，不新增依赖、脚本或 CI。

任何步骤失败都停止后续检查，先修复实际问题再重跑。Vite+ 格式检查若提示失败，**不要未经检查就盲目修改上游 Skills**；只对确实属于第一方的文件执行 `vp check --fix`，审阅差异后再复验。

**预期结构**：`@adui/normalize.css@0.0.1`，`private:true`；`dist/` 唯一 `normalize.css`；npm 包文件**恰好 5 项且全部必需**：LICENSE、README.md、README.en.md、dist/normalize.css、package.json，且无 bundled 依赖。真实 tarball 的本地测试现已强制校验精确文件清单、包名/版本和作者/MIT 元数据；漏掉英文 README 也会测试失败。包字节数/哈希随新增本地验证脚本元数据变化，**不得沿用以前 13871 B 的大小作为固定断言**。真实体积以本轮输出为准。

## 浏览器数据准备完成后再做 T0/T2 对照

复用现有开发态页面：

```powershell
vp pack
vp dev
```

在**同一真实浏览器版本、设备和设置**中打开：

- T0：`http://localhost:5173/fixtures/t2-native.html`
- T2：`http://localhost:5173/fixtures/t2-package.html`

分别复制页面 `#probe-output` JSON 到本机两个文件（例如 `t2-native.json` 与 `t2-package.json`），然后执行：

```powershell
node tests/t2-evidence.mjs .\t2-native.json .\t2-package.json
```

CLI 仅使用 Node 内置模块，复用现有 **256 KiB 普通文件限长读取**，不会发送环境数据。探针不仅记录 `link.sheet` 是否挂载，还从**同源 CSSOM** 提取 `type`、`selector`、`font-weight`、声明数量和 `!important` 优先级；比较器要求正式产物的 CSSOM **恰好只有 `b,strong {font-weight:bolder}` 一条普通规则**。空样式表、错误规则、多余声明、强制 `!important` 或 CSSOM 不可读，都不能据此宣布静态验证通过。结果有：

| `status`                             | CLI 退出码 | 说明                                                               |
| ------------------------------------ | ---------: | ------------------------------------------------------------------ |
| `PROBE_PASS`                         |          0 | 包 CSS link 为已挂载，10 项静态探针满足当前 R-003/R-004 的有限契约 |
| `STYLE_MISMATCH`                     |          1 | 字重、等宽字体或对照上下文出现不符合预期的变化                     |
| `STYLESHEET_NOT_LOADED`              |          1 | 正式 CSS link 未挂载；**不能判通过**                               |
| `STYLESHEET_CONTENT_MISMATCH`        |          1 | CSSOM 内容与唯一 R-003 规则不一致，或 CSSOM 不可读                 |
| 输入错误、混合 UA、错误页或非法 JSON |          2 | 证据不可比较，需检查文件/版本/来源                                 |

比较器会输出 R-003 六组字重、R-004 四组等宽元素的值与差异；Chrome 120 的四组**预期修复差异**不属于失败，而 Firefox 121 的零差异也可能是正确结果。**静态 PROBE_PASS 虽已核对本地解析后的 CSSOM，但不能证明 Network 响应原始字节、真实浏览器构建版本、原生交互、无障碍或全七项目标支持范围**；仍需手工版本截图、Network、操作记录。详见 [P-05 浏览器证据矩阵](research/W07_P05_BROWSER_EVIDENCE_MATRIX.md)。

## 发布前尚需决定

- **P-04**：虽然 npm `whoami=adui` 与个人 `@adui` 作用域相符，但首次发布认证条件、安全设置与实际包名状态仍待最终核对。
- **P-05**：ADR-0004 已批准的七项目标浏览器正式支持矩阵仍缺部分可审计实机附件；不宣称未验证的最低支持版本。
- **P-07**：npm 正式发布、修改 `private:true`、Tag/Release、合并 `main` 都必须取得**独立明确授权**。

**MVP 开发交付与公开发行是两种不同的验收**。这份清单不关闭 W-07 Issue #8，也不代表浏览器实机或 npm 发行已通过。
