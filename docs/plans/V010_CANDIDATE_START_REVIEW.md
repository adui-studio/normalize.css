# v0.1.0 · 候选启动评审与最小版本迁移清单

**建立日期**：2026-11-06  
**关联**：[Issue #18](https://github.com/adui-studio/normalize.css/issues/18) · [ADR-0006（Accepted）](../adr/0006-v01-default-scope-and-compatibility-risk.md) · [工程准入与实测](V010_ENGINEERING_ADMISSION_PLAN.md) · [人工发行规程](../RELEASING.md)  
**审查基线**：`main@7b0e5092e6240590e5273a291de6c94ebc4e9173`（已发行 npm 仍为 `@adui/normalize.css@0.0.3`）。  
**文件性质**：**启动与版本迁移的待审计划**，不是已经批准的候选、不是版本升级、不是发布许可或实际测试报告。

## 1. 决策结论与准入建议

1. **范围决定已生效**：按照 ADR-0006 方案 A，默认 Normalize 固定 R-003/R-007/R-008；已发行 `reset.css`、`forms.css`、`a11y.css`、`all.css` 保持显式 opt-in。36 条候选中其余暂缓/排除项不因里程碑升级自动进入产品。此范围**不要求新增 CSS**。
2. **建议先批准候选准备，再另行审批发布**：如果维护者认可把现有稳定的 CSS-only 契约作为 `0.1.0` 完整性里程碑，可在**独立的开发 PR** 里实施最小版本迁移。若仍要求有新功能或完整旧浏览器保证才允许 `0.1.0`，应保持 `0.0.3`，不为填版本号而扩大 CSS 或伪造兼容性证据。
3. **尚未获得升级授权**：本文件及 PR 的评审、合并不构成 `0.1.0` 候选开发、`npm publish`、Tag、Release 的许可。**即使以后允许启动候选，发布仍需再次明确授权。**
4. **兼容承诺边界**：旧 Safari 对 R-007 的下划线解析、旧 Blink 对 R-008 的收益保持已批准的限定风险接受；未获得逐版本原始数据时，不向外承诺具体最低浏览器版本或全矩阵 PASS。

## 2. 已核实的仓库契约（2026-11-06）

| 核查项 | 当前实际值 | 候选阶段限制 |
| --- | --- | --- |
| `package.json#name` | `@adui/normalize.css` | 不更名 |
| `package.json#version` | `0.0.3` | **仅获独立许可后**改为 `0.1.0` |
| `package.json#private` | `false` | 不误改为 `true`；非发布授权 |
| `package.json#exports` | 六个 CSS-only 公共入口 | 保留所有既有映射 |
| `package.json#files` | `dist` 和 `src` | 不额外暴露测试资产 |
| `package.json#sideEffects` | `["**/*.css"]` | 保留 CSS 副作用声明 |
| `package.json#engines` | `^22.18.0 \|\| ^24.11.0 \|\| >=26.0.0` | 不无故扩大或收窄 |
| `package.json#packageManager` | `pnpm@12.15.0` | 不更新工具链或依赖 |
| `vite.config.ts` | `vp pack` 构建默认 CSS；`vp build` 构建八页 Fixture | 不把 Fixture 当作正式包文件 |
| `pnpm-lock.yaml` | 已含 pnpm 和 Vite+ 锁定数据 | 不手改；以冻结安装的真实结果判定 |

**默认产品规则与公开模块**：`src/normalize.css` 三条，`src/reset.css`、`src/forms.css`、`src/a11y.css`、`src/all.css` 保持现有行为与公开路径。不增加运行时 JavaScript，不新增依赖、CI 或自动发布工作流。

## 3. 若获准启动候选：最小修改矩阵

下表是**未来候选 PR 的预期文件范围**，并非本轮已修改的文件。具体内容需以启动当日的最新 `main` 重新核对。

| 文件 | 必要动作 | 原因与注意 |
| --- | --- | --- |
| `package.json` | `version: "0.0.3" → "0.1.0"` | 仅升级包版本；六个 `exports`、依赖、`files`、`engines` 等不变 |
| `tests/package.node.test.mjs` | 第 16 行当前 `pkg.version === "0.0.3"` 的固定断言改为 `0.1.0` | 同步包元数据契约 |
| `tests/package-real.node.test.mjs` | 第 82 行当前 `manifest.version === "0.0.3"` 的固定断言改为 `0.1.0` | 真实 tarball/离线安装版本一致 |
| `README.md` | 更新页首当前正式版与候选状态说明；保留 `0.0.3` 历史首次发布子路径的准确表述 | 不把尚未发布的 `0.1.0` 写成 npm 已上架 |
| `README.en.md` | 与中文 README 同步候选状态及实际兼容性措辞 | 不虚构最低浏览器支持版本 |
| `CHANGELOG.md` | 在 **Unreleased/候选** 下记录里程碑和“产品 CSS 不变”；发行后再归档正式版本段落 | 发行前不得写已发布日期、Tag/SHA 或 npm 成功 |
| `docs/RELEASING.md`、`docs/PROJECT_CONTEXT.md`、`docs/HARNESS.md`、`docs/CODEBASE_MAP.md` | 只同步确实受影响的候选状态、门槛、命令及代码地图 | 保留旧 `0.0.3` 发行事实及其固定 SHA |
| `pnpm-lock.yaml` | **不预设必须修改**；先做冻结安装，只有工具确定必要时才在单独审查下更新 | 避免凭印象手工改锁文件 |

**明确不应修改**：

- `tests/package-smoke.node.test.mjs` 的 `0.0.0-smoke.0` 是合成包隔离版本，不能改成 `0.1.0`。
- `src/*.css`、`vite.config.ts`、`fixtures/`、六个 CSS-only 导出映射及第三方依赖，无证据不变。
- `v0.0.3` 的 npm tarball、历史 Git Tag 与 Release 不能重写、移动或重复发布。
- 不添加任何 CI / Actions / 自动发布。

## 4. 开发候选工程门槛（需新 SHA）

未来候选 PR 实际存在之后，维护者必须在同一精确 HEAD 上执行并留存结果。执行前先记录 `git rev-parse HEAD` 和工作区状态，结束再记录一次；任何中途提交、合并、修复均需重新绑定证据。

```powershell
git branch --show-current
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

`verify:mvp` 实际覆盖格式/Lint、Vitest、离线 Node、`vp pack`、真实 npm tarball 离线安装、Vite+ 组合 CSS 消费和 npm dry-run。**它不包含**独立的八页 `vp build`、以下六项生态/Reset、真实浏览器 T0/T2 或 M0/M1。执行数字必须取当次输出，不能直接沿用旧版 64/64。

若候选版本迁移完全不改产品 CSS，先保留以前对应源码 SHA 的浏览器证据与限定风险说明；如出现新浏览器回归报告或候选引入行为变化，应针对相关环境补测，不将旧管理验收当作每个版本独立的原始 PASS。

独立消费者/Reset 门槛使用仓库现有脚本（可能依赖 npm 网络/缓存）：

```powershell
node tests/ecosystem-consumer.mjs vue-element
node tests/ecosystem-consumer.mjs vue-tdesign
node tests/ecosystem-consumer.mjs react-antd

node tests/reset-consumer.mjs tailwind-preflight
node tests/reset-consumer.mjs unocss-tailwind-v4
node tests/reset-consumer.mjs unocss-tailwind-compat
```

六项仅证明生产打包/解析与两种导入顺序**可以构建**，不证明浏览器的真实级联、视觉、键盘或系统偏好兼容。

## 5. 独立 Gate 与授权顺序

| Gate | 当前审查状态 | 后续完成条件 |
| --- | --- | --- |
| D-01 范围 | **已批准** | 保留 R-003/R-007/R-008 和 opt-in 边界 |
| D-02 历史风险 | **已批准限定接受** | 不公开承诺缺少证据的最低浏览器版本 |
| D-03 浏览器/生态 | **部分历史管理验收 + 构建级证据** | 仅陈述实际已测环境；补足必要交互/级联回归 |
| D-04 候选 SHA 工程 | **尚未执行** | 正式候选存在后按第 4 节完整重跑，结果绑定候选最终 SHA |
| D-05 对外措辞 | **政策已定，候选文案待审** | README、CHANGELOG 与 npm 文案分清候选/正式版 |
| D-06 版本/发布 | **尚未授权** | 先独立授权候选开发，再独立授权 npm、Tag 和 Release |
| D-07 无 CI | **持续约束** | 无 CI、无运行时 JS、无无关改动 |

### 拟申请的第一个独立决定

**是否授权在下一条独立 PR 中仅完成 `0.1.0` 候选元数据、两项版本断言与必要文档迁移，而不修改产品 CSS？**

- **批准候选准备**：允许创建独立开发分支并修改上表范围，仍**不允许**合并候选、更不允许发布。
- **暂缓**：继续使用正式版 `0.0.3`，按 Issue #18 补充真实浏览器/生态证据；不自动扩大默认 CSS。
- **要求新增行为或最低版本承诺**：先重新评审具体规则/浏览器目标，未获新证据不直接实施。

最终 npm 发布前还需要单独验证 Registry 版本占用、发布身份/权限及候选准确 SHA 与 tarball 的一致性，维护者再独立批准并人工执行。禁止在开发候选阶段运行 `release:publish`、创建/移动 Tag 或 Release。
