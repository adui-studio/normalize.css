# W-07 · MVP 发布前质量审核记录

- **首次审查日期**：2026-11-04
- **分支**：`feat/viteplus-local-harness`
- **工作项**：[W-07 / Issue #8](https://github.com/adui-studio/normalize.css/issues/8)
- **审查形式**：读取 GitHub 开发分支当前文件、遍历仓库提交树、比对已有人工/终端证据；**不是在维护者 Windows 环境重新运行 Vite+ / npm 命令**。
- **审核判断**：**部分通过，发布准备尚未就绪；Issue #8 保持 Open**。
- **红线**：不修改产品 CSS 或既定包根入口；不新增依赖/CI、GitHub Actions、自动发布；不执行 npm publish、GitHub Release、`main` 合并。

## 2026-11-04 · P-01 锁文件提交与静态核对（最新）

维护者确认已提交锁文件。**本次直接读取 GitHub 开发分支后确认**：

- `pnpm-lock.yaml` 已存在于 `feat/viteplus-local-harness`，blob SHA：`b2a572124b5434bc10fdf91c4f2c4aefcf426520`；GitHub 根目录**只有这一份依赖锁文件**。
- `package.json#packageManager` 是 `pnpm@12.15.0`；锁文件的**环境文档**包含 `packageManagerDependencies.pnpm` 的 `specifier/version:12.15.0`，一致。
- 锁文件的**项目文档**含 `importers["."].devDependencies["vite-plus"]`，`specifier:1.4.0`，对应 `vite-plus@1.4.0` 的 `packages` 解析项和 `sha512` 完整性元数据；与 `package.json#devDependencies` 一致。
- 该锁文件包含两份以 `---` 分隔的 YAML 文档，**是 pnpm 12 已文档化的环境锁定 + 项目依赖锁定格式**，并非同一依赖图重复生成（参考 [pnpm 官方锁文件说明](https://github.com/pnpm/pnpm/blob/main/pnpm/docs/lockfile.md)）。任何自制或第三方静态解析工具应读取**所有文档**，不要只解析第一段而误报项目没有 `vite-plus`。
- 提交树未发现额外 npm/yarn/bun 根锁文件或 CI 工作流。本轮**没有从维护者收到** `pnpm install --frozen-lockfile`、`pnpm exec vp check`、`pnpm exec vp test`、`pnpm run test:offline`、真实包/消费验证的最新命令输出，因此**只能记为「锁文件已提交，静态结构 PASS」，不能声称冻结安装 PASS**。

**下一步是验证，而不是重复生成锁文件。** 在使用 pnpm 12.15.0、符合 `engines.node` 的 Windows 开发环境中执行：

```powershell
git status --short
pnpm --version
node --version
pnpm install --frozen-lockfile
pnpm exec vp check
pnpm exec vp test
pnpm run test:offline
pnpm exec vp pack
pnpm run test:package
pnpm run test:consumer
npm pack --dry-run --json --ignore-scripts
```

本轮 GitHub 文档更新不改变正式 CSS、依赖、包版本、导出或发布开关；W-07 Issue #8 仍 Open。

## 2026-11-04 · P-01 包管理器决策（历史阶段：提交锁文件前）

维护者确认采用 **pnpm 作为唯一根项目包管理器**。参考维护者此前 Windows PowerShell 中有实测的 pnpm `12.15.0`，在开发分支 `package.json` 最小新增 `"packageManager": "pnpm@12.15.0"`；不改变 `vite-plus@1.4.0`、Node engines、单一 CSS 根导出、根脚本、`private:true` 或版本 `0.0.0`。

**实际执行边界**：此轮执行环境 `pnpm` 未安装，且访问 `registry.npmjs.org` 返回 DNS `EAI_AGAIN`；**没有**实际运行 pnpm 12.15.0、依赖解析、生成 lockfile、冻结安装或测试。不得手工臆造锁文件、声明 P-01 已完全通过。由于当前构建机 Node 为 `22.16.0`，亦低于本项目 `engines.node` 所需 `^22.18.0 || ^24.11.0 || >=26.0.0`，不能将其当作目标环境上的工具兼容性验证。

维护者在 Windows PowerShell 从开发分支最新代码执行：

```powershell
git pull --ff-only origin feat/viteplus-local-harness
node --version
pnpm --version                # 预期 12.15.0；版本不符则先调整本机
pnpm install --lockfile-only  # 生成真实 pnpm-lock.yaml，不手工编辑
pnpm install --frozen-lockfile
git status --short
git add pnpm-lock.yaml
git commit -m "🔒 chore(w07): 提交 pnpm 锁文件"
git push origin feat/viteplus-local-harness
```

成功的证据是 `pnpm --version` 与 `packageManager` 一致、根目录只存在 `pnpm-lock.yaml`、冻结安装返回零退出码、提交 SHA 可追溯。此后才可继续执行其他本地质量门槛。`npm pack` 与相关 Node 脚本内部调用的 npm CLI 是**测试 tarball 格式的工具**，不改变本项目只用 pnpm 管理根依赖的决定。

## 1. 包契约与产物

| 核对项              | 当前仓库事实                                                                                                                                    | 审核判定                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 包名与入口          | `package.json`：`@adui/normalize.css`；`exports["."] = "./dist/normalize.css"`，无公开子路径                                                    | **静态核对 PASS**                                 |
| 源码                | `src/normalize.css` 只有 R-003：`b,strong { font-weight:bolder }`；36 条规则的首版去留已由 W-05 评审                                            | **静态核对 PASS**                                 |
| CSS-only 构建       | `vite.config.ts` 由 `vp pack` 输出 `dist/normalize.css`；`vp build` 负责本地 HTML Fixtures                                                      | **配置核对 PASS**，本轮未重新构建                 |
| 包白名单            | `files: ["dist"]`、`sideEffects: ["**/*.css"]`；没有 `dependencies` 字段                                                                        | **静态核对 PASS**                                 |
| 包内文件            | `tests/package-real.node.test.mjs` 实际断言必含 `LICENSE`、`README.md`、`dist/normalize.css`、`package.json`，可选 `README.en.md`，禁止其它文件 | **历史真实 tarball 测试 PASS（1/1）**，本轮未重跑 |
| 生产消费            | `tests/package-vite-consumer.node.test.mjs` 安装真实 tarball，验证 Vite+ 消费结果包含 R-003 CSS                                                 | **历史测试 PASS（1/1）**，本轮未重跑              |
| 第三方 Reset 与生态 | [W-06 管理验收索引](W06_ACCEPTANCE_INDEX.md) 记录 9/9 Reset 构建、Chrome 156 静态对照及维护者回归确认                                           | **已归档**，不要扩大为未附证据平台的逐版本 PASS   |
| Git 忽略边界        | `.gitignore` 忽略 `dist/`、`dist-fixtures/`、`node_modules/`、`*.tgz` 等；`dist/normalize.css` 在 Git 中不跟踪                                  | **静态核对 PASS**；正式包生成须先 `vp pack`       |
| 开发工具链          | `vite-plus: "1.4.0"`（devDependency），Node `^22.18.0                                                                                           |                                                   | ^24.11.0 |     | >=26.0.0` | **配置核对 PASS**；本轮未重新安装 |

**特别说明**：`npm pack` 会根据其文件收集规则包含部分标准根文件；目前是否包含正确内容有前序真实打包测试，但本轮增加 `CHANGELOG.md` 等文档后**没有重新执行 tarball 文件清单检查**。`CHANGELOG.md` 作为仓库记录不属于当前 `files: ["dist"]` 的公开包内容白名单；如未来希望发行包包含 Changelog，应单独调整准入策略与包契约测试，不能悄然扩大。

## 2. 文档与许可证

| 核对项        | 证据/发现                                                                                                                            | 状态                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| 中英文 README | 根目录 `README.md`、`README.en.md` 均存在，且互相链接                                                                                | PASS（结构）                                                                                   |
| 文档链路      | 基于开发分支 GitHub 提交树，对 11 份核心与规则/验收文档的 **252 个 Markdown 本地文件链接**进行路径存在性静态核对，**未发现失效目标** | **PASS（路径存在性）**；未检查外链、锚点或 GitHub UI                                           |
| 正式许可证    | `LICENSE` 是 MIT 文本，版权所有者 ADui Studio，2026                                                                                  | PASS（文件存在及文本检查）                                                                     |
| 第三方 Skills | `.agents/skills/UPSTREAM.md` 有上游固定 SHA、三项来源；`UPSTREAM_LICENSE.txt` 保留 GitHub, Inc. MIT 文本                             | PASS（归属记录）                                                                               |
| 规则来源      | W-05 仅 R-003 准入；证据卡和 W-06 验收索引可追溯                                                                                     | PASS（范围与链接）                                                                             |
| 变更记录      | 新建根目录 `CHANGELOG.md`，仅列「未发布」，没有编造发行版本或日期                                                                    | PASS（文档准备）                                                                               |
| 文档状态      | 历史段落中存在过时的“W-06 未开始/未验收”等阶段措辞；以文件顶部的**最新状态**与 W-05/W-06 正式索引优先                                | **已修正**：中英文 README 顶部的最新状态与 W-05/W-06 结项、W-07 审核一致；历史测试段落保留原貌 |

## 3. 发布前尚未完成的事项

| 编号 | 事项                     | 当前证据                                                                                                                                       | 风险/决定                                                                                                                                                       |
| ---- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P-01 | **锁文件与包管理器策略** | **pnpm 12.15.0 已固定；`pnpm-lock.yaml` 已真实提交**。GitHub 当前分支唯一根锁文件；含 pnpm 环境锁定与 `vite-plus@1.4.0` 项目依赖及完整性元数据 | **静态 PASS / 冻结安装待验**：版本与 importer 一致；本轮未获得 `pnpm install --frozen-lockfile` 实际退出码、`vp check` 与测试输出，不能等同可复现安装已运行通过 |
| P-02 | **版本和 npm 发布开关**  | `version:"0.0.0"`、`private:true`                                                                                                              | **预期发布阻断**：保持现状直到维护者正式指定首个语义化版本并授权公开发布；**不提前清除 `private`**                                                              |
| P-03 | **包元数据**             | 当前 `package.json` 没有 `license`、`description`、`repository`、`homepage`、`bugs` 等字段；仓库 `LICENSE` 文件真实存在                        | **待补充审核**：优先 `license: "MIT"` 与明确的仓库 URL；其它字段按必要性补齐；修改 manifest 需另行批准并复测包契约                                              |
| P-04 | **npm 组织/作用域权限**  | 无已验证的 `@adui` npm scope 发布授权、包名可用性或维护者身份资料                                                                              | **NOT_VERIFIED**：发布前由维护者自行核验；不读取令牌、不登录、不尝试发布                                                                                        |
| P-05 | **公开兼容性范围**       | [W-06](W06_ACCEPTANCE_INDEX.md) 已获维护者管理验收；缺少本次逐目标 UA/OS/设备原始附件                                                          | **文案门槛**：不得把目标最低版本清单直接写成已经可复核 PASS 的公开支持承诺                                                                                      |
| P-06 | **最终本机复核**         | 已存在旧阶段 `vp check` / `vp test` / `test:offline` / `test:package` / `test:consumer` PASS 记录                                              | **NOT_RUN（本次）**：最新文档/包设置定稿后按本地命令重跑；不得当作本轮已执行                                                                                    |
| P-07 | **最终发行准许**         | W-07 当前只获授权执行质量审核，**未授权发布、Release、合并或改生产配置**                                                                       | **BLOCKER**：发布需维护者新的明确指令                                                                                                                           |

**许可证细节**：`LICENSE` 文件已经存在并在历史 tarball 测试的允许清单中，但 `package.json` 尚未显式声明 `license:"MIT"`。这不是“缺少许可证文件”，而是 npm 元数据与仓库许可证描述尚未同步。

**GitHub Actions**：检查 `.github/` 目录，当前仅 `ISSUE_TEMPLATE/` 与 `pull_request_template.md`，**未发现 workflows**。本项目长期禁止增加任何 CI；W-07 不新增自动检查机制。

## 4. 下一次仅在维护者本机执行的只读或测试命令

**注意：以下命令为待运行验证步骤，本文未声称已执行。**

```powershell
# 在 feat/viteplus-local-harness 工作树根目录
git status --short
git ls-files "*lock*"

# 现有本地工具链及 Node 检查
node --version
npm --version
vp check
vp test
npm run test:offline

# 真实 CSS-only 包与消费验证，不会公开发布
vp pack
npm run test:package
npm run test:consumer

# 审查包内文件，不发布也不安装
npm pack --dry-run --json --ignore-scripts
```

**已确定仅采用 pnpm 12.15.0**，不使用 npm/yarn/bun 维护根依赖或生成额外锁文件。维护者现已提交真实 `pnpm-lock.yaml`，本轮 GitHub 静态核对的包管理器版本与 `vite-plus@1.4.0` importer 匹配；仍需保存 Windows `pnpm install --frozen-lockfile` 的真实运行结果。项目现有 `npm run ...` 脚本可由 `pnpm run ...` 执行；测试内部使用 npm CLI 校验 tarball，不代表根仓库还应维护 npm lockfile。

## 5. 本轮结论与后续决策

**当前判断：W-07 审核已启动，基础包契约/许可证/证据索引符合已有设计；发布前门槛未全部满足，Issue #8 继续 Open。**

优先级建议：**锁文件已提交且通过结构核对；下一步是冻结安装及本机测试复核（P-01/P-06），然后处理公开包元数据与正式版本审核（P-02/03），最后由维护者另行决定发布授权（P-07）**。

本轮已补建 `CHANGELOG.md`、更新中英文 README 的当前状态，并同步文档/Issue。未修订生产 CSS、未运行新的本地测试、未执行 CI、未变更包导出、未发布软件包、未创建 Release、未合并主分支。
