# RELEASING — 版本策略与人工发行清单

**生效日期**：2026-11-05  
**仓库**：[adui-studio/normalize.css](https://github.com/adui-studio/normalize.css)  
**性质**：维护者批准的**人工版本管理和发行流程**；不使用 CI、GitHub Actions、自动发布服务或运行时 JavaScript。

## 版本策略

| 版本 | 定位 | 状态 |
| --- | --- | --- |
| `0.0.1` | 首次 MVP：默认 R-003 | **npm 已发布**（维护者实际 `npm view` 及截图确认）；首次发布时未创建 Git Tag/Release |
| `0.0.2` | 当前开发及下次发行候选：R-003、R-007、R-008 和 npm Keywords | **仓库现行版本，尚未确认 npm 发布**；等待与最终发行提交一致的验证、发行授权 |
| `0.1.0` | 默认 `normalize.css` 规则范围完成、评审与必要验证后的里程碑 | **未来规划**；不因为增加一两条规则或发出 `0.0.2` 而提前升级 |

**明确决议**：维护者已要求 **`package.json` 目前保持 `0.0.2`，只在默认 Normalize 完成时才调整为 `0.1.0`**。首次 `0.0.2` 发行既包括 npm 搜索元数据，也包括新增 CSS 行为；不能再称为“纯 Keywords 补丁”。可选 Reset、Forms、A11y 模块各自独立审议，默认不把其未实现作为 `0.0.2` 的已完成声明。

已经公开到 npm 的版本不可原地替换。若 `0.0.2` 发布后还需提前发行其他改进，**必须重新评审未被使用的版本号**，不能重发同版本，也不能为了方便提前占用 `0.1.0`。

## 每次正式发行的操作门槛

以下命令以 `0.0.2` 为示例，未来根据当次批准的实际版本替换。**记录发行流程不授权立即执行 `npm publish`、创建 Git Tag 或 GitHub Release。**

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

## 边界和历史情况

- `0.0.1` 已公开发行，但本次核对 GitHub 时没有 Release，亦未定位到对应 Tag；**不据此推断其最初 npm 发布的精确 Git SHA，也不自动补建旧 Tag/Release**。若日后补建，先核实该精确提交。
- 此规范**不改变** `package.json`、npm 脚本、依赖、CSS 源码、包导出、浏览器最低支持承诺或 CI 配置。
- Git Tag、GitHub Release 与 npm 发行是不同外部操作；**必须以实际工具返回/远端状态确认是否成功**，不能把“已规划”记录为“已完成”。
