# R-003 / R-004 · 首次本地 Vite+ 与 Chrome 156 验证记录

- **记录日期**：2026-11-04
- **证据来源**：维护者提供的四张本地 Fixture 截图，以及 pnpm、Node 测试、Vite+ 命令的终端原始输出。**本记录对用户提供的观察进行复核和转录，并非助手独立运行其 Windows 浏览器**。
- **关联**：[W-02 / Issue #3](https://github.com/adui-studio/normalize.css/issues/3)、[W-03 / Issue #4](https://github.com/adui-studio/normalize.css/issues/4)、[验证指南](R003_R004_LOCAL_VERIFICATION.md)
- **测试场景**：开发分支 `feat/viteplus-local-harness`，Vite+ 1.4.0，本地服务 `http://localhost:5173/`，Chrome UA 所示 `Chrome/156.0.0.0`、`Windows NT 10.0; Win64; x64`。
- **重要限制**：UA 中的 `Windows NT 10.0` 不足以区分 Windows 10 与 Windows 11；`Chrome/156.0.0.0` 是简化 UA，**不是完整发行构建号**，需要使用 `chrome://version` 补充。未检查 DevTools UA 获胜声明和原始文件的完整性。原始截图未纳入仓库。
- **当前不是最低版本兼容性验收**：目标 Chrome/Edge 120、Firefox 121、Safari 17.2 及移动端仍然 `NOT_RUN`。

## 1. 本机实际命令结果

| 操作 | 维护者提供的结果 | 状态 |
| --- | --- | --- |
| `pnpm install` | pnpm `11.24.0` 安装 `vite-plus@1.4.0` 成功；提示 peer dependency 警告 | **PASS / 带警告**；详情需 `pnpm peers check` |
| `npm run test:offline` | Node 内置测试共 22 项，`pass 22 / fail 0`；合成包 smoke 产生 Node `DEP0190` 弃用安全警告 | **PASS 22/22**；警告仍待定位 |
| `npm exec -- vp test` | 内置 Vitest `v5.0.5`，`tests/fixtures.test.ts` 的 5 项测试通过 | **PASS 5/5** |
| `npm exec -- vp dev` | Vite+ `v1.4.0` 启动成功，本地 `http://localhost:5173/`；4 个 Fixture 页面已由维护者打开 | **PASS（本地服务与页面）** |
| `npm exec -- vp check` | 报告 **66 个文件存在格式问题**，包括上游复制的 `.agents/skills/`、项目 Markdown、HTML/JS/TS 与 GitHub 模板 | **FAIL（格式）**；没有看到其他检查项完成的充分证据 |
| 本机锁文件 | `pnpm install` 已成功，但未提供 `git status` / 锁文件内容 | **未核对是否已生成及纳入 Git** |

**不要**为了让 `vp check` 通过而不加审查地执行全仓 `vp check --fix`：它会修改带来源/许可证记录的上游原版 Skills 与大量非任务文件。后续需针对第一方代码/文档制定最小格式处理方案；上游 Skills 应保持固定 SHA 原文，必要时按 Vite+ 官方 `fmt.ignorePatterns` 单独排除。正式格式通过在重验前仍为 `FAIL`。

## 2. R-003：Chrome 156 的真实截图观察（非最低目标）

| 父级 `font-weight` | T0 原生 `b` | T0 原生 `strong` | T1 候选 `b` | T1 候选 `strong` |
| --- | --- | --- | --- | --- |
| `400` | `700` | `700` | `700` | `700` |
| `600` | `900` | `900` | `900` | `900` |
| `700` | `900` | `900` | `900` | `900` |

两页均显示 `font-size: 16px`、`font-family: "Noto Sans SC"`，简化 UA 相同。**六组计算字重均无差异**。人工对照符合 `NO_COMPUTED_DIFFERENCE` 的数字条件，但**尚未从原始 JSON 文件运行 `tests/r003-evidence.mjs`**，故不得登记为自动比较器执行通过。

推论：在该台机器的 Chrome 156 下，没有证据证明 `b, strong { font-weight: bolder; }` 能改变默认计算结果。**不将其加入正式 Normalize CSS**；旧 Chrome、Firefox、Safari 仍需另行取证。

## 3. R-004：T1 有候选声明，但截图计算值没有变化（待诊断）

| 节点 | T0 父级字号 | T0 自身字号 | T1 父级字号 | T1 自身字号 |
| --- | --- | --- | --- | --- |
| `code` | `16px` | `13px` | `16px` | `13px` |
| `kbd` | `16px` | `13px` | `16px` | `13px` |
| `samp` | `16px` | `13px` | `16px` | `13px` |
| `pre` | `16px` | `13px` | `16px` | `13px` |

T0/T1 均报告 `font-family: monospace`。仓库 T1 HTML 明确包含 `code, kbd, samp, pre { font-size: 1em; }`，按预期相对于 16px 父级应得到 16px；**截图的 13px 尚不能解释为“声明生效但无风险”**，应先核对样式加载、层叠优先级及探针采样时机。

在 **R-004 T1 页面**的浏览器 DevTools Console 执行下面的只读诊断，记录输出；不要修改线上页面：

```js
(() => {
  const element = document.querySelector('#code');
  const styleElement = document.querySelector('#risk-review-only');
  return {
    readyState: document.readyState,
    styleElementPresent: Boolean(styleElement),
    inlineRule: styleElement?.textContent?.trim() ?? null,
    cssomRules: styleElement?.sheet
      ? [...styleElement.sheet.cssRules].map((rule) => rule.cssText)
      : null,
    parentFontSize: getComputedStyle(element.parentElement).fontSize,
    currentFontSize: getComputedStyle(element).fontSize,
    capturedFontSize: JSON.parse(document.querySelector('#probe-output').textContent)
      .rows.find((row) => row.id === 'code')?.fontSize,
  };
})()
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

| 元素 | T0 原生 | T1：仅 `font-size: 1em` | T1b：保留 `1em` 并追加 `monospace, monospace` |
| --- | --- | --- | --- |
| `code` | 13px | 13px | **16px** |
| `kbd` | 13px | 13px | **16px** |
| `samp` | 13px | 13px | **16px** |
| `pre` | 13px | 13px | **16px** |

- 三组页面均报告父级 `font-size: 16px`；T0/T1 的计算字体族为 `monospace`，T1b 四个元素报告 `monospace, monospace`。
- T1b Console 显示 `readyState: "complete"`、`currentFontSize: "16px"`、`capturedFontSize: "16px"`，二者一致；页面路径为 `/fixtures/r004-family-review.html`。
- 此次 Console 查询仍是 `#risk-review-only`，核对的是 **T1 保留下来的 `font-size: 1em` 声明**；**并未单独查询 `#family-review-only` 的 CSSOM**。但页面源文件已包含这一字体族规则，且探针的计算 `fontFamily` 已对应发生变化。
- **局部结论**：在此 Chrome 156 环境里，T1 与 T1b 的唯一新增作者 CSS 声明是重复的等宽字体族，测得字号从 13px 变成 16px。该现象与浏览器独立等宽字号机制的已知行为相符，但没有进行用户手动设置等宽字号、跨浏览器及字体实际渲染对照，**不进一步断言唯一内部原因**。
- **产品取舍**：保持低侵入原则，R-004 **不准入默认 Normalize**。不添加 `font-size: 1em`、`font-family: monospace, monospace` 或强制字体栈；T1b 只保留为风险验证 Fixture。后续若有可选 Typography 模块需求，再另行评审。
- 此次不运行新提交后的全部 Node/Vite+ 契约测试，上一轮 **22/22 Node 和 5/5 Vitest** 仅对应 T1b 新增前的提交；T1b 页面由维护者实际浏览器访问，但新测试的全量回归仍待执行。

## 3.3 Vite+ 格式检查的来源文件隔离（2026-11-04，配置已提交／未重测）

维护者最初执行 `npm exec -- vp check` 时有 66 个格式错误，涉及仓库自有文件与固定来源的第三方 `.agents/skills/` 文件。根据 [Vite+ 官方格式配置](https://viteplus.dev/config/fmt)，在开发分支的根 `vite.config.ts` **仅**新增：

```ts
fmt: {
  ignorePatterns: ['.agents/skills/**'],
}
```

该配置专门保护上游原版 Skills 的文本/许可证来源，不关闭第一方格式检查，不设置 `check.fmt: false`，也不删除检查工具。**当前还没有基于此配置重新运行 Vite+ 1.4.0 的格式或完整检查**；旧的 66 个错误是改动前基线，不能外推改动后还剩多少问题。

建议在维护者本地先执行 `pnpm exec vp fmt --check` 和 `pnpm exec vp check`，核对剩余第一方文件；可单独执行 `pnpm exec vp check --no-fmt` 判断 lint 部分，但该命令通过**不等于完整 check 通过**。对于需要格式化的自有文件，另行按最小范围处理并检查 Git diff，不对上游 Skills 执行批量 `--fix`。

## 4. 下一步与关闭条件

1. 保留此次 Chrome 156 的 R-003 **局部无差异**观察；优先收集目标 **Chrome 120 / Edge 120 / Firefox 121 / Safari 17.2** 的原始 T0/T1 JSON、真实构建号、DevTools UA 声明。
2. R-004 在 Chrome 156 已完成 T0/T1/T1b 计算字号对照：13px / 13px / 16px；不采纳默认强制字号/重复字体族。**仍需**最低目标浏览器、用户自定义等宽字号设置以及 CJK 实际字形/可访问性回归证据，才可更新跨浏览器结论。
3. 定位 `DEP0190`：离线包测试在 Windows 上使用 `shell:true` 的警告可考虑通过无 shell 的参数传递修复，但需要复测 npm.cmd 启动是否兼容，不在本轮凭推测改动。
4. 对 `vp check` 的 66 项格式问题分类：上游 Skills 原样保留；第一方代码与文档再按最小范围处理。完成修复前不得写作检查通过。
5. 核对 `pnpm-lock.yaml` 是否存在及 `git status --short`；**本次并未取得/提交锁文件**。
6. W-03 与 W-02 的目标旧版/移动端和兼容性门槛未完成，Issue #3 / #4 继续 Open；没有正式 CSS 发布、没有 CI。
