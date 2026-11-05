# RELEASING — 版本策略与人工发行清单

**生效日期**：2026-11-05  
**仓库**：[adui-studio/normalize.css](https://github.com/adui-studio/normalize.css)  
**性质**：维护者批准的**人工版本管理和发行流程**；不使用 CI、GitHub Actions、自动发布服务或运行时 JavaScript。

**最新版本事实（2026-11-05）**：`package.json` 为未发布的 `0.0.3/private:false`；[PR #25](https://github.com/adui-studio/normalize.css/pull/25) 已获维护者批准并合并 `main@5e299a65e5a091d17ff6d329cadb166613bec332`。新增 Reset、Forms、A11y、all.css 子路径，默认 Normalize 行为不变。维护者提供合并前实际 Windows `verify:mvp` **61/61 PASS**、8 Fixture 构建和 10 文件 npm dry-run；日志未提供精确 HEAD，也不证明全部浏览器/组件库行为。最新 GitHub 正式 Release 仍为 `v0.0.2`，`v0.0.3` Tag 未创建；当前助手运行环境无法访问 npm Registry，因此 **`0.0.3` Registry 版本占用尚须维护者本机核实**。此次通过的是 PR 合并审批，**不是 npm publish、Git Tag 或 GitHub Release 授权**；禁止新增 CI。下文 `0.0.2` 发布命令为已执行的历史示例，严禁照抄重发。

## 版本策略

| 版本    | 定位                                                        | 状态                                                                                                   |
| ------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `0.0.1` | 首次 MVP：默认 R-003                                        | **npm 已发布**（维护者实际 `npm view` 及截图确认）；首次发布时未创建 Git Tag/Release                   |
| `0.0.2` | R-003、R-007、R-008 与 npm Keywords                         | **已发行**：npm 版本可查；`v0.0.2` Tag 已核验，GitHub Release 已发布（2026-11-05）                     |
| `0.0.3` | 默认 Normalize + 可选 Reset/Forms/A11y + `all.css` 整套候选 | **源码已合并**：工程测试 61/61 PASS；发行前 SHA/Registry/兼容风险核查及 npm/Tag/Release 单独授权待完成 |
| `0.1.0` | 默认 `normalize.css` 规则范围完成、评审与必要验证后的里程碑 | **未来规划**；不因为增加一两条规则或发出 `0.0.2` 而提前升级                                            |

**当前版本决议（2026-11-05）**：正式发行至 `0.0.2`；仓库已合并 `0.0.3` 套件源码，但尚未向 npm 或 GitHub 发布。可选模块已作为显式子路径实现，默认 CSS 不变。`0.1.0` 仍属于未来完整性里程碑，不能提前升级或发布。

已经公开到 npm 的版本不可原地替换。若 `0.0.2` 发布后还需提前发行其他改进，**必须重新评审未被使用的版本号**，不能重发同版本，也不能为了方便提前占用 `0.1.0`。

## 0.0.3 开发迭代（2026-11-05 开始）

- 上一正式版本为 `0.0.2`，其 npm、Tag、GitHub Release 已归档；不要重复发布或移动历史 Tag。
- 维护者明确要求开始 `0.0.3`：在独立开发分支中调整 `package.json#version`，同步 `tests/package.node.test.mjs`、`tests/package-real.node.test.mjs` 的固定版本断言；**创建候选不代表已经发布**。
- 范围已按维护者最新指令一次完成并经 PR #25 正式合并：默认仍为三条已发行规则，Reset、Forms、A11y 与组合入口作为**显式可选模块**已实装；没有运行时依赖或 CI。其余研究候选不自动进入默认模块。
- `pnpm-lock.yaml` 的当前根 importer 不含包版本字段，不因改版本手工修改；候选合并前执行 `pnpm install --frozen-lockfile`，如出现真实锁文件差异再由包管理工具处理。
- 维护者已经提供合并前 `pnpm run verify:mvp` 61/61 PASS 与 `pnpm exec vp build` 八页成功的原始日志，但缺少这组日志的独立 Git SHA 输出；最终发行前须在准确发行提交上再核对/执行并记录仍缺的浏览器证据。正式 npm、Tag、Release 需要再次单独授权，**禁止提前执行 `pnpm run release:publish` 或创建 `v0.0.3` Tag**。
- `0.1.0` 仍是 Normalize 完整性里程碑，不因 `0.0.3` 立项而改变验收门槛。

## 0.0.3 合并后的集中发行前置核查（尚未授权发布）

以下是本次版本的**单次整体 Gate**，统一检查包契约与兼容性风险，不重新按 R-010/R-015/R-018 逐条要求维护者批准。2026-11-05 的 GitHub 远端回读确认 `main@5e299a65e5a091d17ff6d329cadb166613bec332`、PR #25 已合并，`v0.0.3` Tag 不存在，最新正式 Release 为 `v0.0.2`。**npm 远端版本占用尚未直接核实**。

1. **源码与版本**：`package.json` 为 `0.0.3/private:false`，`exports` 的根和五个子路径均指向纯 CSS；根 CSS 保持 R-003/R-007/R-008，Reset/Forms/A11y 只有使用者显式导入才生效。无 `.github/workflows`/CI、运行时 JS、外部依赖变更。
2. **工程证据**：维护者合并前实际日志为格式 86/86、Lint 21 无错误、Vitest 7/7、离线 Node 52/52、真实 tarball 1/1、Vite+ `all.css` 消费 1/1（总计 61/61 PASS），以及 `vp build` 八个 Fixture 页面成功；本地 npm dry-run 十文件、9,223 B，SHA-1 `8f79c0bfd72db0a62e41facdcf788fdf0fbe6293`。这些是**已取得的工程证据**，不是所有浏览器的 PASS。
3. **最终发行提交绑定**：在维护者的 Windows PowerShell 中执行以下命令，确认 `git rev-parse HEAD` 是**之后获准用于发行的真实提交**，`git status --short` 干净；若发布文档发生变更，必须以新的准确 HEAD 为准，不能沿用合并前测试哈希：

   ```powershell
   git switch main
   git pull --ff-only origin main
   git rev-parse HEAD
   git status --short

   pnpm install --frozen-lockfile
   pnpm run verify:mvp
   pnpm exec vp build
   git diff --check
   git status --short
   ```

4. **Registry 及账号预检**：请维护者本机执行 `npm view @adui/normalize.css@0.0.3 version --registry=https://registry.npmjs.org/` 和 `npm whoami --registry=https://registry.npmjs.org/`。若 `0.0.3` 已存在则停止重复发布；若查询网络错误、权限问题或 2FA 问题，先诊断，不能根据失败直接宣布版本空闲。用户名、令牌或 2FA 验证码不回传聊天或提交仓库。
5. **集中兼容风险评估**：历史 Safari/WebKit 的 R-007 无前缀装饰、早期 Blink 的 R-008 行为以及可选 Reset/Forms/A11y 对真实 Chrome/Firefox/Safari、Vue/React/Element Plus/Ant Design/TDesign 的影响仍缺完整可审计矩阵。对外不要声明未经验证的最低版本；接受风险前，应记录哪些环境实际测过、哪些没有。特别注意 `all.css` 与 Tailwind Preflight/UnoCSS Reset 的重复 Reset 风险，以及键盘焦点、强制颜色、系统减少动态偏好。
6. **独立发行授权**：只在维护者明确批准**此 `0.0.3` 的 npm 发布**后，才按下方既有人工流程执行发布；再以准确**已发布源码 SHA** 创建 `v0.0.3` Tag / Release（需对应单独授权），核验 Registry、Git Tag 和 Release 三者一致。不添加 CI，不提前升级 `0.1.0`。

**当前状态**：完整 CSS 套件已合并、工程验收已有实际通过记录；**正式发布没有发生**，仍存在 Registry 未核验与兼容性证据缺口。这不影响已验证的工程结论，也不能把项目判成“全面浏览器测试通过”。

## 0.1.0 版本准备专项审核（尚未授权升级）

**最新事实**：`0.0.2` 已发行，默认 Normalize 当前的 R-003/R-007/R-008 规则集合及 Windows 工程验证 60/60、8 张 Fixture 构建有可追溯记录；`0.1.0` 尚未完成内容及浏览器证据验收，也未取得升级或发行授权。后续表格为**发行前路线评审的历史说明**，实际已选择并完成路径 A。

### 先解决 0.0.2 与 0.1.0 的版本路径

| 路径                         | 必须先确认的决定                                            | 后续处理                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| A：先发布 0.0.2              | 维护者另行批准 `0.0.2` 发行，满足本文件完整发行门槛         | 按 [Issue #20](https://github.com/adui-studio/normalize.css/issues/20) 完成 npm、`v0.0.2` Tag、Release；然后再评审 `0.1.0` |
| B：跳过 0.0.2 直接准备 0.1.0 | 维护者明确批准不再发行 `0.0.2`，并单独批准 `0.1.0` 版本配置 | 先更新/重新定向 Issue #20，避免留下错误的 `v0.0.2` 发行承诺；之后才执行下列版本迁移和重新验收                              |

**路线裁定**：路径 A（先发行 `0.0.2`）已执行；路径 B（跳过 `0.0.2`）未采用。`0.1.0` 继续作为未来里程碑，不提前发布。

### 将来获准升级时的最小同步清单

1. **唯一发布版本**：`package.json#version` 从当时实际候选版本调整至获准的新版本；`name`、`private`、`exports`、`files`、`sideEffects`、`vite-plus`、`packageManager` 与手动发布脚本保持现行契约，除非另有独立决策。
2. **测试中的版本强绑定**：`tests/package.node.test.mjs`、`tests/package-real.node.test.mjs` 均以字面量 `0.0.2` 断言根包版本，必须与正式版本同步。真实 tarball 的 `id/name/version` 一致性断言不能放宽；合成包自有的 `0.0.0-smoke.0` 和隔离消费者的 `private:true` 不应误改。
3. **锁文件与包管理**：当前 `pnpm-lock.yaml` 采用 pnpm 12 的锁文件格式，静态回读未见根包 `0.0.2` 版本条目；版本变更后仍须运行 `pnpm install --frozen-lockfile` 以验证供应链策略和锁文件一致性。如果实际检测到需要更新，按当前 pnpm 工具规范生成真实锁文件，不手工伪造或无故升级依赖。
4. **用户可见资料**：同步中英文 README 的“已发布版本 / 仓库候选 / 对外支持边界”，以及 CHANGELOG 的 Unreleased 与正式版本分栏；不提前把未发布功能描述为 npm 已上线。`docs/PROJECT_CONTEXT.md` 和关联需求、架构、代码地图仅按受影响内容更新。
5. **重新验收准确提交**：版本号、包内 README 或 CHANGELOG 的变更可能改变 tarball 内容或元数据；新 HEAD 上必须重跑 `pnpm install --frozen-lockfile`、`pnpm run verify:mvp`、`pnpm exec vp build`、`git diff --check`、`git status --short`，记录 Git SHA、退出码和五文件清单。原 `0.0.2` 的 60/60 PASS 不能自动替代新版本验收。
6. **发布独立授权**：即便版本配置与工程验收通过，公开 npm、Git Tag、GitHub Release 仍须单独确认；若对外承诺具体最低浏览器版本，还须有该环境的真实 T0/T2 证据。

**本节只是版本准备审计，未修改产品 CSS、包版本、测试断言、锁文件或发布操作，不引入 CI。**

---

## 每次正式发行的操作门槛

以下命令保留 `0.0.2` 的**历史发行示例**。该版本已发布，**严禁重复运行 `npm publish`、重复创建或移动 `v0.0.2` Tag**；后续发行必须先独立批准新版本并替换所有示例中的版本号与准确源码提交。

1. **核对发行范围与提交**。读取最新 `AGENTS.md`、`package.json`、`CHANGELOG.md`、相关 CSS 规则依据；确保公开说明仅陈述已实现功能，并将发行说明、必要文档修改提交到 `main`。确认维护者批准**本次具体版本的发布**。
2. **在维护者 Windows PowerShell 上运行本地验收**，记录执行提交、成功/失败结果和仍缺失的浏览器、UI 组件证据；不得将旧提交结果冒充新结果：

   ```powershell
   git switch main
   git pull --ff-only origin main
   git status --short
   git rev-parse HEAD

   pnpm install --frozen-lockfile
   pnpm run verify:mvp
   pnpm exec vp build
   git diff --check
   ```

   `verify:mvp` 已包含本地 CSS 打包、真实 tarball 消费与 `npm pack --dry-run`；必要时再执行与本次 CSS 变更相关的浏览器、Vue/React、Element Plus、Ant Design、TDesign、UnoCSS/Tailwind 对照。**并非所有历史环境均已有可审计 PASS**，不能扩大对外兼容承诺。工作区应干净；**记录准确的发行源码 Git SHA**。

3. **检查 npm 账号与版本占用**。维护者在本机确认 `npm whoami --registry=https://registry.npmjs.org/` 及发行权限；通过 `npm view @adui/normalize.css@0.0.2 version --registry=https://registry.npmjs.org/` 查看该版本是否已存在。若已存在，停止重复发布并核对实际状态。未发布时按下步操作，**2FA 验证码/Token 仅在本机处理，不写入仓库、Issue 或聊天**。
4. **执行已单独授权的 npm 公开发行**：现有脚本为 `vp pack && npm publish --access public --registry=https://registry.npmjs.org/`，不得增加 CI。维护者交互式执行 `pnpm run release:publish`，随后再次使用 `npm view @adui/normalize.css@0.0.2 version --registry=https://registry.npmjs.org/` 确认公开 Registry 返回 `0.0.2`；未确认前不能称发行成功。
5. **核准发布提交并补齐 Git Tag**。确保 Tag **指向第 2 步经过验收且实际发布的准确 Git SHA**，不能随意指向发布后已前进的 `main`。以 `v0.0.2` 为命名约定，在本地执行以下人工操作（需有 GitHub 仓库写权限）：

   ```powershell
   git tag -a v0.0.2 <RELEASE_COMMIT_SHA> -m "发布 @adui/normalize.css v0.0.2"
   git push origin v0.0.2
   git ls-remote --tags origin "refs/tags/v0.0.2"
   ```

   上面的 `<RELEASE_COMMIT_SHA>` 是**待替换的实际 SHA**，不是字面命令；不可在未发布或未确认提交时提前执行。

6. **创建同版本 GitHub Release**。在 [GitHub Releases](https://github.com/adui-studio/normalize.css/releases) 使用现有 `v0.0.2` Tag，标题建议 `v0.0.2`；使用**中文为主、英文辅助**的正式发行说明（版本、R-007/R-008、Keywords、兼容边界和迁移风险、测试证据）。也可在已登录 GitHub CLI 的维护者终端执行：

   ```powershell
   gh release create v0.0.2 --repo adui-studio/normalize.css --verify-tag --title "v0.0.2" --notes "本次版本包含 R-007/R-008 Normalize 规则及 npm Keywords。详见 CHANGELOG.md。"
   gh release view v0.0.2 --repo adui-studio/normalize.css
   ```

   这是**正式发布后的人工命令**，执行前应根据当次完整变更调整发行说明。`--verify-tag` 确保 GitHub Release 不会在找不到已有 Tag 时临时从错误的 HEAD 自动创建 Tag。

7. **最终一致性核验**：npm Registry 版本存在，Git Tag 解析到同一次发行提交，GitHub Release 的 Tag、标题和说明正确；在 `CHANGELOG.md`、`PROJECT_CONTEXT.md` 与发行 Issue 中记录**实际**版本、发布时间、提交 SHA、结果与证据，再关闭对应发行任务。若任一操作失败，保留明确的 PARTIAL 状态，禁止宣称三者全部完成。

## v0.0.2 实际发行记录（2026-11-05）

- **npm**：维护者 Windows `npm view @adui/normalize.css@0.0.2 version --registry=https://registry.npmjs.org/` 返回 `0.0.2`，确认版本已公开存在；npm tarball SHA-1 与本地打包 SHA-1 是否一致**尚未独立核验**。
- **Git Tag**：`refs/tags/v0.0.2` 是附注标签，对象 SHA `4e2e90b2cc02144c731f6c82a09f167d7cda7f65`，其目标 commit 为 `4d66e6b590c09b7de6e98332524684237dddf212`，与维护者本机工程验收的发行源码提交一致。
- **GitHub Release**：[v0.0.2](https://github.com/adui-studio/normalize.css/releases/tag/v0.0.2) 已于 2026-11-05 正式发布，非草稿/预发布；发行说明注明同一源码 SHA。
- **工程验收**：上述源码提交的维护者 Windows `verify:mvp` 60/60、独立 Fixture 构建 8 个 HTML、npm dry-run 五文件通过；**这不是全部目标浏览器 T0/T2 的实际 PASS 证明**。
- **归档约束**：GitHub `main` 后续文档修订不改变历史发行 Tag 所指向的源码，也无法修改 npm 已发布 tarball 中的 README；新文档会以 `main` 的后续提交为准。

## 边界和历史情况

- `0.0.1` 已公开发行，但本次核对 GitHub 时没有 Release，亦未定位到对应 Tag；**不据此推断其最初 npm 发布的精确 Git SHA，也不自动补建旧 Tag/Release**。若日后补建，先核实该精确提交。
- 此规范**不改变** `package.json`、npm 脚本、依赖、CSS 源码、包导出、浏览器最低支持承诺或 CI 配置。
- Git Tag、GitHub Release 与 npm 发行是不同外部操作；**必须以实际工具返回/远端状态确认是否成功**，不能把“已规划”记录为“已完成”。
