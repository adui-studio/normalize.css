# 0.0.3 · R-007 / R-008 浏览器兼容证据复审与本地补证

**日期**：2026-11-05  
**任务**：[Issue #22](https://github.com/adui-studio/normalize.css/issues/22) · [Issue #18](https://github.com/adui-studio/normalize.css/issues/18)  
**审查基线**：`main@8edcd5070e9b7be86202405d2a1f21845a3d04e3`，开发版本 `0.0.3`，默认 CSS 仍为 R-003/R-007/R-008。  
**证据等级**：本次已核对项目实际 Fixture/比较器和浏览器厂商公开原始资料；**未取得本轮 Safari / Chromium 真实设备新的 T0/T2 JSON，不能写成浏览器 PASS**。

## 1. 本次决定与风险优先级

| 规则 | 当前产品声明 | 上游证据 | 本库新增风险 | 评审建议 |
| --- | --- | --- | --- | --- |
| R-007 | `:where(abbr[title]) { text-decoration: underline dotted; }` | WebKit Bug 277889 针对 UA 样式使用 `-webkit-` 前缀修复；Safari 26.2 才完善无前缀简写 | **高**：历史 Safari 上本库无前缀声明可能无法达到点状下划线目标；现有作者样式探针也使用复合简写 | 保留已发布规则，先做真实旧 Safari 的声明解析和可见效果检查，再评审最小修正 |
| R-008 | `:where(table) { border-color: currentColor; }` | 旧 Chromium UA 的 `border-color: gray` 已被 Chrome/Edge 149 修复 | **中**：新版本冗余，但旧 Blink 可能仍需；需核对是否影响作者显式边框与旧 HTML `border` 属性 | 暂保留兼容旧 Blink；优先补 Chrome/Edge 120 的 T0/T2 对照，不直接移除 |

**结论**：`0.0.3` 暂不改 `src/normalize.css`、包导出、依赖或版本。任何 R-007 修订（例如分开写长属性或添加回退）必须先证明对目标旧 Safari 的实际收益、现代浏览器的低侵入性，以及没有改变作者 CSS 优先级；不要直接把建议 CSS 当作已批准方案。

## 2. R-007：重点区分 WebKit UA 修复与本库作者 CSS

1. [WebKit Bug 277889](https://bugs.webkit.org/show_bug.cgi?id=277889) 在 2024-08-09 报告，评论明确指出 Safari 17.6.1 中带 `title` 的 `abbr` 缺少预期点状下划线；问题讨论发现当时**无前缀** `text-decoration: dotted underline` 并未得到完整支持，修复是给 **UA 样式** 增加 `-webkit-` 前缀；2024-09-09 的 `283368@main` 标记为 FIXED。**此 FIXED 不能证明本库当前无前缀作者声明在 Safari 17.2 有效。**
2. [WebKit Safari 26.2 正式特性说明](https://webkit.org/blog/17640/webkit-features-for-safari-26-2/)（2025-12-12）说明 `text-decoration` 在该版本成为覆盖 `line/style/color/thickness` 的完整简写属性。这意味着**早期 Safari 的无前缀复合声明解析值得验证**；厂商历史材料不自动构成“所有 Safari 17.x 一定解析失败”的实测结论。
3. 现有 `fixtures/t2-native.html` / `fixtures/t2-package.html` 使用 `abbr-title`、`abbr-plain`、`abbr-author`；其中 `.abbr-author { text-decoration: overline solid; }` 也采用复合简写。**若旧 Safari 连测试夹具的这条作者声明也不能解析**，比较器会报告作者样式前置条件异常，不能草率归因于 Normalize 覆盖作者样式。应先用 DevTools 分辨“作者声明自身无效”与“包 CSS 覆盖”。
4. 对 `abbr-title` 观察 `getComputedStyle().textDecorationLine`、`.textDecorationStyle` 与实际视觉点状线；`CSS.supports("text-decoration", "underline dotted")` 仅为语法能力线索，不能替代计算样式、CSSOM 与视觉结果。记录 `CSS.supports("text-decoration-line","underline")`、`CSS.supports("text-decoration-style","dotted")` 可帮助定位长属性与简写差别。

**待验证判断分支**：如果旧 Safari T0 无点状线、T2 仍无点状线或 CSSOM 缺少预期声明，则 R-007 的该环境修复收益未证实；如果 T2 形成预期点状下划线且作者样式未被覆盖，则记录该确切版本的 PASS。即便 T0 与 T2 看起来相同，也必须先确认 T2 CSS 已真实加载与 CSSOM 可读。

## 3. R-008：旧 Blink 修复与现代冗余的边界

1. Chromium [2026-04-03 首次提交](https://chromium.googlesource.com/chromium/src/+/69afd54ee5a9591975dda9712d20328ee7b61a5c) 移除表格默认 `border-color: gray`，之后因上游测试失败出现回退；[2026-04-07 reland](https://chromium.googlesource.com/chromium/src/third_party/+/f0483397bdce74d5eb6cd956e87a62593b62d2e1) 可作为补充历史，不应只根据首次合入判断所有构建已生效。
2. [Chrome 149 发布说明](https://developer.chrome.com/release-notes/149) 与 [Edge 149 发布说明](https://learn.microsoft.com/microsoft-edge/web-platform/release-notes/149) 均记载已移除旧 UA 灰色边框声明，与 Firefox/WebKit 默认对齐。这证明厂商公布的兼容性方向，但**并不是本库运行在 Chrome 120 / Edge 120 的 T0/T2 实际样式证据**。
3. 当前 `table-border` 使用 `border="1"`，可比较 `borderTopColor` 与 `color`。另有 `table-author` 使用 `color: rgb(20, 40, 60)` 与 `border-color: rgb(120, 80, 40)`，应确认 T2 不覆盖作者颜色。
4. `:where(table)` 选择器本身的特异性为零（[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity)），适合降低作者样式冲突；但**零特异性并不代表规则没有可观察效果**，对 UA 正常值的作者级声明仍需谨慎取舍。

**待验证判断分支**：在旧 Blink 中，如 T0 的表格边框与文字颜色不同、T2 变为相同且 `table-author` 未回归，则记录有限的兼容收益；在已修复的现代 Blink 中若 T0/T2 无差异，记录“此环境冗余”，而不是把零差异误报为测试失败。保留旧浏览器兼容的收益与维护成本由维护者后续裁定。

## 4. 真实浏览器补证顺序

| 优先级 | 环境 | 核实要点 | 证据状态 |
| --- | --- | --- | --- |
| P0 | 实际 Safari 17.2/macOS、Safari iOS 17.2（如可获得） | R-007 无前缀复合简写是否解析，`abbr-title` 的点状线，作者自定义修饰是否原生可用 | `EVIDENCE_MISSING` |
| P0 | 旧 Safari 17.6.1（如可获得） | 复现 WebKit 277889 描述的历史行为并比较 T2 | `EVIDENCE_MISSING` |
| P1 | Chrome for Testing 120、Edge 120（真实安装版本） | R-008 的 `table-border` / `table-author` T0/T2 | `EVIDENCE_MISSING` |
| P1 | Safari 26.2+、Chrome/Edge 149+（实际可用环境） | 上游修复后的冗余/作者样式不回归 | `EVIDENCE_MISSING` |
| P2 | Firefox 121、现有主力版本及组件消费 | 确保原生行为和已报告局部测试不回归 | `EVIDENCE_MISSING`（本次专项） |

旧版浏览器只在隔离的本地测试环境使用，不登录真实账号，不访问不可信网站。Playwright WebKit、移动视口模拟、UA 字符串修改不能充当品牌 Safari 或真实移动端的版本证据。已有 [W-07 P-05 历史矩阵](W07_P05_BROWSER_EVIDENCE_MATRIX.md) 的管理验收和复用政策仍有效，本专项不强制为成熟相同规则重复完成全部七项历史最低版本验证；若公开承诺明确最低浏览器版本，证据必须与承诺匹配。

## 5. 不新增测试工具的本地执行步骤

在当前 `main` 的 Windows PowerShell 中先生成**真正供 T2 加载的 CSS**，再启动本地 Fixture：

```powershell
git switch main
git pull --ff-only origin main
git rev-parse HEAD
pnpm install --frozen-lockfile
pnpm exec vp pack
pnpm exec vp dev
```

在**同一真实浏览器和相同设备/配置**中分别访问（端口以 `vp dev` 实际输出为准）：

- `http://localhost:5173/fixtures/t2-native.html`（T0：不加载本库 CSS）
- `http://localhost:5173/fixtures/t2-package.html`（T2：加载 `../dist/normalize.css`）

两页已提供 `#probe-output`。保存其 JSON 分别为 `t2-native.json` 和 `t2-package.json`，不得修改 `userAgent`、`location`、`rows` 或手工拼造 CSSOM。若真实移动设备通过局域网访问 Windows 开发机，不能用手机自身的 `localhost` 代替；按实际地址、网络隔离规则配置访问。

在每个页面的 DevTools Console 可直接执行下面的**只读**检查，连同浏览器“关于”页面的完整版本、OS 与日期一起记录：

```js
const abbr = document.getElementById("abbr-title");
const authorAbbr = document.getElementById("abbr-author");
const table = document.getElementById("table-border");
const authorTable = document.getElementById("table-author");
console.table({
  unprefixedShorthand: CSS.supports("text-decoration", "underline dotted"),
  separateLine: CSS.supports("text-decoration-line", "underline"),
  separateStyle: CSS.supports("text-decoration-style", "dotted"),
  abbrLine: getComputedStyle(abbr).textDecorationLine,
  abbrStyle: getComputedStyle(abbr).textDecorationStyle,
  authorAbbrLine: getComputedStyle(authorAbbr).textDecorationLine,
  authorAbbrStyle: getComputedStyle(authorAbbr).textDecorationStyle,
  tableBorder: getComputedStyle(table).borderTopColor,
  tableText: getComputedStyle(table).color,
  authorTableBorder: getComputedStyle(authorTable).borderTopColor,
  authorTableText: getComputedStyle(authorTable).color,
});
```

随后关闭 `vp dev`，对同一个浏览器的两份 JSON 执行既有比较器（不新装依赖）：

```powershell
node tests/t2-evidence.mjs .\t2-native.json .\t2-package.json
```

比较器要求相同 `userAgent`、正确 T0/T2 页面角色、15 个探针，以及 T2 的三个完整 CSSOM 规则；它会对错误数据和样式回归返回非零退出码。**`PROBE_PASS` 只代表记录的样式与 CSSOM 在该环境通过，不等于全部浏览器兼容保证。** 需要分别留存 T0/T2 原始 JSON、CLI 输出、Network CSS 请求状态和异常截图，不要只提交结论。

## 6. 本轮未完成 / 下一步裁定

- **已研究**：上游 WebKit、Chromium、Chrome/Edge 官方资料；当前源码的 15 探针与比较器字段；零特异性和作者样式保护的边界。
- **未执行**：旧 Safari/旧 Blink 真实 T0/T2；可用浏览器的 `CSS.supports`/视觉验证；对未来修订 CSS 的跨引擎回归。**不存在可声称的新设备 PASS**。
- **待评审**：R-007 是否需要兼容旧 Safari 的声明写法调整；是否需要先修正测试夹具中 `.abbr-author` 的复合简写才能可靠证明旧 WebKit 上作者样式保留；R-008 对最低 Blink 目标的保留收益。
- **边界**：未经单项准入批准不改变产品 CSS 或公开子路径，不修改 `0.0.3` 版本、锁文件、依赖或 CI，不执行 npm publish、Tag、Release；`0.1.0` 仍待独立完整性验收与授权。
