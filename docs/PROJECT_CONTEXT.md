# PROJECT_CONTEXT — 项目长期上下文

**最近更新**：2026-11-04  
**当前阶段**：五项 ADR 已接受／最低浏览器测试目标已批准／尚未开发

## 1. 项目概况

- 名称：`@adui/normalize.css`
- GitHub：[adui-studio/normalize.css](https://github.com/adui-studio/normalize.css)
- 类型：计划中的 CSS 标准化 npm 库
- 目标：吸收主流 Normalize/Reset 方案中有证据的优点，舍弃过时、过度或高侵入的默认规则。
- 已确认许可证：MIT（见根目录 [LICENSE](../LICENSE)）。
- 团队沟通语言：中文优先，英文作为必要的项目概览。

## 2. 事实状态

| 项目 | 状态 | 证据/说明 |
| --- | --- | --- |
| GitHub 仓库 | 已创建 | 根目录已有 LICENSE |
| LICENSE | 已存在 | MIT，Copyright © 2026 ADui Studio |
| 八类工程资产 | 文档初始化 | [AGENTS](../AGENTS.md)、需求、SDD、架构、上下文、代码地图、Skills、Harness |
| CSS 源码 | **未实现** | 仓库无 src/ 或发布 CSS 文件 |
| package.json、依赖、构建脚本 | **未实现** | Vite+ 已选为开发工具链（ADR-0005 Accepted），但未安装、未运行、未生成配置 |
| 自动化测试、浏览器回归 | **未实现/未运行** | 只规划本地运行，不得声称通过 |
| CI | **明确不规划** | 项目约束：不增加任何 CI |
| npm 包发布、版本号 | **未发布/未确定** | 不能将先前讨论的草案版本当成仓库发布事实 |
| 架构方案 | **已接受／未实现** | ADR-0001～0005 均 Accepted；[MVP 实施计划](plans/MVP_IMPLEMENTATION_PLAN.md) 已建立，浏览器兼容承诺仍待验证 |
| 自研 Skills | **未创建** | 目前没有项目自研技能 |
| 第三方 Skills | **评审分支已纳入** | 3 个 awesome-copilot 原版 Skill，CLI 未执行，本机发现未验证；见 [索引](SKILLS.md) |
| Harness | **未搭建** | 仅建立 [验证计划](HARNESS.md) |

## 3. 已接受架构与仍待验证的事项

- **ADR-0001 Accepted**：默认 Normalize，长期可选 Reset/A11y/Forms，首版不交付可选模块。
- **ADR-0002 Accepted**：首版默认不内置 `@layer`，按规则评估 `:where()`。
- **ADR-0003 Accepted**：首版只规划 `@adui/normalize.css` 默认根入口；`all.css` 等路径延期。
- **ADR-0004 Accepted**：固定 Baseline 2023 作为特性准入参考，七项 [最低浏览器测试目标](research/BASELINE_2023_MAPPING.md) 已批准并依据时间线核对；实际兼容性声明、OS/设备/WebView 仍未实测。
- **ADR-0005 Accepted**：开发工具链统一使用 Vite+，具体版本、纯 CSS 打包方式和本地运行结果尚未确定。
- **W-02 部分研究**：已批准最低测试目标包含旧 Blink/WebKit，因此 R-003 成为首版必测条件性候选；R-004 不宜在默认 Normalize 中覆盖用户等宽字号偏好。[专项证据](research/RULE_EVIDENCE_R003_R004.md) 与 [本地执行指南](research/R003_R004_LOCAL_VERIFICATION.md) 已建立，真实浏览器复现未执行。
- 仍需实测 Vue/React、Element Plus、Ant Design、TDesign、Tailwind/UnoCSS Reset 兼容性；所有候选规则均未获准实现。

## 4. 当前工作与后续顺序

1. **已完成决策和任务拆分**：ADR-0001～0004 Accepted；[W-01～W-07 MVP 计划](plans/MVP_IMPLEMENTATION_PLAN.md) 已建立；GitHub [Issue #2～#8](https://github.com/adui-studio/normalize.css/issues) 均为待执行任务。
2. **研究任务（可继续文档工作）**：W-01 七项最低目标已批准、Apple 官方确认 Safari 17.2 平台范围；实际浏览器/OS/设备尚未验证。W-02 已有 R-003/004 的标准及源码证据，R-003 需在目标最低版本实测，R-004 不进入默认字号统一。
3. **开发阶段（需新指令）**：W-03 已形成 [Vite+ 本地 Harness 设计](plans/VITEPLUS_LOCAL_HARNESS_DESIGN.md)，W-04 已形成 [CSS-only 包交付研究](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)；真实安装、Fixture、包导出、CSS 和兼容性回归均未启动。
4. **发布阶段（另行授权）**：W-07 质量和许可证审核；npm 和 Release 单独批准；不增加 CI。

## 5. 当前风险与阻塞

- **2026-11-04 新增研究来源**：main 分支已建立 [TDesign、Tailwind v4 Preflight、UnoCSS Reset 固定源码审查](research/2026-11-04-reset-source-audit.md)；已识别层叠、样式来源和原生交互的待证风险，但不能视为浏览器或组件库的实际测试 PASS。相关隔离验证原则已关联 [HARNESS §6](HARNESS.md)。

- 浏览器最低**测试目标**已批准但**未实测**，系统 WebView、真实硬件和正式发布支持声明仍未确定。
- npm `@adui` 作用域的发布权限未验证。
- 首版不内建 Layers 的策略已接受，实际选择器层叠、消费者覆盖和组件库兼容性仍需实测。
- 第三方规则借鉴需独立审查许可证、差异证据和破坏性影响。
- 本轮只能完成文档一致性检查，不能验证运行时与视觉兼容性。

## 6. 文档索引和变更记录

[README](../README.md) · [AGENTS](../AGENTS.md) · [REQUIREMENTS](REQUIREMENTS.md) · [ARCHITECTURE](ARCHITECTURE.md) · [SDD](SDD.md) · [CODEBASE_MAP](CODEBASE_MAP.md) · [SKILLS](SKILLS.md) · [HARNESS](HARNESS.md) · [ADR](adr/0001-css-base-strategy.md) · [文档校验](DOCUMENTATION_VALIDATION.md)

| 日期 | 事件 | 备注 |
| --- | --- | --- |
| 2026-11-03 | 初始工程文档创建于 adui-dev/normalize.css | 仅文档，无 CSS 或 CI |
| 2026-11-03 | 迁移文档到 adui-studio/normalize.css | 保留目标仓库原有 LICENSE；原仓库未删除，Git 历史独立 |
| 2026-11-03 | 文档评审分支增加规则、浏览器、Layers 研究 | 未合并 main；全部为研究/Proposed，明确不增加 CI |
| 2026-11-03 | 核验首批 11 条候选的上游规范与修复记录 | R-007/008/009/010/011 调整为暂缓，未实测；见 [证据记录](research/RULE_EVIDENCE_BATCH1.md) |
| 2026-11-03 | 纳入 3 个 awesome-copilot Skills、Issue/PR 模板和第二批表单规则审查 | 文档评审分支，未合并 main；不增加 CI、CSS 或 npm 依赖 |
| 2026-11-03 | 第三批 17 条规则资料核查及 ADR-0003 初稿 | 36 条初始候选均已进行首轮资料研究；未实测、未接受 ADR、未合并 main |
| 2026-11-03 | 增加浏览器支持 ADR-0004 与开发准入清单 | 历史记录：当时均未批准 |
| 2026-11-03 | 维护者接受四项 ADR 并要求转化首版实施任务 | ADR-0001～0004 Accepted，W-01～W-07 未实施 |
| 2026-11-03 | 在 GitHub 创建 W-01～W-07 对应 Issues #2～#8 | 任务待执行，未开始实现；不增加 CI |
| 2026-11-03 | 维护者指定 Vite+ 开发工具链，并完成 Baseline 2023 固定映射数据核查 | ADR-0005 Accepted；工具链未安装，候选最低版本非实际浏览器兼容承诺 |
| 2026-11-03 | W-02 完成 R-003/R-004 第一轮 UA 源码与用户偏好研究 | R-003 条件性候选，R-004 默认不采纳；未执行本项目真实浏览器测试 |
| 2026-11-03 | 维护者批准 Baseline 2023 七项最低测试目标，补充 WebKit 2023 UA 证据 | R-003 首版必测，R-004 维持默认不采纳；正式浏览器兼容声明仍未验证 |
| 2026-11-03 | W-02 补充 Firefox 121 发行日期前的 Gecko 源码和官方旧版浏览器获取线索 | 本地验证执行指南已形成；未安装旧浏览器或运行 Fixture |
| 2026-11-03 | W-03 补充 Vite+ 本地 Harness 开发前设计 | 仅更新计划，不创建 package.json、Fixture、源码、依赖或 CI |
| 2026-11-03 | W-04 完成纯 CSS 根入口、exports、sideEffects 与消费者验收方案研究 | 仅新增方案文档；未运行 vp pack、未建包配置与 CSS、未加 CI |

**更新约定**：重大进度、已完成验证、关键决策、阻塞与下一阶段变化时更新；事实来源优先实际仓库、命令输出与正式 ADR，而非历史聊天。

## 7. 迁移来源

本次文档迁移来源于 [adui-dev/normalize.css 的初始化提交](https://github.com/adui-dev/normalize.css/commit/7f9d4a1af3ea7fea6fb978378f93390ecd47271f)。目标仓库已独立存在，因此采用文档内容迁移而非 GitHub 原生 Transfer；两个仓库的 Git 历史没有合并。
