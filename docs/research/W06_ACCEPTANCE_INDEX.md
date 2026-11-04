# W-06 · 正式验收归档索引

- **结项日期**：2026-11-04
- **工作项**：[Issue #7 · 浏览器、无障碍、组件库与双 Reset 回归](https://github.com/adui-studio/normalize.css/issues/7)
- **结项依据**：维护者在当前对话明确确认“回归完成”，继而确认“已经正式验收归档”。
- **管理状态**：维护者已正式验收并归档；本索引用于同步开发仓库的项目状态，**不等于本次重新执行了回归或取得额外测试日志**。
- **开发分支**：`feat/viteplus-local-harness`。未批准自动合并 `main`、发布 npm 或增加 CI。

## 1. 已保留、可追溯的验证证据

| 验证范围 | 可追溯事实 | 证据形式 |
| --- | --- | --- |
| Tailwind v4 Preflight | `baseline`、`normalize-first`、`normalize-last` 三组真实 CSS tarball + Vite+ 构建成功；Chrome 156 三模式 12 元素 × 14 属性静态计算值零差异 | 维护者构建终端日志、三份 JSON |
| UnoCSS Reset `tailwind-v4` | 三组真实构建通过；Chrome 156 三模式静态计算值零差异 | 维护者构建终端日志、三份 JSON 和页面 CSS 来源 |
| UnoCSS Reset `tailwind-compat` | 三组真实构建通过；Chrome 156 三模式静态计算值零差异 | 维护者构建终端日志、三份 JSON 和页面 CSS 来源 |
| 三个独立 Reset 合计 | **9/9 生产构建通过**，彼此隔离、未混用 Reset | [Reset 实测记录](W06_RESET_LOCAL_VERIFICATION.md) |
| Tailwind Cascade Layers | Chrome 156 的两个加载顺序下，`b#bold` 未分层普通声明生效，Tailwind `base` 层同名规则被划线覆盖 | 维护者 DevTools Styles 截图与既有计算样式 JSON |
| Tailwind 原生交互 | Chrome 156 三模式可信 Button/Input/Details/Dialog 事件、焦点采样，以及可信 `beforematch` 和 `hidden` 属性移除 | 维护者逐页 Console JSON |
| UnoCSS 两套原生交互 | 维护者确认两套均按约定完成并通过 | **人工验收反馈**；当前未附逐模式原始事件 JSON |
| Vue/React 生态消费者 | Vue + Element Plus、React + Ant Design 真实 tarball 构建及 Chrome 156 静态 UI 对照既有通过记录 | [生态验证记录](W06_ECOSYSTEM_LOCAL_VERIFICATION.md) |
| TDesign 对照 | 维护者此前确认已完成 | **人工完成反馈**；详细浏览器矩阵未在本次提供 |
| 其他浏览器的回归执行 | 维护者确认回归完成并已正式验收归档 | **管理验收反馈**；当前会话未附逐目标 UA、OS、设备、版本、结果清单 |

## 2. 浏览器支持声明的证据边界

既定最低**测试目标**为 Chrome/Edge 120、Firefox 121、Safari 17.2 与相应核心移动浏览器版本，见 [浏览器支持边界](BROWSER_REVIEW.md) 和 [Baseline 2023 映射研究](BASELINE_2023_MAPPING.md)。

- 既有 Chrome 120、Firefox 121 的早期 R-003 T0/T1 对照资料应按原有数据引用；这不代表每个生态 Fixture 均在这些版本上完成相同测试。
- 当前无法从本次维护者完成反馈推导出 Edge 120、真实 Safari 17.2、iOS Safari、Android 浏览器、强制色、减少动效及全部 F-001～F-010 子项的**逐项可复核 PASS**。
- Playwright WebKit 的执行结果不能当作真实 Safari（尤其 iOS Safari）的实测结果。
- **正式验收归档与对外宣称兼容特定浏览器最低版本是两个不同决定**。验收完成可以由维护者确认；对外浏览器支持范围仍须引用相应版本及设备上的可追溯数据，不得捏造或自行补齐。

## 3. 结项决定

维护者已经明确表示完成正式验收归档。基于该结论，**W-06 按维护者签收的工作项结项**，Issue #7 已标记为 `Closed — completed`；这不是声称每条历史复合清单均在本轮获得了额外日志，也不是在没有逐平台证据的情况下冻结公开支持矩阵。

本次仓库同步仅更新文档与工作项状态：

- 不修改 `src/normalize.css`、根依赖或实际打包入口。
- 不增加任何 CI、GitHub Actions 或发布工作流。
- 不合并分支，不发布 npm、不创建 GitHub Release。
- 未来如需对外发布兼容性承诺，另行审阅支持矩阵与相关证据；该审核不自动推翻维护者已完成的 W-06 管理验收。

## 4. 相关记录

- [W-06 Reset 验证记录](W06_RESET_LOCAL_VERIFICATION.md)
- [W-06 生态消费者验证记录](W06_ECOSYSTEM_LOCAL_VERIFICATION.md)
- [W-06 T2 浏览器对照](W06_T2_LOCAL_VERIFICATION.md)
- [浏览器支持边界](BROWSER_REVIEW.md)
- [本地浏览器历史验证](LOCAL_BROWSER_RUN_20261104.md)
- [执行环境与门槛](../HARNESS.md)
- [长期项目上下文](../PROJECT_CONTEXT.md)

**状态说明**：本索引基于仓库可读取文件及维护者本次确认编制；未接收另存于仓库外的正式签核文档，因此不虚构签核人签名、附件编号、具体设备清单或独立测试结果。
