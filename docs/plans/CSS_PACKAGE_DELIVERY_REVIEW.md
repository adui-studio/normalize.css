# W-04 — 纯 CSS npm 包导出与副作用验收方案

- **状态**：开发前研究 / 验收方案；**尚未创建 package.json、CSS 或发布产物，未执行打包/安装/测试**。
- **日期**：2026-11-03
- **关联**：[Issue #5](https://github.com/adui-studio/normalize.css/issues/5) · [ADR-0003](../adr/0003-mvp-package-contract.md) · [ADR-0005](../adr/0005-viteplus-toolchain.md) · [W-03 Harness 设计](VITEPLUS_LOCAL_HARNESS_DESIGN.md) · [MVP 计划](MVP_IMPLEMENTATION_PLAN.md)
- **范围**：只验证已接受的 `@adui/normalize.css` **根 CSS 入口**，无运行时 JavaScript 依赖，不发布任何可选 CSS 子路径。
- **约束**：未来本地手动验证；**不增加任何 CI**。本文件仅研究包交付行为，不对 CSS 规则、npm 发布或额外入口做授权。

## 1. 本轮官方依据

| 官方规范 | 可以确定的事实 | 对本库尚不能保证的内容 |
| --- | --- | --- |
| [Vite+ Pack](https://viteplus.dev/guide/pack) | `vp pack` 基于 tsdown，支持 CSS bundling；推荐在 `vite.config.ts` 的 `pack` 块配置 | **尚无证据保证纯 CSS 作为唯一入口时不输出 JS 包装模块** |
| [Node Packages：exports](https://nodejs.org/api/packages.html#package-entry-points) | `exports` 的 `.` 定义根入口；路径必须以 `./` 开头；未公开子路径可被封装 | Node 的 JS 运行时不因此获得直接执行/解析 CSS 的能力；各打包器 CSS 处理方式需要实测 |
| [Webpack Package exports](https://webpack.js.org/guides/package-exports/) | Webpack 文档列出 `style` 条件，适用于 stylesheet 请求 | 不能据此承诺其他构建器均识别 `style` 条件 |
| [Webpack Tree Shaking](https://webpack.js.org/guides/tree-shaking/) | CSS 副作用导入会受到 `sideEffects` 标记影响；`false` 可能导致样式被丢弃 | 正确标记仍不能代替消费端生产构建测试 |
| [npm package.json：files](https://docs.npmjs.com/files/package.json/#files) | `files` 可限定 tarball 文件；`package.json`、README、LICENSE 等有特殊的默认包含规则 | npm 包最终内容、入口文件存在性仍应从真实 tarball 验证 |
| [Vite CSS Features](https://vite.dev/guide/features#css) | Vite 消费端能处理 CSS 导入以及 CSS 内的 `@import` | 原生浏览器直接加载 CSS URL **不等于**能解析裸 npm 包名 |

## 2. 两种交付方式（不是新的架构决策）

| 方案 | 核心方法 | 评估顺序 | 必须防止 |
| --- | --- | --- | --- |
| **A — Vite+ `vp pack`** | 尝试直接将最小 CSS 作为库资源打包，保留单一 CSS 产物 | 获开发授权后**先用最小可复现样例验证** | 被迫增加 JS entry / 产物、丢失 CSS、自动生成未批准的公开 exports |
| **B — Vite+ + 最小静态 CSS 产物流程** | Vite+ 仍用于本地检查/Fixture；若 A 不适用，则采用经过证据验证的简单复制或安全压缩方案生成 CSS | A 未满足纯 CSS 契约后再评估 | 额外 JS 运行时、重复打包、多余 CLI 依赖、改变浏览器语义 |

**首版只要求产物正确，不要求必须让 `vp pack` 承担 CSS-only 文件复制或压缩。** 方案 B 不是放弃 Vite+，而是承认以 CSS 为唯一发布产物时可能不需要 JS 库打包器。具体方法、版本、文件名和命令全部留待实际试验。

## 3. 公共包契约的候选字段（仅评审，不写 package.json）

| 字段 | 候选设计约束 | 尚需确认 |
| --- | --- | --- |
| `name` | 固定目标名 `@adui/normalize.css` | npm 作用域发布权限未验证 |
| `exports` | **只提供根键 `.`**，指向真实存在的单一 CSS 发布文件，例如未来 `./dist/normalize.css`；这是文件名示例而非已存在路径 | Vite+/Webpack 的 JS 副作用导入与 CSS 导入是否均能正确解析 |
| `style` | 可能作为兼容提示，**不是已保证广泛支持的标准入口** | 需与根 `exports` 指向同一个文件并由消费端验证 |
| `main` / `module` | CSS-only 包不为了照顾 JS 约定虚构 `index.js` / `index.mjs` | 纯 CSS 发布时是否应完全省略，按真实打包结果确认 |
| `sideEffects` | CSS 导入具有副作用，**禁止误设 `false`**；候选 `true` 或 `["**/*.css"]`，最终以生产打包验证决定 | 是否存在仅在开发期使用的 JS 文件以及具体匹配范围 |
| `files` | 候选为只包含 CSS 发布目录，例如 `["dist"]`，README、LICENSE、package.json 由 npm 包含规则核验 | 最终 tarball 无 Fixture、测试、私有文件、临时产物 |
| `dependencies` | **运行时依赖应为零**；Vite+ 只作为开发期工具 | 安装后引入图中不应有额外运行时依赖 |
| `version` | 不在此处定首版版本号 | 语义化版本、包所有权、正式发布另行审批 |

**重要区别**：`exports` 指向 CSS 是文件路径契约，不等于 Node.js 执行 CSS。由于 `exports` 会限制子路径，不能让消费者通过未批准的 `/dist/normalize.css` 路径来“补救”根路径解析失败；根入口若无法满足目标消费端，必须记录阻塞，并经 ADR 再评审是否改变公共 API，**不能偷偷追加子路径**。

## 4. 未来最小消费端验收矩阵（计划，全部未运行）

| ID | 情形 | 预期验收 | 当前状态 |
| --- | --- | --- | --- |
| P-01 | 检查实际 tarball 的 root CSS 文件 | `exports` 指向的 CSS 在 tarball 中存在、能正常解析 | NOT_RUN |
| P-02 | Vite+ 消费应用中使用 JS 副作用导入 `import "@adui/normalize.css"` | 开发和生产均真正应用样式，产物中可追踪到该 CSS | NOT_RUN |
| P-03 | Webpack 5 消费应用中使用同样的 JS 副作用导入 | 生产 tree shaking 后 CSS 仍保留，并确实影响页面 | NOT_RUN |
| P-04 | 消费端 CSS 使用 `@import "@adui/normalize.css";` | **仅在支持该 npm 解析语义的构建工具中**验证；若不支持，记录为该调用方式不受支持，不得误称原生浏览器可用 | NOT_RUN |
| P-05 | 直接在浏览器加载**真实部署后的 CSS URL** | 无需 JS 即可被加载，样式仅影响预期范围；浏览器原生 `@import` 需要 URL，不解析 npm 裸包名 | NOT_RUN |
| P-06 | 负向子路径：`/reset.css`、`/forms.css`、`/a11y.css`、`/all.css` | 不允许成为包的公开 exports；在严守 exports 的工具链中应被阻止 | NOT_RUN |
| P-07 | CSS-only 产物检查 | tarball 无为导出而凭空生成的 JS 运行时；产物、元数据和源码许可证对应 | NOT_RUN |
| P-08 | 无 CSS 副作用的错误对照（测试环境） | 通过对照证明生产构建是否会丢 CSS；**不在正式包配置中采用错误值** | NOT_RUN |
| P-09 | 安装实际 tarball 到独立消费项目 | CSS 根入口能从发布包解析，不依赖仓库相对路径、源码别名或未发布文件 | NOT_RUN |
| P-10 | 浏览器原生表现与组件库回归 | 仅在 W-05 证明必要且实现规则后执行；不能从“打包成功”推定兼容 | NOT_RUN |

**W-04 DoD**：至少 P-01、P-02、P-03、P-06、P-07、P-09 必须有实际产物和可复现记录；P-04/P-05 根据声明的使用方式决定是否纳入公开承诺，其他测试用于排查副作用及行为风险。任何阻塞必须在公开文档中说明，不得借测试不充分额外扩大入口。

## 5. 实施顺序与禁止事项

1. 在 W-03 获准并可运行后，用**未包含真正 Normalize 修复的中性测试 CSS**检验工具链/导出行为；不得把中性测试样式当作库功能。
2. 优先探索 `vp pack`，实际记录 CSS-only 产物清单；如无法满足纯 CSS 契约，再按最小原则评估备用方案。
3. 将实际 `package.json` 与 tarball 安装到两个**独立**的消费者（Vite+ 与 Webpack），检查解析、生产保留、导入顺序和最终样式。
4. 再审查 LICENSE、README、`files`、`sideEffects`、零运行时 JS 等发布门槛；npm 包签发和 Release 仍需单独许可。
5. **本项目不增加任何 CI / GitHub Actions / 自动发布**，不使用仅靠脚本名便无法复现的虚假“测试通过”。

## 6. 研究与事实边界

- **已核对**：Vite+ CSS bundling 能力、Node `exports` 的路径与封装规则、Webpack CSS 副作用/打包行为、npm tarball 过滤机制。
- **尚未确认**：纯 CSS `vp pack` 的实际输出、根入口对 CSS / JS 导入的兼容性、`style` 元数据的消费者支持、真实 tarball 与副作用测试。
- **尚未实施**：源码、包配置、依赖、浏览器、构建、发布、CI。
- **对 ADR-0003 的关系**：该 ADR 的“首版唯一根 CSS 入口”仍为 Accepted；**本文不是新增 ADR，也不擅自改变已接受的公共接口**。
