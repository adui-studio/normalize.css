# W-06 · Tailwind Preflight 与 UnoCSS Reset 独立回归

**更新日期**：2026-11-04  
**状态（最新）**：三个互相隔离的 Reset 场景（Tailwind v4 Preflight、UnoCSS tailwind-v4、UnoCSS tailwind-compat）已取得 **9/9 真实 tarball + Vite+ 生产构建 PASS**，各自的 Chrome 156 三模式 12 元素 × 14 属性静态采样均零差异；Tailwind 另有两种加载顺序下的 CSS Layer 胜出截图、完整原生交互事件日志及 beforematch 证据。**维护者本轮确认剩余 UnoCSS 两套 Reset 的交互验证也全部通过**，记录为「维护者人工反馈 PASS（具体逐页原始交互日志尚未提供）」；不将该反馈伪装为工具独立复验或原始日志。F-010 的 Chrome 156 本轮三个 Reset 场景可记为已完成所约定的本地对照；Firefox/WebKit、最低目标浏览器、系统偏好和更完整表单无障碍场景的逐项原始证据仍未随本批记录提供。**维护者随后确认 W-06 已正式验收归档**；工作项结项与逐环境技术证据为不同层级，见 [W-06 验收归档索引](W06_ACCEPTANCE_INDEX.md)。

**前置**：维护者在本轮对话中确认 TDesign 对照已完成；其具体浏览器、日志、截图、结果尚未同步到 W-06 记录。以下任务直接推进 F-010，**不要求重复 TDesign**。

## 2026-11-04 · 维护者 Windows 实测回填：UnoCSS 两组构建 6/6 PASS

以下来自维护者提供的原始 PowerShell 终端输出，并非本执行环境独立重跑。

- `npm run test:reset -- unocss-tailwind-v4 --keep`：三组 `baseline`、`normalize-first`、`normalize-last` 全部成功；CLI 最终输出 `PASS: isolated Reset production builds and tarball resolution`。
- `npm run test:reset -- unocss-tailwind-compat --keep`：同样三组全部成功，CLI 输出同样 PASS。
- 两组输出的 `hasLayer` 均为 `false`；这是**当前产物的正则扫描结果**，与本测试中 UnoCSS Reset 不主动声明 Layer 一致，但单凭这一字段无法判断每条声明的最终 Cascade 优先级。
- 正反顺序产物 SHA-256 不同，只证明**产物不一致**，不等于计算样式存在差异或冲突。当前只有 R-003 `b,strong { font-weight:bolder }` 一条产品规则，仍需对浏览器最终值和胜出来源做验证。

| 场景 | 模式 | CSS 字节数 | SHA-256 | hasLayer | 构建 |
| --- | --- | ---: | --- | --- | --- |
| UnoCSS tailwind-v4 | baseline | 8162 | `a6974aae821ff22156cab7ccf62c5ef7afa22285651e343300c221fd4a05beb3` | false | PASS |
| UnoCSS tailwind-v4 | normalize-first | 8362 | `d2cd6586fd781a484ccdc09c11bead0414a4e5da05043044022807a12d760eb1` | false | PASS |
| UnoCSS tailwind-v4 | normalize-last | 8363 | `dedf5837aa5f2de0343f33b52f628ae60b881e713403b36605357a757284e82d` | false | PASS |
| UnoCSS tailwind-compat | baseline | 7700 | `626b893a9c0e0eff49859497975ed0a0f2de05b22192a66936ddfd4befa691d9` | false | PASS |
| UnoCSS tailwind-compat | normalize-first | 7900 | `1ad5d3f86a9f906d448526ce691803a98c388d427e40d5dacc0d6fa49cc57a20` | false | PASS |
| UnoCSS tailwind-compat | normalize-last | 7901 | `4f039abc9340265be20052228ad0be2d0fcc4d84b41ac2005f947fa15920f572` | false | PASS |

保留的隔离消费者目录（维护者终端原样输出，后续仅使用**当前实际存在的目录**）：

- `D:\Workspace\adui-studio\normalize.css\node_modules\.cache\adui-reset-UQvmww`（UnoCSS tailwind-v4）
- `D:\Workspace\adui-studio\normalize.css\node_modules\.cache\adui-reset-8TXDC6`（UnoCSS tailwind-compat）

**下一门槛**：分别启动每组的三份页面，在同一浏览器采集 `window.__aduiResetEvidence` 和对应胜出 CSS 声明；再单独运行 Tailwind Preflight。**本次没有提供这些浏览器结果、Tailwind 命令日志或新增离线套件检查日志**。因此 F-010 不勾选整体完成，也不修改产品 CSS。

## 2026-11-04 · Chrome 156 三份计算样式 JSON 静态对照（维护者提供）

维护者连续提供三份 `window.__aduiResetEvidence` JSON。三份 UA 相同：Windows NT 平台字符串、Chrome/156.0.0.0。按此前 `tailwind-v4` 优先、`baseline → normalize-first → normalize-last` 的既定测试顺序，**暂作为 `unocss-tailwind-v4` 的三个模式数据**；由于 JSON **没有**包含 `location.href`、模式 ID、Reset 名称或构建 CSS 哈希，不能从 JSON 本身独立确认模式及页面来源。需要额外 URL/加载记录作为证据闭环。

逐项阅读维护者提供的三份 JSON：每份 **12 个相同 ID、14 个相同计算样式属性**，共每份 168 个属性观测值；三份之间未发现任何计算值差异。重点如下：

| 检查项 | 三份观测结果 | 注意 |
| --- | --- | --- |
| `bold`、`strong` | `fontWeight: "900"` | 父级 600，`bolder` 的计算结果符合预期；不能单凭计算值证明最终胜出 CSS 文件 |
| `heading`、`paragraph`、`list` | `margin: 0px`、`fontSize: 16px` | 显示 Reset 风格的计算效果，不是本库新加的规则 |
| `code` | `fontSize: 16px`、字体族以 `ui-monospace` 开头 | 三份一致；与非 Reset 的浏览器默认字体大小不能混为同一实验 |
| `button`、`input` | `boxSizing: border-box`、`borderWidth: 0px`、背景透明 | 三份一致，未证明聚焦/输入/点击行为 |
| `hidden` | `display: none` | 仅静态显示计算值 |
| `until-found` | `display: block` | `hidden="until-found"` 可能通过 `content-visibility` 隐藏；不能以 `display` 单独判断查找揭示 |
| `dialog` | `display: none` | 只是未打开状态，未验证打开/Esc/焦点 |
| `outlineStyle` | 三份静态均为 `none` | 未采集 `:focus-visible` 状态，不能推断焦点标记被移除 |

**判定**：在“按既定顺序对应三个不同页面”的前提下，静态计算样式为 **0 差异（维护者 JSON）**；之前的真实 tarball / Vite+ 生产构建已 3/3 PASS。当前 **不能**据此判定完整 `BROWSER_PASS` 或确认 CSS 规则胜出来源。未发现需要修改 `src/normalize.css` 的具体冲突证据。

**下一步最小证据**：在三个页面各记录 `location.href`、当前 `style.css` 加载内容或 DevTools 资源、已确认的 `baseline/normalize-first/normalize-last` 身份；在差异风险点（尤其 `b/strong` 和聚焦状态）保留 DevTools 命中规则。UnoCSS `tailwind-compat` 要使用另一个独立消费者重复，Tailwind Preflight 仍单独执行。当前不混合 Reset、不增加 CI、不发布 npm。

## 2026-11-04 · UnoCSS tailwind-v4 三模式 CSS 页面来源复核（维护者提供）

维护者接着在三个不同的 Chrome 156 本地页面执行 `document.styleSheets` 来源检查，结果如下：

| 页面 URL | 首个样式表 `href` | 首个样式表 `data-vite-dev-id` 后缀 | 与预期模式 |
| --- | --- | --- | --- |
| `http://localhost:5180/` | `null` | `adui-reset-UQvmww/baseline/style.css` | 匹配 |
| `http://localhost:5181/` | `null` | `adui-reset-UQvmww/normalize-first/style.css` | 匹配 |
| `http://localhost:5182/` | `null` | `adui-reset-UQvmww/normalize-last/style.css` | 匹配 |

三页各有第二个 `href:null`、`viteId:null` 的样式表；**其用途尚未识别，不能据此声称已审计所有 CSS 声明或不存在其他动态样式**。首个样式表的 `data-vite-dev-id` 精确匹配先前 `--keep` 输出的 UnoCSS `tailwind-v4` 临时消费者目录及三份模式的 `style.css`，证明三页使用独立 Vite CSS 模块，而非三个端口意外落到同一份 `style.css`。

据此更新当前证据状态：

- **BUILD_PASS**：此组既有 3/3 真实 tarball + Vite+ 生产构建结果保持有效。
- **PAGE_SOURCE_CONFIRMED**：维护者提供的三个 URL 和 Vite 样式模块路径均与模式对应。
- **COMPUTED_EQUAL（有限静态采样）**：此前按三组顺序采集的三份 JSON，12 个元素 × 14 属性零差异；鉴于原始 JSON 本身不携带 URL/模式身份，这是**依据连续操作上下文关联的证据**，不是单份 JSON 内的自证。
- **尚未验收**：CSSOM 完整胜出规则与 `:focus-visible`、输入/按钮交互、`hidden="until-found"` 查找揭示；以及独立的 UnoCSS `tailwind-compat` 三页浏览器对照、Tailwind Preflight。不能把 F-010 整体标成 PASS。

**后续建议**：不再重复本组三页的静态计算值采样；下一批直接对 `adui-reset-8TXDC6` 的 compat 三页采集 URL 与计算结果，之后再独立运行 Tailwind。出现真实属性差异时才补采 DevTools Styles 面板最终胜出声明并评估是否修改产品 CSS。不新增 CI、不发布或合并。

## 2026-11-04 · UnoCSS tailwind-compat 浏览器基线（阶段记录）

维护者提供 Chrome 156 下的三组页面来源：
- 5180：`adui-reset-8TXDC6/baseline/style.css`；已收到 12 个元素、14 个计算样式属性。
- 5181：`adui-reset-8TXDC6/normalize-first/style.css`；尚未收到计算样式 JSON。
- 5182：`adui-reset-8TXDC6/normalize-last/style.css`；尚未收到计算样式 JSON。

三个页面的 Vite CSS 模块来源与隔离构建目录一致，记为 PAGE_SOURCE_CONFIRMED。现阶段**不能**将 compat 正反加载顺序标为静态零差异或完整浏览器 PASS。

compat baseline 与独立的 v4 baseline 相比：默认字体族、按钮背景和光标、输入框背景、dialog margin 等计算样式存在差异。这些是不同 Reset 的基线差异，不是 Normalize 冲突证据。

后续只需从 5181/5182 采集包含 URL 和 `window.__aduiResetEvidence` 的 JSON；不重复构建，不增加 CI。

## 2026-11-04 · UnoCSS tailwind-compat 三模式计算样式对照已补齐（Chrome 156）

维护者补充了 `http://localhost:5181/` 和 `http://localhost:5182/` 的 `window.__aduiResetEvidence` 全量 JSON。与此前 `http://localhost:5180/` 的 baseline 比较，这三份数据的浏览器 UA 相同（Chrome/156.0.0.0 / Windows NT），每份均有相同 12 个元素 ID、每个元素 14 个属性：

| 组别 | 页面/来源（此前已核对） | 采集数量 | 相对于 baseline 的静态差异 | 判定 |
| --- | --- | --- | --- | --- |
| baseline | 5180，`adui-reset-8TXDC6/baseline/style.css` | 12 × 14 | 基线 | 已采集 |
| normalize-first | 5181，`adui-reset-8TXDC6/normalize-first/style.css` | 12 × 14 | **0** | 静态一致 |
| normalize-last | 5182，`adui-reset-8TXDC6/normalize-last/style.css` | 12 × 14 | **0** | 静态一致 |

重点计算值：`bold` / `strong` 的 `fontWeight=900`；`code` 的 `fontSize=16px`；`heading` / `paragraph` / `list` 的 `margin=0px`；`button` 背景 `rgb(240,240,240)`、`cursor=pointer`；`input` 背景 `rgb(255,255,255)`；`dialog` 的 `margin=auto`；`[hidden]` 的 `display=none` 与 `[hidden="until-found"]` 的 `display=block`。这些值在三组中均相同。

**结论**：结合本组已记录的真实 tarball + Vite+ 生产构建 **3/3 BUILD_PASS** 与三页 CSS 来源证据，记录为 **COMPUTED_EQUAL（Chrome 156，12 元素 × 14 静态样式，前后顺序均相对 baseline 零差异）**。连同此前 `unocss-tailwind-v4` 的三模式静态一致结果，两套 UnoCSS Reset 的构建与静态采样均已有局部证据，且始终分别执行、未在同一消费者叠加。

**验收边界**：这并不证明所有 CSS 属性、鼠标/键盘交互、`:focus-visible`、`hidden=until-found` 查找揭示、弹窗实际打开行为、样式表胜出声明以及跨引擎兼容。此轮未执行本地新命令，数据来自维护者提供的原始 JSON，**不能将 F-010 或整个 W-06 标记为整体 PASS**。下一阶段应独立运行 Tailwind v4 Preflight 的三模式验证，且不因该两组结果修改产品 CSS。

## 2026-11-04 · Tailwind v4 Preflight 三模式生产构建（维护者 Windows 日志）

维护者执行 `npm run test:reset -- tailwind-preflight --keep`，命令输出 `PASS: isolated Reset production builds and tarball resolution`。测试在独立消费者中安装固定的 `tailwindcss@4.3.4`、`@tailwindcss/vite@4.3.4` 与开发期 Normalize tarball，未混合 UnoCSS Reset。三组 Vite+ 构建及 SHA-256 证据：

| 模式 | CSS 字节数 | SHA-256 | hasLayer | 构建 |
| --- | ---: | --- | --- | --- |
| baseline | 4586 | `811a10ce2388159ea26f8cba47e6296b6799c402ba3eef8f6e2a8bdafcc977c0` | true | PASS |
| normalize-first | 4786 | `074b40c42674108e538782ecf766ca501ac0d4bffb912c5dff1b8290a32a3e75` | true | PASS |
| normalize-last | 4786 | `5299c72db32767f1470cb68c6c492dadedfea5763afbbd0fe966ea1e34a3bff8` | true | PASS |

保留的消费者：`D:\Workspace\adui-studio\normalize.css\node_modules\.cache\adui-reset-JQcSHX`（`baseline`、`normalize-first`、`normalize-last`）。当前 `hasLayer:true` 为生成 CSS 的正则扫描结果；按现有测试脚本，Tailwind 场景还必须命中 `@layer base` 才会通过。正反顺序 CSS 字节数相同但 SHA-256 不同，表明输出内容不同，**不能据此判定浏览器最终计算值存在差异**。

**阶段结论：BUILD_PASS 3/3（维护者日志）**。尚无本组 Chrome/Firefox/WebKit 页面来源、计算样式、焦点交互或胜出 CSS 声明证据，不能宣布 Tailwind 浏览器兼容 PASS，F-010 仍部分完成。下一步直接复用临时目录，以三端口独立页面采集带 URL 的 `window.__aduiResetEvidence` 与 CSS 来源，不重复已成功的安装和生产构建；不修改产品规则、依赖或 CI。

## 2026-11-04 · Tailwind v4 Preflight 三模式静态对照（Chrome 156）

维护者提供了 Chrome 156（Windows NT UA）三个独立页面的 URL、`window.__aduiResetEvidence` 和 `document.styleSheets` 来源信息；对应先前已构建通过、带 `--keep` 保留的 `adui-reset-JQcSHX` 消费者：

| 模式 | URL | Vite CSS 模块 | 每组属性数 | 对 Baseline 的差异 |
| --- | --- | --- | ---: | ---: |
| baseline | `http://localhost:5180/` | `adui-reset-JQcSHX/baseline/style.css` | 12 × 14 = 168 | 基线 |
| normalize-first | `http://localhost:5181/` | `adui-reset-JQcSHX/normalize-first/style.css` | 168 | **0** |
| normalize-last | `http://localhost:5182/` | `adui-reset-JQcSHX/normalize-last/style.css` | 168 | **0** |

三份 JSON 均为相同的 12 个元素 ID 和 14 个计算属性，逐项核对一致；例如 `bold` / `strong` 的 `fontWeight:900`，`code` 的 `fontSize:16px`，标题、段落与列表的 `margin:0px`，按钮与输入框背景透明，普通 `[hidden]` 的 `display:none`，`[hidden="until-found"]` 的 `display:block`，关闭状态 `dialog` 的 `display:none`。三页均报告相应的 Vite CSS 模块路径，并包含第二份没有 `href` 或 `viteId` 标识的样式表；后者的具体来源尚未检查。

**阶段结果**：三组真实 tarball / Vite+ 生产构建此前均 **BUILD_PASS（3/3）**，本次 **PAGE_SOURCE_CONFIRMED + COMPUTED_EQUAL**（Chrome 156，当前样本 168 项静态计算样式，两个引入顺序均相对 baseline 零差异）。至此 Tailwind Preflight、UnoCSS tailwind-v4、UnoCSS tailwind-compat **三个互相隔离的方案**，各自三模式构建均已通过（共 9/9），并各自取得 Chrome 156 三页静态采样零差异的证据。

**层级归因边界**：Tailwind 正式产物存在 `@layer base`，而产品 Normalize 的 R-003 是未分层 `b, strong { font-weight: bolder }`；本次 `900` 的相同计算值不能确定浏览器最终胜出声明，亦不能单凭值一致证明 CSS Layers 的先后优先级。需另看 DevTools Styles 或 CSSOM 的匹配声明、重要性和层归属，尤其检查 `b` / `strong`，才可形成“层级胜出”结论。

**仍未验证**：`:focus-visible` 的键盘实际状态，按钮/输入行为，`hidden=until-found` 查找揭示，dialog 打开/Esc 关闭，第二个无来源样式表的声明，以及 Firefox/WebKit/目标旧版浏览器。以上不能从静态 JSON 推定 PASS，**F-010/W-06 均不能整体结项**。暂时没有证据需要修改 `src/normalize.css`；本轮未修改产品 CSS、依赖、CI 或发布配置。

## 2026-11-04 · Tailwind Preflight CSS Layers 胜出规则实测（Chrome 156）

维护者提供 `http://localhost:5181/`（`normalize-first`）和 `http://localhost:5182/`（`normalize-last`）的 Chrome 156 DevTools **Elements → Styles** 截图，选中元素均为 `b#bold`，其父级 `section` 设置 `font-weight: 600`。本次记录依据维护者截图及已确认的 `tests/reset-fixtures.mjs` / `src/normalize.css`；截图原文件仅在对话附件中，**未另存为 GitHub 仓库证据文件**。

| 验证项 | 5181：Normalize First | 5182：Normalize Last |
| --- | --- | --- |
| 未分层 `b, strong { font-weight: bolder; }` | DevTools 显示有效、未划线 | 有效、未划线 |
| Tailwind `base` 层的相同规则 | 显示在“级联层 base”，声明被划线覆盖 | 显示在“级联层 base”，声明被划线覆盖 |
| 最终计算字重 | 先前 JSON 为 `900` | 先前 JSON 为 `900` |
| 交换 CSS 导入顺序是否改变胜出规则 | 否 | 否 |

**归因**：当前产品 CSS 只包含 R-003 的未分层 `b, strong { font-weight: bolder; }`，Tailwind Preflight 在 `base` 层中也包含同选择器/同值的普通声明。依据此组 Fixture 的隔离导入及截图，两页均是**未分层的普通作者声明胜出**，层内声明被覆盖。对于相同来源、相同重要性的普通作者规则，CSS Layer 优先级先于特异性和源码顺序比较，未分层规则优先于具名层的普通规则；这不适用于所有来源和 `!important` 场景。

**范围内结论：CASCADE_WINNER_CONFIRMED（Chrome 156 / `b#bold` / 两种导入顺序）**。与之前的 3/3 BUILD_PASS、三模式 168 项静态采样零差异互相印证，没有发现本次 R-003 与 Tailwind Preflight 的顺序敏感问题；**不需要修改产品 CSS 或将 R-003 改成 `@layer` 规则**。当前测试仅对 `b#bold` 的 Styles 面板完成明确胜出规则归因（`strong` 的计算值一致，但未提供单独的 Styles 面板截图），不能推广成全部 CSS 属性、交互或完整浏览器兼容证明。

**剩余验收**：键盘 `:focus-visible`、真实表单交互、`hidden="until-found"` 查找揭示、dialog 行为以及 Firefox/WebKit/最低目标版本仍待分别取得证据；`F-010` / `W-06` 保持部分完成。未增加 CI、未修改源码或发布设置。

## 2026-11-04 · F-010 原生交互与无障碍手动验收（待执行）

**状态：测试步骤与临时采集代码已制定，尚无本批实测结果。** 这一步紧接三套 Reset 已完成的 9/9 生产构建、Chrome 156 三模式静态样式及 Tailwind `b#bold` 层叠归因。**不需要重新 `vp pack` 或 `npm run test:reset`，也不需要改动已保留消费者的代码。**

### 目标与边界

一次只验证一个独立 Reset 方案，不能把 Tailwind Preflight、UnoCSS tailwind-v4、UnoCSS tailwind-compat 混在同一个消费者。每组分别使用 `baseline`、`normalize-first`、`normalize-last` 三页，均保留相同 HTML 和系统设置；先从当前 Tailwind 消费目录 `adui-reset-JQcSHX` 开始。后续 UnoCSS v4（`adui-reset-UQvmww`）、compat（`adui-reset-8TXDC6`）可使用相同步骤，但需要分别归档。

现有 `tests/reset-fixtures.mjs` 有 `#button`、`#input`、`#details > summary`、`#hidden`、`#until-found` 与 `#dialog`；**没有 dialog 打开按钮、表单提交、按钮业务处理器，也没有 select/textarea/checkbox**。因此只能验证这些 DOM 的原生行为，不能凭本 Fixture 宣称复杂表单、业务处理器或完整无障碍覆盖。

### 操作步骤（Chrome 156，先测 Tailwind 三页）

1. 关闭旧服务或避免端口冲突，三个终端分别进入 `adui-reset-JQcSHX/baseline`、`normalize-first`、`normalize-last`，运行 `vp dev --port 5180`、`5181`、`5182`。确认三个页面 URL 和 Vite `styleIds` 分别对应三种模式。
2. **每个页面刷新后**，在 DevTools Console 粘贴下方代码一次。该代码仅向当前页面注册临时事件监听器，记录信任来源、焦点可见性、输入长度与原生控件状态；不会记录输入内容，不提交网络数据，不修改产品 CSS。刷新页面会清空临时监听。
3. 把焦点从 DevTools 切回页面，使用**物理键盘 Tab / Shift+Tab** 焦点遍历按钮、输入框与 `summary`，观察焦点环，并在采集日志中核查 `focusVisible`、`outlineStyle` / `outlineWidth` / `boxShadow`。仅 `outlineStyle:none`（未聚焦状态）不构成失败；某元素不匹配 `:focus-visible` 也必须结合实际输入方式和视觉反馈判断。
4. 真实鼠标点击 `#button`，确认有 `button-click` 且 `trusted:true`；按钮无业务事件，所以**不要求发生页面跳转或文本变化**。在 `#input` 手工输入测试字符（如 `adui-test`），确认 `input` 事件由可信操作触发，`inputLength > 0`。
5. 以键盘在 `summary` 上按 Enter 或 Space 打开/关闭 `details`，确认 `details-toggle` 和最终 `detailsOpen`；不要用 `element.click()` 冒充用户键盘操作。
6. 在 Console 执行 `window.__aduiF010.openDialog()` **仅用于打开**现有空原生 `dialog`，然后切回页面按物理 Esc，检查 `dialog-cancel`、`dialog-close` 与最终 `dialogOpen:false`。JS 伪造 `KeyboardEvent` 不等于可信 Esc，也不能证明默认关闭行为。
7. 确保测试前 `#until-found` 的 `hidden` 属性值为 `until-found`，使用浏览器自带 Ctrl+F 搜索该元素的文本 `查找时显示`；观察查找揭示，记录 `beforematch`（若浏览器支持）与 `untilFoundAttribute`。`getComputedStyle(...).display === "block"` 本身**不能**证明查找揭示。若已提前揭示，刷新后重测。
8. 每页操作结束执行 `copy(JSON.stringify(window.__aduiF010.report(), null, 2))`，将三份带 `url` 和 `styleIds` 的结果与必要截图归档。实际操作顺序和结果必须明确；不能把未出现的事件补写为 PASS。

**Console 临时采集代码（逐页复制）**：

```javascript
(() => {
  if (window.__aduiF010) {
    console.warn("F-010 采集器已存在；刷新页面后重新开始");
    return;
  }
  const byId = (id) => document.getElementById(id);
  const events = [];
  const removers = [];
  const watch = (target, type, handler) => {
    if (!target) throw new Error("缺少 Fixture 元素: " + type);
    target.addEventListener(type, handler, true);
    removers.push(() => target.removeEventListener(type, handler, true));
  };
  const push = (type, data = {}) => events.push({ type, ...data });
  watch(document, "focusin", (event) => {
    const element = event.target;
    if (!(element instanceof HTMLElement)) return;
    const style = getComputedStyle(element);
    push("focusin", {
      target: element.id || element.tagName.toLowerCase(),
      trusted: event.isTrusted,
      focusVisible: element.matches(":focus-visible"),
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      boxShadow: style.boxShadow,
    });
  });
  watch(byId("button"), "click", (event) =>
    push("button-click", { trusted: event.isTrusted }));
  watch(byId("input"), "input", (event) =>
    push("input", { trusted: event.isTrusted, length: event.target.value.length }));
  watch(byId("details"), "toggle", (event) =>
    push("details-toggle", { open: event.target.open, trusted: event.isTrusted }));
  watch(byId("until-found"), "beforematch", (event) =>
    push("beforematch", { trusted: event.isTrusted }));
  watch(byId("dialog"), "cancel", (event) =>
    push("dialog-cancel", { trusted: event.isTrusted }));
  watch(byId("dialog"), "close", (event) =>
    push("dialog-close", { trusted: event.isTrusted }));
  window.__aduiF010 = {
    openDialog() {
      const dialog = byId("dialog");
      if (dialog.open) dialog.close();
      dialog.showModal();
    },
    report() {
      return {
        url: location.href,
        userAgent: navigator.userAgent,
        styleIds: [...document.styleSheets].map((sheet) =>
          sheet.ownerNode?.getAttribute("data-vite-dev-id") ?? null),
        detailsOpen: byId("details").open,
        dialogOpen: byId("dialog").open,
        hiddenDisplay: getComputedStyle(byId("hidden")).display,
        untilFoundAttribute: byId("until-found").getAttribute("hidden"),
        inputLength: byId("input").value.length,
        events: events.slice(),
      };
    },
    stop() {
      removers.forEach((remove) => remove());
      delete window.__aduiF010;
    },
  };
  console.info("F-010 已启动。请手动操作，结束后执行 copy(JSON.stringify(window.__aduiF010.report(), null, 2))");
})();
```

**采集结果**：

```javascript
copy(JSON.stringify(window.__aduiF010.report(), null, 2));
```

### 无法读取 report 的排障

如果执行 `copy(JSON.stringify(window.__aduiF010.report(), null, 2))` 时出现 `Cannot read properties of undefined (reading 'report')`，表示当前页面的 `window.__aduiF010` **不存在**，通常是尚未执行上方完整的 `(() => { ... })();` 初始化代码、刷新页面导致全局变量丢失，或 Console 当前并非被测页面的执行上下文。**这不是 CSS 失败，也不能将测试标为 FAIL/PASS。**

请在当前页面 Console 依次执行：

```javascript
location.href
document.getElementById("button") !== null
typeof window.__aduiF010
```

应分别确认是目标端口、`true`，以及已初始化时的 `"object"`。若为 `"undefined"`，**先完整执行上方“Console 临时采集代码”代码块**（不是下方的 `copy(...)` 结果采集语句），看到“F-010 已启动”后再进行物理键盘/鼠标测试。若仍未初始化，保留 Console 第一条异常供诊断；不要立即改动项目源代码。所有页面均需单独初始化，刷新会清空变量及事件日志。

采集时可先用 `window.__aduiF010?.report?.()` 确认能返回对象，再执行 `copy(JSON.stringify(window.__aduiF010.report(), null, 2))`。

### 验收标准及不确定性

| 维度 | 目标证据 | 当前状态 |
| --- | --- | --- |
| CSS/页面来源 | 正确 URL、`styleIds` 指向对应 Reset 与模式 | 静态三组已核对；交互采集待执行 |
| 键盘焦点 | 物理 Tab 产生 `focusin`，焦点环/焦点可见行为符合原生预期 | NOT_RUN |
| 按钮、输入框 | 真实点击/输入，事件 `trusted:true`，输入长度变化 | NOT_RUN |
| details | summary 键盘操作使 `open` 正常切换 | NOT_RUN |
| dialog | `showModal()` 后真实 Esc 触发原生取消/关闭 | NOT_RUN |
| until-found | 浏览器查找能揭示隐藏内容，必要时记录 beforematch 与属性变化 | NOT_RUN |
| 跨引擎、系统偏好 | Firefox、WebKit、最低目标版本和系统强制色/减少动效 | NOT_RUN |

此代码为 DevTools 手动取证工具，**不是自动化测试结果或交互质量结论**。事件有时会因开发者工具焦点、浏览器默认行为或元素当前状态而缺失；要记录阻塞而非凭空填 PASS。CSS 只含 R-003，若观察到差异先比对同一 Reset 的 Baseline，不能把不同 Reset 的默认视觉差异归咎本库。所有手动测试依然不能替代未来真实跨浏览器回归；**不增 CI，不发布或合并 main**。

## 2026-11-04 · Tailwind Preflight 三模式原生交互日志已核对（Chrome 156）

维护者依次提供三份 `window.__aduiF010.report()`，其中 `normalize-last` 后续**补发最新日志**（替代其首次不含点击和输入事件的记录）。最终三份均为同一 Chrome/156.0.0.0 UA，CSS 来源分别命中 `adui-reset-JQcSHX/baseline/style.css`、`normalize-first/style.css`、`normalize-last/style.css`，对应 `localhost:5180/5181/5182/`；日志来源和模式关系已确认。

| 检查项 | Baseline 5180 | Normalize First 5181 | Normalize Last 5182（最新日志） |
| --- | --- | --- | --- |
| Button 点击 | 有 `button-click`，`trusted:true` | 有 `button-click`，`trusted:true` | **补齐 3 次** `button-click`，均 `trusted:true` |
| Input 输入 | 有可信 `input`，最终长度 9 | 有可信 `input`，最终长度 9 | **补齐**可信 `input` 长度 1 至 9，最终长度 9 |
| `details` | 可信事件包含 `open:false` 和 `open:true`，最终 true | 可信事件包含 true 和 false，最终 true | 可信事件包含 true 和 false，最终 false |
| `dialog` Esc 取消与关闭 | `dialog-cancel`、`dialog-close` 可信；最终关闭 | 同左 | 同左 |
| 焦点 | button/input/summary 均有 `focusVisible:true` 与 `outlineStyle:auto`、`outlineWidth:1px` | 同左 | 同左 |
| 普通 `hidden` | `display:none` | `display:none` | `display:none` |
| `hidden="until-found"` 查找揭示 | 无 `beforematch`，属性仍 `until-found` | 同左 | 同左 |

**范围内结果**：Chrome 156 的 Tailwind Preflight 三个模式均已取得可信 Button/Input/Details/Dialog 事件、可见焦点及普通 hidden 状态证据；**没有发现当前测试中 Normalize 引入顺序导致的上述行为差异**。需注意 `focusVisible:false` 亦出现在真实鼠标聚焦时，不能自动判断焦点功能损坏。三个页面 `detailsOpen` 末态不同但所有模式均有双向 toggle，不是 CSS 回归。

**尚未通过的独立子项**：`until-found` 的浏览器查找揭示**未取得成功证据**；三个报告均未出现 `beforematch`，且 `untilFoundAttribute` 均保留 `"until-found"`。这只说明当前日志没有确认揭示行为，既不是 PASS，也不足以指认 Normalize 缺陷。后续应刷新页面重新初始化采集器，先单击页面把焦点移出 DevTools，然后使用**浏览器页面的 Ctrl+F** 搜索 `查找时显示`，实际查看内容是否揭示及后续 `beforematch` 和属性值，记录搜索行为与时间点。也可以单独采集 DevTools Console 中的 `document.getElementById("until-found").getAttribute("hidden")`，注意别用 `display:block` 冒充已揭示。

**证据边界**：这是维护者 Chrome 156 人工操作日志，不是 Firefox/WebKit/最低目标版本或复杂表单的测试结果；`trusted:true` 支持真实浏览器分发事件，但当前采集器未记录具体键值，不能逐项证明完整键盘路径。F-010 / W-06 仍为部分完成，正式 `src/normalize.css` 不需要修改，禁止新增 CI/发布。

## 2026-11-04 · Tailwind Preflight 查找揭示三模式补验完成（Chrome 156）

维护者在此前 Tailwind 三模式 Button/Input/Details/Dialog/焦点交互日志后，再次提供 **三份更新的原始 `window.__aduiF010.report()`**。三份报告中的 Vite CSS 模块来源仍与 `adui-reset-JQcSHX` 完全对应，浏览器 UA 均为 Windows Chrome/156.0.0.0。**本节是本组最新查找揭示证据，取代本文件前面“未发现 beforematch / until-found 未确认”的历史阶段状态。**

| 测试模式 | URL | `beforematch` | `trusted` | 最终 `untilFoundAttribute` | 阶段结果 |
| --- | --- | --- | --- | --- | --- |
| baseline | `http://localhost:5180/` | 已出现 | `true` | `null` | PASS |
| normalize-first | `http://localhost:5181/` | 已出现 | `true` | `null` | PASS |
| normalize-last | `http://localhost:5182/` | 已出现 | `true` | `null` | PASS |

在当前 Fixture 的 `<div hidden="until-found">` 上，可信 `beforematch` 事件与 `hidden` 属性被移除相互支持，说明 **Chrome 156 的浏览器查找揭示路径已实际触发**。这是有明确浏览器事件和 DOM 状态的实测，不再只是 `display:block` 的间接推测。三个模式下普通 `#hidden` 的计算显示依旧为 `display:none`，没有观察到独立隐藏属性受到影响。

结合维护者前几次已提供并已归档的同组交互日志，当前 Tailwind Preflight 三页对 **按钮可信点击、输入框可信输入、键盘焦点可见（已采样元素）、details 可信展开和收起、dialog 可信取消和关闭、普通隐藏属性，以及 `hidden="until-found"` 浏览器查找揭示**均有 Chrome 156 证据。三个模式均完成了本 Fixture 的这些原生交互子项，**未观察到因 Normalize 前置/后置而产生的行为回归**。

**范围限制**：以上仅为 Chrome 156 当前 Fixture 和人工操作的原生交互覆盖，不包含复杂表单、完整键盘遍历/可访问名称检查、系统无障碍偏好、Firefox/WebKit、目标低版本或 UnoCSS 两套独立 Reset 的交互实测，不能将 F-010 或 W-06 整体结项。产品 CSS 不需修改；不增加 CI、依赖或发布配置。

## 2026-11-04 · UnoCSS 双 Reset 原生交互验证完成反馈（维护者确认）

维护者在执行 Tailwind Preflight 原生交互后，继续完成 `@unocss/reset/tailwind-v4.css` 和 `@unocss/reset/tailwind-compat.css` 的独立本地验证，并明确反馈：**“全部验证通过了”**。结合上一轮明确安排的两个独立 UnoCSS 消费目录及三个加载模式，此次反馈按 **Chrome 156、此前约定的原生交互检查范围** 归档，不重新要求重复已完成的操作。

| 单独测试场景 | 真实 tarball + Vite+ 三模式构建 | Chrome 156 三模式静态样式 | 本次原生交互结论 | 证据等级 |
| --- | --- | --- | --- | --- |
| Tailwind v4 Preflight | 3/3 PASS | 12 × 14 项零差异 | 已验证 Button、Input、Details、Dialog、焦点和 `beforematch` 三页表现 | 维护者逐页原始 JSON、URL 与 DevTools 截图 |
| UnoCSS tailwind-v4 | 3/3 PASS | 12 × 14 项零差异 | **维护者反馈所约定项目全部通过** | 人工完成反馈；未收到此批交互 JSON |
| UnoCSS tailwind-compat | 3/3 PASS | 12 × 14 项零差异 | **维护者反馈所约定项目全部通过** | 人工完成反馈；未收到此批交互 JSON |

**范围内决策**：F-010 的三个独立 Reset 场景在 **Chrome 156 当前 Fixture** 上的构建、静态对照与约定原生交互检查可记录为 **“本地验证阶段完成”**，目前没有观察到需要修改 `src/normalize.css` 的冲突证据。不要据此声明 UnoCSS 的逐页可信事件已经通过本助手审阅，更不能将它们归入自动化测试通过数量。

**保留的开放范围**：Firefox、WebKit、Chrome/Edge 最低目标版本、真实 Safari/移动端、系统强制色与减少动效、复杂表单和完整键盘可访问性尚无此批证据；W-06 Issue #7 原有覆盖目标仍继续 **Open**。不自动勾选其完整 F-001～F-010/浏览器矩阵清单，不合并 main、不新增 CI、不发布包或更改产品规则。

## 2026-11-04 · W-06 跨浏览器回归完成反馈（最新）

维护者继 Chrome 156 的三套独立 Reset 验证完成之后，进一步确认：**“回归完成”**。本记录将其登记为 **“跨浏览器回归执行：维护者反馈已完成”**。这一反馈表明无需再安排重复操作；但**本轮没有附新的逐浏览器 UA/OS、浏览器版本、Fixture 对照、截图或原始交互日志**，不能从这句话推断具体通过了哪一个最低版本或所有无障碍场景。

目前分层证据状态：

- **Chrome 156 / Tailwind Preflight**：3/3 生产构建、三页静态样式零差异、`b#bold` 的 CSS Layers 胜出截图、Button/Input/Details/Dialog/焦点与 `beforematch` 原始事件记录均已归档。
- **Chrome 156 / UnoCSS v4 与 compat**：各 3/3 生产构建、各自三页静态零差异；原生交互为维护者明确反馈 PASS，但本轮无逐页事件 JSON。
- **跨浏览器回归整体**：维护者反馈执行完成；**具体目标环境及逐项结果仍需归档**。不把“已执行完”直接等价为 Edge 120、Firefox 121、Safari 17.2 及对应移动版本的可复核 PASS，特别注意 Playwright WebKit 与真实 Safari 不能互相代替。

**决策**：当前本地测试操作可以进入验收整理，不重复已经完成的回归；W-06 Issue #7 暂保持 Open，直到正式浏览器矩阵、系统偏好/交互覆盖及未测试平台的处理结果明确。无产品 CSS、CI、依赖、发布或 main 变更。浏览器目标和已有记录见 [浏览器支持边界](BROWSER_REVIEW.md)。

## 1. 测试边界与版本

| 独立场景                 | 仅安装在临时消费者中的固定直接依赖             | 实际加载的唯一第三方 Reset                                                                              |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `tailwind-preflight`     | `tailwindcss@4.3.4`、`@tailwindcss/vite@4.3.4` | `tailwindcss/theme.css`（主题变量，并非另一套 Reset）与 `tailwindcss/preflight.css`，后者属于 `base` 层 |
| `unocss-tailwind-v4`     | `@unocss/reset@66.12.0`                        | `@unocss/reset/tailwind-v4.css`                                                                         |
| `unocss-tailwind-compat` | `@unocss/reset@66.12.0`                        | `@unocss/reset/tailwind-compat.css`                                                                     |

版本为测试场景固定的精确直接依赖版本；本轮维护者已成功执行两项 UnoCSS 隔离安装及版本/真实 tarball 断言，Tailwind 仍待本机执行。间接依赖由实际安装记录为准。UnoCSS 组**不安装 `unocss`、不启动 presetWind4、不引入 Tailwind Preflight**。Tailwind 组不引入 `@unocss/reset`。Vite+ 继续使用当前仓库已固定的 `vite-plus@1.4.0`，无新增根项目开发/运行时依赖。

各场景生成三个独立页面，且共用相同 HTML、探针 JS 与视口：

- `baseline`：仅加载该场景自己的 Reset；
- `normalize-first`：先 Normalize，再当前 Reset；
- `normalize-last`：先当前 Reset，再 Normalize。

只反转同一场景两份样式的导入顺序；Tailwind 的层声明始终首先建立，Preflight 在 `base` 层。**层优先级可能使两种顺序结果相同，这本身是有意义的观测，不得强行制造差异**。

## 2. Windows PowerShell 实际执行步骤

在仓库根目录（**开发分支 `feat/viteplus-local-harness`，不要在仅有文档的 main 运行**）：

```powershell
git switch feat/viteplus-local-harness
git pull --ff-only origin feat/viteplus-local-harness

vp pack
npm run test:offline
vp check

# 首先只运行 Tailwind，实际安装仅发生在 Git 忽略的临时目录
npm run test:reset -- tailwind-preflight --keep

# Tailwind 测试完成后，再独立运行 UnoCSS v4
npm run test:reset -- unocss-tailwind-v4 --keep

# compat 另开独立批次，不与 v4 同时加载
npm run test:reset -- unocss-tailwind-compat --keep
```

以上**均为待由维护者本地运行的命令**，不是本轮执行记录。脚本使用真实 `vp pack` + 当前项目 npm tarball，确保 `@adui/normalize.css` 通过真实包的根 CSS 导出解析；独立临时消费者用 Vite+ 分别构建三个入口。每组只安装当前场景所需包，`npm install --ignore-scripts --no-save --package-lock=false`，不会写根目录 `package.json` 或创建 CI。

命令成功时输出每组 CSS 字节数、SHA-256、是否存在 CSS Layer，以及临时目录位置；该信息保存在临时目录 `reset-report.json`，**只证明包解析与构建**。临时目录位于 `node_modules/.cache/adui-reset-*`，已 Git 忽略；脚本 `--keep` 会保留用于手动观察，未加 `--keep` 则清理对应本次新建的目录。脚本不下载浏览器、不上传/发布 npm、不运行 npm 安装脚本。

## 3. 浏览器对照操作

每条命令返回的 `Kept consumer:` 后面是**实际临时目录**。以下使用 Tailwind 示例；UnoCSS 两组各自从自己的独立输出目录启动，不得复用同一浏览器页面或 CSS 文件。

```powershell
$consumerDir = '将这里替换为命令实际输出的 adui-reset-* 路径'

# 分别打开三个 PowerShell 终端：
Set-Location (Join-Path $consumerDir 'baseline')
vp dev --port 5180
```

另两个终端在同一个 `$consumerDir` 的 `normalize-first` 与 `normalize-last` 子目录，分别运行 `vp dev --port 5181`、`vp dev --port 5182`。在同一浏览器、同一 OS、同一系统字体和缩放下访问三个端口。

浏览器控制台可读取 `window.__aduiResetEvidence`，页面也会显示相同 JSON。至少检查：`h1`/列表 margin、font-weight、list marker，`b` 与 `strong`（父级 600）、code、button/input 的背景/边框/焦点、hidden 与 until-found、原生 dialog/details。需要进一步记录 DevTools Styles/Computed 中的**最终命中声明和 CSS Layer**，因为仅记录计算值无法证明声明来源。

建议按 `baseline → normalize-first → normalize-last` 保存三个 JSON 与对应截图；比较只在**同一场景内部**进行，不将 Tailwind 与 UnoCSS 组合到一个页面。若存在浏览器工具可采集完整 CSSOM/样式表来源，也要保存产物样式内容与哈希。

## 4. 结果判定与故障定位

| 分类                 | 判定条件                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `BUILD_PASS`         | 三套隔离 Vite+ 生产构建成功、真实 CSS tarball 已解析，且 Reset 样式进入产物                                   |
| `BROWSER_PASS`       | 同一浏览器下预期/实际交互与布局对照完备，所有变化有来源和理由，无非预期回归                                   |
| `EXPECTED_DUPLICATE` | `b, strong { font-weight: bolder }` 同时来自已安装的 Normalize 和本场景 Preflight/Reset，效果相同且不损害行为 |
| `CONFLICT`           | 存在非预期变化，并有胜出声明、顺序、特异性/层级和最小复现证据                                                 |
| `NOT_RUN / BLOCKED`  | 缺真实安装、实际产物或浏览器交互证据；工具链失败另登记环境阻塞                                                |

特别注意：**本库当前只有 R-003 的 `b/strong` 规则**，在待测三种 Reset 中均已存在类似声明。预期很可能只是重复而非互相冲突，但需要看浏览器实际计算样式、T0/T2 来源以及打包结果。不要把源代码重复直接当成 FAIL，也不要把 CSS 构建成功当成 F-010 整体 PASS。

### 失败与边界情况

- Tailwind 使用 `@tailwindcss/vite` 编译 `--theme(...)` 等表达式：若 Vite+ 插件与当前依赖树不兼容，保留失败日志，先判定为**测试环境/插件阻塞**，不要降级为手工替换 CSS 规则或新增项目根依赖。
- `@unocss/reset` 安装包的 `exports` 若与版本不符，应检查**实际安装包**，不擅自改用 `unocss` 或新增 presetWind4。
- `npm run test:offline` 只验证纯 Node 文件契约；新增 Reset 代码后的完整 PASS 必须由维护者执行后更新。此前 30/30 仅是旧代码版本的已确认结果。
- npm 包尚为 `private: true`、`0.0.0` 的开发 tarball，不代表公开 npm 发布。测试过程中不增加 CI、发布/部署或修改正式 Normalize CSS。
- WebKit 自动化与真实 Safari 17.2 必须分别记录；本次环境未自动安装浏览器。

## 5. 相关文件与依据

- [reset-fixtures.mjs](../../tests/reset-fixtures.mjs)：独立 CSS/HTML/探针生成器；
- [reset-consumer.mjs](../../tests/reset-consumer.mjs)：真实 tarball + Vite+ 三组生产构建命令；
- [reset-contract.node.test.mjs](../../tests/reset-contract.node.test.mjs)：无需网络的 Fixture 隔离契约；
- [既有生态测试记录](W06_ECOSYSTEM_LOCAL_VERIFICATION.md)；[W-06 Issue #7](https://github.com/adui-studio/normalize.css/issues/7)；
- [Tailwind 官方 Preflight](https://tailwindcss.com/docs/preflight)；[UnoCSS 官方 Reset](https://unocss.dev/guide/style-reset)；[Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction)。

**下一条有效更新应来自真实命令输出和浏览器结果，而不是继续累加未运行的测试计划。**
