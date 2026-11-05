# W-07 · 首发版本、npm 作用域与浏览器声明审核

- **审核日期**：2026-11-05
- **工作项**：[W-07 / Issue #8](https://github.com/adui-studio/normalize.css/issues/8)
- **所属分支**：`feat/viteplus-local-harness`
- **状态**：P-02 形成版本建议，**待维护者正式决策**；P-04 **用户身份及个人作用域已核验，首次发布准备仍待确认**；P-05 文案与证据边界已审核，**正式最低版本支持矩阵未冻结**；P-07 未授权。
- **范围**：这是发行前决策研究及审核记录，**不是批准改变 `package.json`、取消 `private`、发布或合并主分支**。

## P-02 · 首个公开版本

当前已验证开发版事实：

- `package.json`：`name:"@adui/normalize.css"`、`version:"0.0.0"`、`private:true`。
- 单一 CSS 根入口 `./dist/normalize.css`；只包含准入规则 R-003（`b,strong` 的相对字重），其他 35 条研究候选未加入首版。
- W-03/W-04/W-05/W-06 已按各自结项记录完成；W-07 的 P-01（锁文件/冻结安装）、P-03（含作者 ADui 的元数据及真实 npm tarball 消费）、P-06（本地质量回归）已获得维护者实际 PASS 日志。

**建议将 `0.1.0` 作为第一个正式公开版本的候选值**，理由：SemVer 2.0.0 对初始开发阶段使用 `0.y.z`，官方 FAQ 亦建议从 `0.1.0` 开始；[SemVer 中文规范](https://semver.org/lang/zh-CN/spec/v2.0.0.html)、[英文规范](https://semver.org/)。

此值**尚未获维护者正式版本批准**，不是既定版本，不在本轮修改 `package.json`、标签、Changelog 发布日期或 `private`。CSS 的修改仍可能产生破坏性视觉影响；`0.x` 并不意味着不需要变更记录和回归测试。若未来批准，必须同时核对锁文件变化、版本文本、真实打包结果及发行说明，不能把旧的 `0.0.0` 产物作为新版本验收。

**不建议目前直接定为 `1.0.0`**：目前唯一的默认规则、尚未提供的可选模块及尚未冻结的公开兼容性矩阵仍处于 MVP 阶段。这是建议而非版本事实。

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

- **已通过**：P-01 pnpm 冻结安装、P-03 元数据与真实 tarball/Vite+ 消费、P-06 本地质量检查；证据详见 [W-07 质量审核](W07_RELEASE_READINESS_REVIEW.md)。
- **待决策**：P-02 `0.1.0` 候选、P-04 `@adui` npm 发布权限、P-05 正式兼容矩阵与对外支持声明。
- **单独授权后才能实施**：版本变更、`private:true` 移除、npm 发布、GitHub Release、`main` 分支合并。
- **始终禁止**：为本项目新建 CI、GitHub Actions 发布工作流或在源码中保存认证令牌。

**总判定**：W-07 发行前审核继续进行，Issue #8 保持 Open。本轮仅新增研究文档和更新状态记录，不修改正式 CSS、包配置、依赖或发行状态。
