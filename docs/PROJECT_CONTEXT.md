# PROJECT_CONTEXT — 项目长期上下文

**最近更新**：2026-11-04  
**当前阶段**：五项 ADR 已接受／W-03 本地 Harness 已验收／W-04 包交付验收已结项（Issue #5 Closed）／W-05 规则评审进行中／尚未发布

## 1. 项目概况

- 名称：`@adui/normalize.css`
- GitHub：[adui-studio/normalize.css](https://github.com/adui-studio/normalize.css)
- 类型：计划中的 CSS 标准化 npm 库
- 目标：吸收主流 Normalize/Reset 方案中有证据的优点，舍弃过时、过度或高侵入的默认规则。
- 已确认许可证：MIT（见根目录 [LICENSE](../LICENSE)）。
- 团队沟通语言：中文优先，英文作为必要的项目概览。

## 2. 事实状态

| 项目                         | 状态               | 证据/说明                                                                                                   |
| ---------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| GitHub 仓库                  | 已创建             | 根目录已有 LICENSE                                                                                          |
| LICENSE                      | 已存在             | MIT，Copyright © 2026 ADui Studio                                                                           |
| 八类工程资产                 | 文档初始化         | [AGENTS](../AGENTS.md)、需求、SDD、架构、上下文、代码地图、Skills、Harness                                  |
| CSS 源码                     | **首条已实现**     | 开发分支 `src/normalize.css` 仅包含 R-003；R-004 保留原生默认                                               |
| package.json、依赖、构建脚本 | **部分实现**       | 单根 CSS、Vite+ 打包已实测；真实包与生产消费者测试均通过；仍 private                                        |
| 自动化测试、浏览器回归       | **部分实现**       | 离线 Node 26/26、真实包 1/1、Vite+ 消费 1/1；浏览器仅部分完成                                               |
| CI                           | **明确不规划**     | 项目约束：不增加任何 CI                                                                                     |
| npm 包发布、版本号           | **未发布/未确定**  | 不能将先前讨论的草案版本当成仓库发布事实                                                                    |
| 架构方案                     | **已接受／未实现** | ADR-0001～0005 均 Accepted；[MVP 实施计划](plans/MVP_IMPLEMENTATION_PLAN.md) 已建立，浏览器兼容承诺仍待验证 |
| 自研 Skills                  | **未创建**         | 目前没有项目自研技能                                                                                        |
| 第三方 Skills                | **评审分支已纳入** | 3 个 awesome-copilot 原版 Skill，CLI 未执行，本机发现未验证；见 [索引](SKILLS.md)                           |
| Harness                      | **部分实现**       | 已有 Fixture 与测试；首批 CSS 构建和定向 Node 测试通过；Vite+ 最新改动未重跑                                |

## 3. 已接受架构与仍待验证的事项

- **ADR-0001 Accepted**：默认 Normalize，长期可选 Reset/A11y/Forms，首版不交付可选模块。
- **ADR-0002 Accepted**：首版默认不内置 `@layer`，按规则评估 `:where()`。
- **ADR-0003 Accepted**：首版只规划 `@adui/normalize.css` 默认根入口；`all.css` 等路径延期。
- **ADR-0004 Accepted**：固定 Baseline 2023 作为特性准入参考，七项 [最低浏览器测试目标](research/BASELINE_2023_MAPPING.md) 已批准并依据时间线核对；实际兼容性声明、OS/设备/WebView 仍未实测。
- **ADR-0005 Accepted**：开发工具链统一使用 Vite+，Vite+ 1.4.0 已在维护者本机运行；纯 CSS 打包方式仍未确定；最近一次本机完整格式/Lint 检查已通过，但新提交的测试改动未重验。
- **W-02 部分研究**：已批准最低测试目标包含旧 Blink/WebKit，因此 R-003 成为首版必测条件性候选；R-004 不宜在默认 Normalize 中覆盖用户等宽字号偏好；Chrome 156 T0/T1/T1b 已观察到 13px/13px/16px 的局部差异。[专项证据](research/RULE_EVIDENCE_R003_R004.md) 与 [本地执行指南](research/R003_R004_LOCAL_VERIFICATION.md) 已建立；Chrome 156 已完成 R-003 六组真实 JSON 对照（0 差异）；Chrome for Testing 120.0.6099.109 / Windows 11 的真实 JSON 已独立核对（4 组差异），Firefox 121 的真实 T0/T1 JSON 与 Windows CLI 实测均为零差异；Edge 120、Safari 17.2 与移动端、UA 声明来源和生态回归尚未实测。
- 仍需实测 Vue/React、Element Plus、Ant Design、TDesign、Tailwind/UnoCSS Reset 兼容性；所有候选规则均未获准实现。

## 4. 当前工作与后续顺序

1. **已完成决策和任务拆分**：ADR-0001～0004 Accepted；[W-01～W-07 MVP 计划](plans/MVP_IMPLEMENTATION_PLAN.md) 已建立；GitHub [Issue #2～#8](https://github.com/adui-studio/normalize.css/issues) 均为待执行任务。
2. **研究任务（可继续文档工作）**：W-01 七项最低目标已批准、Apple 官方确认 Safari 17.2 平台范围；实际浏览器/OS/设备尚未验证。W-02 已有 R-003/004 的标准及源码证据，R-003 需在目标最低版本实测，R-004 不进入默认字号统一。
3. **开发阶段（已授权启动）**：W-03 已实现 Fixture/单测并记录环境阻塞，见 [Harness 设计与进度](plans/VITEPLUS_LOCAL_HARNESS_DESIGN.md)；W-04 已开始 [CSS-only 包元数据与打包白名单验证](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)，但真实包导出、Vite+/Webpack 消费验证与 CSS 兼容回归尚未实施。
4. **发布阶段（另行授权）**：W-07 质量和许可证审核；npm 和 Release 单独批准；不增加 CI。

## 5. 当前风险与阻塞

- 浏览器最低**测试目标**已批准，Chrome 120 与 Firefox 121 已完成 R-003 局部计算值验证；Edge 120、Safari 17.2、移动端、系统 WebView、真实硬件和正式发布支持声明仍未验收。
- npm `@adui` 作用域的发布权限未验证。
- 首版不内建 Layers 的策略已接受，实际选择器层叠、消费者覆盖和组件库兼容性仍需实测。
- 第三方规则借鉴需独立审查许可证、差异证据和破坏性影响。
- 当前已具备本机 Node/Vitest 静态与合成包测试，尚不足以证明目标旧版浏览器、完整视觉行为、组件库兼容或正式 CSS 交付通过。

## 6. 文档索引和变更记录

[README](../README.md) · [AGENTS](../AGENTS.md) · [REQUIREMENTS](REQUIREMENTS.md) · [ARCHITECTURE](ARCHITECTURE.md) · [SDD](SDD.md) · [CODEBASE_MAP](CODEBASE_MAP.md) · [SKILLS](SKILLS.md) · [HARNESS](HARNESS.md) · [ADR](adr/0001-css-base-strategy.md) · [文档校验](DOCUMENTATION_VALIDATION.md)

| 日期       | 事件                                                                     | 备注                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-03 | 初始工程文档创建于 adui-dev/normalize.css                                | 仅文档，无 CSS 或 CI                                                                                                                                                   |
| 2026-11-03 | 迁移文档到 adui-studio/normalize.css                                     | 保留目标仓库原有 LICENSE；原仓库未删除，Git 历史独立                                                                                                                   |
| 2026-11-03 | 文档评审分支增加规则、浏览器、Layers 研究                                | 未合并 main；全部为研究/Proposed，明确不增加 CI                                                                                                                        |
| 2026-11-03 | 核验首批 11 条候选的上游规范与修复记录                                   | R-007/008/009/010/011 调整为暂缓，未实测；见 [证据记录](research/RULE_EVIDENCE_BATCH1.md)                                                                              |
| 2026-11-03 | 纳入 3 个 awesome-copilot Skills、Issue/PR 模板和第二批表单规则审查      | 文档评审分支，未合并 main；不增加 CI、CSS 或 npm 依赖                                                                                                                  |
| 2026-11-03 | 第三批 17 条规则资料核查及 ADR-0003 初稿                                 | 36 条初始候选均已进行首轮资料研究；未实测、未接受 ADR、未合并 main                                                                                                     |
| 2026-11-03 | 增加浏览器支持 ADR-0004 与开发准入清单                                   | 历史记录：当时均未批准                                                                                                                                                 |
| 2026-11-03 | 维护者接受四项 ADR 并要求转化首版实施任务                                | ADR-0001～0004 Accepted，W-01～W-07 未实施                                                                                                                             |
| 2026-11-03 | 在 GitHub 创建 W-01～W-07 对应 Issues #2～#8                             | 任务待执行，未开始实现；不增加 CI                                                                                                                                      |
| 2026-11-03 | 维护者指定 Vite+ 开发工具链，并完成 Baseline 2023 固定映射数据核查       | ADR-0005 Accepted；工具链未安装，候选最低版本非实际浏览器兼容承诺                                                                                                      |
| 2026-11-03 | W-02 完成 R-003/R-004 第一轮 UA 源码与用户偏好研究                       | R-003 条件性候选，R-004 默认不采纳；未执行本项目真实浏览器测试                                                                                                         |
| 2026-11-03 | 维护者批准 Baseline 2023 七项最低测试目标，补充 WebKit 2023 UA 证据      | R-003 首版必测，R-004 维持默认不采纳；正式浏览器兼容声明仍未验证                                                                                                       |
| 2026-11-03 | W-02 补充 Firefox 121 发行日期前的 Gecko 源码和官方旧版浏览器获取线索    | 本地验证执行指南已形成；未安装旧浏览器或运行 Fixture                                                                                                                   |
| 2026-11-03 | W-03 补充 Vite+ 本地 Harness 开发前设计                                  | 仅更新计划，不创建 package.json、Fixture、源码、依赖或 CI                                                                                                              |
| 2026-11-03 | W-04 完成纯 CSS 根入口、exports、sideEffects 与消费者验收方案研究        | 仅新增方案文档；未运行 vp pack、未建包配置与 CSS、未加 CI                                                                                                              |
| 2026-11-03 | 维护者授权开始开发，独立分支实现 W-03 初始本地 Fixture 与 Vite+ 工程配置 | Node 测试 2/2 通过；Vite+ 安装/浏览器运行受环境限制，未添加 Normalize CSS 或 CI                                                                                        |
| 2026-11-03 | 继续 W-03 离线契约测试与 W-04 包元数据预检                               | 本地 Node 8/8 通过，npm pack dry-run 退出码 0；真实 CSS/exports/浏览器测试未完成                                                                                       |
| 2026-11-03 | W-04 增加真实 npm 离线合成 CSS 包打包、安装和根路径封装测试              | 本地 Node 总计 10/10 通过；只验证临时合成包，真实 Normalize CSS/Vite+/Webpack 尚未验证                                                                                 |
| 2026-11-03 | W-02/W-03 增加 R-003 的 T0/T1 JSON 比较器、CLI 与合成数据回归            | 当前离线 Node 测试 18/18 通过；仅测试比较器逻辑，实际旧浏览器证据仍无                                                                                                  |
| 2026-11-03 | 修复 R-003 输入文件先读取后限长的问题                                    | 原 18 项复测通过，新增 4 项边界测试单独通过；完整 22 项未同批运行，未执行真实浏览器验证                                                                                |
| 2026-11-04 | 维护者本机完成 Vite+ 和 Chrome 156 第一轮执行                            | Node 22/22、Vitest 5/5、dev 启动；check 因 66 个格式问题失败；R-003 无差异，R-004 T1 未如预期生效，旧版目标待测。见 [运行记录](research/LOCAL_BROWSER_RUN_20261104.md) |
| 2026-11-04 | R-004 Console 复核与独立字体族 T1b 对照页面                              | T1 CSSOM 已包含 1em 声明、当前与探针均为 13px；新增 T1b 字体族偏好对照                                                                                                 |
| 2026-11-04 | 维护者提交 Chrome 156 的 T1b 真实截图                                    | T0/T1 四元素均为 13px；T1b 四元素均为 16px，fontFamily 为 monospace, monospace；仅为当前环境计算样式，R-004 默认不准入，旧版目标仍未实测                               |
| 2026-11-04 | W-03 配置 Vite+ 格式检查隔离上游 Skills                                  | `vite.config.ts` 增加 `fmt.ignorePatterns` 排除 `.agents/skills/**`；第一方仍纳入检查；初始 66 文件为旧基线                                                            |

| 2026-11-04 | 维护者第二轮本机静态检查与测试 | `vp fmt --check` / `vp check` 仍 FAIL（报告 54 个第一方文件）；离线 Node 23/23、Vitest 6/6 PASS；Windows `DEP0190` 警告待处理，未执行正式 CSS 打包/旧版浏览器矩阵 |

**最新状态补充（2026-11-04）**：R-003 新增 Chrome for Testing 120.0.6099.109、Windows 11 25H2 真实 T0/T1 JSON：父级 600/700 下 T0 700、T1 900，四组计算字重差异；数据已独立解析，CLI 对该批文件的终端执行日志尚未收到。详见[研究记录 §2.2](research/LOCAL_BROWSER_RUN_20261104.md)。维护者完成 Windows 修复后回归：`vp check` 54 文件格式正确、11 文件 Lint 无错误，`vp test` 6/6、离线 Node 23/23、独立 npm 烟测 1/1 均通过，`DEP0190` 未再出现。随后真实运行 R-003 T0/T1 JSON 比较器，得到 `NO_COMPUTED_DIFFERENCE`、零差异（Chrome 156，见[记录 §2.1](research/LOCAL_BROWSER_RUN_20261104.md)）。这不是 Chrome/Edge 120、Firefox 121、Safari 17.2 及移动端的兼容验收。W-03 仍需最低浏览器证据，W-04 仍缺正式 CSS 包与消费端验收，无 CI、无发布。

**最新补充（2026-11-04，Firefox 121）**：维护者 Windows Firefox 121 的 R-003 T0/T1 CLI 结果为 `NO_COMPUTED_DIFFERENCE`、0 差异/0 候选失败；两份原始 JSON 已独立解析核对。具体指纹与六组数值见[本机记录 §2.4](research/LOCAL_BROWSER_RUN_20261104.md)。Chrome 120 与 Firefox 121 的局部真实测试并不等于所有目标浏览器兼容性已通过；R-003 继续评审，不准入发布 CSS。

**Firefox 121 的 R-004 补充（2026-11-04）**：维护者使用 PowerShell 读取 T0/T1/T1b 三组 JSON，四个等宽元素在三页的父级和自身计算字号均为 16px；T1b 仅计算字体族变为 `monospace, monospace`。原始三份 JSON 本轮未上传，助手没有独立校验。另从 Firefox `about:support` JSON 核实正式 release `121.0`、Build ID `20231211174248`、Windows OS build `26200`；完整报告不公开。见[运行记录 §3.2.1](research/LOCAL_BROWSER_RUN_20261104.md)。R-004 继续不准入默认 CSS，Chrome 120/Edge 120/Safari 17.2 的 R-004 同类实验及用户偏好模拟仍缺。

**R-004 Chrome 120 补充（2026-11-04）**：维护者从现有三个 Fixture 的本地 JSON 读取到四元素相同结果：T0/T1 为 13px、T1b 为 16px，与 Chrome 156 一致；Firefox 121 的三页均为 16px。Chrome 120 原始三份 JSON 未上传，记录为终端实测而非助手独立文件复核。该对照不证明用户主动修改字体偏好的结果，R-004 继续排除默认 CSS。详见[运行记录 §3.2.2](research/LOCAL_BROWSER_RUN_20261104.md)。

**首批产品代码开发（2026-11-04）**：维护者明确要求按浏览器默认使用并停止额外字体偏好专项测试。开发分支新增 `src/normalize.css`（唯一 R-003 的 `b, strong { font-weight: bolder; }`）、最初的 Node 复制脚本（后续已移除）、单一 CSS 根 `exports`，保持 `private: true`、`0.0.0`、无新增依赖及 CI。定向 Node 测试 5/5、静态 CSS 输出字节检查、离线本地 tarball 安装/根路径解析/未公开子路径拒绝已在独立 Linux Node 22.16.0 复刻目录实测通过；该运行时低于项目要求，Windows 上最新 `vp check`、完整 Node/Vitest 与实际 Vite+/Webpack 消费端验证仍待执行。R-004 不进入产品 CSS，Chrome 120/Firefox 121/Safari 等完整发布兼容范围未验收。详见[SDD](SDD.md)、[包方案](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)与[代码地图](CODEBASE_MAP.md)。

**Vite+ 构建命令迁移（2026-11-04）**：维护者确认旧版 `npm run build` 运行成功、离线 Node 25/25 PASS，并要求直接使用 `vp dev`、`vp build`、`vp pack`。已移除 `scripts/build.mjs` 及旧 build script，`vite.config.ts` 新增 Vite CSS-only 库构建配置（目标 `dist/normalize.css`）和独立 tsdown CSS-only 试验配置（`dist-pack/`，不覆盖包根导出），Git 忽略该试验目录。新定向 Node 契约测试在独立 Node 22.16.0 环境 5/5 PASS；尚未在 Windows Vite+ 1.4.0 执行迁移后的 build/pack/check/test。仍保持 private、无新依赖、无 CI、无发布。详见[W-04 记录 §7.2](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

**Vite+ 本机实测与后续修正（2026-11-04）**：维护者执行 `vp check` 55 文件格式与 11 Lint PASS，`vp test` 6/6，离线 Node 25/25，`vp dev` 成功；`vp pack` 生成仅一个 `dist-pack/normalize.css`（约 200 字节，无 JS），但 `vp build` 以 CSS 作为 Vite 库输入时触发 `cssCodeSplit: false` 错误。确认原 `dist/normalize.css` 的时间早于失败构建。开发分支已据此修改 `vite.config.ts`：`vp build` 只构建现有六张 Fixture HTML 到 `dist-fixtures/`，`vp pack` 使用实测的 CSS-only 入口生成 `dist/normalize.css`，包根导出不变。新配置在独立 Linux Node 22.16.0 中完成 Git blob 指纹匹配、定向契约测试 **6/6 PASS**，尚未重新执行 Windows 版 Vite+ build/pack。仍保持 `private: true`、无 CI、无 npm 发布。详见[W-04 记录 §7.3](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

**W-03 本地 Harness 结项（2026-11-04）**：维护者提供最终 Vite+ 1.4.0 终端结果：`vp build` 正常构建六张 HTML Fixture 与一个探针 JS 至 `dist-fixtures/`；`vp pack` 成功生成 `dist/normalize.css` 单文件（200 字节），无发布 JS；`npm run test:offline` **26/26 PASS**。此前同轮 `vp check` 55 文件格式/11 Lint PASS、`vp test` 6/6 PASS、`vp dev` 启动成功。依据[W-03 退出门槛](plans/VITEPLUS_LOCAL_HARNESS_DESIGN.md)，GitHub [Issue #4](https://github.com/adui-studio/normalize.css/issues/4) 已以 `completed` 关闭并记录范围：T0/T1 本地复现 Harness 已具备，但 T2 真实包集成、键盘焦点、hidden/dialog、移动端/真实 Safari、组件库等完整测试仍归 W-06（#7），不因关闭 W-03 视作通过。W-04（#5）仍缺 Vite+/Webpack 生产消费者和正式 npm tarball 验收；开发 Draft PR #9 依赖未合并的文档 Draft PR #1，本次不关闭/合并任一 PR、不发布 npm 或新增 CI。

**W-04 真实 tarball 验收补充（2026-11-04）**：在既有合成包烟测之外新增独立 `tests/package-real.node.test.mjs` 和 `npm run test:package`，要求先 `vp pack`。脚本对真实 `dist/normalize.css` 执行当前仓库 `npm pack --offline`、临时消费者安装、文件白名单、根导出和子路径封装验证；不会写入或发布正式 tarball，不新增依赖/CI。提交的脚本 Git blob SHA 与独立 Linux Node 22.16.0 代表性包目录运行的文件完全一致，**代表性目录 1/1 PASS**；真实 Windows 仓库测试尚未执行，故 W-04 #5 继续 Open，Vite+/Webpack 生产消费与 CSS tree shaking 仍未通过。详见[W-04 §7.4](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

**W-04 生产消费者补充（2026-11-04）**：新增 `tests/package-vite-consumer.node.test.mjs` 和 `npm run test:consumer`，在 `vp pack` 后将真实 CSS tarball 离线安装到临时独立 Vite+ 1.4.0 消费项目，以 JS 副作用导入 `@adui/normalize.css` 并执行生产构建，再检查 CSS 产物保留。新增脚本已通过 Node 语法检查和 Git blob 指纹核对，但当前环境没有 Vite+ 1.4.0，**尚未获得真实生产构建输出**；P-02 继续待实测，P-03 Webpack 5 未测。`test:consumer` 与 `test:package` 均独立于 26 项普通离线测试，不引入额外依赖/CI。详见[W-04 §7.5](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

**W-04 Windows 验收与 LF 规范（2026-11-04）**：维护者提供真实终端日志：`vp pack` 仅生成单个 `dist/normalize.css`（约 200 字节）；`npm run test:package` **1/1 PASS**，验证真实 tarball 清单、离线安装与根入口/私有子路径；`npm run test:consumer` **1/1 PASS**，验证独立 Vite+ 1.4.0 生产构建保留 CSS。P-01/P-06/P-07/P-09 已通过，P-02 生产打包子项通过（开发态及页面渲染待测），P-03 Webpack 5 尚未执行，W-04 [Issue #5](https://github.com/adui-studio/normalize.css/issues/5) 保持 Open。用户说明反复运行 `vp check --fix` 是为解决 Windows CRLF → LF；开发分支新增 `.gitattributes`（`* text=auto eol=lf`）与 `.editorconfig`（UTF-8、LF、末尾换行），配置需在维护者 Windows 本机复核，未批量重写追踪文件、不改变产品 CSS。没有新增依赖/CI、未发布 npm。见[W-04 §7.6](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

**W-04 Webpack 5 消费端脚本与格式诊断（2026-11-04）**：维护者 `git check-attr text eol` 已确认样本为 `text: auto`、`eol: lf`。最新 `vp check` 报告仅三个 Markdown 格式问题，随后 `vp check --fix` 格式修复成功、13 文件 Lint PASS；GitHub 新提交的实际补丁显示是表格宽度与空格对齐变化，未显示 CRLF 归一化。因此 LF 策略生效与 Markdown 格式问题须区分，修复后再次 `vp check` 的完整结果尚未提供。针对 W-04 P-03 已增加显式独立 `npm run test:webpack`，在临时目录中从真实 tarball 安装 CSS 包和固定 Webpack 5.112.2，利用原生 `experiments.css` 做生产构建和 CSS 副作用保留检查。不添加根项目依赖、CI，不发布；新测试文件已通过 Node `--check` 和 Git blob 指纹核对，但当前容器不能访问 npm registry，**未实际安装 Webpack 或运行其构建**。W-04 Issue #5 仍 Open，详见[W-04 §7.7](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

**W-04 范围收敛与结项决策（2026-11-04）**：维护者明确 Vite+ 为唯一开发与打包工具链，Webpack 不参与本库 CSS 生成与使用，亦不作为 W-04 必须测试的生产消费者。已删除 `tests/package-webpack-consumer.node.test.mjs` 和 `test:webpack` 命令，修订[包验收矩阵](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)和 ADR-0005 后续实施说明。既有真实结果：`vp pack` 唯一 CSS、`test:package` 1/1 PASS、`test:consumer` 1/1 PASS，满足当前包交付 DoD；P-03 记为**范围外**，不伪装成测试通过。开发态/浏览器直接引用/无障碍/组件库回归留 W-06，公开 npm 发布/Release 留 W-07；保持 `private: true`、`0.0.0`，不改产品 CSS、不新增依赖或 CI。前文有关 Webpack 阶段计划与待测的记录属于历史事实，以本条决策为当前状态。GitHub [Issue #5](https://github.com/adui-studio/normalize.css/issues/5) 已以 Completed 关闭；不等于 W-06/W-07 通过。**本轮更改后最新 Windows `vp check` 和全套测试尚待执行**。

**更新约定**：重大进度、已完成验证、关键决策、阻塞与下一阶段变化时更新；事实来源优先实际仓库、命令输出与正式 ADR，而非历史聊天。

## 7. 迁移来源

本次文档迁移来源于 [adui-dev/normalize.css 的初始化提交](https://github.com/adui-dev/normalize.css/commit/7f9d4a1af3ea7fea6fb978378f93390ecd47271f)。目标仓库已独立存在，因此采用文档内容迁移而非 GitHub 原生 Transfer；两个仓库的 Git 历史没有合并。
