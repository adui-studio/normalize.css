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

## 4. 下一步与关闭条件

1. 保留此次 Chrome 156 的 R-003 **局部无差异**观察；优先收集目标 **Chrome 120 / Edge 120 / Firefox 121 / Safari 17.2** 的原始 T0/T1 JSON、真实构建号、DevTools UA 声明。
2. 先诊断 R-004 样式生效问题再讨论强制 `font-size: 1em` 的影响；**不要把 T1=13px 当成候选可用**。
3. 定位 `DEP0190`：离线包测试在 Windows 上使用 `shell:true` 的警告可考虑通过无 shell 的参数传递修复，但需要复测 npm.cmd 启动是否兼容，不在本轮凭推测改动。
4. 对 `vp check` 的 66 项格式问题分类：上游 Skills 原样保留；第一方代码与文档再按最小范围处理。完成修复前不得写作检查通过。
5. 核对 `pnpm-lock.yaml` 是否存在及 `git status --short`；**本次并未取得/提交锁文件**。
6. W-03 与 W-02 的目标旧版/移动端和兼容性门槛未完成，Issue #3 / #4 继续 Open；没有正式 CSS 发布、没有 CI。
