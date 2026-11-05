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

**最新完整本地回归与任务清理（2026-11-04）**：维护者在 Windows 运行 `vp check`，**57 个文件格式 PASS / 13 个文件 Lint PASS**；`vp test` **6/6 PASS**；`vp pack` 单个 CSS PASS；`npm run test:offline` **26/26 PASS**；`npm run test:package` 真实 tarball **1/1 PASS**、`npm run test:consumer` Vite+ 生产消费 **1/1 PASS**。已核对 GitHub 关闭的 W-03 #4 和 W-04 #5 进度条源自历史阶段记录里的 Markdown `[ ]`；现把历史状态保留为普通文字，顶部当前阶段清单各 4/4，未完成的 T2、浏览器和组件库回归移交 W-06 #7，锁文件/包管理器策略核对移交 W-07 #8。**这不是把未执行的测试改为通过**。不新增 CI、不发布 npm。

**W-06 首批 T2 页面开发（2026-11-04）**：新增 `fixtures/t2-native.html` 与 `t2-package.html`，body 与测试用父级字重一致；T2 仅通过 `<link href="../dist/normalize.css">` 加载当前 `vp pack` 构建产物。`probe.js` 在 T2 额外记录 `packageStylesheet.href/loaded`，避免 CSS 404 被误判为浏览器零差异。新增 Node/Vitest 契约，并将两页加入 `vp build`；包含 R-003 的 6 个字重点、R-004 的 4 个等宽元素，以及后续可手工观察的原生控件。已对 GitHub 实际文件完成 body/样式/ID/链接与配置一致性静态检查，**未在 Windows 执行本轮 Vite+ 命令或浏览器 T2**；结果应保持 NOT_RUN。先 `vp pack`，再 `vp build` / `vp dev`，详见[本地验证说明](research/W06_T2_LOCAL_VERIFICATION.md)。不新增产品 CSS、依赖或 CI。

**W-06 T2 反馈与第二批原生交互开发（2026-11-04）**：维护者反馈首批 T0/T2 本地验证通过，但未提供浏览器/系统精确版本、原始 JSON 和截图；记录为**维护者报告通过**，尚不足以给 R-003/R-004 各浏览器兼容矩阵逐项签署 PASS。两张 T0/T2 页面同步新增原生 fieldset/select/textarea/checkbox 与 dialog（保留此前 button/search/details/hidden），仍是相同 DOM，只有 T2 引用真实 CSS。新增 Node 契约只检查页面元素存在与隔离，不证明键盘焦点、Esc、系统偏好或 until-found 查找通过；这些步骤按[W-06 指南](research/W06_T2_LOCAL_VERIFICATION.md)手工验证，状态为 NOT_RUN。无产品 CSS、运行时依赖或 CI 变更。

**W-06 Chrome 156 实测截图（2026-11-04）**：维护者提供 T0/T2 两张页面截图并反馈验证通过；T2 实际 CSS link 的 `packageStylesheet.loaded` 为 `true`，T0 与 T2 10 个计算样式测量点一致。已记为该浏览器环境的**静态 CSS 加载与样式对照 PASS**；原生表单控件和 details 可见，但截图不能证明 Tab/键盘、dialog Esc、hidden/until-found、系统偏好、Edge/Safari/移动端及组件库回归通过。研究记录见 [W-06 T2 本地验证说明](research/W06_T2_LOCAL_VERIFICATION.md)。本次仅整理证据，不新增源码规则/依赖/CI。

**W-06 Chrome 156 原生交互人工 PASS 补充（2026-11-04）**：维护者明确确认已在 T0/T2 本地页实际操作并通过：原生 `dialog` 打开与 Esc 关闭、键盘焦点、`hidden="until-found"` 页面查找揭示。将 F-005、F-006、F-007 的这些具体子项标记为**维护者人工验证 PASS**，但本轮没有交互录屏、自动化日志或其他浏览器实测；不推断 dialog 表单关闭按钮、整个键盘遍历、系统减少动效/强制颜色偏好、完整 UI 组件库矩阵已通过。详情见[W-06 本地记录](research/W06_T2_LOCAL_VERIFICATION.md)。W-06 #7 继续 Open，不增加产品 CSS、依赖或 CI。

**W-06 首批生态消费脚本（2026-11-04，待真实安装/运行）**：新增 `tests/ecosystem-fixtures.mjs`、`tests/ecosystem-consumer.mjs` 与 `tests/ecosystem-contract.node.test.mjs`。通过真实 `vp pack` CSS tarball、现有 Vite+ 1.4.0，在 Git 忽略的临时目录隔离构建 Vue 3 + Element Plus 与 React + Ant Design 的 T0/T2；测试入口只差 `import "@adui/normalize.css"`，各有独立生产构建，以排除共享 CSS 污染。`npm run test:offline` 新增纯 Node 静态契约，不下载依赖；`npm run test:ecosystem -- vue-element` / `react-antd` 仅在人工执行时安装对应固定版本至临时消费者（禁用安装脚本），不修改正式 npm 包、项目依赖或 CI。已在 Code Mode 对新生成器执行 JavaScript 解析及 T0/T2 来源隔离检查，**真实 Node 离线套件和 Vite+ UI 库构建在本轮仍 NOT_RUN**，不宣称视觉兼容通过。见[生态验证指南](research/W06_ECOSYSTEM_LOCAL_VERIFICATION.md)。

**W-06 Vue/React 真实消费端本机结果（2026-11-04）**：维护者 Windows 运行 `npm run test:ecosystem -- vue-element` **PASS**（T0 静态 CSS 360171 字节、T2 360362 字节）、`npm run test:ecosystem -- react-antd` **PASS**（T0 静态 CSS 0 字节、T2 192 字节）；`vue-element --keep` 再次 PASS，并保留 `node_modules/.cache/adui-ecosystem-tLDzuZ` 临时消费者供浏览器对照。React/Ant Design 的 0 字节仅是**静态 CSS 输出**，不能推断组件运行时无 CSS。维护者同轮 `npm run test:offline` 结果 **29/30 PASS，1 FAIL**，唯一失败源于 `tests/package.node.test.mjs` 固定的旧六项离线脚本清单，与新增第七项 `ecosystem-contract.node.test.mjs` 不一致；现已对该断言实施最小修复，**修复后的完整离线测试未重新运行**。生态构建 PASS 不等于组件渲染、焦点、样式冲突测试 PASS，F-009 仍部分完成。见[完整验证记录](research/W06_ECOSYSTEM_LOCAL_VERIFICATION.md)。无产品 CSS/CI 修改。

**W-06 Vue + Element Plus / Chrome 156 浏览器对照（2026-11-04）**：维护者提交 T0 `localhost:5174` 与 T2 `localhost:5175` 的页面/DevTools 截图，两组 Element Plus Button/Input 均成功挂载（`buttonMounted`、`inputMounted` 都为 `true`），组件静态外观一致，`b-600`、`strong-600`、`b-700`、`strong-700` 的计算字重均 `900`，`code` 字号均 `13px`，两组五个探针相同；据此确认该 Chrome 156 环境的**静态 UI 及计算样式对照 PASS（截图）**。两页共同的 Vue feature flags 警告及 favicon.ico 404 不构成 CSS 冲突证据。Vue 实际键盘/输入行为、React+Ant Design 浏览器对照、其他浏览器仍待测。修复后的离线 Node 全套 30 项尚未取得最新运行结果。[详见 W-06 生态记录](research/W06_ECOSYSTEM_LOCAL_VERIFICATION.md)。

**W-06 React + Ant Design / Chrome 156 静态 UI 对照（2026-11-04）**：维护者新增 React T0/T2 两张浏览器及 Console 截图。两页 Ant Design Button/Input 正常挂载（`buttonMounted: true`、`inputMounted: true`），外观一致，`b-600/strong-600/b-700/strong-700` 均为 `fontWeight: 900`、`fontSize: 16px`、`fontFamily: Noto Sans SC`，`code` 为 `fontWeight: 400`、`fontSize: 13px`、`fontFamily: monospace`。结合之前真实 tarball 的 Vite+ 生产构建 PASS，记录 **React 19.3.1 + Ant Design 6.6.8 在 Chrome 156 的静态 UI/五项计算样式对照 PASS（截图）**。React DevTools 信息提示非异常；实际点击/输入/焦点未测，不外推其他浏览器或组件。Vue + Element Plus 的 Chrome 156 静态对照此前已 PASS。`test:offline` 修复后 30/30 尚未获本机日志，W-06 #7 保持 Open。见[生态验证记录](research/W06_ECOSYSTEM_LOCAL_VERIFICATION.md)。

**W-06 离线 30/30 完成复验、TDesign 场景开始（2026-11-04）**：维护者 Windows 最新 `npm run test:offline` 显示 **30 tests / 30 pass / 0 fail / 0 skip**，修复了旧测试清单断言失败；这条 PASS 属于增加 TDesign 场景前的代码版本。现有生态生成器新增固定 `vue@3.5.44` + `tdesign-vue-next@1.20.10` 的 `vue-tdesign`，复用 Vite+ 1.4.0 和真实 CSS tarball，新增的离线断言验证官方样式入口及组件导入。已用 JS 解析及源生成器比较三组案例的 T0/T2，仅差一个 Normalize CSS import；**新代码的真实 Windows `npm run test:offline`、`vp check`、TDesign 安装/生产构建和浏览器 UI 回归尚未运行**。见 [生态验证指南](research/W06_ECOSYSTEM_LOCAL_VERIFICATION.md)；无运行时依赖、产品 CSS 或 CI 增量。

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

## W-06 / F-010 · 独立 Reset 本地回归入口（2026-11-04）

维护者已反馈 TDesign 对照完成；不重复要求执行。F-009 的浏览器/组件实测细项以归档日志为准，不自动将所有引擎标为 PASS。

为 F-010 添加 `tests/reset-fixtures.mjs`、`tests/reset-consumer.mjs`、`tests/reset-contract.node.test.mjs`。本地命令为 `npm run test:reset -- tailwind-preflight --keep`、`npm run test:reset -- unocss-tailwind-v4 --keep` 和 `npm run test:reset -- unocss-tailwind-compat --keep`；每次只在 Git 忽略的临时消费者中安装一套 Reset，使用真实 Normalize tarball 与现有 Vite+ 分别构建 `baseline`、`normalize-first`、`normalize-last` 三页。Tailwind v4 使用 `@tailwindcss/vite` 处理 Preflight `base` 层，UnoCSS 只加载单个 `@unocss/reset` CSS 入口；不添加工具链、运行时依赖或 CI。

**已核对**：GitHub 中独立生成器的三组模式及 CSS 导入顺序满足源文件隔离关系；`package.json` 与离线套件清单断言同步。**尚未验证**：维护者 Windows 上的新离线全量运行、npm 包下载、真实 Vite+ 构建结果与浏览器交互；不得据此标记 F-010 PASS。详见 [W-06 Reset 验证指南](research/W06_RESET_LOCAL_VERIFICATION.md)。

**2026-11-04 · F-010 最新状态与交互取证入口**：维护者已分别完成 Tailwind Preflight、UnoCSS `tailwind-v4`、`tailwind-compat` 三套独立消费者的三模式真实 tarball + Vite+ 构建，合计 **9/9 PASS**。每套均取得 Chrome 156 三模式 12 元素 × 14 项静态计算样式零差异；Tailwind 中 `b#bold` 的两种顺序均由未分层普通声明胜出，已获 DevTools 截图确认。该事实覆盖上文历史阶段的“尚未实际构建”状态，但**不能证明原生交互或所有目标浏览器通过**。已于 [Reset 本地验证记录](research/W06_RESET_LOCAL_VERIFICATION.md) 增补无需重建的 DevTools 临时采集步骤（Tab / 焦点、按钮、输入、details、dialog、until-found）；采集代码已做语法检查，**本批交互实测仍为 NOT_RUN**。无需更改正式 CSS 或添加 CI。

**2026-11-04 · Tailwind Preflight 原生交互三模式补验**：维护者在 Chrome 156 三个独立页面的更新日志中均取得可信 `beforematch` 事件（`trusted:true`）且 `untilFoundAttribute:null`，确认 `[hidden="until-found"]` 浏览器查找揭示在 baseline、normalize-first、normalize-last 中均已实际触发。此前三页的可信按钮点击、输入、details 双向切换、dialog 取消/关闭以及当前采样范围内可见焦点均已获证实；**Tailwind 方案在 Chrome 156 的当前 Fixture 原生交互子集已通过**。尚不代表 UnoCSS 两套独立 Reset 的交互、Firefox/WebKit、目标最低浏览器、系统偏好或完整无障碍验收通过；F-010 保持部分完成。详见 [验证证据](research/W06_RESET_LOCAL_VERIFICATION.md)。不增加 CI。

**2026-11-04 · UnoCSS 双 Reset 原生交互维护者完成反馈（最新）**：维护者在 Tailwind Chrome 156 的逐页交互报告与 beforematch 事件已通过后，确认两套独立 UnoCSS Reset 的原生交互“全部验证通过”。按已约定的 Chrome 156 三种独立加载模式记为 **人工反馈 PASS**，目前没有附带两套 UnoCSS 的逐页 JSON，证据等级与 Tailwind 的原始事件报告不同。三个 Reset 的 9/9 真实生产构建与静态样式对照已通过；**此处完成的是 Chrome 156 本地子范围**，并非 F-010 的全平台或 W-06 全部验收。后续仅推进尚未覆盖的 Firefox/WebKit/低版本及系统无障碍偏好，不重新要求维护者做已通过的 Chrome 测试。详见 [Reset 记录](research/W06_RESET_LOCAL_VERIFICATION.md)；不新增 CI。

**2026-11-04 · 跨浏览器回归执行完成反馈（最新）**：维护者已明确反馈“回归完成”。此前三个互相隔离的 Reset Chrome 156 本地测试子范围已完成，其中 Tailwind 具有原始交互日志和层叠截图、两套 UnoCSS 交互为维护者人工完成反馈。新增跨浏览器回归的**执行状态**记为“维护者反馈完成”；但尚无本轮完整逐 UA/OS/版本/设备的结果清单，不能逐项认定 Firefox/WebKit/真实 Safari/移动端或系统偏好通过，**W-06 仍待证据归档后正式验收**。不要重复组织已完成的测试，不因本条反馈新增 CI、产品 CSS 或公开支持声明。详见 [浏览器支持边界](research/BROWSER_REVIEW.md) 和 [W-06 实测记录](research/W06_RESET_LOCAL_VERIFICATION.md)。

**2026-11-04 · W-06 正式验收归档（最新）**：维护者明确确认已经正式验收归档。W-06 工作项按维护者签收结项，已有实测、人工完成反馈及缺少逐 UA/OS/设备日志的证据边界均纳入 [W-06 验收归档索引](research/W06_ACCEPTANCE_INDEX.md)。结项不自动宣称所有最低浏览器、系统偏好或完整无障碍均有原始 PASS 记录，也不代表发布批准。没有新的产品 CSS、CI、依赖或发布操作。

**2026-11-04 · W-07 首轮审核与待执行本机复核**：GitHub 开发分支已确认 `package.json` 的唯一 CSS 根导出、历史真实 tarball/消费端测试文件、MIT 与第三方 Skill 许可证；双语 README 已校正当前状态，根目录补建仅 Unreleased 的更新日志，核对核心文档 252 个本地 Markdown 链接均有提交树路径对应。上述是**远程仓库静态检查**，本轮未实际运行 `vp check`、`vp test`、`npm run test:offline`、`vp pack`、`npm run test:package`、`npm run test:consumer` 或 `npm pack --dry-run --json`。包管理器锁文件、release manifest 元数据与正式版本尚待维护者决策，W-07 Issue #8 保持 Open。详情见 [发布前审核记录](research/W07_RELEASE_READINESS_REVIEW.md)，禁止新增 CI 或自动发布。

**2026-11-04 · W-07 pnpm 锁文件验收门槛（最新）**：已固定唯一根依赖管理器为 `pnpm@12.15.0`，但 `pnpm-lock.yaml` 尚未生成或提交。维护者须在符合 `engines.node` 的 Windows 环境，先核对 `pnpm --version`，再 `pnpm install --lockfile-only`、`pnpm install --frozen-lockfile`，确认无其它根锁文件后提交真实 `pnpm-lock.yaml`。本执行环境 pnpm 不可用、npm Registry DNS 返回 `EAI_AGAIN`，因此**未执行**依赖安装/冻结安装或新一轮 `vp check` / `vp test` / npm tarball 验证；不能标记为 PASS。本仓库 Node 测试内部使用 npm 校验 tarball 格式不改变根项目 pnpm-only 决策。详见 [W-07 审核记录](research/W07_RELEASE_READINESS_REVIEW.md)，不新增 CI。

**2026-11-04 · W-07 pnpm 锁文件已入库（最新）**：维护者提交的 `pnpm-lock.yaml` 已在 GitHub 开发分支核实，具有 pnpm 12.15.0 环境锁定、`vite-plus@1.4.0` 项目 importer 与 sha512 完整性记录；双 YAML 文档是 pnpm 12 正常格式。**锁文件存在及静态一致性 PASS**，但本轮未收到 Windows `pnpm install --frozen-lockfile`、`pnpm exec vp check`、`pnpm exec vp test`、`pnpm run test:offline`、`pnpm exec vp pack`、真实包及消费测试的最新输出，均按待核实处理。此前“未生成锁文件”的阶段记录已被本条覆盖，不要据此要求再次生成，也不要把静态核对当成命令测试通过。详见 [W-07 审核报告](research/W07_RELEASE_READINESS_REVIEW.md)，不新增 CI。

**2026-11-05 · W-07 本机回归新证据（最新）**：维护者 Windows PowerShell 输出：`vp check --fix` 格式完成、19 文件零 Lint 错误/警告；`vp test` 7/7 PASS；`pnpm run test:offline` 33/33 PASS；`vp pack` 输出单一 CSS 文件 0.20 kB；`pnpm run test:package` 1/1 PASS；`pnpm run test:consumer` 1/1 PASS。均归档为**维护者实际执行**，不是本助手独立执行。此前“没有本批检查结果”的段落为历史状态，以上最新结果覆盖。尚无本次 `pnpm install --frozen-lockfile`、`git status --short`（`--fix` 可能修改文件）和 `npm pack --dry-run` 输出，因此这些项保留待核实。参考 [W-07 审核记录](research/W07_RELEASE_READINESS_REVIEW.md)；不新增 CI。

**2026-11-05 · W-07 最新冻结安装和预打包补验（最新）**：维护者提供真实 Windows 日志：`pnpm install --frozen-lockfile` 83ms、pnpm v12.15.0，无需重新解析且符合锁文件供应链策略；`git status --short` 只见未跟踪 `.idea/`，`git diff --check` 无输出；`npm pack --dry-run --json --ignore-scripts` 返回 5 个预期文件，分别为 LICENSE、README.md、README.en.md、dist/normalize.css（200 B）和 package.json，未捆绑任何依赖。结合此前实际 `vp check --fix`、Vitest 7/7、Node 33/33、`vp pack`、真实包安装 1/1 和 Vite+ 生产消费 1/1，**W-07 P-01/P-06 验证 PASS**。已在开发分支 `.gitignore` 新增 `.idea/`，需下次本地拉取后复核不再出现未跟踪提示；修改该 Git 忽略规则不是本次用户提供的本机命令输出。出版元数据与发布授权仍待决策。详见 [W-07 审核报告](research/W07_RELEASE_READINESS_REVIEW.md)。不新增 CI。

**2026-11-05 · W-07 新 npm 元数据的复验要求（最新）**：维护者已批准补充 `package.json` 的 MIT、英文简介及 GitHub `repository/homepage/bugs`；开发分支已实施并完成 JSON/字段/原配置静态核对，`private:true`、`version:0.0.0`、单一 CSS 根导出与锁文件不变。此前用户 Windows 命令的 `vp check`、Vitest 7/7、离线 Node 33/33、`vp pack`、真实包与消费测试各 1/1、冻结安装及旧包五文件白名单均 PASS；**此次改动后的本机测试尚未执行**。维护者只须对新 manifest 重新进行 `vp check`、`pnpm run test:offline`、`vp pack`、`pnpm run test:package`、`pnpm run test:consumer`、`npm pack --dry-run --json --ignore-scripts` 并保存真实输出。无 CI、发布或 main 合并。详见 [W-07 报告](research/W07_RELEASE_READINESS_REVIEW.md)。

**2026-11-05 · W-07 P-03 元数据回归与作者字段（最新）**：维护者原始 Windows 输出确认新增五项 npm 公开元数据后：`pnpm install --frozen-lockfile` 28ms PASS、`vp check` 初次有两份文件格式问题但 `vp check --fix` 修复成功且 19 文件零 Lint 警告/错误、离线 Node 33/33、`vp pack` 唯一 200 B CSS、tarball 和 Vite+ 生产消费各 1/1、五文件 `npm pack --dry-run`（13655 B）全部 PASS，`git status --short` 无输出。之后维护者要求补充 `author:"ADui"`，已最小添加并保持 MIT LICENSE 的 ADui Studio 版权主体不变。**含作者字段的最新 manifest 仍待维护者在 Windows 执行 `vp check`、`vp pack`、`pnpm run test:package`、`pnpm run test:consumer`、`npm pack --dry-run --json --ignore-scripts` 复验**。之前五字段的 PASS 记录继续有效但不得覆盖新文件。不得新增 CI 或发布，详见 [W-07 审核报告](research/W07_RELEASE_READINESS_REVIEW.md)。

**2026-11-05 · W-07 最终 `author:ADui` 包验证（最新）**：维护者 Windows 本地完成 `vp check` 首次格式问题（仅 W-07 报告文件）、`vp check --fix` 修复后格式/Lint PASS（19 文件零错误警告）、`vp pack` 唯一 CSS 200 B、真实 `pnpm run test:package` **1/1 PASS**、`pnpm run test:consumer` **1/1 PASS**、`npm pack --dry-run --json --ignore-scripts` 五文件清单 PASS（13663 B，`package.json` 1355 B），最终 `git status --short` 无输出。**P-03 含作者元数据已真实验收通过**；本轮未再次运行 Vitest、33 项离线 Node 或冻结安装，保留既有证据，不新增 CI。正式版本、作用域权限、对外兼容性声明及发布需另行批准。详见 [W-07 审核报告](research/W07_RELEASE_READINESS_REVIEW.md)。

## 6. 安全和发布门禁（规划）

- 审核第三方规则的许可证及改写过程；不引入未经审批的远程字体、图片或跟踪请求。
- 浏览器支持策略见 [ADR-0004](adr/0004-browser-support-policy.md)，验证门槛见 [REVIEW_GATE](research/REVIEW_GATE.md)，工作顺序见 [MVP 实施计划](plans/MVP_IMPLEMENTATION_PLAN.md)。
- 所有公开入口必须能在实际发布包内解析，默认入口不得隐式导入可选增强。
- 浏览器关键回归、许可证、发布文件清单和版本说明全部确认后，才可申请发布。
- npm 权限、版本发布和 GitHub Release 需另行授权；不引入 CI Secrets 或发布工作流。

## 7. 故障报告格式

记录：任务/需求编号、环境及浏览器版本、最小复现页面、实际/预期差异、受影响入口、测试证据、原因分析、修复结果、无法验证事项。

**更新约定**：在明确批准开发后，新增真实本地脚本、测试或运行环境时，以可执行命令更新本页；**项目不增加任何 CI**。如未运行必须明确记录原因。
