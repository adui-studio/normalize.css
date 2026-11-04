# W-06 · T2 真实 CSS 浏览器对照（首批）

- **阶段**：维护者已提交 Chrome 156 的 T0/T2 页面截图并确认验证通过；可以确认当前截图中的实际 CSS 加载成功、10 个计算样式测量点一致、原生控件可见。新增的键盘、对话框、系统偏好等交互过程**尚无独立证据**，不得扩展为整套浏览器兼容性 PASS。
- **范围**：R-003 `b/strong` 与 R-004 默认等宽字号。基础 button/search/details/hidden 只作为手工观察点，不在本阶段宣称无障碍兼容通过。
- **相关**：[W-06 #7](https://github.com/adui-studio/normalize.css/issues/7) · [W-03](../plans/VITEPLUS_LOCAL_HARNESS_DESIGN.md) · [W-04 包证据](../plans/CSS_PACKAGE_DELIVERY_REVIEW.md)

## 本地运行

在项目根目录的 PowerShell 中：

```powershell
vp pack
vp dev
```

分别打开：

- T0 原生：`http://localhost:5173/fixtures/t2-native.html`
- T2 实际产物：`http://localhost:5173/fixtures/t2-package.html`

**先执行 `vp pack` 是必要前提**：T2 的 `<link>` 直接引用 `../dist/normalize.css`，对应 npm 包唯一根导出 `./dist/normalize.css`；不是拷贝的 T1 候选 CSS。T0 和 T2 的 body 与测试用父级字重样式相同，唯一增加的是 T2 的 CSS 链接。后续用 `vp build` 生成独立的 `dist-fixtures/` HTML 预览；该目录不进入 npm tarball。

## Chrome 156 · T0/T2 截图验证记录（2026-11-04）

**证据来源**：维护者在本次对话中提交的两张完整页面截图（T0 `/fixtures/t2-native.html`、T2 `/fixtures/t2-package.html`）及“验证通过”的人工确认。截图没有作为原始 JSON 或仓库截图文件上传；以下均为**截图可见事实或维护者反馈**，并非自动化浏览器执行结果。

- 浏览器：截图 UA 为 `Chrome/156.0.0.0`、Windows 平台标识（具体 Windows 发行版未单独核验），两页为相同浏览器环境。
- T2 计算样式面板显示 `packageStylesheet.href = "../dist/normalize.css"`、`packageStylesheet.loaded = true`；T0 无该字段，说明当前本地 Vite+ 服务中真实 CSS link 已挂载。该字段不替代 Network 200 或 stylesheet 内容校验；它与 W-04 已确认的产品构建证据结合使用。
- 两页原有 **10 个**探针行均一致：6 组 `b/strong` 计算字重（父级 400/600/700）、4 组 `code/kbd/samp/pre` 字号和字体族。截图中等宽元素字号均为 `13px`、fontFamily 为 `monospace`，符合 R-004 不强制改写默认等宽字号的决定。
- 两页原生 button、search、fieldset、select、textarea、checkbox 和 details/summary **可见**；静态截图不记录键盘事件、焦点状态、`dialog` 弹出及关闭、`hidden="until-found"` 的查找揭示、系统偏好切换。维护者总体反馈通过，**逐交互 F-003～F-007 的可复现证据仍未收集**。

**本次判定**：Chrome 156 的本地 **T0/T2 样式加载与静态计算样式对照 PASS（截图证据）**。不外推到 Chrome 120、Firefox 121、Safari 17.2、Edge 120、移动端或组件库。W-06 继续 Open；其余功能按 PASS / FAIL / NOT_RUN 逐项记账。

## 下一批：原生交互最小检查（F-003～F-007）

**T0、T2 都要用同一浏览器、相同设置操作一遍**，比较两页的行为是否一致。新增元素不会被 `[data-probe]` 作为字重目标计算，原有 10 个字重/字号测量点保持不变。

1. **F-003 · `details/summary`**：用 Tab 聚焦 `t2-summary`，按 Enter 或 Space 展开与关闭；记录展开状态和焦点是否保留。
2. **F-004 · 表单**：依次 Tab 聚焦 `t2-button`、`t2-search`、`t2-select`、`t2-textarea`、`t2-checkbox`，检查键盘输入、选择、勾选是否正常以及焦点是否可见。不能把视觉观察代替真实键盘操作。
3. **F-005 · `dialog`**：在两页的开发者工具 Console 各执行一次：
   ```js
   document.querySelector("#t2-dialog").showModal();
   ```
   检查焦点转移、是否进入模态 top-layer；先按 Esc 关闭，再重新打开并点击对话框内 `关闭对话框` 按钮。若环境不支持 `showModal`，记录为不支持/FAIL 或 NOT_RUN，不得用脚本假装支持。
4. **F-006 · `hidden`**：确认 `#t2-hidden` 默认不可见；使用页面查找 `until-found 的内容用于后续交互验证`，观察 `hidden="until-found"` 是否被浏览器按本机版本的原生能力揭示。记录查找路径和具体结果，Safari、Firefox、Chromium 的行为不互相代替。
5. **F-007 · 系统与焦点**：实际按 Tab，观察原生焦点标记；分别在普通与设置了降低动态效果/高对比度的系统环境下复测（若无对应环境，标记 NOT_RUN）。可记录当前值：
   ```js
   console.table({
     reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
     forcedColors: matchMedia("(forced-colors: active)").matches
   });
   ```
   读取媒体查询值只记录当前偏好，**不是已经验证模式切换的证据**。

每一项记录：浏览器准确版本与 OS、T0/T2 是否一致、实际操作、PASS/FAIL/NOT_RUN 和关键异常。新观察点只是复用既有两张测试页面，未修改任何产品 CSS；不添加模拟 DOM/键盘的脚本，也不安装 UI 框架或 CI。未收集结果前，F-003～F-007 继续 NOT_RUN。

## 观察方法与判定

1. 打开 T2 的开发者工具 Network，确认 `normalize.css` 加载成功；页面 `#probe-output` 中的 `packageStylesheet.loaded` 必须是 `true`。如果为 `false`、缺少该字段或网络加载失败，先检查 `vp pack` 与访问路径，**不得将计算值无变化标记为 PASS**。T0 不应出现 `packageStylesheet` 字段。
2. 在两页分别复制 `#probe-output` JSON，记录浏览器**实际版本/构建、OS、UA、页面 URL**和计算样式。字段包含六组 `b`/`strong` 字重、四组 `code`/`kbd`/`samp`/`pre` 字号/字体族。
3. 观察 R-003：Chrome for Testing 120 已有 T0/T1 四组计算字重差异的历史证据，但 **T2 必须重新采集**，不能直接复用 T1 结果。其他浏览器出现零差异也需按版本客观记录，不等于对所有平台支持的承诺。
4. 观察 R-004：正式 CSS 没有等宽字体字号规则；在**同一浏览器、同一设置**下，T0/T2 的四个代码元素计算字号与字体族应相同。
5. button、search、details/summary、`hidden` 和 `hidden="until-found"` 已留作原生行为观察点；**本轮没有自动化交互测试或通过证据**。键盘焦点、dialog、系统偏好、组件库和最低版本浏览器的完整 F-001～F-010 矩阵，继续在 W-06 中记录 PASS/FAIL/NOT_RUN。

开发者工具中可快速查看（无需外部插件）：

```js
const evidence = JSON.parse(document.querySelector("#probe-output").textContent);
console.log(evidence.packageStylesheet ?? "T0: no product CSS");
console.table(evidence.rows);
```

**验证门槛**：`vp check`、`vp test`、`npm run test:offline` 仅确保本地代码/契约没有明显回归；它们不能证明浏览器渲染。记录中的 `PASS` 只针对实际完成且可重现的 T2 项目。未测浏览器和功能应标记 `NOT_RUN`，不自行推断已支持。

不新增产品规则、框架依赖、CI、npm 发布或公开入口。
