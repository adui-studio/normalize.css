# W-07 · 首发版本、npm 作用域与浏览器声明审核

- **审核日期**：2026-11-05
- **工作项**：[W-07 / Issue #8](https://github.com/adui-studio/normalize.css/issues/8)
- **所属分支**：`main`（原研究与开发记录保留在 `feat/viteplus-local-harness` 历史分支）
- **状态**：P-02 **`0.0.1/private:true` 候选包已通过本机交付回归**；P-04 **账户/用户作用域通过核验，首次发布权限与认证仍待确认**；P-05 **最低浏览器支持矩阵未冻结**；P-07 **未授权发布**。
- **范围**：维护者已同意将 PR #1/#9 按 Merge commit 顺序合并 `main`，GitHub 已确认两者合并完成；`0.0.1/private:true` 继续保留。**这不等于授权 npm 发布、Tag、Release 或任何后续 PR 合并**。

## 2026-11-05 · P-05 成熟竞品规则免重复实测（最新维护者决定）

维护者明确要求：**“别的竞品库已经使用的，不需要再验证了。”** 对首版仅有的 R-003（`b, strong { font-weight: bolder; }`），现有 [WHATWG 建议样式](https://html.spec.whatwg.org/multipage/rendering.html#phrasing-content-3)、[normalize.css 源码](https://github.com/necolas/normalize.css/blob/master/normalize.css)、[modern-normalize 3.0.0](https://app.unpkg.com/modern-normalize@3.0.0/files/modern-normalize.css) 加上本仓库既有 Chrome 120、Firefox 121 局部证据和 W-06 管理验收，已满足**成熟低侵入规则的来源与准入复核**。不要求重新在七个历史目标浏览器逐项跑同一规则的 T0/T2 才允许进入发行评审。

**调整 P-05 发行判断**：
- **允许采用不承诺具体数字最低版本的发布说明**：表述 Baseline 2023 是**CSS 特性选择参考和内部测试目标**，而不是声称 `Chrome 120/Edge 120/Firefox 121/Safari 17.2` 及移动端均已完整通过。此时逐环境正式 T2 原始证据**不再构成 v0.0.1 发行阻塞**，但证据状态仍保持 PARTIAL / EVIDENCE_MISSING，不能写成 PASS。
- 若发布材料要声明“最低支持某浏览器某版本”，仍需匹配可审计证据或独立批准的政策修订；成熟竞品用了相同 CSS 不等于本项目按全部历史系统实测。
- 仍需确保本仓库真实打包/消费行为、源文件、许可证、样式副作用及已发现的层叠/组件冲突有可追溯处理；对**新规则、改变选择器/作用范围、系统交互风险**不自动免测。首版 R-003 产品 CSS 和发布保护不变。
- **P-04 首发认证/2FA 和 P-07 正式 npm/Tag/Release 独立授权保持不变**。本段只是验证策略调整，不准许修改 `private:true` 或发布。

**本次评审结论**：P-05 的“R-003 必须重复完成七项正式 T0/T2”门槛已由维护者**正式豁免**；不承诺明确最低数字版本时，P-05 **不再单独阻断 v0.0.1 首发审核**。过去缺少原始附件的事实原样保留。


## 2026-11-05 · P-04 npm 官方认证与公开作用域流程复核（规则已查证，账户状态待验）

本次只核对 npm 官方现行文档，**没有登录维护者 npm 账户、读取 Token/OTP、试发或执行发布**。与之前维护者提供的 `npm whoami=adui`、官方 Registry 及公开包版本查询 E404 的本机结果须区分：

- **公开 scoped 包**：npm 官方 [Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/) 明确首次公开发行需指定 `--access public`。本仓库 `package.json` 仍为 `private:true`，属于已批准的防误发布设置，**本阶段不解除**。
- **发布认证**：[Requiring 2FA for package publishing](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/) 明确创建与发行 npm 包须使用交互式双因素认证（2FA），或符合要求的 granular access token（bypass 2FA）；`npm whoami` 成功仅验证当前登录身份，**不能证明 2FA 已启用或首发认证能通过**。
- **无 CI 的最小路线**：本项目可在维护者**独立授权公开发行后**，由其在本机按 npm 交互提示使用账户 2FA；不需要为此添加 CI、GitHub Actions、trusted publishing、访问令牌或自动发布工作流。验证码、恢复代码、Token 和 `.npmrc` 凭据不得提交或发送到 Issue/PR。
- **发布前人工核对（尚未收到实际结果）**：维护者自行在 npm 网站确认账户 2FA 是否启用、恢复方式是否可用，结合 `@adui` 个人 scope 检查包名状态和账户异常。公开包查询 E404 **不代表**名称已预留、权限已通过或首次发布一定成功。
- **公开发布动作**：只有 P-05 按最新成熟规则免重测政策明确对外**不承诺尚未证实的数字最低浏览器版本**、最新完整本地回归条件达到批准的验收口径，并取得 **P-07 明确的发行授权**后，才可讨论解除 `private:true` 和通过 `npm publish --access public` 正式发行。**此处只是操作要求说明，不授权执行该命令**。

**P-04 判定：官方规则已核实；维护者账户的 2FA/首发认证条件仍是未完成的实际验证项。**

## 2026-11-05 · P-02 候选私有包已完成本地交付复验（最新）

维护者针对最终的 `version:"0.0.1"`、`private:true` 配置完成 Windows 本地回归：`vp check --fix` 格式/Lint PASS（19 文件）、Node 离线 **33/33 PASS**、`vp pack` 唯一 CSS **200 B**、真实 tarball 安装 **1/1 PASS**、Vite+ 生产消费 **1/1 PASS**，以及 `npm pack --dry-run --json --ignore-scripts` 的**五文件白名单 PASS**（`@adui/normalize.css@0.0.1`、打包 13871 B、`bundled:[]`）。最终 `git status --short` 无输出。

**P-02 候选版本配置与包交付验证 PASS**。本轮 `pnpm run test:offline` 中自动输出锁文件供应链核验通过，但没有单独运行冻结安装；`vp test` 本轮也未重新执行（此前 7/7 PASS 继续保留历史记录）。这**不代表** P-04 发布认证、P-05 浏览器兼容范围及 P-07 发布授权已通过。私有安全开关仍保留，尚未发布。

## 2026-11-05 · P-01/P-02/P-06 完整质量门槛补验（最新）

维护者提供 `0.0.1/private:true` 的 Windows 真机输出：冻结安装 `pnpm install --frozen-lockfile` **PASS**（pnpm 12.15.0，24ms）；`vp check --fix` **PASS**（19 文件无 Lint 错误/警告）；`vp test` **Vitest 7/7 PASS**；`pnpm run test:offline` **Node 33/33 PASS**；`vp pack` 唯一 CSS **200 B PASS**；真实包 `test:package` 与 Vite+ 消费 `test:consumer` 各 **1/1 PASS**；`npm pack --dry-run` 五文件 **PASS**（13871 B，`@adui/normalize.css@0.0.1`）；`git status --short` 无输出。

**P-01/P-02/P-03/P-06 完整本地验收通过**。此前批次所写的“本轮未重跑 Vitest/冻结安装”已被本次完整回归补齐。`vp test` 日志使用 **Vitest 5.0.5**；项目 `vite-plus@1.4.0` 保持锁定，`vp` 提示可升级至 1.5.0，但**未升级**。继续保持 `private:true`，P-04 首次发行认证、P-05 浏览器兼容性声明与 P-07 独立发布授权未完成，不执行发布。

## 2026-11-05 · P-02 private 安全开关恢复（历史批次）

维护者最新明确要求：**首发候选版本保持 `0.0.1`，但 `package.json#private` 恢复为 `true`**。此前将其改为 `false` 的操作只属于历史阶段，现已撤回。这一选择保留 npm 的防误发布保护，更符合 W-07 尚未结束、P-07 尚未获得发布授权的当前状态。

本次只恢复 `package.json` 的 `private:true` 与两项正式包测试的 `private:true` 断言，继续验证版本 `0.0.1`。真实包安装后 manifest 一致性检查保留；模拟 Fixture/独立消费者的 `private:true` 本来就不需要变化。**没有变更产品 CSS、pnpm 锁文件、依赖或入口**。

**当前 P-02 状态：版本 `0.0.1` 已定；`private:true` 为维护者确定的未发布安全开关。** 此前关于 `private:false` 的配置描述仅供审计追溯，不代表当前仓库。新组合 `0.0.1/private:true` 的本机包/消费者回归尚未执行；未发布、未打 Tag/Release、未合并 main，也不增加 CI。

## P-02 · 首个公开版本（历史配置：`private:false` 已撤回）

**历史阶段决定（2026-11-05，随后已撤回 `private:false`）**：曾将首个公开候选版本定为 **`0.0.1`**，并暂时把 `private` 调整为 **`false`**，取代此前未获批准的 `0.1.0` 建议。当时根 `package.json` 曾采用以下配置；**目前真实配置为 `0.0.1/private:true`，以本页顶部及当前仓库为准**：

```json
{
  "name": "@adui/normalize.css",
  "version": "0.0.1",
  "private": false
}
```

**版本选择依据**：首版真正交付的 CSS 只有 R-003 —— `b, strong { font-weight: bolder; }`；其余 35 条研究候选均未加入默认 CSS，也未提供 Reset、Forms、A11y 或组合入口。`0.0.1` 是有效的 SemVer 三段版本号，适合作为用户自行确定的最小首发候选；[SemVer 规范](https://semver.org/lang/zh-CN/spec/v2.0.0.html) 没有要求初次公开必须为 `0.1.0`。选择 `0.0.1` 不是为了规避 CSS 视觉兼容性评审，后续增加或变更 CSS 规则仍需评估破坏性影响。

**配置范围与现有验证**：`package.json` 仅更改 `version`（`0.0.0 → 0.0.1`）与 `private`（`true → false`）；`tests/package.node.test.mjs` 与 `tests/package-real.node.test.mjs` 已同步更新断言，并验证真实安装后 manifest 中的 `version` / `private` 一致。合成 smoke Fixture 和独立消费者的 `private:true` 为测试环境隔离语义，**不需修改**。唯一产品 CSS、正式入口、依赖、作者、许可证、pnpm 12 锁文件均保持不变。

**当时的风险与边界（历史记录）**：`private:false` 会撤销 npm 内建的误发布拦截。**当时尚未执行新版本下的本机 `vp check`、离线测试、`vp pack`、真实 tarball/消费者回归或 `npm pack --dry-run`，不能宣称 `0.0.1` 已通过发布前最终复验**。单一 CSS 根入口只有旧版本的交付证据，新配置需要针对性重新验证。当前**没有**执行 `npm publish`、创建 Git Tag / GitHub Release 或合并 `main`；`CHANGELOG.md` 仍为 `Unreleased`。P-07 需维护者**新的独立发布授权**。

## P-04 · npm `@adui` 发布权限

**2026-11-05 最新核验**：包名为 `@adui/normalize.css`，作者是 `ADui`。维护者在 Windows PowerShell 使用 npm 官方 Registry 的现有登录态实际执行 `npm whoami`，返回 **`adui`**。npm 官方 [About scopes](https://docs.npmjs.com/about-scopes/) 明确每个 npm 账户拥有与用户名对应的个人作用域，因此**当前登录账号对 `@adui` 用户作用域的身份归属已确认**；GitHub `adui-studio` 不需要与 npm 用户名相同。**这并非首次发布已经获准/成功的实测证明**。

官方依据：

- [npm About scopes](https://docs.npmjs.com/about-scopes/)：npm scope 属于账户或组织名称，不由 GitHub 仓库所有权推导。
- [npm Package scope / access matrix](https://docs.npmjs.com/package-scope-access-level-and-visibility/)：公共包可以被所有人访问，但发布权限取决于包所有者或有写权限的团队/成员。
- [npm Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)：公开 scoped 包有单独的发布权限、访问级别与账户安全门槛。

**维护者本机只读核对（已执行，真实输出）**：

```powershell
# 不显示或提交任何 npm Token，不执行 npm publish
npm config get registry
npm whoami --registry=https://registry.npmjs.org/
npm view "@adui/normalize.css" version --registry=https://registry.npmjs.org/
```

实际输出及判断：

| 检查项                                                                          | 维护者本机输出                             | 审核结论                                                   |
| ------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| `npm config get registry`                                                       | `https://registry.npmjs.org/`              | **PASS：官方 Registry**                                    |
| `npm whoami --registry=https://registry.npmjs.org/`                             | `adui`                                     | **PASS：当前 npm 登录用户及用户作用域匹配**                |
| `npm view "@adui/normalize.css" version --registry=https://registry.npmjs.org/` | `E404 Not Found`，返回不存在或无权访问提示 | **未取得该包可访问的已发布版本**；不能简单视为发布权限测试 |

**剩余核验**：`npm whoami=adui` 与 npm 个人 `@adui` 作用域规则已足以确认**账户/用户作用域匹配**。但 `npm view` 返回 E404 不会证明该包已被正式预留或允许立即发布；还需要在 npm 网页的当前账户中检查双因素/发布认证要求、包名及作用域相关异常（如有），并在获得独立发布授权后才可进行实际发布。**不得通过试发、创建一个空包或关闭安全要求来验证**。

**安全边界**：维护者本机已有 npm 登录态；本助手没有登录或获取 Token、没有读取 npm 私密配置，也没有执行任何发布命令。正式发布必须另外批准，并满足 npm 实际认证与双因素/发布安全要求；不得通过新增 CI 或自动发布来绕过。

**P-04 结论**：账户、官方 Registry 和用户作用域**已验证 PASS**；包的首次可发布性与发布认证仍**待验**，所以 P-04 **部分完成，不关闭发行门槛**。

## 2026-11-05 · P-05 七项最低浏览器证据盘点（最新）

已根据 ADR-0004、W-06 正式验收索引和历史 R-003/T2 数据建立 [P-05 浏览器证据矩阵与复用步骤](W07_P05_BROWSER_EVIDENCE_MATRIX.md)。Chrome 120 / Firefox 121 **只有 R-003 T0/T1 局部证据**；Chrome 156 有真实 T0/T2 与部分交互/生态记录，但**不能代替最低目标版本**；Edge 120、真实 Safari 17.2、Chrome Android 120、Firefox Android 121、Safari iOS 17.2 **尚无仓库可定位的逐环境 T2 原始记录**。W-06 管理验收已完成，**不声称这些环境未执行测试**，只标记公开支持版本的**证据缺口**。

该矩阵优先复用过去的测试和已有 `vp pack` / `vp dev` Fixture；不增加浏览器自动化依赖，不强制重做已经签收的 W-06 范围。**P-05 证据整理方案完成，正式七目标支持范围仍待补证或经维护者另行正式修订 ADR-0004。**

## 2026-11-05 · P-05 GitHub Issue 原始记录补充复核（最新）

进一步查阅已结项 [W-06 Issue #7](https://github.com/adui-studio/normalize.css/issues/7) 的 22 条历史评论，核对 Chrome 156 的原生/组件/Reset 局部测试证据与管理签收记录。没有新增可直接作为 **Edge 120、真实 Safari 17.2、三项最低移动版本** T0/T2 通过依据的独立原始附件；**不能把评论中的“回归已完成”转写为七目标逐项 PASS**。

已将直接 Issue 来源链接与 **Chrome 120 / Firefox 121 的优先正式 T2 补证步骤**加入 [P-05 浏览器证据矩阵](W07_P05_BROWSER_EVIDENCE_MATRIX.md)。此次仅复用既有资料，不新增浏览器实测。**P-05 仍 OPEN**，W-06 原正式验收结论不变。

## 2026-11-05 · P-05 本地证据比较器就绪（开发待验收）

为后续一次性完成 Chrome 120 / Firefox 121 及其他环境的 T0/T2 取证，新增 Node `tests/t2-evidence.mjs`，复用现有 Fixture 和限长 JSON 读取，检查正式包 CSS 加载标记、10 个计算样式点及预期/非预期差异；并将合成测试接入 `test:offline`，增加本地 `verify:mvp` 命令。**新增功能尚未由维护者完整运行，不将代码存在当作 P-05 PASS**。正式最低浏览器矩阵和发布认证门槛保持独立。详见 [MVP 交付清单](../MVP_0_0_1_HANDOFF.md)。

## P-05 · 最低浏览器兼容性声明

**已批准的特性参考**：Baseline 2023。Chrome/Edge 120、Firefox 121、Safari 17.2 与对应核心移动家族是[ADR-0004](../adr/0004-browser-support-policy.md)中的**最低测试目标**，不是已经对外保证的最低支持版本。

**仓库可复核的证明层级**：

- R-003 曾在 Chrome 120、Firefox 121 等指定环境取得 T0/T1 对照数据；不代表所有 Fixture 或 UI 框架均在这些版本复验。
- Chrome 156：三类 Reset 的 9/9 独立构建、静态计算样式、部分原生交互与生态对照有实测资料。
- W-06 已由维护者正式验收并关闭 Issue #7；但逐浏览器 UA/OS/设备/版本/失败豁免附件在当前仓库证据中不完整，**不能替代具体兼容性矩阵**。参见 [W-06 验收索引](W06_ACCEPTANCE_INDEX.md) 和 [浏览器支持边界](BROWSER_REVIEW.md)。

**建议对外中文表述（待发布文案审核）**：

> 本库以原生浏览器默认行为为基础，仅针对有证据支持的差异提供最小 CSS Normalize。浏览器兼容性以已公开的实际测试记录为准；Chrome/Edge 120、Firefox 121、Safari 17.2 及相应移动版本目前是验收目标，尚未作为正式最低支持版本承诺。嵌入式 WebView 等环境需要独立验证。

**建议英文表述（待发布文案审核）**：

> This library provides a minimal CSS Normalize based on documented browser differences. Compatibility claims are limited to environments with auditable test evidence. Chrome/Edge 120, Firefox 121, Safari 17.2, and the corresponding mobile versions remain verification targets, not published minimum support guarantees. Embedded WebViews require separate validation.

这段谨慎文案可避免无依据宣称，但**不能代替 ADR-0004 的发行前目标版本实测门槛**。正式发布前必须获得目标环境的可审核结果，或另行经维护者批准修改该兼容性 ADR 与正式验收要求；不能因没有写具体版本号就忽略原定最低验证目标。

**P-05 当前结论**：文字和证据边界审核已完成；目标版本承诺**未批准、未冻结**。已完成的 W-06 管理验收保持有效，不要求凭空重新执行过去的测试。

## P-07 · 发行与版本控制边界

- **已通过（旧开发版实际证据）**：P-01 pnpm 冻结安装、P-03 包元数据与真实 tarball/Vite+ 消费、P-06 本地质量回归，详见 [W-07 总审核](W07_RELEASE_READINESS_REVIEW.md)。
- **P-02 已实施并验收（最新）**：`version:"0.0.1"`、`private:true`，两处包契约测试断言一致；**本地离线/真实包/消费者回归 PASS**，不构成发布授权。
- **仍待完成**：P-04 首发包发布认证和安全要求，P-05 正式最低浏览器支持矩阵或经批准的替代验收决定。
- **已单独批准并执行**：PR #1、PR #9 以 Merge commit 合并 `main`，未使用 Squash 或强制推送。**仍需单独授权**：解除 `private:true` 的发布保护、`npm publish`、Git Tag、GitHub Release 及后续 `main` 合并。
- **始终禁止**：新增 CI、GitHub Actions 发布工作流或提交 Token/OTP/密码。

**总判定（最新）**：W-07 继续 Open；P-01/P-02/P-03/P-06 已完成最新 `0.0.1/private:true` 完整本地回归，P-04/P-05/P-07 发行门槛仍未完成。**首发候选 ≠ 已发布版本**。
