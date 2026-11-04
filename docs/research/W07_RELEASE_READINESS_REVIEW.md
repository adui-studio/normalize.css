# W-07 · MVP 发布前质量审核记录

- **首次审查日期**：2026-11-04
- **分支**：`feat/viteplus-local-harness`
- **工作项**：[W-07 / Issue #8](https://github.com/adui-studio/normalize.css/issues/8)
- **审查形式**：读取 GitHub 开发分支当前文件、遍历仓库提交树、比对已有人工/终端证据；**不是在维护者 Windows 环境重新运行 Vite+ / npm 命令**。
- **审核判断**：**部分通过，发布准备尚未就绪；Issue #8 保持 Open**。
- **红线**：不修改产品 CSS 或既定包根入口；不新增依赖/CI、GitHub Actions、自动发布；不执行 npm publish、GitHub Release、`main` 合并。

## 1. 包契约与产物

| 核对项 | 当前仓库事实 | 审核判定 |
| --- | --- | --- |
| 包名与入口 | `package.json`：`@adui/normalize.css`；`exports["."] = "./dist/normalize.css"`，无公开子路径 | **静态核对 PASS** |
| 源码 | `src/normalize.css` 只有 R-003：`b,strong { font-weight:bolder }`；36 条规则的首版去留已由 W-05 评审 | **静态核对 PASS** |
| CSS-only 构建 | `vite.config.ts` 由 `vp pack` 输出 `dist/normalize.css`；`vp build` 负责本地 HTML Fixtures | **配置核对 PASS**，本轮未重新构建 |
| 包白名单 | `files: ["dist"]`、`sideEffects: ["**/*.css"]`；没有 `dependencies` 字段 | **静态核对 PASS** |
| 包内文件 | `tests/package-real.node.test.mjs` 实际断言必含 `LICENSE`、`README.md`、`dist/normalize.css`、`package.json`，可选 `README.en.md`，禁止其它文件 | **历史真实 tarball 测试 PASS（1/1）**，本轮未重跑 |
| 生产消费 | `tests/package-vite-consumer.node.test.mjs` 安装真实 tarball，验证 Vite+ 消费结果包含 R-003 CSS | **历史测试 PASS（1/1）**，本轮未重跑 |
| 第三方 Reset 与生态 | [W-06 管理验收索引](W06_ACCEPTANCE_INDEX.md) 记录 9/9 Reset 构建、Chrome 156 静态对照及维护者回归确认 | **已归档**，不要扩大为未附证据平台的逐版本 PASS |
| Git 忽略边界 | `.gitignore` 忽略 `dist/`、`dist-fixtures/`、`node_modules/`、`*.tgz` 等；`dist/normalize.css` 在 Git 中不跟踪 | **静态核对 PASS**；正式包生成须先 `vp pack` |
| 开发工具链 | `vite-plus: "1.4.0"`（devDependency），Node `^22.18.0 || ^24.11.0 || >=26.0.0` | **配置核对 PASS**；本轮未重新安装 |

**特别说明**：`npm pack` 会根据其文件收集规则包含部分标准根文件；目前是否包含正确内容有前序真实打包测试，但本轮增加 `CHANGELOG.md` 等文档后**没有重新执行 tarball 文件清单检查**。`CHANGELOG.md` 作为仓库记录不属于当前 `files: ["dist"]` 的公开包内容白名单；如未来希望发行包包含 Changelog，应单独调整准入策略与包契约测试，不能悄然扩大。

## 2. 文档与许可证

| 核对项 | 证据/发现 | 状态 |
| --- | --- | --- |
| 中英文 README | 根目录 `README.md`、`README.en.md` 均存在，且互相链接 | PASS（结构） |
| 文档链路 | 基于开发分支 GitHub 提交树，对 11 份核心与规则/验收文档的 **252 个 Markdown 本地文件链接**进行路径存在性静态核对，**未发现失效目标** | **PASS（路径存在性）**；未检查外链、锚点或 GitHub UI |
| 正式许可证 | `LICENSE` 是 MIT 文本，版权所有者 ADui Studio，2026 | PASS（文件存在及文本检查） |
| 第三方 Skills | `.agents/skills/UPSTREAM.md` 有上游固定 SHA、三项来源；`UPSTREAM_LICENSE.txt` 保留 GitHub, Inc. MIT 文本 | PASS（归属记录） |
| 规则来源 | W-05 仅 R-003 准入；证据卡和 W-06 验收索引可追溯 | PASS（范围与链接） |
| 变更记录 | 新建根目录 `CHANGELOG.md`，仅列「未发布」，没有编造发行版本或日期 | PASS（文档准备） |
| 文档状态 | 历史段落中存在过时的“W-06 未开始/未验收”等阶段措辞；以文件顶部的**最新状态**与 W-05/W-06 正式索引优先 | **需要 README 的最新状态校正**；历史记录不作无依据抹除 |

## 3. 发布前尚未完成的事项

| 编号 | 事项 | 当前证据 | 风险/决定 |
| --- | --- | --- | --- |
| P-01 | **锁文件与包管理器策略** | 当前 GitHub 完整提交树**无** `pnpm-lock.yaml`、`package-lock.json`、`yarn.lock` 或 `bun.lock*`；`package.json` 无 `packageManager` | **BLOCKER**：选定包管理器与版本后提交对应 lockfile 并验证可复现安装；不得假定 `pnpm install` 自动产生文件已入库 |
| P-02 | **版本和 npm 发布开关** | `version:"0.0.0"`、`private:true` | **预期发布阻断**：保持现状直到维护者正式指定首个语义化版本并授权公开发布；**不提前清除 `private`** |
| P-03 | **包元数据** | 当前 `package.json` 没有 `license`、`description`、`repository`、`homepage`、`bugs` 等字段；仓库 `LICENSE` 文件真实存在 | **待补充审核**：优先 `license: "MIT"` 与明确的仓库 URL；其它字段按必要性补齐；修改 manifest 需另行批准并复测包契约 |
| P-04 | **npm 组织/作用域权限** | 无已验证的 `@adui` npm scope 发布授权、包名可用性或维护者身份资料 | **NOT_VERIFIED**：发布前由维护者自行核验；不读取令牌、不登录、不尝试发布 |
| P-05 | **公开兼容性范围** | [W-06](W06_ACCEPTANCE_INDEX.md) 已获维护者管理验收；缺少本次逐目标 UA/OS/设备原始附件 | **文案门槛**：不得把目标最低版本清单直接写成已经可复核 PASS 的公开支持承诺 |
| P-06 | **最终本机复核** | 已存在旧阶段 `vp check` / `vp test` / `test:offline` / `test:package` / `test:consumer` PASS 记录 | **NOT_RUN（本次）**：最新文档/包设置定稿后按本地命令重跑；不得当作本轮已执行 |
| P-07 | **最终发行准许** | W-07 当前只获授权执行质量审核，**未授权发布、Release、合并或改生产配置** | **BLOCKER**：发布需维护者新的明确指令 |

**许可证细节**：`LICENSE` 文件已经存在并在历史 tarball 测试的允许清单中，但 `package.json` 尚未显式声明 `license:"MIT"`。这不是“缺少许可证文件”，而是 npm 元数据与仓库许可证描述尚未同步。

**GitHub Actions**：检查 `.github/` 目录，当前仅 `ISSUE_TEMPLATE/` 与 `pull_request_template.md`，**未发现 workflows**。本项目长期禁止增加任何 CI；W-07 不新增自动检查机制。

## 4. 下一次仅在维护者本机执行的只读或测试命令

**注意：以下命令为待运行验证步骤，本文未声称已执行。**

```powershell
# 在 feat/viteplus-local-harness 工作树根目录
git status --short
git ls-files "*lock*"

# 现有本地工具链及 Node 检查
node --version
npm --version
vp check
vp test
npm run test:offline

# 真实 CSS-only 包与消费验证，不会公开发布
vp pack
npm run test:package
npm run test:consumer

# 审查包内文件，不发布也不安装
npm pack --dry-run --json --ignore-scripts
```

如维护者选定 pnpm，应明确选用的 pnpm 版本、生成并提交 `pnpm-lock.yaml`，然后使用相应版本的冻结锁文件安装流程复核；如决定使用 npm，则提交 `package-lock.json` 并复核 `npm ci`。**暂不并存多套锁文件或无依据地固定本地工具版本**。

## 5. 本轮结论与后续决策

**当前判断：W-07 审核已启动，基础包契约/许可证/证据索引符合已有设计；发布前门槛未全部满足，Issue #8 继续 Open。**

优先级建议：**先确认单一包管理器与 lockfile 策略（P-01），再处理包元数据与正式版本（P-02/03），随后复核真实包内容和检查输出（P-06），最后由维护者决定是否授权发布（P-07）**。

本轮只可写审核文档及同步准确 README 状态。未修订生产 CSS、未执行 CI、未变更包导出、未发布软件包、未创建 Release、未合并主分支。
