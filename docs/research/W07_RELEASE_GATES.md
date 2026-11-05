# W-07 · 首发版本、npm 作用域与浏览器声明审核

- **审核日期**：2026-11-05
- **工作项**：[W-07 / Issue #8](https://github.com/adui-studio/normalize.css/issues/8)
- **所属分支**：`feat/viteplus-local-harness`
- **状态**：P-02 **维护者已确定候选版号 `0.0.1`，并恢复 `private:true`**，待新版包测试；P-04 **账户/用户作用域通过核验，首次发布权限与认证仍待确认**；P-05 **最低浏览器支持矩阵未冻结**；P-07 **未授权发布**。
- **范围**：维护者已授权在开发分支确定 `0.0.1` 并恢复 `private:true`；**不等于已授权 npm 发布、Tag、Release 或合并主分支**。

## 2026-11-05 · P-02 private 安全开关恢复（最新决策）

维护者最新明确要求：**首发候选版本保持 `0.0.1`，但 `package.json#private` 恢复为 `true`**。此前将其改为 `false` 的操作只属于历史阶段，现已撤回。这一选择保留 npm 的防误发布保护，更符合 W-07 尚未结束、P-07 尚未获得发布授权的当前状态。

本次只恢复 `package.json` 的 `private:true` 与两项正式包测试的 `private:true` 断言，继续验证版本 `0.0.1`。真实包安装后 manifest 一致性检查保留；模拟 Fixture/独立消费者的 `private:true` 本来就不需要变化。**没有变更产品 CSS、pnpm 锁文件、依赖或入口**。

**当前 P-02 状态：版本 `0.0.1` 已定；`private:true` 为维护者确定的未发布安全开关。** 此前关于 `private:false` 的配置描述仅供审计追溯，不代表当前仓库。新组合 `0.0.1/private:true` 的本机包/消费者回归尚未执行；未发布、未打 Tag/Release、未合并 main，也不增加 CI。

## P-02 · 首个公开版本

**维护者最新决定（2026-11-05）**：将首个公开候选版本定为 **`0.0.1`**，并明确将 `private` 调整为 **`false`**，取代此前未获批准的 `0.1.0` 建议。仓库当前根 `package.json` 已实施：

```json
{
  "name": "@adui/normalize.css",
  "version": "0.0.1",
  "private": false
}
```

**版本选择依据**：首版真正交付的 CSS 只有 R-003 —— `b, strong { font-weight: bolder; }`；其余 35 条研究候选均未加入默认 CSS，也未提供 Reset、Forms、A11y 或组合入口。`0.0.1` 是有效的 SemVer 三段版本号，适合作为用户自行确定的最小首发候选；[SemVer 规范](https://semver.org/lang/zh-CN/spec/v2.0.0.html) 没有要求初次公开必须为 `0.1.0`。选择 `0.0.1` 不是为了规避 CSS 视觉兼容性评审，后续增加或变更 CSS 规则仍需评估破坏性影响。

**配置范围与现有验证**：`package.json` 仅更改 `version`（`0.0.0 → 0.0.1`）与 `private`（`true → false`）；`tests/package.node.test.mjs` 与 `tests/package-real.node.test.mjs` 已同步更新断言，并验证真实安装后 manifest 中的 `version` / `private` 一致。合成 smoke Fixture 和独立消费者的 `private:true` 为测试环境隔离语义，**不需修改**。唯一产品 CSS、正式入口、依赖、作者、许可证、pnpm 12 锁文件均保持不变。

**风险与边界**：`private:false` 会撤销 npm 内建的误发布拦截。**当前尚未执行新版本下的本机 `vp check`、离线测试、`vp pack`、真实 tarball/消费者回归或 `npm pack --dry-run`，不能宣称 `0.0.1` 已通过发布前最终复验**。单一 CSS 根入口只有旧版本的交付证据，新配置需要针对性重新验证。当前**没有**执行 `npm publish`、创建 Git Tag / GitHub Release 或合并 `main`；`CHANGELOG.md` 仍为 `Unreleased`。P-07 需维护者**新的独立发布授权**。

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

| 检查项 | 维护者本机输出 | 审核结论 |
| --- | --- | --- |
| `npm config get registry` | `https://registry.npmjs.org/` | **PASS：官方 Registry** |
| `npm whoami --registry=https://registry.npmjs.org/` | `adui` | **PASS：当前 npm 登录用户及用户作用域匹配** |
| `npm view "@adui/normalize.css" version --registry=https://registry.npmjs.org/` | `E404 Not Found`，返回不存在或无权访问提示 | **未取得该包可访问的已发布版本**；不能简单视为发布权限测试 |


**剩余核验**：`npm whoami=adui` 与 npm 个人 `@adui` 作用域规则已足以确认**账户/用户作用域匹配**。但 `npm view` 返回 E404 不会证明该包已被正式预留或允许立即发布；还需要在 npm 网页的当前账户中检查双因素/发布认证要求、包名及作用域相关异常（如有），并在获得独立发布授权后才可进行实际发布。**不得通过试发、创建一个空包或关闭安全要求来验证**。

**安全边界**：维护者本机已有 npm 登录态；本助手没有登录或获取 Token、没有读取 npm 私密配置，也没有执行任何发布命令。正式发布必须另外批准，并满足 npm 实际认证与双因素/发布安全要求；不得通过新增 CI 或自动发布来绕过。

**P-04 结论**：账户、官方 Registry 和用户作用域**已验证 PASS**；包的首次可发布性与发布认证仍**待验**，所以 P-04 **部分完成，不关闭发行门槛**。

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
- **P-02 已实施（最新）**：`version:"0.0.1"`、`private:true`，已同步两处包契约测试断言；**本次恢复后本机回归尚未执行**。
- **仍待完成**：P-04 首发包发布认证和安全要求，P-05 正式最低浏览器支持矩阵或经批准的替代验收决定。
- **仍需单独授权**：更改 `private:true` 的发布保护、`npm publish`、Git Tag、GitHub Release、`main` 分支合并。
- **始终禁止**：新增 CI、GitHub Actions 发布工作流或提交 Token/OTP/密码。

**总判定（最新）**：W-07 继续 Open；P-02 版本 `0.0.1` 与私有安全开关 `true` 已配置，但最新包回归和其他发行门槛未完成。**首发候选 ≠ 已发布版本**。
