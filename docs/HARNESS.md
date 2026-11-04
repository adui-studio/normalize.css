# HARNESS — 执行、验证与反馈环境

**当前状态：W-03 已在独立开发分支实现首批本地 Harness 资产**：`package.json`、`vite.config.ts`、R-003/R-004 Fixture、`tests/fixtures.test.ts` 与 Node 探针测试。维护者最新本机 `vp check`（55 文件格式、11 Lint）、Vitest 6/6、离线 Node 25/25 均通过，Windows `DEP0190` 在修复后未复现；R-003 已有 Chrome 156 / Firefox 121 零差异与 Chrome 120 四组差异的 T0/T1 对照；Edge 120、Safari 17.2 及移动端未测。无 CSS 发布产物或 CI。

**本机首次实测（2026-11-04）**：维护者在 Windows 上用 pnpm 11.24.0 安装了 Vite+ 1.4.0，`npm run test:offline` **22/22 PASS**，`npm exec -- vp test` **5/5 PASS**，`npm exec -- vp dev` 启动成功并访问四个 Fixture；`npm exec -- vp check` **FAIL**（当时报告 66 个文件格式问题）。Chrome 156 的 R-003 T0/T1 字重无差异；R-004 T1 声明效果不符合预期，待诊断。完整记录见 [首次本地运行](research/LOCAL_BROWSER_RUN_20261104.md)。上述结果**来自维护者提供的本地截图/终端日志**，不是本执行容器独立重跑。

**R-004 补充测试**：维护者的 DevTools Console 已验证 T1 中作者 CSS 规则存在于 CSSOM，当前与探针记录均为 13px；依据 [字体族字号偏好研究](research/R003_R004_LOCAL_VERIFICATION.md)，新增独立 T1b 页面 `/fixtures/r004-family-review.html`，仅相对于 T1 增加 `font-family: monospace, monospace`；**T1b 浏览器结果已由维护者提供**：Chrome 156 四个等宽元素的自身计算字号均由 T1 的 13px 变为 T1b 的 16px，字体族显示 `monospace, monospace`；**后续已收到新增契约的完整本机回归：Node 23/23、Vitest 6/6 通过**。单环境实测不等于最低浏览器矩阵通过。

**本机第二轮实测（2026-11-04）**：维护者使用 `vp fmt --check` 和 `vp check` 重新检查，均因格式问题 **FAIL**（本轮输出列出 54 个第一方文件）；`npm run test:offline` **23/23 PASS**，`vp test` **6/6 PASS**。不能将 `vp test:offline` 视为存在的子命令；离线脚本使用 `npm run test:offline`。Windows 上 `DEP0190` 警告仍存在，已定位到 `tests/package-smoke.node.test.mjs` 的 `spawnSync` 配置，尚未修复。格式化后完整重验仍待执行；见 [最新本机执行记录](research/LOCAL_BROWSER_RUN_20261104.md)。

**本机第三轮实测（2026-11-04，维护者提供）**：`vp check` **PASS**（54 个文件格式正确、11 个文件无 Lint 警告或错误）；`vp test` **6/6 PASS**；`npm run test:offline` **23/23 PASS**，但原测试代码在 Windows 仍发出 `DEP0190`。已在 `tests/package-smoke.node.test.mjs` 将 Windows npm 启动从 `npm.cmd` + `shell: true` 改为 `node.exe` 直接执行 npm JavaScript CLI，保留独立参数数组；**提交后的 Windows 回归尚未执行，不得声称警告消失**。独立 Linux Node 22 环境已验证同类无 shell npm CLI 调用可完成离线打包与安装，但不能替代真实 Windows 验证。

**本机第四轮验证与真实 JSON 比较（2026-11-04）**：维护者在 Windows 上重新执行 `vp check`（54 文件格式/11 文件 Lint PASS）、`vp test`（6/6 PASS）、`npm run test:offline`（23/23 PASS），并单独运行合成 npm 包烟测（1/1 PASS）；两次 Node 测试均不再出现 `DEP0190`。维护者随后运行 R-003 原始 T0/T1 JSON 比较器，得到 `NO_COMPUTED_DIFFERENCE`、`differences: 0`、`candidateFailures: 0`；本次对话附件也已被独立解析核对。完整构建号和旧版浏览器矩阵仍未验证。详见[本机运行记录](research/LOCAL_BROWSER_RUN_20261104.md)。

**R-003 Chrome 120 独立复核（2026-11-04）**：维护者已上传官方 Chrome for Testing 120.0.6099.109 / Windows 11 的 T0/T1 JSON，六组中有四组从计算字重 700 变为 900。助手使用当前仓库比较器内容的独立临时副本，在 Linux Node 22.16.0 实际运行得到 `COMPUTED_DIFFERENCE_OBSERVED`、`differences: 4`、`candidateFailures: 0`、退出码 0；这不是 Windows 本机的 CLI 执行，也不等于 Chrome 120 以外浏览器已验证。Firefox 121 的独立 Profile 测试流程已列入[验证指南](research/R003_R004_LOCAL_VERIFICATION.md)，尚未执行。

**R-003 Firefox 121 实测（2026-11-04）**：维护者在 Windows Firefox 121 真实页面中导出 T0/T1 JSON 并执行仓库 CLI，得到 `NO_COMPUTED_DIFFERENCE`、`differences: 0`、`candidateFailures: 0`。本次上传的原始两份 JSON 已独立解析，六组测量值与字体上下文一致；此为 Gecko 121 单环境计算样式证据，非 UA 声明来源、实际字体渲染、精确构建 ID 或完整发布兼容性证明。见[本机记录 §2.4](research/LOCAL_BROWSER_RUN_20261104.md)。

**R-004 Firefox 121 本机观测（2026-11-04）**：维护者使用 PowerShell 读取三个已下载 Fixture JSON，报告 T0/T1/T1b 的四个等宽元素字号均为 16px；T0/T1 的计算字体族为 `monospace`，T1b 为 `monospace, monospace`。这是维护者终端输出，三份原始 R-004 JSON 尚未由助手独立解析。Firefox `about:support` 另提供 release Build ID `20231211174248`，文件包含环境敏感信息，公开文档只记录最小版本字段。R-004 默认不准入 CSS，详见[本机记录 §3.2.1](research/LOCAL_BROWSER_RUN_20261104.md)。

**R-004 Chrome 120 本机观测（2026-11-04）**：维护者以 PowerShell 读取三个已下载 Fixture JSON，四个等宽元素的 T0/T1 计算字号均为 13px、T1b 均为 16px；T0/T1 的 `fontFamily` 是 `monospace`，T1b 为 `monospace, monospace`。结果与先前 Chrome 156 一致，而 Firefox 121 的三页均为 16px。此项为维护者终端实际输出，三份 Chrome 120 原始 JSON 本轮未上传；没有独立解析或字体用户设置回归。R-004 默认不准入 CSS；见[本机记录 §3.2.2](research/LOCAL_BROWSER_RUN_20261104.md)。

**首批产品 CSS 构建与定向测试（2026-11-04）**：`src/normalize.css` 当前只包含 R-003；`scripts/build.mjs` 直接复制静态 CSS，`package.json` 只导出 CSS 根入口并保持 private。独立 Linux Node 22.16.0 复刻目录新增定向 Node **5/5 PASS**；CSS 字节一致、离线 tarball 安装、根路径解析与私有子路径封装通过。复刻文件的 Git blob SHA 与远程提交完全一致，但 **Node 低于项目 engine 下限**，不是维护者 Windows 上 Vite+ 全量测试通过。见[W-04 交付记录](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

**Vite+ 三命令迁移（2026-11-04）**：维护者要求统一使用 `vp dev`、`vp build`、`vp pack`，不再通过 `npm run build` 调用 `scripts/build.mjs`（已删除）。`vite.config.ts` 的 `build.lib.entry` 为 `src/normalize.css`、`cssFileName` 为 `normalize`，目标是仅生成 `dist/normalize.css`；`pack` 把试验性 CSS-only 入口输出到独立 `dist-pack/`，不会覆盖根包导出。离线 Node 测试对新配置及现有 CSS 契约 **5/5 PASS**，运行环境 Node 22.16.0；**未执行真正 Vite+ 1.4.0 的 `vp build` / `vp pack`**，且目前尚不清楚 tsdown 能否把 CSS 直接用作唯一入口。维护者迁移前的 `npm run test:offline` 实测为 **25/25 PASS**；迁移后需重跑完整测试、`vp check`、`vp test` 和两个构建命令。详见[W-04 包研究](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

**本机最新 Vite+ 反馈与修复（2026-11-04）**：维护者报告 `vp check` **PASS**（55 文件格式、11 文件 Lint）、`vp test` **6/6 PASS**、`npm run test:offline` **25/25 PASS**、`vp dev` 正常启动、`vp pack` 在旧 `dist-pack/` 成功构建一个 `normalize.css`（200 字节，无 JS），而 CSS-only `vp build` 触发了 `cssCodeSplit: false` 与 CSS input 冲突。项目改为 **`vp build` 打包六张 Fixture HTML 至 `dist-fixtures/`，`vp pack` 将唯一产品 CSS 输出至 `dist/normalize.css`**。修改后的 GitHub `vite.config.ts`、`tests/package.node.test.mjs` 通过独立文件 SHA 校验，Node 定向测试 **6/6 PASS**；但 Vite+ 1.4.0 修订配置的实际 build/pack、完整 Windows 回归尚未执行。没有新增依赖、CI、发布。详见 [W-04 实测结论](plans/CSS_PACKAGE_DELIVERY_REVIEW.md#73-vite-140-实际反馈与构建职责修订2026-11-04)。

**W-03 验收结项（2026-11-04）**：维护者报告修订后的 `vp build` **PASS**，输出六张 HTML Fixture 及一个仅测试用探针 JS 到 `dist-fixtures/`；`vp pack` **PASS**，`dist/normalize.css` 为唯一构建产物（200 字节，无发布 JS）；`npm run test:offline` **26/26 PASS**。此前 `vp check`（55 格式/11 Lint）、`vp test` 6/6、`vp dev` 均已验证，最新构建改动后的 `vp check` / `vp test` 尚未单独提供新日志。按 [W-03 退出门槛](plans/VITEPLUS_LOCAL_HARNESS_DESIGN.md)，本地 T0/T1 测试工具与证据流程已建立，[Issue #4](https://github.com/adui-studio/normalize.css/issues/4) **Closed · Completed**。T2 消费端集成、键盘/系统偏好、组件库与 Safari/移动端等全矩阵回归尚未完成，由 W-06（#7）处理；真实 npm 产物与 CSS 副作用消费验证由 W-04（#5）负责。不合并 PR、不发布、不加 CI。

**W-04 真实包验收脚本（2026-11-04）**：在合成 npm 烟测之外新增独立 `npm run test:package`，要求先执行 `vp pack`，随后对当前真实 `dist/normalize.css` 执行临时 npm tarball 打包、离线安装、根导出/非公开子路径/文件白名单及副作用元数据检查。测试不上传发布、无需网络或新增依赖，且不进入常规 26 项 `test:offline`。同一源文件的独立 Linux Node 22.16.0 代表性目录运行 **1/1 PASS**，但完整 GitHub 仓库和 Windows 环境尚未执行这一新测试，不能据此宣布 W-04 退出验收。见[W-04 §7.4](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

**W-04 独立 Vite+ 生产消费脚本（2026-11-04）**：新增 `npm run test:consumer`，使用**真实 `vp pack` 产物和临时 npm tarball**安装到独立消费者，通过 `import "@adui/normalize.css"` 构建生产应用，检查 Vite+ 1.4.0 的 CSS 产物未被 tree shaking 丢弃。不额外安装 Vite+，消费端位于 Git 忽略的 `node_modules/.cache/` 中，结束后清理；该脚本**仅做过 Node 语法检查，尚未实际运行 Vite+ 构建**。P-02 待 Windows 实测，P-03 Webpack 5 仍待测。详见[W-04 §7.5](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

**W-04 真实 Windows 测试与 LF 行尾规范（2026-11-04）**：维护者已执行 `vp pack`，生成唯一 `dist/normalize.css`（约 200 字节）；`npm run test:package` **1/1 PASS**（真实 tarball、封装、独立离线安装），`npm run test:consumer` **1/1 PASS**（真实 tarball、独立 Vite+ 生产构建、R-003 CSS 保留）。P-01/P-06/P-07/P-09 已有真实包验证，P-02 **生产构建子项**通过；P-02 开发态与页面实际计算样式、P-03 Webpack 5 仍待测，不能关闭 W-04 Issue #5。维护者指出重复执行 `vp check --fix` 是 CRLF→LF 行尾转换，本轮新增 `.gitattributes`（`* text=auto eol=lf`）与 `.editorconfig`（UTF-8、LF、末尾换行），**新配置尚待 Windows 本机 `vp check` 与 Git 工作区验证**。不重写上游固定 Skills，不新增 CI。[完整结果](plans/CSS_PACKAGE_DELIVERY_REVIEW.md#76-windows-真实包与-vite-生产消费验收2026-11-04)。

**W-04 工具链范围修订（2026-11-04）**：维护者明确本库只采用 Vite+ 和标准 CSS 交付，撤销尚未执行的 Webpack 5 专项测试与 `test:webpack` 命令。基于真实 `vp pack` 单 CSS 产物、`test:package` 1/1、`test:consumer` 1/1，W-04 的包交付契约已达到当前验收门槛；P-03 标注为范围外而非通过。Vite+ 开发态、浏览器样式与组件库回归转 W-06；正式发布转 W-07。不增加 CI。见[W-04 最新范围](plans/CSS_PACKAGE_DELIVERY_REVIEW.md)。

**Windows 格式检查说明**：维护者 `git check-attr` 已确认 `auto/lf`，随后 `vp check --fix` 格式修复与 13 文件 Lint 通过。已提交的该次 diff 主要是 3 个 Markdown 表格列宽对齐，而非 CRLF→LF，不能将表格布局问题归因于 Git 属性失效；还需再执行一次 `vp check` 确认格式检查完全 PASS。

## 1. Harness 目标

形成可重复的闭环：理解需求 → 影响分析 → 制定验证矩阵 → 最小修改 → 检查 → 定位失败 → 修复重验 → 记录结果。未来仅考虑维护者本地运行可复现检查并记录结果；项目明确**不增加任何 CI**，避免仅凭经验声称跨浏览器兼容。

## 2. 当前可以执行的审查（无新增工具）

- 确认开发分支仅新增 Fixture、探针与测试代码，保留 MIT LICENSE；不把合成 CSS 测试样例当作产品源码。
- 对照 [CODEBASE_MAP](CODEBASE_MAP.md) 的真实路径核查存在性。
- 审核相对链接、需求 ID、ADR 状态及“未实现/已验证”措辞。
- 审核文档是否引用不存在的命令、Skill、workflow 或发布版本。
- 把上述**人工检查**与未来程序化文档校验明确区分。

## 3. 开发阶段拟建设的验证层级

| 层级       | 拟议检查                                   | 预期产物               | 当前状态 |
| ---------- | ------------------------------------------ | ---------------------- | -------- |
| 依赖/环境  | Node 与包管理器版本锁定、安装重现          | 环境说明、锁文件       | 部分实现 |
| 格式与静态 | Markdown、CSS 格式、语法、规则约束         | 可定位的检查报告       | 部分实现 |
| 规则单元   | 某声明存在/缺失及导出边界                  | 单元测试报告           | 部分实现 |
| 真实浏览器 | Chromium、Firefox、WebKit 的差异 Fixture   | 浏览器版本及结果、截图 | 部分实现 |
| 无障碍体验 | 键盘焦点、系统减少动画/高对比度            | 行为回归记录           | 未实现   |
| 组件库兼容 | Element Plus、Ant Design、TDesign 选定示例 | 对照截图及误差分析     | 未实现   |
| 打包发布   | CSS 公开导出、包文件清单、许可证、大小     | npm tarball 验证报告   | 部分实现 |
| CI         | 项目明确不增加任何 CI                      | 不适用                 | 不规划   |

## 4. Vite+ 本机执行与下一步验证

**格式检查范围的最小修复（2026-11-04，已在本机重验）**：根目录 `vite.config.ts` 新增 `fmt.ignorePatterns: ['.agents/skills/**']`。参照 [Vite+ 官方 Format Config](https://viteplus.dev/config/fmt)，`vp check` 会读取根配置，因此固定上游原版 Skills（含其 references、来源记录）不应由项目格式化器修改；**其余第一方 Markdown、HTML、JS、TS、package.json 与 GitHub 模板继续接受完整格式检查**。不能为了通过而设置 `check.fmt: false` 或忽略 `docs/**`、`tests/**`、`fixtures/**`。

```sh
pnpm exec vp fmt --check
pnpm exec vp check
# 若只想先单独检查 lint，而不误称完整 check 通过：
pnpm exec vp check --no-fmt
```

**当前验证边界**：维护者已修复第一方格式问题并提交，且在 Windows npm 子进程修复后重新执行完整本机检查，54 个格式文件、11 个 Lint 文件、6 项 Vitest 与 23 项离线 Node 均通过，未再出现 `DEP0190`。这仍不是旧版浏览器与实际发行包的兼容验收。第三方 Skills 保留原文，不扩大忽略范围。

Vite+ 已根据 [ADR-0005](adr/0005-viteplus-toolchain.md) 选定为统一工具链；已在 `package.json` 固定开发依赖 1.4.0，`vite.config.ts` 配置测试。**维护者已实际验证 `vp check`、`vp test`、`vp dev` 和 CSS-only `vp pack`；旧 CSS-entry `vp build` 曾因 Vite 默认 `cssCodeSplit: false` 失败，新 HTML Fixture 预览配置仍需实测**。

```sh
vp fmt --check
vp check
vp test
vp dev
vp build
vp pack
```

- `vp check` / `vp fmt`：静态检查与格式化的候选；对 CSS 的实际覆盖仍需验证。
- `vp test`：使用 Vitest 进行规则元数据或文件导出等单元检查，**不等于真实浏览器回归**。
- `vp dev`：用于后续原生 HTML 与 UI 组件 Fixture 的本地预览。
- `vp build`：现构建六张原生 HTML Fixture，输出到 `dist-fixtures/`，不进入 npm 包。
- `vp pack`：维护者在 Vite+ 1.4.0 已实测直接 CSS 入口成功输出唯一 CSS、无 JS；现在以相同输入输出到 `dist/normalize.css`，等待新配置复测。
- `vp pack` 不等于 `npm pack`，实际 tarball 检验仍使用 `npm pack --dry-run`。

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
