# W-06 · T2 真实 CSS 浏览器对照（首批）

- **阶段**：测试页面与契约实现中；尚未取得本轮 T2 浏览器实测结果。
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
