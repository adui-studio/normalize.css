# RELEASING — 版本策略与人工发行清单

**2026-11-07 · `v0.1.0` 正式发行归档（当前优先事实）**：npm `@adui/normalize.css@0.1.0` 已正式上架且 `latest=0.1.0`；Registry `dist.shasum=09ad11dc9c52538941fb8bdf5629f4841411dde3` 与最终打包预览一致（10 文件、9,240 B，SHA-512 integrity 亦一致）。GitHub 附注 Tag [`v0.1.0`](https://github.com/adui-studio/normalize.css/releases/tag/v0.1.0) 精确指向发行源码 `cd28baaa5bf0a2af995053a7a35147e7392265a4`，Release 已于 2026-11-06T10:07:24Z Published（非 Draft/Prerelease），且为 GitHub latest。维护者 Windows 发行候选执行 64/64 自动化测试、94 文件格式检查、22 文件 Lint 与 8 张 Fixture 构建 PASS；最终合并后的源码 SHA、干净工作区与包摘要也单独复核。默认 R-003/R-007/R-008 及显式可选 Reset/Forms/A11y/All 保持不变。Chromium 144/Linux Headless 的 21/21 有界行为检查采用内存 CSS 注入及模拟媒体偏好，不是实际 HTTP 导入或全平台 PASS；详见 [发行后兼容性矩阵](research/V010_POST_RELEASE_COMPATIBILITY.md)。下方有关 `0.1.0` “未批准/待发行”的内容是历史阶段记录，不得覆盖本段；禁止重复 npm publish、移动历史发行 Tag 或新增 CI。

**2026-11-06 · v0.1.0 合并后工程验收与发行准备（当前优先）**：维护者在 `main@02dec1c9c3801fdb580b3b5798d803d348a2a213` 完成 `pnpm run verify:mvp` **64/64 PASS**、8 张 Fixture `vp build` PASS、94 文件格式与 22 文件 Lint 通过、干净工作区，真实 npm tarball 安装和 Vite+ 消费成功。合并后的 `npm pack --dry-run` 预览为 `@adui/normalize.css@0.1.0`、10 文件、9,281 B、bundled 依赖为空。维护者本机 Registry 查询当前最新 `0.0.3`、`0.1.0` 返回 E404；再行发布前应核验。为避免随 tarball 发布的 README 保留“未验收”错误文案，本轮一次性同步双语 README、CHANGELOG 及本发行记录，**因此最终发布 SHA 与打包 SHA/大小须以这次变更合并后的真实产物为准，不能复用 9,281 B / 旧摘要当作发布结果**。默认 CSS 三规则和显式可选模块不变，不增加 CI；**npm、Git Tag、Release 均未授权或执行**。下面的早期“尚未启动/未执行”属于历史阶段快照，不覆盖此段。

**2026-11-06 · v0.1.0 开发候选已启动，未发布**：维护者已批准 [PR #33](https://github.com/adui-studio/normalize.css/pull/33) 合并并独立启动最小版本迁移。开发分支 `chore/prepare-v0.1.0-20261106` 仅准备 `package.json#version=0.1.0`、两处对应的真实包断言及必要文档，不修改产品 CSS、六个公开 CSS 子路径、依赖或 CI。**这仅是源码候选，不是已验收的发行版本；在准确候选 HEAD 全量验证并获得单独发布授权前，禁止 `npm publish`、创建/移动 `v0.1.0` Tag 或创建 Release**。当前 npm 正式版本仍为 `0.0.3`，历史 Tag/Release 保持不变。

**2026-11-06 · v0.1.0 候选启动评审（仅计划）**：新增[候选启动及版本迁移清单](plans/V010_CANDIDATE_START_REVIEW.md)，基于已批准 ADR-0006 方案 A，明确如未来取得单独授权，可保持默认三条 CSS 规则及 opt-in 公开接口不变，仅在独立开发 PR 修改 `package.json#version`、两处版本断言和确实受影响的中英文文档。此处尚未授权升级至 `0.1.0`、候选合并、npm publish、Tag/Release；未来候选须按准确 SHA 全量本机验收，现有 `0.0.3` 的正式发布记录不可覆盖，不新增 CI。

**2026-11-06 · v0.1.0 工程准入计划已建立，但尚未启动候选发布**：基于 ADR-0006 Accepted 的三条默认规则与限定旧浏览器风险策略，新增 [工程准入预检与 SHA 绑定清单](plans/V010_ENGINEERING_ADMISSION_PLAN.md)。它记录现有 `verify:mvp` 与 `vp build` / 生态 / Reset / 浏览器的覆盖差别，以及未来版本变更须同步 `package.json` 和两处测试中的 `0.0.3` 字面量；**本轮并未更改任何版本断言，也未运行针对 `0.1.0` 的完整本机验收**。当前正式发布仍为 `v0.0.3`。此项不是 npm 发布授权，不运行 `release:publish`、不创建 Tag/Release、不增加 CI。

**2026-11-06 · 下一里程碑已批准范围，不是发行授权**：维护者正式接受 [ADR-0006 方案 A](adr/0006-v01-default-scope-and-compatibility-risk.md)，默认 Normalize 继续仅 R-003/R-007/R-008，显式可选模块行为保持；旧 Safari/Blink 限定兼容风险已登记，不宣称未经逐版本验证的最低支持版本。**仅 D-01/D-02 范围及风险签收已完成，`0.1.0` 的新发布提交固定 SHA 工程验证、版本变更、npm 发布与 Git Tag/Release 尚未授权或执行**。现有正式 `v0.0.3` 不变，不增加 CI。

**生效日期**：2026-11-05  
**仓库**：[adui-studio/normalize.css](https://github.com/adui-studio/normalize.css)  
**性质**：维护者批准的**人工版本管理和发行流程**；不使用 CI、GitHub Actions、自动发布服务或运行时 JavaScript。

**最新版本事实（2026-11-06）**：正式版本已到 **`@adui/normalize.css@0.0.3`**。维护者在 Windows 成功运行 `pnpm run release:publish`，最终 npm CLI 输出 `+ @adui/normalize.css@0.0.3`，发布 tarball 为 10 文件、9,223 B、SHA-1 `8f79c0bfd72db0a62e41facdcf788fdf0fbe6293`；GitHub API 已独立确认附注 Tag [`v0.0.3`](https://github.com/adui-studio/normalize.css/releases/tag/v0.0.3) 的提交目标为 `f5c08642e1ab6eaa1cb3d84782485f0298ae77be`，正式 Release 已 Published（非 Draft/Prerelease）。该提交已由维护者本机 `verify:mvp` 61/61 PASS、8 张 Fixture 构建及干净工作区验证。**不得重复发布 0.0.3、移动现有 v0.0.3 Tag，或将后续文档提交冒充该发行源码**。本文下方 `0.0.2` 和 `0.0.3` 预检的命令与“尚未发行”说明均为历史记录；新版本发布仍须重新审批，禁止新增 CI、自动发布与运行时 JS 依赖。

## 版本策略

| 版本    | 定位                                               | 状态                                                                                  |
| ------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `0.0.1` | 首次 MVP：默认 R-003                               | **npm 已发布**（维护者实际 `npm view` 及截图确认）；首次发布时未创建 Git Tag/Release  |
| `0.0.2` | R-003、R-007、R-008 与 npm Keywords                | **已发行**：npm 版本可查；`v0.0.2` Tag 已核验，GitHub Release 已发布（2026-11-05）    |
| `0.0.3` | 默认 Normalize + 可选 Reset/Forms/A11y + `all.css` | **已发行**：npm、附注 Tag `v0.0.3`、GitHub Release 完成；最终 SHA 工程验收 61/61 PASS |
| `0.1.0` | 默认三规则与可选模块保持既有公开契约 | **已正式发行**：npm latest、附注 Tag / GitHub Release 均已核对一致 |

**当前版本决议（2026-11-07）**：npm `0.1.0` 已正式发行并成为 `latest`，附注 `v0.1.0` Git Tag / GitHub Release 精确固定到发行源码。保持 R-003/R-007/R-008 与所有可选模块既有契约；浏览器/生态后续验证见 [发行后兼容性矩阵](research/V010_POST_RELEASE_COMPATIBILITY.md)。

已经公开到 npm 的版本不可原地替换。`0.1.0` 已发布并占用，后续如需修改 CSS 或发行包，必须另行评审新的语义化版本，不能重发 `0.1.0` 或移动现有 Tag。

## 0.0.3 开发迭代记录（2026-11-05，历史过程）

- 上一正式版本为 `0.0.2`，其 npm、Tag、GitHub Release 已归档；不要重复发布或移动历史 Tag。
- 维护者明确要求开始 `0.0.3`：在独立开发分支中调整 `package.json#version`，同步 `tests/package.node.test.mjs`、`tests/package-real.node.test.mjs` 的固定版本断言；**创建候选不代表已经发布**。
- 范围已按维护者最新指令一次完成并经 PR #25 正式合并：默认仍为三条已发行规则，Reset、Forms、A11y 与组合入口作为**显式可选模块**已实装；没有运行时依赖或 CI。其余研究候选不自动进入默认模块。
- `pnpm-lock.yaml` 的当前根 importer 不含包版本字段，不因改版本手工修改；候选合并前执行 `pnpm install --frozen-lockfile`，如出现真实锁文件差异再由包管理工具处理。
- 维护者已经提供合并前 `pnpm run verify:mvp` 61/61 PASS 与 `pnpm exec vp build` 八页成功的原始日志，但缺少这组日志的独立 Git SHA 输出；最终发行前须在准确发行提交上再核对/执行并记录仍缺的浏览器证据。正式 npm、Tag、Release 需要再次单独授权，**禁止提前执行 `pnpm run release:publish` 或创建 `v0.0.3` Tag**。
- `0.1.0` 仍是 Normalize 完整性里程碑，不因 `0.0.3` 立项而改变验收门槛。

## 0.0.3 合并后的集中发行前置核查（历史记录，现已发行）

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

**当时的预检状态（已由 2026-11-06 正式发行取代）**：完整 CSS 套件已合并，工程验收已有实际通过记录；当时尚未执行正式发布。真实浏览器与组件库完整兼容证据至今仍有缺口，不能据此宣称全面通过。

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

## v0.0.3 实际发行记录（2026-11-06）

- **npm**：维护者 Windows `pnpm run release:publish` 输出 `+ @adui/normalize.css@0.0.3` 并再次确认已发布；npm CLI 日志内包大小 **9,223 B**、10 个文件、SHA-1 `8f79c0bfd72db0a62e41facdcf788fdf0fbe6293`，与发行源码的本机 dry-run SHA-1 完全一致。此处 **不冒充助手已经独立查询 Registry**；npm 发行成功证据来自维护者提供的日志与确认。
- **准确发行源码**：`f5c08642e1ab6eaa1cb3d84782485f0298ae77be`。维护者在该 HEAD 运行 `pnpm install --frozen-lockfile`、`vp check --fix`、`pnpm run verify:mvp`，共 **61/61 PASS**（Vitest 7、Node 离线 52、真实 tarball 安装 1、Vite+ `all.css` 消费 1），`vp build` 8 Fixture 页面成功，`git status --short` 干净。
- **Git Tag**：已验证附注 `refs/tags/v0.0.3`，Tag 对象 SHA 为 `05e8b76d3fcb6b97c7bd698aee73f0043080de98`，解引用目标为**上述发行源码 SHA**，并非后续文档提交。
- **GitHub Release**：[v0.0.3](https://github.com/adui-studio/normalize.css/releases/tag/v0.0.3) 的 `draft:false`、`prerelease:false`，发布于 `2026-11-05T23:41:24Z`（北京时间 2026-11-06 07:41），标题 `v0.0.3`，已附兼容性边界说明。
- **项目管理**：[Issue #22](https://github.com/adui-studio/normalize.css/issues/22) 已按 Completed 关闭。该版本发布后才进行的 README / CHANGELOG / 工程文档修订只影响后续仓库状态，**不会改变既有 npm tarball / Tag / Release 归属**。
- **保留事项**：Chrome/Firefox/Safari/移动端与组件库的全矩阵视觉、焦点与交互测试尚未完成，不对未验证的最低浏览器版本作出公开支持承诺。后续进展见 [Issue #18](https://github.com/adui-studio/normalize.css/issues/18)；`0.1.0` 尚未批准。

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
