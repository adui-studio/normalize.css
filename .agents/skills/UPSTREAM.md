# awesome-copilot 第三方 Skills

本目录从 [github/awesome-copilot](https://github.com/github/awesome-copilot) 原样纳入三个上游 Skills，保留 Skill 源文件及所需 references；**不是自行重新写同名 Skill**。

- 上游固定提交：[8178d1939a203f691067073dcab2a3f1e14072d3](https://github.com/github/awesome-copilot/tree/8178d1939a203f691067073dcab2a3f1e14072d3/skills)
- 上游 MIT 许可证：[UPSTREAM_LICENSE.txt](UPSTREAM_LICENSE.txt)
- 纳入日期：2026-11-03
- 本次导入方式：GitHub 连接复制上游 UTF-8 文件到项目级目录；本环境没有执行 `npx skills add`，也没有在用户本机安装
- 本轮没有导入脚本，亦未引入运行时依赖或 CI

| Skill | 入口 | 在本项目中使用 |
| --- | --- | --- |
| github-issues | [SKILL.md](github-issues/SKILL.md) | Issue 信息采集、创建/更新前确认仓库和证据，含完整原版 references |
| conventional-commit | [SKILL.md](conventional-commit/SKILL.md) | 规范提交主题与范围 |
| bug-reproduction-brief | [SKILL.md](bug-reproduction-brief/SKILL.md) | 最小复现、预期/实际、环境与未验证事项的分离 |

## Codex / OpenCode 本地使用

两者均支持 `.agents/skills/<name>/SKILL.md` 项目级路径。将包含上述文件的分支检出后即可让 Agent 发现；本轮未在用户本机验证自动调用。

如果要在本地用原生 CLI 升级/重新安装（会修改上游 Skill 文件，先核对 Git diff 和来源）：

```powershell
npx skills add github/awesome-copilot -s github-issues -s conventional-commit -s bug-reproduction-brief -a codex opencode -y
```

**该命令本轮未执行**。以后上游升级前先审查许可证、参考文件和所调用工具的权限。

本仓库 `AGENTS.md` 和用户最新要求高于上游 Skill 指令。特别是任何要求创建 CI、安装依赖、合并 PR、发布包或执行未知脚本的步骤均不得擅自执行。
