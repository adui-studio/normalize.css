# W-07 · MVP 发布前质量审核记录

- **首次审查日期**：2026-11-04
- **分支**：`feat/viteplus-local-harness`
- **工作项**：[W-07 / Issue #8](https://github.com/adui-studio/normalize.css/issues/8)
- **审查形式**：读取 GitHub 开发分支当前文件及提交树，并核对维护者提供的 Windows PowerShell 原始命令输出；**本助手没有直接在维护者 Windows 环境运行命令**。
- **审核判断**：**部分通过，发布准备尚未就绪；Issue #8 保持 Open**。
- **红线**：不修改产品 CSS 或既定包根入口；不新增依赖/CI、GitHub Actions、自动发布；不执行 npm publish、GitHub Release、`main` 合并。

## 2026-11-05 · P-03 npm 公开元数据已获批准并实施（最新）

维护者明确批准最小修改，已向 `feat/viteplus-local-harness` 的 `package.json` 提交 [元数据变更](https://github.com/adui-studio/normalize.css/commit/cdace17a290afb6a752537f29fbefaa37132617f)（commit `cdace17a290afb6a752537f29fbefaa37132617f`）。

**唯一新增字段**：英文 `description`、`license:"MIT"`、`repository:{type:"git",url:"git+https://github.com/adui-studio/normalize.css.git"}`、`homepage:"https://github.com/adui-studio/normalize.css#readme"`、`bugs:{url:"https://github.com/adui-studio/normalize.css/issues"}`。许可与仓库根 `LICENSE` 的 MIT 文本一致。GitHub 实时回读 `package.json` JSON 可解析，全部新字段存在且 URL 指向唯一正式仓库。当前 `pnpm-lock.yaml` blob SHA 仍为 `b2a572124b5434bc10fdf91c4f2c4aefcf426520`。

**已静态确认没有变化**：`name`、`private:true`、`version:"0.0.0"`、`packageManager:"pnpm@12.15.0"`、`devDependencies.vite-plus:"1.4.0"`、单一 CSS 根 `exports`、`files`、`sideEffects`、`scripts`、Node engines、产品 CSS、许可证文件、CI。没有调用 npm 发布、GitHub Release 或 main 合并。维护者上轮新提供的 `git status --short` **无输出**，确认**修改元数据之前**工作区干净；最新提交后用户本地需要更新分支才能检查新版本。

**P-03 阶段判定：元数据配置已实施且 GitHub 静态 PASS；针对新 manifest 的本机质量复验尚未执行（NOT_RUN）**。以前 P-01/P-06 的真实 PASS 结果是旧元数据文件的测试基线，不能冒充已经验证本次修改。维护者更新代码后建议执行：

```powershell
git pull --ff-only origin feat/viteplus-local-harness
pnpm install --frozen-lockfile
vp check
pnpm run test:offline
vp pack
pnpm run test:package
pnpm run test:consumer
npm pack --dry-run --json --ignore-scripts
git status --short
```

验收重点：`npm pack --dry-run` 仍只有 LICENSE、两个 README、`dist/normalize.css`、`package.json` 五文件；版本仍 0.0.0，大小与 SHA 预计因 metadata 变动而不同，**不可用此前 13562 字节作为新包的相等断言**。

## 2026-11-05 · P-01 / P-06 补充验收完成（最新）

维护者提供新一批 Windows PowerShell **实际命令输出**，完成上一批质量回归剩余四项：

| 检查项目 | 维护者提供的实际结果 | 当前判定 |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | `Lockfile passes supply-chain policies (verified 13h ago)`；`Lockfile is up to date, resolution step is skipped`；`Done in 83ms using pnpm v12.15.0` | **PASS：冻结安装成功，版本匹配锁文件**；供应链策略的时效以 pnpm 输出为准 |
| `git status --short` | 仅显示 `?? .idea/` | **已跟踪文件无待提交修改**；IDE 本地目录未跟踪，应忽略，不将其误写为“Git 工作区完全干净” |
| `git diff --check` | 命令无任何输出 | **PASS：当前已跟踪工作树差异未报告空白错误**；不检查未跟踪文件 |
| `npm pack --dry-run --json --ignore-scripts` | 返回有效 JSON；`@adui/normalize.css@0.0.0`；`entryCount:5`；`bundled:[]`；`size:13562` bytes；`unpackedSize:32922` bytes | **PASS：正式包文件白名单匹配，未执行 npm publish** |

**npm 预打包五文件清单（从用户实际输出逐项核对）**：`LICENSE`（1089 B）、`README.en.md`（9595 B）、`README.md`（21096 B）、`dist/normalize.css`（200 B）、`package.json`（942 B）。没有 `src`、`tests`、`fixtures`、`.agents`、`.idea` 或开发依赖；`CHANGELOG.md` 未在当前包白名单中，符合前述文件契约。整个预打包体积约 **13.56 kB**（并非 CSS 文件大小）。`npm pack --dry-run` 是文件清单/打包模拟，不等于真实发布，也不是新一次 tarball 离线安装；真实 tarball 测试已在上一批日志中 **1/1 PASS**。

**本轮仓库最小修正**：为避免 JetBrains 用户的本地配置误提交，已在 `.gitignore` 仅新增 `.idea/`。不会删除本地目录，不改代码风格或编辑器共享配置；这是本次仅有的非文档文件更改。该远端忽略规则需维护者下一次 `git pull --ff-only` 后生效；用户这次 `git status` 截图是在新增忽略规则**之前**获得的，因此不得声称已验证其生效。

**阶段结论**：W-07 **P-01 依赖锁定/冻结安装 PASS**；**P-06 当前本地质量回归 PASS**（此前 `vp check --fix`、Vitest 7/7、Node 离线 33/33、`vp pack` 0.20 kB、真实包 1/1、消费构建 1/1，以及本次 Git/预打包检查均有维护者实际输出）。当前审核仍保留 **P-02 首版正式版本及 private 发布开关、P-03 npm 包公开元数据、P-04 npm scope 授权、P-05 公开最低浏览器版本支持声明、P-07 单独发布授权**。这些不随 P-01/P-06 自动完成；Issue #8 保持 Open。

## 2026-11-05 · P-06 本地质量回归（已通过；详见上方最新补验）

维护者提供 Windows PowerShell 真实终端输出，项目目录 `D:\Workspace\adui-studio\normalize.css`。本条证据来自**用户实际运行的日志**，本助手未远程执行命令，也没有独立获取终端状态或 `git diff`。

| 执行命令 | 维护者提供的可核实结果 | 本次判定 |
| --- | --- | --- |
| `vp check --fix` | Formatting completed（7.8 秒）；19 个文件无 Lint warnings/errors（2.0 秒，16 threads） | **PASS**，但 `--fix` 可能写入本地文件，需查看工作区 diff |
| `vp test` | Vitest 5.0.5：1 个测试文件通过，**7/7** tests，历时约 54.05 秒 | **PASS** |
| `pnpm run test:offline` | Node 内置测试：**33/33 PASS，0 FAIL，0 skipped**，历时约 1.02 秒 | **PASS** |
| `vp pack` | 入口 `src/normalize.css`；输出唯一 `dist/normalize.css`，**0.20 kB、gzip 0.18 kB**，Build complete | **PASS** |
| `pnpm run test:package` | 真实 npm tarball 离线安装与 CSS 入口回归，**1/1 PASS** | **PASS** |
| `pnpm run test:consumer` | 真实 tarball 的独立 Vite+ 生产消费 CSS 保留，**1/1 PASS** | **PASS** |

**阶段结论**：W-07 P-06 的上述 6 个当前本地质量门槛，在维护者提供日志的范围内**全部 PASS**；这比历史 W-04/W-06 阶段的旧数字更新。产品 CSS 是唯一 R-003，`vp pack` 只产生一个 CSS 文件；并未据此宣称未运行的浏览器矩阵、发布流程或网络服务正常。

**仍待确认**：

1. 用户日志**未包含** `pnpm install --frozen-lockfile` 输出，不能把锁文件存在和 6 组测试成功等同于**冻结安装已验证**。
2. `vp check --fix` 是可能修改文件的操作；尚未提供 `git status --short` / `git diff --check` 和实际变更清单，不能认定格式修复已同步到 GitHub 分支。
3. `npm pack --dry-run --json --ignore-scripts` 的本轮输出未提供；真实 tarball 测试已通过，但未来如修改 `package.json` 的元数据，必须再次复核。
4. 目前 `package.json` 仍是 `private:true`、`version:"0.0.0"`，公开元数据和 npm scope 权限待审核；**不发布、不合并、不增加 CI**。

**最小补充检查**（无需重复已经 PASS 的测试）：

```powershell
pnpm install --frozen-lockfile
git status --short
git diff --check
npm pack --dry-run --json --ignore-scripts
```

以上命令是**后续待执行/待提供日志**，并非本次已运行结果。

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
| P-01 | **锁文件与包管理器策略** | pnpm 12.15.0、唯一 `pnpm-lock.yaml` 已入库；维护者 Windows `pnpm install --frozen-lockfile` 83ms 成功且依赖解析跳过 | **PASS（真实冻结安装 + GitHub 静态核对）** |
| P-02 | **版本和 npm 发布开关**  | `version:"0.0.0"`、`private:true`                                                                                                              | **预期发布阻断**：保持现状直到维护者正式指定首个语义化版本并授权公开发布；**不提前清除 `private`**                                                              |
| P-03 | **公开 npm 元数据** | 已补充 `description`、`license:MIT`、`repository`、`homepage`、`bugs`；GitHub JSON/字段/原有配置静态核对 PASS | **元数据实施完成／新版 manifest 真实 tarball 与消费端复验 NOT_RUN**；不得将此前旧包测试冒充新版本 PASS |
| P-04 | **npm 组织/作用域权限**  | 无已验证的 `@adui` npm scope 发布授权、包名可用性或维护者身份资料                                                                              | **NOT_VERIFIED**：发布前由维护者自行核验；不读取令牌、不登录、不尝试发布                                                                                        |
| P-05 | **公开兼容性范围**       | [W-06](W06_ACCEPTANCE_INDEX.md) 已获维护者管理验收；缺少本次逐目标 UA/OS/设备原始附件                                                          | **文案门槛**：不得把目标最低版本清单直接写成已经可复核 PASS 的公开支持承诺                                                                                      |
| P-06 | **最终本机复核** | 维护者 Windows 实际日志：19 文件格式/Lint 正常，Vitest 7/7、Node 33/33、唯一 CSS 打包、真实 tarball 1/1、Vite+ 消费 1/1、冻结安装成功、`git diff --check` 无输出、npm 预打包五文件白名单完全匹配 | **PASS（真实执行日志；`.idea/` 已在后续仓库规则中忽略，生效待下一次拉取确认）** |
| P-07 | **最终发行准许**         | W-07 当前只获授权执行质量审核，**未授权发布、Release、合并或改生产配置**                                                                       | **BLOCKER**：发布需维护者新的明确指令                                                                                                                           |

**许可证细节（最新）**：`LICENSE` 本来就是 MIT，`package.json` 现已显式补充 `license:"MIT"`；两者静态一致。该元数据变化不影响 R-003 CSS 或运行时依赖。

**GitHub Actions**：检查 `.github/` 目录，当前仅 `ISSUE_TEMPLATE/` 与 `pull_request_template.md`，**未发现 workflows**。本项目长期禁止增加任何 CI；W-07 不新增自动检查机制。

## 4. 下一次仅在维护者本机执行的只读或测试命令

**历史命令清单**：下列大部分检查已经由维护者在 2026-11-05 提供真实 PASS 日志；以本文顶部最新结果为准，勿重复执行已通过的项目。今后如果包元数据或发布配置发生变化，再针对新内容复验。

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

**当前判断（2026-11-05）**：P-01 冻结安装和旧 manifest 的 P-06 本机质量回归均有真实 PASS 日志；**P-03 新元数据已写入并通过 GitHub 静态检查，但修改后的本机打包与消费测试尚未复验**。P-02 版本和 private 开关、P-04 npm scope 权限、P-05 公开浏览器支持范围及 P-07 发布授权均未完成。**Issue #8 继续 Open，不发布、不合并、不新增 CI。**

优先级建议：**先针对新 `package.json` 复验真实包文件清单与 Vite+ 生产消费，确认 P-03 完全满足发行前要求；随后独立评估 P-02 首版版本、P-04 npm scope、P-05 兼容性声明及 P-07 发布授权。**

本轮已补建 `CHANGELOG.md`、更新中英文 README 的当前状态，并同步文档/Issue。未修订生产 CSS、未运行新的本地测试、未执行 CI、未变更包导出、未发布软件包、未创建 Release、未合并主分支。
