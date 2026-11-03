# HARNESS — 执行、验证与反馈环境

**当前状态：只有规划文档，没有可执行 Harness。** 仓库中尚无 package.json、测试框架、构建脚本、CI、浏览器 Fixtures、发布产物。不得把本页命令示例称为已验证可运行。

## 1. Harness 目标

形成可重复的闭环：理解需求 → 影响分析 → 制定验证矩阵 → 最小修改 → 检查 → 定位失败 → 修复重验 → 记录结果。未来仅考虑维护者本地运行可复现检查并记录结果；项目明确**不增加任何 CI**，避免仅凭经验声称跨浏览器兼容。

## 2. 当前可以执行的审查（无新增工具）

- 确认 GitHub 仓库仅在文档阶段修改 Markdown，保留 MIT LICENSE。
- 对照 [CODEBASE_MAP](CODEBASE_MAP.md) 的真实路径核查存在性。
- 审核相对链接、需求 ID、ADR 状态及“未实现/已验证”措辞。
- 审核文档是否引用不存在的命令、Skill、workflow 或发布版本。
- 把上述**人工检查**与未来程序化文档校验明确区分。

## 3. 开发阶段拟建设的验证层级

| 层级 | 拟议检查 | 预期产物 | 当前状态 |
| --- | --- | --- | --- |
| 依赖/环境 | Node 与包管理器版本锁定、安装重现 | 环境说明、锁文件 | 未选型 |
| 格式与静态 | Markdown、CSS 格式、语法、规则约束 | 可定位的检查报告 | 未实现 |
| 规则单元 | 某声明存在/缺失及导出边界 | 单元测试报告 | 未实现 |
| 真实浏览器 | Chromium、Firefox、WebKit 的差异 Fixture | 浏览器版本及结果、截图 | 未实现 |
| 无障碍体验 | 键盘焦点、系统减少动画/高对比度 | 行为回归记录 | 未实现 |
| 组件库兼容 | Element Plus、Ant Design、TDesign 选定示例 | 对照截图及误差分析 | 未实现 |
| 打包发布 | CSS 公开导出、包文件清单、许可证、大小 | npm tarball 验证报告 | 未实现 |
| CI | 项目明确不增加任何 CI | 不适用 | 不规划 |

## 4. 规划命令与真实命令的界线

未来**可以考虑**使用以下命令名称，但仓库目前**不存在对应 npm scripts，不能执行或宣称通过**：

```sh
npm run lint
npm run test
npm run test:browser
npm run build
npm run check
```

工具链要在 [SDD](SDD.md)、[需求](REQUIREMENTS.md) 的最低验证能力确认后再选，避免为了命令名称反向引入依赖。

## 5. Fixture 最小范围（规划）

1. 基础文档语义：headings、lists、hr、abbr、pre/code、details/summary。
2. 表单：button、input 各类型、select、textarea、fieldset/legend、原生校验。
3. 原生交互：dialog、popover、focus-visible、hidden/hidden=until-found。
4. 系统偏好：forced-colors、prefers-contrast、prefers-reduced-motion。
5. 组件库：Element Plus、Ant Design、TDesign 中按钮、输入、弹窗、表格的典型页面。

每一项需同时记录 **浏览器版本、操作步骤、期待行为、实际结果**。浏览器引擎覆盖不能由 CSS 解析测试代替。

## 6. 安全和发布门禁（规划）

- 审核第三方规则的许可证及改写过程；不引入未经审批的远程字体、图片或跟踪请求。
- 浏览器支持与测试范围见 [ADR-0004](adr/0004-browser-support-policy.md)，进入开发的决策门槛见 [REVIEW_GATE](research/REVIEW_GATE.md)。
- 所有公开入口必须能在实际发布包内解析，默认入口不得隐式导入可选增强。
- 浏览器关键回归、许可证、发布文件清单和版本说明全部确认后，才可申请发布。
- npm 权限、版本发布和 GitHub Release 需另行授权；不引入 CI Secrets 或发布工作流。

## 7. 故障报告格式

记录：任务/需求编号、环境及浏览器版本、最小复现页面、实际/预期差异、受影响入口、测试证据、原因分析、修复结果、无法验证事项。

**更新约定**：在明确批准开发后，新增真实本地脚本、测试或运行环境时，以可执行命令更新本页；**项目不增加任何 CI**。如未运行必须明确记录原因。