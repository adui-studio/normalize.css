# W-04 — 纯 CSS npm 包导出与副作用验收方案

- **状态**：**W-04 已实现开发期首批 CSS 静态构建与单根 exports**，保留 `private: true`，不发布 npm；Vite+/Webpack 生产消费者与完整发布门槛未验收。已有真实 R-003 源码和独立环境中的构建、定向测试、离线包安装结果。
- **日期**：2026-11-03
- **关联**：[Issue #5](https://github.com/adui-studio/normalize.css/issues/5) · [ADR-0003](../adr/0003-mvp-package-contract.md) · [ADR-0005](../adr/0005-viteplus-toolchain.md) · [W-03 Harness 设计](VITEPLUS_LOCAL_HARNESS_DESIGN.md) · [MVP 计划](MVP_IMPLEMENTATION_PLAN.md)
- **范围**：只验证已接受的 `@adui/normalize.css` **根 CSS 入口**，无运行时 JavaScript 依赖，不发布任何可选 CSS 子路径。
- **约束**：未来本地手动验证；**不增加任何 CI**。本文件仅研究包交付行为，不对 CSS 规则、npm 发布或额外入口做授权。

## 1. 本轮官方依据

| 官方规范                                                                            | 可以确定的事实                                                                      | 对本库尚不能保证的内容                                                             |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [Vite+ Pack](https://viteplus.dev/guide/pack)                                       | `vp pack` 基于 tsdown，支持 CSS bundling；推荐在 `vite.config.ts` 的 `pack` 块配置  | **尚无证据保证纯 CSS 作为唯一入口时不输出 JS 包装模块**                            |
| [Node Packages：exports](https://nodejs.org/api/packages.html#package-entry-points) | `exports` 的 `.` 定义根入口；路径必须以 `./` 开头；未公开子路径可被封装             | Node 的 JS 运行时不因此获得直接执行/解析 CSS 的能力；各打包器 CSS 处理方式需要实测 |
| [Webpack Package exports](https://webpack.js.org/guides/package-exports/)           | Webpack 文档列出 `style` 条件，适用于 stylesheet 请求                               | 不能据此承诺其他构建器均识别 `style` 条件                                          |
| [Webpack Tree Shaking](https://webpack.js.org/guides/tree-shaking/)                 | CSS 副作用导入会受到 `sideEffects` 标记影响；`false` 可能导致样式被丢弃             | 正确标记仍不能代替消费端生产构建测试                                               |
| [npm package.json：files](https://docs.npmjs.com/files/package.json/#files)         | `files` 可限定 tarball 文件；`package.json`、README、LICENSE 等有特殊的默认包含规则 | npm 包最终内容、入口文件存在性仍应从真实 tarball 验证                              |
| [Vite CSS Features](https://vite.dev/guide/features#css)                            | Vite 消费端能处理 CSS 导入以及 CSS 内的 `@import`                                   | 原生浏览器直接加载 CSS URL **不等于**能解析裸 npm 包名                             |

## 2. 两种交付方式（不是新的架构决策）

| 方案                                  | 核心方法                                                                                      | 评估顺序                               | 必须防止                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| **A — Vite+ `vp pack`**               | 尝试直接将最小 CSS 作为库资源打包，保留单一 CSS 产物                                          | 获开发授权后**先用最小可复现样例验证** | 被迫增加 JS entry / 产物、丢失 CSS、自动生成未批准的公开 exports |
| **B — Vite+ + 最小静态 CSS 产物流程** | Vite+ 仍用于本地检查/Fixture；若 A 不适用，则采用经过证据验证的简单复制或安全压缩方案生成 CSS | A 未满足纯 CSS 契约后再评估            | 额外 JS 运行时、重复打包、多余 CLI 依赖、改变浏览器语义          |

**首版只要求产物正确，不要求必须让 `vp pack` 承担 CSS-only 文件复制或压缩。** 方案 B 不是放弃 Vite+，而是承认以 CSS 为唯一发布产物时可能不需要 JS 库打包器。具体方法、版本、文件名和命令全部留待实际试验。

## 3. 公共包契约的候选字段（仅评审，不写 package.json）

| 字段              | 候选设计约束                                                                                                       | 尚需确认                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| `name`            | 固定目标名 `@adui/normalize.css`                                                                                   | npm 作用域发布权限未验证                                  |
| `exports`         | **只提供根键 `.`**，指向真实存在的单一 CSS 发布文件，例如未来 `./dist/normalize.css`；这是文件名示例而非已存在路径 | Vite+/Webpack 的 JS 副作用导入与 CSS 导入是否均能正确解析 |
| `style`           | 可能作为兼容提示，**不是已保证广泛支持的标准入口**                                                                 | 需与根 `exports` 指向同一个文件并由消费端验证             |
| `main` / `module` | CSS-only 包不为了照顾 JS 约定虚构 `index.js` / `index.mjs`                                                         | 纯 CSS 发布时是否应完全省略，按真实打包结果确认           |
| `sideEffects`     | CSS 导入具有副作用，**禁止误设 `false`**；候选 `true` 或 `["**/*.css"]`，最终以生产打包验证决定                    | 是否存在仅在开发期使用的 JS 文件以及具体匹配范围          |
| `files`           | 候选为只包含 CSS 发布目录，例如 `["dist"]`，README、LICENSE、package.json 由 npm 包含规则核验                      | 最终 tarball 无 Fixture、测试、私有文件、临时产物         |
| `dependencies`    | **运行时依赖应为零**；Vite+ 只作为开发期工具                                                                       | 安装后引入图中不应有额外运行时依赖                        |
| `version`         | 不在此处定首版版本号                                                                                               | 语义化版本、包所有权、正式发布另行审批                    |

**重要区别**：`exports` 指向 CSS 是文件路径契约，不等于 Node.js 执行 CSS。由于 `exports` 会限制子路径，不能让消费者通过未批准的 `/dist/normalize.css` 路径来“补救”根路径解析失败；根入口若无法满足目标消费端，必须记录阻塞，并经 ADR 再评审是否改变公共 API，**不能偷偷追加子路径**。

## 4. 未来最小消费端验收矩阵（计划，全部未运行）

| ID   | 情形                                                              | 预期验收                                                                                                | 当前状态 |
| ---- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------- |
| P-01 | 检查实际 tarball 的 root CSS 文件                                 | `exports` 指向的 CSS 在 tarball 中存在、能正常解析                                                      | NOT_RUN  |
| P-02 | Vite+ 消费应用中使用 JS 副作用导入 `import "@adui/normalize.css"` | 开发和生产均真正应用样式，产物中可追踪到该 CSS                                                          | NOT_RUN  |
| P-03 | Webpack 5 消费应用中使用同样的 JS 副作用导入                      | 生产 tree shaking 后 CSS 仍保留，并确实影响页面                                                         | NOT_RUN  |
| P-04 | 消费端 CSS 使用 `@import "@adui/normalize.css";`                  | **仅在支持该 npm 解析语义的构建工具中**验证；若不支持，记录为该调用方式不受支持，不得误称原生浏览器可用 | NOT_RUN  |
| P-05 | 直接在浏览器加载**真实部署后的 CSS URL**                          | 无需 JS 即可被加载，样式仅影响预期范围；浏览器原生 `@import` 需要 URL，不解析 npm 裸包名                | NOT_RUN  |
| P-06 | 负向子路径：`/reset.css`、`/forms.css`、`/a11y.css`、`/all.css`   | 不允许成为包的公开 exports；在严守 exports 的工具链中应被阻止                                           | NOT_RUN  |
| P-07 | CSS-only 产物检查                                                 | tarball 无为导出而凭空生成的 JS 运行时；产物、元数据和源码许可证对应                                    | NOT_RUN  |
| P-08 | 无 CSS 副作用的错误对照（测试环境）                               | 通过对照证明生产构建是否会丢 CSS；**不在正式包配置中采用错误值**                                        | NOT_RUN  |
| P-09 | 安装实际 tarball 到独立消费项目                                   | CSS 根入口能从发布包解析，不依赖仓库相对路径、源码别名或未发布文件                                      | NOT_RUN  |
| P-10 | 浏览器原生表现与组件库回归                                        | 仅在 W-05 证明必要且实现规则后执行；不能从“打包成功”推定兼容                                            | NOT_RUN  |

**W-04 DoD**：至少 P-01、P-02、P-03、P-06、P-07、P-09 必须有实际产物和可复现记录；P-04/P-05 根据声明的使用方式决定是否纳入公开承诺，其他测试用于排查副作用及行为风险。任何阻塞必须在公开文档中说明，不得借测试不充分额外扩大入口。

## 5. 实施顺序与禁止事项

1. 在 W-03 获准并可运行后，用**未包含真正 Normalize 修复的中性测试 CSS**检验工具链/导出行为；不得把中性测试样式当作库功能。
2. 优先探索 `vp pack`，实际记录 CSS-only 产物清单；如无法满足纯 CSS 契约，再按最小原则评估备用方案。
3. 将实际 `package.json` 与 tarball 安装到两个**独立**的消费者（Vite+ 与 Webpack），检查解析、生产保留、导入顺序和最终样式。
4. 再审查 LICENSE、README、`files`、`sideEffects`、零运行时 JS 等发布门槛；npm 包签发和 Release 仍需单独许可。
5. **本项目不增加任何 CI / GitHub Actions / 自动发布**，不使用仅靠脚本名便无法复现的虚假“测试通过”。

## 6. 已执行的元数据与白名单预检（2026-11-03）

- W-03 开发分支的 `package.json` 仍为 `private: true`、`vite-plus@1.4.0` 开发依赖、**没有运行时 dependencies、没有 `exports` / `main` / `module`**。
- W-04 已新增 `files: ["dist"]` 与 `sideEffects: ["**/*.css"]`；这两个字段是**开发阶段约束声明**，不等于生产构建已证明 CSS 一定保留。
- 本地实际运行 `npm pack --dry-run --json --ignore-scripts --offline .`：返回 **exit code 0**。修改前开发用包文件列表包含 `fixtures/`、`tests/` 和 `vite.config.ts`；修改后因尚无 `dist/`，仅列出 `package.json`（本地复制目录未包含 GitHub 原有 README / LICENSE；最终必须以完整仓库重新检查）。
- 新增零依赖 `tests/package.node.test.mjs`，与 Fixture/探针测试合计 **8/8 通过**。
- **本次只证明文件白名单与元数据契约的本地行为**。P-01（CSS 实际存在）、P-02/03（生产构建保留 CSS）、P-06（子路径拒绝）、P-07（真实 CSS tarball）、P-09（独立安装）全部仍为 `NOT_RUN`，不得关闭 W-04。
- 当前环境 Node 22.16.0 不满足 Vite+ 要求，npm Registry DNS 不可用；`vp pack` **未运行**，不能宣布方案 A 已通过或已被否决。

## 7. W-04 合成 CSS 包的离线安装验证（2026-11-03）

新增 `tests/package-smoke.node.test.mjs`，只使用 **Node.js 标准库与本机 npm**，在系统临时目录构建**一次性合成测试包**，不写入项目的 `dist/`、不新增正式 Normalize 规则或 `exports`：

1. 合成包固定为 `@adui/normalize.css@0.0.0-smoke.0`，仅有 `exports: {".":"./dist/normalize.css"}`，CSS 内容只是独立命名的测试标记。
2. 本地执行 `npm pack --json --ignore-scripts --offline`，得到实际 `.tgz`；**校验** tarball 清单恰为 `package.json`、`dist/normalize.css`、测试用 README 和 LICENSE，不包含 `tests/`。
3. 在另一个临时消费项目执行 `npm install --offline --ignore-scripts --no-save` 安装 tarball，使用 Node `require.resolve` 验证根路径指向正确 CSS 文件且字节内容一致。
4. 验证 `/reset.css` 和 `/package.json` 返回 `ERR_PACKAGE_PATH_NOT_EXPORTED`；没有 `index.js` 或测试目录进入安装后的包。
5. 所有临时文件均在测试退出后清理；该合成包**不会进入仓库，也不允许发布**。

**真实结果**：与现有探针、Fixture、元数据契约测试合计，`npm run test:offline` 在本地执行 **10/10 PASS**，包括上述一次实际 npm pack + install。运行时 Node `22.16.0`、npm `10.9.2`；此测试不要求安装 Vite+，并不意味着已验证 Vite+ 1.4.0 打包能力。

**严格限制**：这些是临时合成包的 npm 行为证据，**不将 P-01 / P-02 / P-03 / P-06 / P-07 / P-09 正式包测试改为 PASS**。它们仍为 `NOT_RUN`，直到真正的 Normalize CSS 产物、`exports`、Vite+ / Webpack 生产消费端及实际项目 tarball 均有可复现证据。尤其 `require.resolve` 的路径可解析不表示 Node 能执行 CSS，也不表示打包器会保留 CSS 副作用。

## 7.1 首批真实 CSS 包实现与局部验证（2026-11-04）

维护者授权继续开发，按照低侵入原则和已有 Chrome 120 的 R-003 差异证据，首批产品源码为 `src/normalize.css`（唯一规则 `b, strong { font-weight: bolder; }`）。R-004 的等宽字体字号完全采用浏览器默认行为。

- `package.json` 保持 `private: true`、`0.0.0`，只增加 `exports: { ".": "./dist/normalize.css" }`、`build: "node scripts/build.mjs"`，保留 `files: ["dist"]`、`sideEffects: ["**/*.css"]` 和 `vite-plus@1.4.0`；未增加运行时依赖。
- 构建仅把 `src/normalize.css` 复制至 `dist/normalize.css`，无 JS wrapper、无压缩或修改原始 CSS 字节。Vite+ 继续用于本地 check/test/dev；`vp pack` 是否能满足纯 CSS 契约**尚未测试**，静态复制是最小可用开发交付路径，不据此宣称它不适用。
- 助手在独立 Linux Node `v22.16.0` 目录重建与 GitHub 完全相同 Git blob 的 CSS、构建脚本、单测；新增 `tests/package.node.test.mjs` **5/5 PASS**，构建产生唯一 CSS 且与源码完全相同。离线执行 `npm pack` 以及在单独临时消费者 `npm install --offline`；根 CSS 解析、字节一致、未公开的 `/reset.css` 路径拒绝均通过。由于重建目录仅放入构建契约文件，pack 清单只有 CSS 和 package.json；**不能把这个清单当作完整 GitHub 仓库的 npm tarball 清单**。
- 该 Linux Node 版本 **低于**本项目 `^22.18.0` 的要求，npm install 报告了 `EBADENGINE` 警告；验证仅证明标准库构建与 npm 本地契约逻辑。尚未在维护者 Windows 支持环境执行本轮 `vp check/test`、实际完整仓库打包、Vite+ / Webpack 生产消费端。因此 P-01/P-06/P-07/P-09 为**局部验证**，P-02/P-03 未运行，不得标为最终 PASS。

开发阶段不增加 CI，不创建 Release，不将测试包发布到 npm。

## 7.2 Vite+ 内置命令迁移（2026-11-04）

维护者提供迁移前本机结果：`npm run build` 的 Node 复制构建执行成功，`npm run test:offline` **25/25 PASS**。随后明确要求使用 **`vp dev`、`vp build`、`vp pack`**。当前开发分支已执行**代码配置迁移**，尚无这三个命令在迁移后的本机结果：

- 删除旧 `scripts/build.mjs` 与 package script `build`，不再依赖 `npm run build`。**Vite+ 内置的 `vp build` 不会调用同名 package script**。
- `vite.config.ts` 使用 `build.lib.entry: "src/normalize.css"`、`formats: ["es"]`、`cssFileName: "normalize"`、`cssMinify: false`，目标为 `dist/normalize.css`，不创建额外 JS 入口。是否仅有 CSS、输出名和规则内容准确，需以 Vite+ 1.4.0 的真实输出和更新后的 Node 契约测试确认。
- `vp dev` 仍供现有 Fixture 页面使用。
- `vite.config.ts` 中的 `pack.entry: ["src/normalize.css"]` 与 `css.fileName: "normalize.css"` 是对 tsdown CSS-only 唯一入口的**试验性配置**，结果隔离到 `dist-pack/` 并从 Git 忽略，`package.json` 的根导出仍指向 `dist/normalize.css`。如果 `vp pack` 失败或产生 JS，不应修改现有 npm 根导出强行适配；保留报错与产物列表，单独评审。
- 修改后的 `tests/package.node.test.mjs` 在不依赖 Vite+ 的独立 Linux Node 22.16.0 环境执行 **5/5 PASS**；这是配置/源码和已存在 CSS 文件的契约检查，**不是** Vite+ 命令实际构建成功，也不是 Windows 完整测试通过。
- `vp pack` 是 tsdown 库构建命令，**不是** `npm pack`；后者仍用于最终 tarball 的文件和导出边界检查。项目保持 `private: true`、零运行时 JS、无新增依赖或 CI。

## 7.3 Vite+ 1.4.0 实际反馈与构建职责修订（2026-11-04）

维护者的 Windows PowerShell 实测证据：

| 命令 | 本机结果 | 证据边界 |
| --- | --- | --- |
| `vp check` | PASS：55 文件格式、11 文件 Lint | 修订构建配置前 |
| `vp test` | PASS：6/6 | 修订构建配置前 |
| `npm run test:offline` | PASS：25/25 | 修订构建配置前 |
| `vp dev` | PASS：Vite+ 1.4.0 本地服务就绪 | 原 Fixture 页面开发服务 |
| `vp build` | **FAIL**：`cssCodeSplit: false` 与 CSS 输入冲突 | 此前 `build.lib.entry = "src/normalize.css"` 的配置不适用 |
| `vp pack` | **PASS**：只生成 `dist-pack/normalize.css`，200 字节，无 JS | 证明 Vite+ 1.4.0 已能原生直接打包 CSS-only 入口 |

**纠正旧方案**：Vite 的 library mode 默认 `cssCodeSplit: false`，当前 Rolldown 拒绝将 CSS 文件直接作为这种模式的输入。鉴于 `vp pack` 已真实验证，**不通过制造 JS 入口或强制修改 Vite 的 CSS 拆分行为来绕过错误**。

已修改开发分支：

- `vp build`：使用 `build.rolldownOptions.input` 指向仓库已有的六张原生 HTML Fixture，输出 **`dist-fixtures/`**。这属于本地测试预览，可能包含 HTML/JS，绝不进入 npm 的 `files: ["dist"]`。
- `vp pack`：保留实测成功的 `pack.entry = ["src/normalize.css"]` 和 `pack.css.fileName = "normalize.css"`，输出从 `dist-pack/` 调整为 **`dist/`**，与唯一根 `exports["."] = "./dist/normalize.css"` 一致；`private: true`、零运行时 JS、不增依赖均保持。
- `tests/package.node.test.mjs` 现在独立验证两类产物：预览 HTML 六页与单一 CSS。修订代码文件在独立 Linux Node 22.16.0 环境通过 Git blob SHA 匹配及 **6/6 Node 定向契约测试**。本环境没有 Vite+ 1.4.0，**修订后的 `vp build` 和 `vp pack` 尚未实跑**，完整 Windows 离线套件也尚未重跑。
- 原来 `dist/normalize.css` 的文件时间为 10:37，早于失败的 `vp build`；不能把旧产物当作当前构建通过证据。旧 `dist-pack/` 产物与 `dist-fixtures/` 均不作为发布内容。

下一步维护者只需 `vp check`、`vp build`、`vp pack`、`npm run test:offline`（需要时再执行 `vp test`）；观察 `dist-fixtures/` 的六个 HTML 与 `dist/` 唯一 CSS。真正 npm tarball 与 Vite+/Webpack 消费端仍需独立验证，当前不发布。

## 8. 研究与事实边界

- **已核对**：Vite+ CSS bundling 能力、Node `exports` 的路径与封装规则、Webpack CSS 副作用/打包行为、npm tarball 过滤机制。
- **已实测**：CSS 直接作为 Vite+ 1.4.0 `vp pack` 唯一入口成功；**尚未确认**：调整至 `dist/` 后的实际产物、Vite+ HTML 预览构建、根入口对 CSS/JS 消费端的兼容性、`style` 元数据的消费者支持、完整仓库真实 tarball 与副作用测试。
- **尚未实施**：源码、包配置、依赖、浏览器、构建、发布、CI。
- **对 ADR-0003 的关系**：该 ADR 的“首版唯一根 CSS 入口”仍为 Accepted；**本文不是新增 ADR，也不擅自改变已接受的公共接口**。
