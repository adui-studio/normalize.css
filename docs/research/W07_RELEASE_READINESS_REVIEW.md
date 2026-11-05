# W-07 · MVP 发布前质量审核记录

- **首次审查日期**：2026-11-04
- **分支**：`feat/viteplus-local-harness`
- **工作项**：[W-07 / Issue #8](https://github.com/adui-studio/normalize.css/issues/8)
- **审查形式**：读取 GitHub 开发分支当前文件及提交树，并核对维护者提供的 Windows PowerShell 原始命令输出；**本助手没有直接在维护者 Windows 环境运行命令**。
- **审核判断**：**部分通过，发布准备尚未就绪；Issue #8 保持 Open**。
- **红线**：不修改产品 CSS 或既定包根入口；不新增依赖/CI、GitHub Actions、自动发布；不执行 npm publish、GitHub Release、`main` 合并。

## 2026-11-05 · P-05 最低浏览器支持证据矩阵已建立（最新）

已核对 [ADR-0004](../adr/0004-browser-support-policy.md) 的七项目标和 [W-06 正式验收索引](W06_ACCEPTANCE_INDEX.md)，新增 [P-05 浏览器证据矩阵](W07_P05_BROWSER_EVIDENCE_MATRIX.md)。**Chrome 120 和 Firefox 121 只有早期 R-003 T0/T1 字重证据（分别四组差异、零差异）**；Chrome 156 的 T0/T2/交互/生态记录属于另一个实际版本；Edge 120、Safari 17.2 与三个移动最低版本的可审核 T2 附件当前缺失。**缺附件不等于维护者未执行 W-06 回归**，正式验收的管理决定保持不变。

**P-05 判定仍为 OPEN**：补证方案和统一字段已准备好，优先复用 W-06 已有文件及维护者保存的历史环境结果，未获取的浏览器/版本不可假设 PASS。发布具体最低版本承诺前仍须按 ADR-0004 取得真实测试证据，或经维护者另行批准修订 ADR。没有执行新浏览器测试、改 CSS、增 CI、合并或发布。

## 2026-11-05 · P-01/P-02/P-06 最新完整 Windows 本地回归（最终复核）

维护者进一步提供 `version:"0.0.1"`、`private:true` 候选包的**完整 Windows PowerShell 真实命令输出**。本次补齐先前缺少的独立冻结安装和 Vitest 回归，并重复了真实包链路检查：

| 检查命令                                     | 维护者实际结果                                                              | 本轮结论                                        |
| -------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------- |
| `pnpm install --frozen-lockfile`             | pnpm 12.15.0，锁文件供应链策略通过、解析跳过，24ms                          | **PASS**                                        |
| `vp check --fix`                             | 格式化完成 1.2s，19 文件零 Lint warnings/errors（159ms）                    | **PASS（修复模式；未另行执行只读 `vp check`）** |
| `vp test`                                    | Vitest 5.0.5；1 文件、7/7 测试通过，137ms                                   | **PASS**                                        |
| `pnpm run test:offline`                      | Node 33/33 PASS，0 FAIL，约 1.03s                                           | **PASS**                                        |
| `vp pack`                                    | 唯一 `dist/normalize.css` 200 B（gzip 180 B），25ms                         | **PASS**                                        |
| `pnpm run test:package`                      | 真实 npm tarball 离线安装 1/1 PASS                                          | **PASS**                                        |
| `pnpm run test:consumer`                     | 独立 Vite+ 生产构建导入 CSS 1/1 PASS                                        | **PASS**                                        |
| `npm pack --dry-run --json --ignore-scripts` | `@adui/normalize.css@0.0.1`，5 文件、`bundled:[]`、包 13871 B、解包 33846 B | **PASS**                                        |
| `git status --short`                         | 无输出                                                                      | **已跟踪文件无改动、无未忽略的未跟踪文件**      |

npm 包清单与前次一致：`LICENSE` 1089 B、`README.en.md` 9821 B、`README.md` 21381 B、`dist/normalize.css` 200 B、`package.json` 1355 B；文件总数为 5，无 bundled 依赖。此为**预打包模拟，不是实际 npm 公开发布**。`vp test` 提示 Vite+ 1.5.0 可用，当前 `package.json` 继续锁定 `vite-plus@1.4.0`；不据提示擅自升级依赖。

**本轮结论**：当前候选 `0.0.1/private:true` 的 P-01 冻结安装、P-02 包配置与真实交付、P-03 元数据/包契约、P-06 本地完整质量检查**均有直接 PASS 证据**。以此处最新结果为准；下方此前阶段记录的“`vp test` 未重跑”以及 “冻结安装待独立复验”只描述**当时那次执行**，不再是最新阻塞项。没有声称执行 Chrome/Edge/Firefox/Safari 所有目标版本的逐环境验证。P-04 正式发行认证、P-05 可审核的浏览器兼容性声明及 P-07 单独发布授权依然待完成；W-07 Issue #8 保持 Open。**未执行 npm publish、GitHub Release、Tag、main 合并或增加 CI。**

## 2026-11-05 · P-02/P-06 的 0.0.1 私有包本地验收完成（历史批次，已由上方完整复核补充）

维护者在 Windows PowerShell 的 `D:\Workspace\adui-studio\normalize.css` 项目目录实际执行了本轮测试，基于已提交的 `version:"0.0.1"`、`private:true` 和对应的两项正式包断言。以下状态**来自维护者提供的终端原始输出**，并非本助手独立运行：

- `vp check --fix`：格式化完成（1.2s），19 文件无 Lint warnings/errors（183ms，16 threads），**PASS**。本轮使用修复模式；**没有单独执行无 `--fix` 的 `vp check`**。
- `pnpm run test:offline`：执行前输出锁文件供应链检查通过、无需重新解析，pnpm **12.15.0**；随后 Node **33/33 PASS、0 FAIL/skip**（约 1.12s），**PASS**。但本轮**未单独运行** `pnpm install --frozen-lockfile`；先前该命令的真实 PASS 保留为独立证据。
- `vp pack`：唯一 `dist/normalize.css`，**200 B**（gzip **180 B**），24ms，**PASS**。
- `pnpm run test:package`：真实 tarball 的离线安装 **1/1 PASS**；`pnpm run test:consumer`：独立 Vite+ 生产消费 **1/1 PASS**。
- `npm pack --dry-run --json --ignore-scripts`：`id:"@adui/normalize.css@0.0.1"`，**5 文件**：LICENSE（1089 B）、README.en.md（9821 B）、README.md（21381 B）、dist/normalize.css（200 B）、package.json（1355 B）；`size:13871` B、`unpackedSize:33846` B、`bundled:[]`。**PASS**；仅为预打包，不代表发布。
- `git status --short`：无输出，维护者本机工作区**干净**。

**当前结论**：**P-02 的 `0.0.1/private:true` 候选包配置及对应本地测试 PASS；P-06 本轮实际执行的质量检查 PASS**。原有 Vitest `vp test` 7/7 PASS 是**较早版本的独立证据**，本轮未重跑，不能算作这次重新执行。因 `private:true` 保持防误发布保护，没有执行 `npm publish`、Tag、Release 或 main 合并。P-04 首发认证条件、P-05 公开浏览器最低版本证据及 P-07 单独发布授权仍未完成，**W-07 Issue #8 继续 Open**。

## 2026-11-05 · P-02 保留 0.0.1 并恢复 private:true（最新）

维护者最新要求：**保留版本号 `0.0.1`，将 `package.json#private` 从 `false` 恢复为 `true`**，继续避免在 W-07 未结束时误发布。GitHub 开发分支同步恢复 `tests/package.node.test.mjs` 与 `tests/package-real.node.test.mjs` 的正式包 `private:true` 断言，继续断言版本 `0.0.1` 和真实安装后 manifest 一致性。模拟 smoke Fixture 与独立消费者自己的 `private:true` 保持不变；产品 CSS、单一根导出、依赖与 pnpm 锁文件均未改动。

**P-02 最新状态**：版本候选已确定为 `0.0.1`、`private:true` 为当前安全配置；此前 `private:false` 只是已被覆盖的历史阶段。**此次恢复后尚未获得新的 Windows `vp check`、离线 Node、真实 tarball/消费者与 `npm pack --dry-run` 执行日志，不声明新包已验证通过**。P-04 首次发布认证、P-05 浏览器对外兼容声明、P-07 发布授权仍未完成。Issue #8 保持 Open，不发布、不合并、不增加 CI。

## 2026-11-05 · P-02 维护者确定 0.0.1 首发候选并解除 private（历史决定：已撤回）

维护者明确要求：首个公开候选版本改为 `0.0.1`（取代未经正式批准的 `0.1.0` 提议），并将 `package.json#private` 由 `true` 调整为 `false`。原因是 **`src/normalize.css` 目前仅有 R-003：`b, strong { font-weight: bolder; }`**；其余候选并未交付。

**GitHub 开发分支已实施**：

- `package.json`：仅变更 `version:"0.0.1"` 与 `private:false`，`author:ADui`、MIT、pnpm 12.15.0、Vite+ 1.4.0、唯一 CSS 根导出与 CSS 副作用约定不变。
- `tests/package.node.test.mjs` 与 `tests/package-real.node.test.mjs`：原本分别断言 `private:true`，若不同步会导致 `test:offline` 和 `test:package` 失败；现已断言 `version:"0.0.1"` 和 `private:false`，真实包安装后进一步校验 `version` 与 `private` 一致。
- 合成 tarball smoke Fixture 与独立消费者的 `private:true` 是测试临时项目的配置，**不属于正式包，不改**。
- `src/normalize.css` 与 `pnpm-lock.yaml` 内容不变；不人为替换锁文件内部第三方依赖可能包含的 `0.0.0` 字符串。

**状态边界**：上述是**配置及测试断言的 GitHub 静态核对**；**新 `0.0.1` + `private:false` 的本机 `vp check`、离线 Node、`vp pack`、真实 tarball 安装、Vite+ 生产消费、五文件预打包以及冻结安装复验尚未收到日志，均标为 NOT_RUN（本次版本变更后）**。以往 `0.0.0` 的 PASS 不自动覆盖新文件。`private:false` 已解除防误发布保护，但用户没有授权发布。P-04 首发认证、P-05 浏览器兼容性声明和 P-07 独立发行批准继续阻塞 npm 发布。

进一步决策见 [W-07 首发门槛审核](W07_RELEASE_GATES.md)。

## 2026-11-05 · P-04 npm 账户与作用域本机核验（最新）

维护者提供 Windows PowerShell 的**真实只读查询**：

- `npm config get registry` → `https://registry.npmjs.org/`，**PASS**。
- `npm whoami --registry=https://registry.npmjs.org/` → `adui`，**PASS**。依 npm 官方 [About scopes](https://docs.npmjs.com/about-scopes/) 的用户作用域规则，`adui` 账号与 `@adui` **个人作用域归属一致**；GitHub 仓库所在组织 `adui-studio` 不影响此结论。
- `npm view "@adui/normalize.css" version --registry=https://registry.npmjs.org/` → **E404 Not Found**。Registry 未向本次请求返回可访问的发行版本；可能未发布或不可访问，**无法以 404 单独确认首发包名一定可用、发布权限或认证条件均满足**。

**阶段结论**：P-04 的**官方 Registry、npm 用户身份与个人作用域匹配 PASS**；包名首次可发布性及发布认证/双因素安全要求仍待在账户环境确认，故整体 **PARTIAL PASS，未满足全部发布前门槛**。维护者未运行 `npm publish`；本助手未获取令牌/登录凭据，也不通过试发布验证。不修改 `private:true`、`0.0.0`、CSS 或依赖。详见 [首发决策审核](W07_RELEASE_GATES.md)。

## 2026-11-05 · P-02/P-04/P-05 首发决策审查（历史提议：0.1.0 已被覆盖）

在不调整产品 CSS 或包配置的前提下，已审查 npm 作用域与 SemVer 官方规范，并对照 ADR-0004 和 W-06 实际验收等级。**发行门槛审核结论**：[W-07 首发决策审核](W07_RELEASE_GATES.md)。

- **P-02：候选 `0.1.0`**。SemVer 0.y.z 适合初始开发，但维护者尚未批准首发版本；当前仍保持 `version:"0.0.0"`、`private:true`。
- **P-04：NOT_VERIFIED**。GitHub `adui-studio`、作者 `ADui` 不等于 npm `@adui` 账户/组织的发布权限；npm scope 归属、包名状态与写权限尚需用户授权账号核实。未登录、未读取令牌、未发布。
- **P-05：兼容性文案边界已形成草案，但正式最低支持版本未冻结**。Chrome/Edge 120、Firefox 121、Safari 17.2 和对应移动端仍是原 ADR 批准的测试目标；W-06 管理验收完成不能补造缺失的逐 UA/OS/设备结果。正式发行前应按 ADR-0004 获取相应证据，或另行批准修订 ADR。

本次只推进**评审与研究**，不提前改变 `private`、版本、锁文件、CSS、CI 或发行/分支状态。W-07 Issue #8 继续 Open。

## 2026-11-05 · P-03 含 ADui 作者字段的最终包验收（最新）

维护者提供 Windows PowerShell **包含 `author: "ADui"` 的最终 manifest** 的实际验收日志，确认 P-03 本机包交付及消费测试通过：

- `vp check`：**首次 FAIL**，唯一格式问题为 `docs/research/W07_RELEASE_READINESS_REVIEW.md`；随后 `vp check --fix` 格式化完成，19 文件无 Lint 警告或错误，**修复后 PASS**。没有提供修复后单独再执行一次 `vp check` 的输出。
- `vp pack`：**PASS**，由 `src/normalize.css` 生成唯一 `dist/normalize.css`，200 B（gzip 180 B），22ms。
- `pnpm run test:package`：**1/1 PASS**，真实 npm tarball 离线安装；`pnpm run test:consumer`：**1/1 PASS**，Vite+ 生产消费构建。
- `npm pack --dry-run --json --ignore-scripts`：**PASS**，包内仅 `LICENSE`、`README.en.md`、`README.md`、`dist/normalize.css`、`package.json` 共 **5 文件**，`bundled:[]`；打包 13663 B，解包 33335 B，其中 `package.json` 1355 B。对外仍为 `@adui/normalize.css@0.0.0`，没有执行 npm publish。
- `git status --short`：**无输出**，维护者工作区干净。

**P-03 判定：PASS（最新含作者 manifest 的真实包/消费者验收）**。项目此前 `vp test` 7/7、Node 离线 33/33 及 pnpm 冻结安装的通过结果独立保留；**本轮没有重跑这三项**，不将其记作本轮新执行。

**剩余 W-07 发行决策**：P-02 首个语义化版本及 `private` 开关、P-04 npm `@adui` 发布权限、P-05 具体最低浏览器公开声明、P-07 另行授权发布，均没有因 P-03 通过而自动放行。Issue #8 保持 Open；不修改产品 CSS、依赖或 CI，不合并、不发布。

## 2026-11-05 · P-03 作者字段补充与本机验收反馈（最新）

维护者指出 npm manifest 缺少作者信息，已明确指定 `author: "ADui"`。本轮仅在 `package.json` 增加该字段，`LICENSE` 继续保留 `Copyright (c) 2026 ADui Studio`；作者标识与版权主体不要求相同。不添加未知邮箱、作者主页、组织身份或 npm 用户名。

维护者还提供 **新增此前五项公开元数据之后、作者字段加入之前** 的 Windows PowerShell 真实输出：

- `pnpm install --frozen-lockfile`：锁文件供应链策略通过、解析跳过；`pnpm v12.15.0`，28ms，**PASS**。
- `vp check`：首次发现 `docs/research/W07_RELEASE_READINESS_REVIEW.md` 与 `package.json` 两个文件的格式问题，**首次 FAIL**。后续 `vp check --fix` 格式化成功、19 文件无 Lint 错误或警告，**修复后 PASS**；不把第一次失败抹掉。
- `pnpm run test:offline`：**33/33 PASS**；`vp pack`：单一 `dist/normalize.css` **200 B**，**PASS**。
- `pnpm run test:package`：真实 tarball 离线安装 **1/1 PASS**；`pnpm run test:consumer`：独立 Vite+ 生产构建 **1/1 PASS**。
- `npm pack --dry-run --json --ignore-scripts`：**5 个文件、无 bundled 依赖，PASS**；`size:13655` B、`unpackedSize:33315` B、`package.json:1335` B。文件仍仅包含 LICENSE、README.en.md、README.md、dist/normalize.css、package.json。
- `git status --short`：**无输出**，修复之后本地工作区干净。

**证据边界与最新状态**：上述整组验证为维护者真实输出，对应的是**尚未含 `author` 的 manifest**；现在作者字段已经新增，GitHub 静态 JSON/字段核对可通过，但**这一最新文件的格式检查及 tarball/消费者测试仍待本机复验**。由于包元数据变化，`npm pack` 字节数和完整性摘要预期不同，不能沿用上述精确大小或哈希。首版版本仍为 `0.0.0`，`private:true`，不发布、不合并、不新增 CI。

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

| 检查项目                                     | 维护者提供的实际结果                                                                                                                                 | 当前判定                                                                                 |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`             | `Lockfile passes supply-chain policies (verified 13h ago)`；`Lockfile is up to date, resolution step is skipped`；`Done in 83ms using pnpm v12.15.0` | **PASS：冻结安装成功，版本匹配锁文件**；供应链策略的时效以 pnpm 输出为准                 |
| `git status --short`                         | 仅显示 `?? .idea/`                                                                                                                                   | **已跟踪文件无待提交修改**；IDE 本地目录未跟踪，应忽略，不将其误写为“Git 工作区完全干净” |
| `git diff --check`                           | 命令无任何输出                                                                                                                                       | **PASS：当前已跟踪工作树差异未报告空白错误**；不检查未跟踪文件                           |
| `npm pack --dry-run --json --ignore-scripts` | 返回有效 JSON；`@adui/normalize.css@0.0.0`；`entryCount:5`；`bundled:[]`；`size:13562` bytes；`unpackedSize:32922` bytes                             | **PASS：正式包文件白名单匹配，未执行 npm publish**                                       |

**npm 预打包五文件清单（从用户实际输出逐项核对）**：`LICENSE`（1089 B）、`README.en.md`（9595 B）、`README.md`（21096 B）、`dist/normalize.css`（200 B）、`package.json`（942 B）。没有 `src`、`tests`、`fixtures`、`.agents`、`.idea` 或开发依赖；`CHANGELOG.md` 未在当前包白名单中，符合前述文件契约。整个预打包体积约 **13.56 kB**（并非 CSS 文件大小）。`npm pack --dry-run` 是文件清单/打包模拟，不等于真实发布，也不是新一次 tarball 离线安装；真实 tarball 测试已在上一批日志中 **1/1 PASS**。

**本轮仓库最小修正**：为避免 JetBrains 用户的本地配置误提交，已在 `.gitignore` 仅新增 `.idea/`。不会删除本地目录，不改代码风格或编辑器共享配置；这是本次仅有的非文档文件更改。该远端忽略规则需维护者下一次 `git pull --ff-only` 后生效；用户这次 `git status` 截图是在新增忽略规则**之前**获得的，因此不得声称已验证其生效。

**阶段结论**：W-07 **P-01 依赖锁定/冻结安装 PASS**；**P-06 当前本地质量回归 PASS**（此前 `vp check --fix`、Vitest 7/7、Node 离线 33/33、`vp pack` 0.20 kB、真实包 1/1、消费构建 1/1，以及本次 Git/预打包检查均有维护者实际输出）。当前审核仍保留 **P-02 首版正式版本及 private 发布开关、P-03 npm 包公开元数据、P-04 npm scope 授权、P-05 公开最低浏览器版本支持声明、P-07 单独发布授权**。这些不随 P-01/P-06 自动完成；Issue #8 保持 Open。

## 2026-11-05 · P-06 本地质量回归（已通过；详见上方最新补验）

维护者提供 Windows PowerShell 真实终端输出，项目目录 `D:\Workspace\adui-studio\normalize.css`。本条证据来自**用户实际运行的日志**，本助手未远程执行命令，也没有独立获取终端状态或 `git diff`。

| 执行命令                 | 维护者提供的可核实结果                                                                             | 本次判定                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `vp check --fix`         | Formatting completed（7.8 秒）；19 个文件无 Lint warnings/errors（2.0 秒，16 threads）             | **PASS**，但 `--fix` 可能写入本地文件，需查看工作区 diff |
| `vp test`                | Vitest 5.0.5：1 个测试文件通过，**7/7** tests，历时约 54.05 秒                                     | **PASS**                                                 |
| `pnpm run test:offline`  | Node 内置测试：**33/33 PASS，0 FAIL，0 skipped**，历时约 1.02 秒                                   | **PASS**                                                 |
| `vp pack`                | 入口 `src/normalize.css`；输出唯一 `dist/normalize.css`，**0.20 kB、gzip 0.18 kB**，Build complete | **PASS**                                                 |
| `pnpm run test:package`  | 真实 npm tarball 离线安装与 CSS 入口回归，**1/1 PASS**                                             | **PASS**                                                 |
| `pnpm run test:consumer` | 真实 tarball 的独立 Vite+ 生产消费 CSS 保留，**1/1 PASS**                                          | **PASS**                                                 |

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

| 编号 | 事项                     | 当前证据                                                                                                             | 风险/决定                                                                  |
| ---- | ------------------------ | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| P-01 | **锁文件与包管理器策略** | pnpm 12.15.0、唯一 `pnpm-lock.yaml` 已入库；维护者 Windows `pnpm install --frozen-lockfile` 83ms 成功且依赖解析跳过  | **PASS（真实冻结安装 + GitHub 静态核对）**                                 |
| P-02 | **版本和 npm 发布开关**  | `0.0.1/private:true` 已确认；本轮离线 33/33、真实 tarball 1/1、Vite+ 消费 1/1、五文件预打包 PASS                     | **PASS：候选私有包已本机验收；未授权发布**                                 |
| P-03 | **npm 公开元数据**       | `author:"ADui"` 等元数据齐全；真实 tarball 1/1、Vite+ 消费 1/1、npm 五文件 dry-run PASS                              | **PASS：最终含 author 的 manifest 已通过真实包及消费验证**                 |
| P-04 | **npm 组织/作用域权限**  | 官方 Registry 已核实，`npm whoami=adui`；个人 `@adui` 作用域归属已验证，`npm view` 返回 E404                         | **PARTIAL PASS：账户/作用域匹配，首发包名及发布认证待核**                  |
| P-05 | **公开兼容性范围**       | [W-06](W06_ACCEPTANCE_INDEX.md) 已获维护者管理验收；缺少本次逐目标 UA/OS/设备原始附件                                | **文案门槛**：不得把目标最低版本清单直接写成已经可复核 PASS 的公开支持承诺 |
| P-06 | **最终本机复核**         | 本轮 `vp check --fix`、Node 33/33、CSS 200 B 打包、真实包 1/1、消费者 1/1 和 npm 五文件清单均 PASS；`vp test` 未重跑 | **PASS（本轮上述检查）；跨浏览器/发行另行审核**                            |
| P-07 | **最终发行准许**         | W-07 当前只获授权执行质量审核，**未授权发布、Release、合并或改生产配置**                                             | **BLOCKER**：发布需维护者新的明确指令                                      |

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

**当前判断（2026-11-05，最新）**：维护者已针对 `0.0.1/private:true` 完成**完整 Windows 本机回归**：冻结安装、`vp check --fix`、Vitest 7/7、Node 33/33、CSS-only 打包、真实 tarball 安装 1/1、Vite+ 生产消费 1/1、npm 五文件预打包及干净工作区均 PASS。P-01/P-02/P-03/P-06 的本机包质量门槛均有直接依据；P-04 首发认证、P-05 公开最低浏览器支持范围证据和 P-07 单独发布授权仍待完成。**Issue #8 继续 Open，不发布、不合并、不新增 CI。**

优先级建议：**`0.0.1/private:true` 的完整本地回归已通过；下一步应核验 P-04 发行认证条件、P-05 对外兼容性证据，最后由维护者明确决定 P-07 npm 发布、Tag、Release 与主分支合并。**

本轮已补建 `CHANGELOG.md`、更新中英文 README 的当前状态，并同步文档/Issue。未修订生产 CSS、未运行新的本地测试、未执行 CI、未变更包导出、未发布软件包、未创建 Release、未合并主分支。
