# R-003 / R-004 · 首次本地 Vite+ 与 Chrome 156 验证记录

- **记录日期**：2026-11-04
- **证据来源**：维护者提供的本地 Fixture 截图、终端原始输出，以及后续 R-003 T0/T1 原始 JSON。**本记录核对维护者提供的证据，并非助手独立运行其 Windows 浏览器**。
- **关联**：[W-02 / Issue #3](https://github.com/adui-studio/normalize.css/issues/3)、[W-03 / Issue #4](https://github.com/adui-studio/normalize.css/issues/4)、[验证指南](R003_R004_LOCAL_VERIFICATION.md)
- **测试场景**：开发分支 `feat/viteplus-local-harness`，Vite+ 1.4.0，本地服务 `http://localhost:5173/`，Chrome UA 所示 `Chrome/156.0.0.0`、`Windows NT 10.0; Win64; x64`。
- **重要限制**：UA 中的 `Windows NT 10.0` 不足以区分 Windows 10 与 Windows 11；`Chrome/156.0.0.0` 是简化 UA，**不是完整发行构建号**，需要使用 `chrome://version` 补充。未检查 DevTools UA 获胜声明和原始文件的完整性。原始截图未纳入仓库。
- **当前已完成两种桌面引擎的部分最低版本 R-003 计算样式验证**：Chrome for Testing 120.0.6099.109 复现四组差异；Firefox 121 的 T0/T1 为零差异；Edge 120、Safari 17.2 及移动端仍为 `NOT_RUN`，尚未完成完整兼容性验收。

## 1. 本机实际命令结果

| 操作                   | 维护者提供的结果                                                                                           | 状态                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `pnpm install`         | pnpm `11.24.0` 安装 `vite-plus@1.4.0` 成功；提示 peer dependency 警告                                      | **PASS / 带警告**；详情需 `pnpm peers check`       |
| `npm run test:offline` | Node 内置测试共 22 项，`pass 22 / fail 0`；合成包 smoke 产生 Node `DEP0190` 弃用安全警告                   | **PASS 22/22**；警告仍待定位                       |
| `npm exec -- vp test`  | 内置 Vitest `v5.0.5`，`tests/fixtures.test.ts` 的 5 项测试通过                                             | **PASS 5/5**                                       |
| `npm exec -- vp dev`   | Vite+ `v1.4.0` 启动成功，本地 `http://localhost:5173/`；4 个 Fixture 页面已由维护者打开                    | **PASS（本地服务与页面）**                         |
| `npm exec -- vp check` | 报告 **66 个文件存在格式问题**，包括上游复制的 `.agents/skills/`、项目 Markdown、HTML/JS/TS 与 GitHub 模板 | **FAIL（格式）**；没有看到其他检查项完成的充分证据 |
| 本机锁文件             | `pnpm install` 已成功，但未提供 `git status` / 锁文件内容                                                  | **未核对是否已生成及纳入 Git**                     |

**不要**为了让 `vp check` 通过而不加审查地执行全仓 `vp check --fix`：它会修改带来源/许可证记录的上游原版 Skills 与大量非任务文件。后续需针对第一方代码/文档制定最小格式处理方案；上游 Skills 应保持固定 SHA 原文，必要时按 Vite+ 官方 `fmt.ignorePatterns` 单独排除。正式格式通过在重验前仍为 `FAIL`。

## 2. R-003：Chrome 156 的真实截图观察（非最低目标）

| 父级 `font-weight` | T0 原生 `b` | T0 原生 `strong` | T1 候选 `b` | T1 候选 `strong` |
| ------------------ | ----------- | ---------------- | ----------- | ---------------- |
| `400`              | `700`       | `700`            | `700`       | `700`            |
| `600`              | `900`       | `900`            | `900`       | `900`            |
| `700`              | `900`       | `900`            | `900`       | `900`            |

两页均显示 `font-size: 16px`、`font-family: "Noto Sans SC"`，简化 UA 相同。**六组计算字重均无差异**。以上为最初截图观察；后续维护者已提交原始 JSON 并实际运行比较器，见下节。

推论：在该台机器的 Chrome 156 下，没有证据证明 `b, strong { font-weight: bolder; }` 能改变默认计算结果。**不将其加入正式 Normalize CSS**；旧 Chrome、Firefox、Safari 仍需另行取证。

### 2.1 原始 JSON 自动比较复核（2026-11-04）

维护者在 Windows 的 Chrome 156 Fixture 中，分别从 `/fixtures/r003-native.html` 和 `/fixtures/r003-candidate.html` 导出 `r003-native.json`、`r003-candidate.json`，并运行 `node tests/r003-evidence.mjs $native $candidate`。**维护者终端实际返回**：

- `status: "NO_COMPUTED_DIFFERENCE"`，`differences: 0`，`candidateFailures: 0`；六行 `candidateMatches` 均为 `true`。
- 父级 `400` 时 `b`、`strong` 在 T0/T1 均为 `700`；父级 `600`、`700` 时均为 `900`。
- T0/T1 的 UA 字符串一致，六组 ID、父级计算字重、`16px` 字号与 `"Noto Sans SC"` 字体族上下文一致。

助手对维护者上传的**两份原始 JSON 附件**完成独立解析与逐行数值复核，结果同样为零差异；**没有**在维护者 Windows 浏览器内重新运行。附件保留在本次对话，不向公开仓库提交原始环境数据。上传附件 SHA-256（仅用于识别这一份证据文件）：

- `r003-native.json`：`5760e2d712c7f52622d7483c9f75e1cd2cb7189e131512ac1679679113ea322d`
- `r003-candidate.json`：`8c89facf37e8cc987a19b3ccb34638a18384bf7c634f962d8517b089aec4f97e`

**局部结论**：当前 Chrome 156 运行环境中，`b, strong { font-weight: bolder; }` 没有改变上述六组计算值；这不说明所有浏览器均不需要修复。UA 只给出简化的 `Chrome/156.0.0.0`，完整构建号、DevTools 获胜 UA 声明、真实字形渲染、Chrome/Edge 120、Firefox 121、Safari 17.2 与移动版本仍需独立验证。R-003 保持**条件性候选／未准入默认 CSS**。

## 2.2 Chrome for Testing 120.0.6099.109：R-003 真实差异已复现（2026-11-04）

**来源与环境**：维护者使用 Browser Workshop v1.0.0 启动官方 Chrome for Testing `120.0.6099.109`（64 位）。`chrome://version` 截图显示 Windows 11 Version 25H2（Build 26200.9711）。UA 对 T0/T1 均为 `Chrome/120.0.0.0`，这是简化 UA，**准确构建号以版本页截图为准**。维护者上传了两份浏览器探针生成的 JSON，助手已独立解析并逐条对照，但**没有在此执行者环境启动该旧版 Chrome 或运行现有 CLI**。

| 测量对象 | 父级计算字重 | T0 原生计算值 | T1 单规则候选计算值 | 是否变化 |
| --- | --- | --- | --- | --- |
| `b`、`strong` | 400 | 700 | 700 | 否（2 组） |
| `b`、`strong` | 600 | 700 | 900 | **是（2 组）** |
| `b`、`strong` | 700 | 700 | 900 | **是（2 组）** |

两份数据均有六个唯一测量 ID；父级字号、元素字号都为 `16px`；字体族一致为 `"Microsoft YaHei"`。逐行核对确认 **4/6 组计算字重发生变化，0/6 组候选规则结果不符合预期**。按 `tests/r003-evidence.mjs` 的比较算法，此数据**应返回** `COMPUTED_DIFFERENCE_OBSERVED`、`differences: 4`、`candidateFailures: 0`；**维护者尚未提供该命令在 Chrome 120 两份文件上的实际运行输出**，不可将独立 JSON 分析写成 CLI 已执行通过。

证据文件保留在本次对话附件，不直接提交公开仓库。SHA-256：

- `r003-native (1).json`：`d5fcc85606dc0d71f2f18df62b3457b073baf05bc4ddf8a6044add26fde86342`
- `r003-candidate (1).json`：`40928f30a2e01acd930662ec1210231f8ac081490b24233fceb8f26f643c4ee0`

**版本对照**：Chrome 156 的真实对照为零差异（§2.1）；Chrome 120 的这组数据为 4 个计算值差异。这支持旧版 Blink 的候选补丁必要性研究，**不是** Edge 120、Android Chrome 120、Firefox 121、Safari 17.2 或正式 Normalize 的通过证明。

**环境风险与后续**：版本页启动命令及浏览器标签栏截图显示 `--disable-extensions`、`--disable-background-networking`、`--proxy-server=...` 被当作网页地址打开，**无法据此确认这些附加限制曾生效**；独立 BWS Profile 不是操作系统隔离，是否实际断开外网未获确认。后续在真实受控隔离条件下复测时，不应将这次命令行附加参数视为安全保证。尚未从 DevTools Styles 核对胜出 UA 声明、嵌套字重、实际字体字形及组件库覆盖风险。R-003 进入**有旧版真实差异证据的条件性候选评审**，仍不准入正式产品 CSS，Issue #3 保持 Open。

## 2.3 Chrome 120 原始 JSON：独立 Node 比较器执行（2026-11-04）

在独立的 Linux 容器 Node.js `v22.16.0` 环境中，助手根据 GitHub 开发分支当前 `tests/r003-evidence.mjs`、`tests/evidence-file.mjs` 的实际内容复制出独立临时模块，并对维护者上传的两份 **Chrome 120** JSON 附件运行同样的 CLI 比较逻辑。真实执行结果：

```text
status: COMPUTED_DIFFERENCE_OBSERVED
differences: 4
candidateFailures: 0
exit_code: 0
```

六组详细结果与 §2.2 的原始 JSON 对照完全一致：`b-400` / `strong-400` 不变，`b-600` / `strong-600` / `b-700` / `strong-700` 由 `700` 变为 `900`。两份文件的 SHA-256 重新计算后，与 §2.2 的登记值一致。

**证据边界**：这是基于仓库文件内容在独立容器复制运行比较器的结果，不是维护者 Windows 本机执行记录，也不等于在该容器重新启动 Chrome 120；尚未运行项目完整的 `vp check` / `vp test`。继续保留 DevTools UA 获胜声明、Firefox 121 等其他版本及组件库回归的待验证状态。

## 2.4 Firefox 121.0：R-003 真实 T0/T1 字重无差异（2026-11-04）

维护者通过 Windows PowerShell 使用仓库现有 `node tests/r003-evidence.mjs $native $candidate` 比较 Firefox 121 的 T0/T1 原始 JSON；**终端实际输出** `status: "NO_COMPUTED_DIFFERENCE"`、`differences: 0`、`candidateFailures: 0`，六行 `candidateMatches: true`。浏览器 UA 为 `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0`；这可证明 UA 宣称 Firefox 121，但不是独立核验完整发行构建号或操作系统版本。

用户上传的 `r003-native-ff121.json` 和 `r003-candidate-ff121.json` 经助手独立读取、结构与数据逐行核对：六个唯一 ID 相同；父级 400 下 `b`、`strong` 计算值均为 700，父级 600/700 下均为 900；T0/T1 的父级字重、父级与元素字号（16px）以及字体族（`sans-serif`）完全一致。当前 JSON 不证明 UA 默认声明来源或实际字体字形渲染。

| 文件（仅本次对话附件，未提交公开仓库） | SHA-256 |
| --- | --- |
| `r003-native-ff121.json` | `3f10c15f8421580f936f758c4828a883bbda44f1e7cfe95030de0ce599214a48` |
| `r003-candidate-ff121.json` | `39a42afee64a26ebc6432ed82a40f0c84e68f69c5d412d67a31f4b6c64603dc3` |

**解释及边界**：与 Chrome for Testing 120.0.6099.109 的四组差异形成真实 Gecko/Blink 对照；本次 Firefox 121 计算样式未受额外候选规则影响，不代表所有 Firefox 版本、Firefox Android、真实字体渲染、正式 Normalize 包或 UI 框架均已通过。Firefox 121 的 `about:support` 完整构建 ID、DevTools UA 来源、嵌套字重与组件库回归仍待补充。R-003 保持条件性候选，不直接写入 CSS。

## 3. R-004：T1 有候选声明，但截图计算值没有变化（待诊断）

| 节点   | T0 父级字号 | T0 自身字号 | T1 父级字号 | T1 自身字号 |
| ------ | ----------- | ----------- | ----------- | ----------- |
| `code` | `16px`      | `13px`      | `16px`      | `13px`      |
| `kbd`  | `16px`      | `13px`      | `16px`      | `13px`      |
| `samp` | `16px`      | `13px`      | `16px`      | `13px`      |
| `pre`  | `16px`      | `13px`      | `16px`      | `13px`      |

T0/T1 均报告 `font-family: monospace`。仓库 T1 HTML 明确包含 `code, kbd, samp, pre { font-size: 1em; }`，按预期相对于 16px 父级应得到 16px；**截图的 13px 尚不能解释为“声明生效但无风险”**，应先核对样式加载、层叠优先级及探针采样时机。

在 **R-004 T1 页面**的浏览器 DevTools Console 执行下面的只读诊断，记录输出；不要修改线上页面：

```js
(() => {
  const element = document.querySelector("#code");
  const styleElement = document.querySelector("#risk-review-only");
  return {
    readyState: document.readyState,
    styleElementPresent: Boolean(styleElement),
    inlineRule: styleElement?.textContent?.trim() ?? null,
    cssomRules: styleElement?.sheet
      ? [...styleElement.sheet.cssRules].map((rule) => rule.cssText)
      : null,
    parentFontSize: getComputedStyle(element.parentElement).fontSize,
    currentFontSize: getComputedStyle(element).fontSize,
    capturedFontSize: JSON.parse(document.querySelector("#probe-output").textContent).rows.find(
      (row) => row.id === "code",
    )?.fontSize,
  };
})();
```

- 若 `currentFontSize === "16px"` 而 `capturedFontSize === "13px"`，优先调查探针**过早采集**或样式动态注入时机。
- 若两者均为 `13px` 且候选声明不存在于 CSSOM，优先检查页面实际响应 HTML、开发服务器处理和缓存。
- 若两者均为 `13px` 且 CSSOM 中存在声明，使用 DevTools **Styles** 查看获胜声明/覆盖来源；在确认前不得改动产品 Normalize。
- 如果样式已经正常应用，才开始比较系统独立等宽字体字号偏好。当前 R-004 默认**不强制字号**的低侵入决策不变。

## 3.1 Console 复核结果与下一项独立实验

维护者补充的 T1 Console 截图确认：`readyState: "complete"`、`stylePresent: true`，CSSOM 可读出 `code, kbd, samp, pre { font-size: 1em; }`，`currentFontSize: "13px"` 与 `capturedFontSize: "13px"` 一致，`parentFontSize: "16px"`。这排除了“样式元素不存在”或“探针采样后最终字号已变化”的假设，**但不代表已完整确认 CSS 层叠中的获胜声明**。

参考 [MDN 对浏览器独立等宽字号偏好的说明](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-family#monospace_font_size)，单独的 `monospace` 字体族与重复的 `monospace, monospace` 对独立等宽字号偏好的处理可能不同。已设计并执行 T1b `/fixtures/r004-family-review.html`：保留 T1 的 `font-size: 1em`，只额外添加 `font-family: monospace, monospace`。维护者已提供真实 Chrome 156 截图，四种元素的计算字号均为 **16px**，详见下节。此结果不能替代目标最低浏览器版本实测。

## 3.2 T1b 实测结果：重复 monospace 后计算字号发生变化

**证据来源**：维护者于 2026-11-04 提供的第五组浏览器截图（T1b 页面及 DevTools Console），并与前述 T0/T1 截图进行对照。浏览器 UA 显示 `Chrome/156.0.0.0`、Windows NT 10.0（Windows 实际版本和 Chrome 完整构建号仍未确认）。记录仅为这台机器的**计算样式观察**，不是最低版本兼容性认证。

| 元素   | T0 原生 | T1：仅 `font-size: 1em` | T1b：保留 `1em` 并追加 `monospace, monospace` |
| ------ | ------- | ----------------------- | --------------------------------------------- |
| `code` | 13px    | 13px                    | **16px**                                      |
| `kbd`  | 13px    | 13px                    | **16px**                                      |
| `samp` | 13px    | 13px                    | **16px**                                      |
| `pre`  | 13px    | 13px                    | **16px**                                      |

- 三组页面均报告父级 `font-size: 16px`；T0/T1 的计算字体族为 `monospace`，T1b 四个元素报告 `monospace, monospace`。
- T1b Console 显示 `readyState: "complete"`、`currentFontSize: "16px"`、`capturedFontSize: "16px"`，二者一致；页面路径为 `/fixtures/r004-family-review.html`。
- 此次 Console 查询仍是 `#risk-review-only`，核对的是 **T1 保留下来的 `font-size: 1em` 声明**；**并未单独查询 `#family-review-only` 的 CSSOM**。但页面源文件已包含这一字体族规则，且探针的计算 `fontFamily` 已对应发生变化。
- **局部结论**：在此 Chrome 156 环境里，T1 与 T1b 的唯一新增作者 CSS 声明是重复的等宽字体族，测得字号从 13px 变成 16px。该现象与浏览器独立等宽字号机制的已知行为相符，但没有进行用户手动设置等宽字号、跨浏览器及字体实际渲染对照，**不进一步断言唯一内部原因**。
- **产品取舍**：保持低侵入原则，R-004 **不准入默认 Normalize**。不添加 `font-size: 1em`、`font-family: monospace, monospace` 或强制字体栈；T1b 只保留为风险验证 Fixture。后续若有可选 Typography 模块需求，再另行评审。
- 此次不运行新提交后的全部 Node/Vite+ 契约测试，上一轮 **22/22 Node 和 5/5 Vitest** 仅对应 T1b 新增前的提交；T1b 页面由维护者实际浏览器访问，但新测试的全量回归仍待执行。

### 3.2.1 Firefox 121.0 三组 R-004 Fixture（2026-11-04）

维护者在 Windows Firefox 121.0 使用现有的 `r004-native.html`（T0）、`r004-risk-review.html`（T1）及 `r004-family-review.html`（T1b），并以 PowerShell `Get-Content | ConvertFrom-Json` 读取三个已下载的探针 JSON，提供了完整表格输出。每个页面的 `code`、`kbd`、`samp`、`pre` **四个元素均相同**：

| 页面对照 | 父级字号 | 元素计算字号 | 计算字体族 |
| --- | --- | --- | --- |
| T0（无 Normalize） | `16px` | `16px` | `monospace` |
| T1（仅额外 `font-size: 1em`） | `16px` | `16px` | `monospace` |
| T1b（在 T1 基础上额外指定 `monospace, monospace`） | `16px` | `16px` | `monospace, monospace` |

**已验证层级**：以上表格来自维护者实际读取 JSON 的 PowerShell 原始输出；助手尚未收到这三份 R-004 JSON 文件，因此没有独立逐行解析或计算其指纹。数值说明 **当前 Firefox 121 配置下 T0/T1/T1b 字号无差异**，不是用户更改等宽字体偏好、渲染物理字形、所有 Gecko 版本均无影响的证据。与 Chrome 156 的 T0/T1=13px、T1b=16px 形成**不同测试环境**的计算字号观察，不可将环境差异直接定性为浏览器缺陷。

维护者另附独立 BWS Profile 的 Firefox `about:support` JSON；助手对该文件独立解析，核实 `application.version: "121.0"`、`buildID: "20231211174248"`、`updateChannel: "release"`、`osVersion: "Windows_NT 10.0 26200"`。报告的内容进程沙箱等级为 6。完整文件包含本机目录、设备与扩展信息，**不进入公开仓库**；此处仅保留必要版本摘要。此前 R-003 Firefox 121 的发行构建号缺口据此补齐，但 R-003/R-004 的 UA 获胜声明与字体偏好回归仍未验证。

**规则决策不变**：R-004 保留浏览器原生等宽字号偏好；默认 Normalize 不添加 `font-size: 1em`、重复的 `monospace` 字体族或固定代码字体栈。下一步建议在 Chrome for Testing 120 上运行同样三个 R-004 Fixture，继续区分引擎/版本与本地字体设置因素。

## 3.3 Vite+ 格式检查的来源文件隔离（2026-11-04，配置已提交／未重测）

维护者最初执行 `npm exec -- vp check` 时有 66 个格式错误，涉及仓库自有文件与固定来源的第三方 `.agents/skills/` 文件。根据 [Vite+ 官方格式配置](https://viteplus.dev/config/fmt)，在开发分支的根 `vite.config.ts` **仅**新增：

```ts
fmt: {
  ignorePatterns: ['.agents/skills/**'],
}
```

该配置专门保护上游原版 Skills 的文本/许可证来源，不关闭第一方格式检查，不设置 `check.fmt: false`，也不删除检查工具。**当前还没有基于此配置重新运行 Vite+ 1.4.0 的格式或完整检查**；旧的 66 个错误是改动前基线，不能外推改动后还剩多少问题。

建议在维护者本地先执行 `pnpm exec vp fmt --check` 和 `pnpm exec vp check`，核对剩余第一方文件；可单独执行 `pnpm exec vp check --no-fmt` 判断 lint 部分，但该命令通过**不等于完整 check 通过**。对于需要格式化的自有文件，另行按最小范围处理并检查 Git diff，不对上游 Skills 执行批量 `--fix`。

## 3.4 第二轮本机回归：上游 Skills 隔离生效（2026-11-04）

维护者提供 Windows PowerShell 最新完整命令输出；以下均为**维护者本地执行结果**，助手尚未在同一 Windows 环境独立复跑：

| 操作                   | 最新结果                                             | 结论                                                          |
| ---------------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| `vp fmt --check`       | 检查列出 54 个第一方文件，报告 `Format issues found` | **FAIL**；尚未执行格式修复                                    |
| `vp check`             | 仍因格式问题失败，报告 54 个文件                     | **FAIL**；不能视为完整 lint/type-check 通过                   |
| `vp test:offline`      | Vite+ 返回 `Command 'test:offline' not found`        | **调用方式错误**；该名称属于 npm script 而非 Vite+ 内置子命令 |
| `npm run test:offline` | Node `tests 23 / pass 23 / fail 0`                   | **PASS 23/23**；离线包测试仍出现 Node `DEP0190` 警告          |
| `vp test`              | Vitest 5.0.5，`tests/fixtures.test.ts` 共 6 项       | **PASS 6/6**                                                  |

与此前 66 个文件的格式报告相比，本轮不再列出 `.agents/skills/**`，与已提交的忽略配置相符；**但 54 是本轮输出列出的文件集合，不能以数量变化证明每一个被排除文件的具体格式状态**。项目自有文件仍应保持格式检查，不应通过扩大忽略范围规避问题。

下一步维护者需先检查 `git status --short`，运行 `vp fmt` 格式化第一方文件，复核 `git diff --stat` / `git diff --check`，再执行 `vp fmt --check` 与 `vp check`。如需隔离格式以诊断 lint，可单独使用 `vp check --no-fmt`，但它的通过不等于完整 `vp check` 通过。

**DEP0190 代码定位**：`tests/package-smoke.node.test.mjs` 的 `npm()` 辅助函数在 Windows 下以 `spawnSync('npm.cmd', args, { shell: true })` 启动 npm。警告与 Node 对 `shell: true` 携带参数数组的弃用提示一致；目前未修改。后续修复需保证 Windows `npm.cmd` 启动、参数安全传递与离线打包测试均通过，禁止仅靠屏蔽警告视为修复。

## 3.5 第三轮本机静态与测试回归，以及 Windows npm 子进程修复（2026-11-04）

维护者提交格式化修改后提供新一轮 Windows PowerShell 输出：`vp check` **PASS**（全部 54 个第一方文件格式正确；11 个文件无警告或 Lint 错误）；`vp test` **6/6 PASS**；`npm run test:offline` **23/23 PASS**。该轮离线 Node 测试仍显示 `DEP0190` 警告，因此不能宣称无警告验收。以上是**维护者本地运行结果**，并非助手独立运行 Windows。

根据 [Node.js child_process 官方文档](https://nodejs.org/api/child_process.html)，Windows `.cmd` 文件不能像普通可执行文件一样无 shell 启动，而 `shell: true` 搭配参数数组会产生未安全转义的 shell 解析风险。开发分支的 `tests/package-smoke.node.test.mjs` 已修改：Windows 下以 `process.execPath` 启动有效的 `npm-cli.js` 并将命令参数作为独立数组传递；优先验证 `npm_execpath` 是存在的 npm CLI，否则尝试 Node 安装目录下的 npm CLI。非 Windows 平台保留原有 `npm` 调用。没有通过关闭弃用警告掩盖问题。

**已验证的范围**：单独在 Linux Node 22 环境中运行了无 shell 的 Node npm CLI 离线 `pack` / `install`，包含路径空格场景，结果通过；未在本环境运行 Windows，也未基于此代码提交重跑全量 `vp check`、Vitest 和 23 个 Node 测试。**待维护者 Windows 本机执行** `vp check`、`vp test`、`npm run test:offline`，确认无 `DEP0190`、合成 CSS 包导出测试仍通过；如报 `Cannot locate npm CLI`，需记录 Node 安装来源与 `npm_execpath` 后再调整解析路径。

## 4. 下一步与关闭条件

1. 保留此次 Chrome 156 的 R-003 **局部无差异**观察；优先收集目标 **Chrome 120 / Edge 120 / Firefox 121 / Safari 17.2** 的原始 T0/T1 JSON、真实构建号、DevTools UA 声明。
2. R-004 在 Chrome 156 已完成 T0/T1/T1b 计算字号对照：13px / 13px / 16px；不采纳默认强制字号/重复字体族。**仍需**最低目标浏览器、用户自定义等宽字号设置以及 CJK 实际字形/可访问性回归证据，才可更新跨浏览器结论。
3. `DEP0190` 的无 shell npm CLI 启动修复已提交到开发分支，待真实 Windows 本机复测；不能将 Linux 的离线打包验证当作 Windows 已通过。
4. 第三轮维护者本机 `vp check` 已通过；新提交的测试代码和文档仍需完整重验。上游 Skills 保持原样，不扩大忽略范围。
5. 核对 `pnpm-lock.yaml` 是否存在及 `git status --short`；**本次并未取得/提交锁文件**。
6. W-03 与 W-02 的目标旧版/移动端和兼容性门槛未完成，Issue #3 / #4 继续 Open；没有正式 CSS 发布、没有 CI。
