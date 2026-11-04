# HARNESS — 执行、验证与反馈环境

**当前状态：W-03 已在独立开发分支实现首批本地 Harness 资产**：`package.json`、`vite.config.ts`、R-003/R-004 Fixture、`tests/fixtures.test.ts` 与 Node 探针测试。已在当前容器通过 **Node 测试 18/18**（含 Fixture/元数据契约）与 JS 语法检查；Vite+ 尚未安装/运行，Chromium 无头测试超时，历史目标浏览器未测。无 CSS 发布产物或 CI。

**本机实测更新（2026-11-04）**：维护者在 Windows 上用 pnpm 11.24.0 安装了 Vite+ 1.4.0，`npm run test:offline` **22/22 PASS**，`npm exec -- vp test` **5/5 PASS**，`npm exec -- vp dev` 启动成功并访问四个 Fixture；`npm exec -- vp check` **FAIL**（66 个文件格式问题）。Chrome 156 的 R-003 T0/T1 字重无差异；R-004 T1 声明效果不符合预期，待诊断。完整记录见 [首次本地运行](research/LOCAL_BROWSER_RUN_20261104.md)。上述结果**来自维护者提供的本地截图/终端日志**，不是本执行容器独立重跑。

## 1. Harness 目标

形成可重复的闭环：理解需求 → 影响分析 → 制定验证矩阵 → 最小修改 → 检查 → 定位失败 → 修复重验 → 记录结果。未来仅考虑维护者本地运行可复现检查并记录结果；项目明确**不增加任何 CI**，避免仅凭经验声称跨浏览器兼容。

## 2. 当前可以执行的审查（无新增工具）

- 确认 GitHub 仓库仅在文档阶段修改 Markdown，保留 MIT LICENSE。
- 对照 [CODEBASE_MAP](CODEBASE_MAP.md) 的真实路径核查存在性。
- 审核相对链接、需求 ID、ADR 状态及“未实现/已验证”措辞。
- 审核文档是否引用不存在的命令、Skill、workflow 或发布版本。
- 把上述**人工检查**与未来程序化文档校验明确区分。

## 3. 开发阶段拟建设的验证层级

| 层级 | 拟议检查 | 预期产物 | 当前状态 |
| --- | --- | --- | --- |
| 依赖/环境 | Node 与包管理器版本锁定、安装重现 | 环境说明、锁文件 | 未选型 |
| 格式与静态 | Markdown、CSS 格式、语法、规则约束 | 可定位的检查报告 | 未实现 |
| 规则单元 | 某声明存在/缺失及导出边界 | 单元测试报告 | 未实现 |
| 真实浏览器 | Chromium、Firefox、WebKit 的差异 Fixture | 浏览器版本及结果、截图 | 未实现 |
| 无障碍体验 | 键盘焦点、系统减少动画/高对比度 | 行为回归记录 | 未实现 |
| 组件库兼容 | Element Plus、Ant Design、TDesign 选定示例 | 对照截图及误差分析 | 未实现 |
| 打包发布 | CSS 公开导出、包文件清单、许可证、大小 | npm tarball 验证报告 | 未实现 |
| CI | 项目明确不增加任何 CI | 不适用 | 不规划 |

## 4. Vite+ 本机执行与下一步验证

Vite+ 已根据 [ADR-0005](adr/0005-viteplus-toolchain.md) 选定为统一工具链；已在 `package.json` 固定开发依赖 1.4.0，`vite.config.ts` 配置测试。**本机 `vp test`、`vp dev` 已验证可执行，`vp check` 因格式问题失败；本执行容器尚未安装 Vite+，`vp pack` 仍未验证**。

```sh
vp fmt --check
vp check
vp test
vp dev
vp pack
```

- `vp check` / `vp fmt`：静态检查与格式化的候选；对 CSS 的实际覆盖仍需验证。
- `vp test`：使用 Vitest 进行规则元数据或文件导出等单元检查，**不等于真实浏览器回归**。
- `vp dev`：用于后续原生 HTML 与 UI 组件 Fixture 的本地预览。
- `vp pack`：官方支持 CSS bundling，但是否适合**无 JS 入口、无 JS 产物**的 CSS-only 库需实测。
- `vp build` 面向应用，不应直接假定它就是静态 CSS npm 包的构建方式；运行自定义 scripts 应使用 `vp run <name>`。

另外已实际运行 `npm pack --dry-run --json --ignore-scripts --offline .` 并返回成功：当前 `files: ["dist"]` 且尚无 `dist`，因此文件清单只有 `package.json`。**该结果只能说明白名单生效，不表示真实 CSS 包、`exports`、Vite+/Webpack 消费端已通过。** 此外，`tests/package-smoke.node.test.mjs` 已在临时目录中实际 npm pack 并离线安装合成的单一 CSS 入口包，检查根路径、拒绝未公开子路径及无 JS/私有测试文件；该测试通过，但**不等于项目的正式 CSS 根入口已实现或经过消费端构建验证**。

新增的 `tests/r003-evidence.mjs` 负责检查真实浏览器输出的 T0/T1 JSON：相同 UA、完整 b/strong × 400/600/700 记录、一致字体上下文及候选字重。新增 8 项合成数据/CLI 单测均通过，但**尚无任何最低目标浏览器实际计算样式**。CLI 状态码 0 表示结构有效且候选符合预期，1 表示候选不符，2 表示输入无效；CLI 本身不能验证 UA 样式来源或物理字体渲染。

R-003 JSON 读取器已改为先验证普通文件与 256 KiB 大小、再读取并解析；`tests/evidence-file.node.test.mjs` 的 **4/4 本地测试通过**。原有 **18/18** 测试在变更前于本轮重新运行通过；原先完整 22 项未在本执行容器中运行；**维护者已在本机执行更新后的 22 项，全部 PASS**（2026-11-04）。目标浏览器环境仍未验证。

离线验证可直接运行：

```sh
npm run test:offline
# 采集真实 T0/T1 JSON 后才运行：
node tests/r003-evidence.mjs r003-native.json r003-candidate.json
npm pack --dry-run --json --ignore-scripts --offline .
```

任何未实际运行的命令只能记录“未执行”，不准声称通过。更多见 [Vite+ 研究](research/VITEPLUS_TOOLCHAIN_REVIEW.md) 以及 [W-03 本地 Harness 设计](plans/VITEPLUS_LOCAL_HARNESS_DESIGN.md)。项目**不增加任何 CI**。

## 5. Fixture 最小范围（规划）

1. 基础文档语义：headings、lists、hr、abbr、pre/code、details/summary。
2. 表单：button、input 各类型、select、textarea、fieldset/legend、原生校验。
3. 原生交互：dialog、popover、focus-visible、hidden/hidden=until-found。
4. 系统偏好：forced-colors、prefers-contrast、prefers-reduced-motion。
5. 组件库：Element Plus、Ant Design、TDesign 中按钮、输入、弹窗、表格的典型页面。

每一项需同时记录 **浏览器版本、操作步骤、期待行为、实际结果**。浏览器引擎覆盖不能由 CSS 解析测试代替。

## 6. 安全和发布门禁（规划）

- 审核第三方规则的许可证及改写过程；不引入未经审批的远程字体、图片或跟踪请求。
- 浏览器支持策略见 [ADR-0004](adr/0004-browser-support-policy.md)，验证门槛见 [REVIEW_GATE](research/REVIEW_GATE.md)，工作顺序见 [MVP 实施计划](plans/MVP_IMPLEMENTATION_PLAN.md)。
- 所有公开入口必须能在实际发布包内解析，默认入口不得隐式导入可选增强。
- 浏览器关键回归、许可证、发布文件清单和版本说明全部确认后，才可申请发布。
- npm 权限、版本发布和 GitHub Release 需另行授权；不引入 CI Secrets 或发布工作流。

## 7. 故障报告格式

记录：任务/需求编号、环境及浏览器版本、最小复现页面、实际/预期差异、受影响入口、测试证据、原因分析、修复结果、无法验证事项。

**更新约定**：在明确批准开发后，新增真实本地脚本、测试或运行环境时，以可执行命令更新本页；**项目不增加任何 CI**。如未运行必须明确记录原因。