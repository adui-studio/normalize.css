# SKILLS — Agent 能力索引

**状态**：三个官方上游第三方 Skills 已真实纳入本仓库的文档评审分支；保留原始 `SKILL.md`、`github-issues` 的十份 references 与原始 MIT 许可证。**main 在 PR 合并前尚无这些文件；用户本机的 Skill 自动发现尚未验证。**

## 已纳入的第三方 Skills

来源：[github/awesome-copilot](https://github.com/github/awesome-copilot)，固定上游提交 [`8178d1939a203f691067073dcab2a3f1e14072d3`](https://github.com/github/awesome-copilot/tree/8178d1939a203f691067073dcab2a3f1e14072d3/skills)。

| Skill                  | 原版入口                                                      | 使用场景                                                          | 本轮状态                                                                                      |
| ---------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| github-issues          | [SKILL.md](../.agents/skills/github-issues/SKILL.md)          | 先核对仓库与 Issue 类型，再提供可复现问题、功能或任务的结构化提交 | 已用于 Issue Forms；尚未新建 Issue                                                            |
| conventional-commit    | [SKILL.md](../.agents/skills/conventional-commit/SKILL.md)    | 结构化提交标题与中文变更说明                                      | 已用于本轮文档提交                                                                            |
| bug-reproduction-brief | [SKILL.md](../.agents/skills/bug-reproduction-brief/SKILL.md) | 先记录环境、最小复现、期望与实际，暂缓未经证实的修复              | 已用于浏览器 Issue Form 和 [表单规则研究](research/FORM_CONTROLS_REVIEW.md)；尚未做浏览器实测 |

这些是**直接使用上游 Skills 文件**，不是只借鉴后自编；完整来源、许可证和本地命令见 [UPSTREAM.md](../.agents/skills/UPSTREAM.md)。

## 本地启用与升级

Codex、OpenCode 均支持项目 `.agents/skills/<name>/SKILL.md`；在本地检出评审分支后可供 Agent 发现。本环境因网络 DNS 限制**未运行 Skills CLI**，也没有在用户电脑上执行安装。可在本机进入仓库根目录后按官方 CLI 方式选择安装：

```powershell
npx skills add github/awesome-copilot -s github-issues -s conventional-commit -s bug-reproduction-brief -a codex opencode -y
```

该命令可能更新/覆盖仓库自带的原版文件，应先审阅上游变化和 Git diff。**以上命令尚未在本轮执行。**

## 继续观察的能力

Normalize 规则审查、跨浏览器回归、发布审查可在真正出现稳定重复工作流后分别考虑创建项目专用 Skill；当前不创建空 Skill、脚本或依赖。

## 使用红线

- 当前用户要求与 [AGENTS.md](../AGENTS.md) 高于第三方 Skill 的流程建议。
- 上游 Skill 中的工具名需按当前真实已连接工具适配；不假定某个 MCP 名称一定存在。
- 未授权不得写 CSS 源码、安装依赖、创建/合并 PR、发布 npm 或执行第三方脚本。
- 本项目**不增加任何 CI**。
- Skill 源文件存在不表示用户本机发现已验证，规范研究也不等于浏览器测试通过。
