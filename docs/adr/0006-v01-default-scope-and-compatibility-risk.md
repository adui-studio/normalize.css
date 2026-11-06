# ADR-0006 — v0.1.0 默认规则范围及历史浏览器兼容风险（提案）

- **状态**：Proposed（2026-11-06；**维护者尚未正式批准**）
- **日期**：2026-11-06
- **适用议题**：[Issue #18](https://github.com/adui-studio/normalize.css/issues/18)
- **基线**：`main@304b6e45ecbdfb7676831bf06cbc6c6ce320ab38`、已正式发布 `@adui/normalize.css@0.0.3`。`v0.0.3` 发行源码为 `f5c08642e1ab6eaa1cb3d84782485f0298ae77be`。
- **关联**：[ADR-0001](0001-css-base-strategy.md) · [ADR-0004](0004-browser-support-policy.md) · [36 条规则准入复审](../research/V01_RULE_ADMISSION_REVIEW_20261106.md) · [R-007/R-008 专项](../research/R007_R008_COMPATIBILITY_V003.md) · [发行规范](../RELEASING.md)
- **授权边界**：本文件是**待决策记录**。创建/合并文档 PR、批准本 ADR、批准 `0.1.0` 版本升级、批准 npm 发布及 Git Tag/Release 分别是**不同动作**；不得相互推定。不新增 CI。

## 1. 需要裁定的问题

已发布 `v0.0.3` 包含默认 Normalize 三条 CSS 规则与显式可选 Reset、Forms、A11y、All。旧 36 条规则已完成历史筛选，现有研究结论为 **3 默认 / 17 暂缓 / 8 历史可选方向 / 8 排除默认**；历史“可选方向”不等于发布后每个模块逐字实现候选重置。

下一里程碑需要回答：

1. `0.1.0` 的“默认 Normalize 完整”是否允许继续只有 R-003、R-007、R-008，还是必须引入新的、具有可复现必要性的差异修复？
2. 旧 Safari 与旧 Blink 的适用性证据尚不完整时，是否保留已发行 R-007/R-008，同时避免承诺没有被证据覆盖的最低浏览器版本？
3. 哪些验收属于**正式范围冻结**，哪些属于**未来确定发布提交上的工程验证和独立发行授权**？

## 2. 可选方案

| 方案 | 范围与兼容策略 | 收益 | 成本/风险 | 本提案态度 |
| --- | --- | --- | --- | --- |
| **A · 保守冻结三规则** | 默认保持 R-003/R-007/R-008；可选模块显式 opt-in；不公开承诺未经逐版本确认的最低版本；把旧 Safari/旧 Blink 具体风险记录并保留重开路径 | 稳定、低侵入、保留已发行用户契约 | 不能宣称 R-007 已修复全部旧 Safari；R-008 在新版 Blink 可能冗余 | **推荐（待批准）** |
| B · 严格承诺历史最低版本 | 在冻结范围或发布前，对要承诺的 Chrome/Edge 120、Safari 17.2 等真实设备/版本补足 T0/T2、CSSOM、视觉与交互证据；如确有缺陷再评审最小修复 | 有条件提供明确最低版本保证 | 老设备环境、复现、产品行为修订与长期维护成本更高 | 仅当维护者明确要求特定最低版本时采用 |
| C · 扩大默认规则 | 将 R-009～R-016 等历史候选按完整性数量批量实现 | 规则数量增加 | 无明确现代 UA 必要性，易破坏原生控件、HTML 语义和框架样式 | **不推荐** |

**建议裁定内容（尚未生效）**：选择 A；默认模块三条规则作为本里程碑**候选冻结范围**，不是“全部浏览器已通过”或“现在允许发布 `0.1.0`”。新增规则必须另有具体 UA 差异和独立审查，不作为冻结的隐含任务。

## 3. 三条默认规则与风险边界

| 规则 | 已发行实现 | 当前可证事实 | 风险接受建议 | 触发重新评审 |
| --- | --- | --- | --- | --- |
| **R-003** | `b,strong {font-weight:bolder}` | 仓库历史 Chrome 120、Firefox 121 的限定范围实测及 WHATWG 建议渲染依据；相对字重不等于固定 700 | 保留，不改变强弱语义 | 特定浏览器中相对字重错误或作者样式覆盖冲突的可复现证据 |
| **R-007** | `:where(abbr[title]) {text-decoration:underline dotted}` | [WebKit Bug 277889](https://bugs.webkit.org/show_bug.cgi?id=277889) 记载 Safari 17.6.1 旧问题及通过 **UA 样式前缀** 修复；[Safari 26.2](https://webkit.org/blog/17640/webkit-features-for-safari-26-2/) 才完善 `text-decoration` 四长属性完整简写 | **保留现行已发布声明；接受旧 Safari 上可能达不到点状下划线的未证风险**，不公开宣称 Safari 17.2/17.6.1 已获本库修复 | 明确受支持旧 Safari 的真实 T0/T2 显示该声明不起作用，或作者下划线覆盖被破坏；另开最小修复提案 |
| **R-008** | `:where(table) {border-color:currentColor}` | [Chrome 149](https://developer.chrome.com/release-notes/149)、[Edge 149](https://learn.microsoft.com/en-us/microsoft-edge/web-platform/release-notes/149) 已公布移除 UA `table` 的灰色边框规则；旧 Blink 行为改善仍需确切版本的本库 T0/T2 | **保留兼容旧 Blink 的可能收益**；承认新版 Chromium 冗余，不声明所有旧版已通过 | 真实旧 Blink 的 T0/T2 不改善或引发作者显式边框、旧 HTML `border` 属性行为回归 |

以上“风险接受”仅适用于**不对外作特定旧版本保证的条件**；不等于把未知实测结果写成 PASS。未来若要公开承诺旧 Safari 17.2 / Chrome 120 等具体最低版本，应重新检查此决议及 ADR-0004 的七个内部测试目标。

## 4. 默认与可选模块边界

- 默认 `@adui/normalize.css` 和 `@adui/normalize.css/normalize.css` 仅包含 R-003、R-007、R-008；**不**自动导入 Reset / Forms / A11y。
- `/reset.css` 的 R-022/023/024 只实现较保守的部分行为：清标题/列表上下间距、媒体最大 inline size；**仍保留标题字号/字重、列表 marker/缩进和媒体默认行内语义**。不为了匹配旧候选名字额外清空这些原生行为。
- `/forms.css` 的控件 margin 和文件选择按钮字体继承是**显式可选**实现，并没有将 R-012/R-015 准入默认。
- `/a11y.css` 可见焦点及系统偏好增强保持 opt-in；不得无条件移除原生焦点或用 `!important` 禁用全部动画。
- `/all.css` 现有导入顺序与六个 CSS-only exports 保持不变；不增加 JS 运行时、全局主题、根字体强制设置或 CI。

## 5. 决策与发行 Gate（独立状态）

| Gate | 交付内容 | 截至本提案状态 |
| --- | --- | --- |
| **D-01** 范围签收 | 维护者明确选择 A/B/C，批准或拒绝三规则冻结及 3/17/8/8 归属、可选模块部分实施的设计取舍 | **待维护者裁定**；PR #29 仅完成研究合并 |
| **D-02** 兼容风险签收 | 明确 R-007/R-008 的旧版风险接受范围，决定是否对外提供某些最低浏览器版本保证 | **待维护者裁定**；S/U 官方资料已核对，目标旧版原始 T0/T2 附件仍不全 |
| **D-03** 原生行为与集成 | 以默认 15 点 T0/T2、M0/M1、组件库和作者 CSS 覆盖回归检查新增差异及现有风险 | **已有历史工程与维护者管理验收**，不冒称每个历史目标版本的独立 PASS |
| **D-04** 固定发布 SHA 工程验证 | 当未来真的启动 `0.1.0` 时，绑定当次准确 HEAD，完成本机 `vp check`、`verify:mvp`、`vp build`、tarball 与消费检查及干净工作区 | **尚未执行针对 `0.1.0` 的工程验收**；不能复用 `0.0.3` 的 61/61 或 PR #28 的 64/64 冒充 |
| **D-05** 对外说明 | README / npm 文案只陈述有证据的浏览器范围，Baseline 2023 仍是特性参考而非经验证最低支持承诺 | **既有政策有效；未来版本需要单独审核** |
| **D-06** 版本与发行独立授权 | 维护者另行批准 `package.json` 版本、发布前检查、npm、对应 Git Tag/Release，版本号和发行 SHA 保持一致 | **未授权；当前唯一正式版本仍为 `0.0.3`** |
| **D-07** 零 CI 与最小改动 | 不新增任何工作流、依赖、产品规则或无关配置 | **本提案仅文档** |

**Gate 与版本意义**：即使批准了本 ADR 的方案 A，也**只能说明范围与风险处置路径获得授权**。不得自动将本 PR 改为 `0.1.0` 开发完成，也不得创建 Release。只有在 D-01～D-06 按实际提交逐项满足后，才能提出单独的版本发行申请。

## 6. 维护者待签收决定

当前记录为 **Proposed**；未经维护者明确确认不填“Accepted”：

- **范围选择**：A（保留默认三条） / B（先完成历史最低版本保证） / C（需要新的必要规则证据）——**待选**。
- **旧版支持声明**：不公开承诺特定旧 Safari/Blink 最低版本 / 需要承诺并补证——**待选**。
- **是否接受已发布可选 Reset/Forms/A11y 的有意保守行为**：接受 / 需修改——**待选**。
- **`0.1.0` 版本开发、npm、Tag/Release**：均为**单独后续授权**，本文件无权批准。

批准后应仅将本 ADR 状态更新为 Accepted（及必要的正式文档同步），**不在同一个审批动作里修改产品 CSS、升级版本或发布**。

## 7. 已核对来源与未解决事项

**仓库事实**：`src/*.css`、`package.json`、[36 条规则复审](../research/V01_RULE_ADMISSION_REVIEW_20261106.md)、[ADR-0004](0004-browser-support-policy.md)、[RELEASING](../RELEASING.md) 和 PR #28/#29 的管理验收/研究归档。

**厂商一手资料**：

- [WebKit Bug 277889](https://bugs.webkit.org/show_bug.cgi?id=277889)（历史 Safari abbr 缺陷及加前缀的 UA 修复）。
- [WebKit Safari 26.2 正式说明](https://webkit.org/blog/17640/webkit-features-for-safari-26-2/)（完整 `text-decoration` 简写）。
- [Chrome 149 Release Notes](https://developer.chrome.com/release-notes/149) 和 [Edge 149 Release Notes](https://learn.microsoft.com/en-us/microsoft-edge/web-platform/release-notes/149)（移除 table UA `border-color: gray`）。

**仍未知**：本库旧 Safari 17.2/17.6.1、Chrome/Edge 120 上 R-007/R-008 全部 T0/T2 的原始可复核表现；维护者是否要求正式承诺特定最低版本；下一次版本发布 SHA 与全量工程/消费者实际验证。未知结果不得填写 PASS。
