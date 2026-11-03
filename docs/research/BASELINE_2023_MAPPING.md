# Baseline 2023 浏览器版本映射：固定数据核查

- **日期**：2026-11-03
- **状态**：**已完成数据快照核查，未执行本项目浏览器实测；尚未冻结发行版最低浏览器声明**
- **关联**：[ADR-0004 Accepted](../adr/0004-browser-support-policy.md) · [W-01](../plans/MVP_IMPLEMENTATION_PLAN.md) · [浏览器矩阵](BROWSER_REVIEW.md) · [Issue #2](https://github.com/adui-studio/normalize.css/issues/2)

## 1. 一手数据来源

- 维护方：W3C WebDX Community Group 项目 [baseline-browser-mapping](https://github.com/web-platform-dx/baseline-browser-mapping)。
- 本次锁定的上游 Git 提交：[f0a635b134cdeef3b82804a057bcb96796d42a2f](https://github.com/web-platform-dx/baseline-browser-mapping/commit/f0a635b134cdeef3b82804a057bcb96796d42a2f)，提交时间 2026-11-02 22:56:31 UTC。
- 数据文件：[static/all_versions_array_with_supports.json](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/static/all_versions_array_with_supports.json)。
- 版本对应数据与函数说明：[源代码](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/src/index.ts) 与 [README](https://github.com/web-platform-dx/baseline-browser-mapping/blob/f0a635b134cdeef3b82804a057bcb96796d42a2f/README.md)。
- 本次源码包 `package.json` 声明版本 **2.11.35**。
- **核查方法**：通过已连接 GitHub 接口读取固定提交的静态数组，按浏览器家族筛选 `year >= 2023` 的首条记录。源码将 `targetYear:2023` 对应 2023-12-31 特性截止日。**本轮没有安装包，也没有真正调用 npm 模块的 `getCompatibleVersions()`**，后续可在独立环境以同一数据版本复核函数输出。

## 2. 核心浏览器特性兼容候选下限

| 浏览器 | 静态快照中首个 `year >= 2023` 的版本 | 首次记录发布日期 |
| --- | --- | --- |
| Chrome | **120** | 2023-12-05 |
| Chrome Android | **120** | 2023-12-05 |
| Edge | **120** | 2023-12-07 |
| Firefox | **121** | 2023-12-19 |
| Firefox Android | **121** | 2023-12-19 |
| Safari macOS | **17.2** | 2023-12-11 |
| Safari iOS | **17.2** | 2023-12-11 |

**结论边界**：上表是 Baseline 2023 特性兼容集合映射的**候选下限**，不是 `@adui/normalize.css` 正式最低支持浏览器版本。还需检查真实系统最低版本、设备可用性、CSS 原生样式及所有入选规则的交互回归。

## 3. 为什么不能直接宣布已经支持这些版本

1. Baseline 衡量**特性可用性**，不是 UA 默认样式的一致性和实际可访问性。
2. `:where()` 等单项语法支持，并不代表整个 CSS 包与框架的级联规则兼容。
3. 首个 CSS 产物尚不存在，无法验证同一个选择器在 Chrome/Firefox/Safari 的影响。
4. Safari macOS 与 iOS 的最低 OS 支持前提需要另行查询官方发行说明；本轮尚未确认。
5. WebView2、Android System WebView、微信/X5 等不在七个核心家族直接映射结果之内；不能借共享引擎自动承诺兼容。
6. Playwright WebKit 与品牌 Safari 不完全等同，真实移动设备/系统版本需要显式检查。

## 4. W-01 仍需完成的工作

- [x] 固定映射数据来源与上游 SHA、记录研究日期。
- [x] 提取 Chrome/Edge/Firefox/Safari 七个核心家族的 Baseline 2023 特性候选版本。
- [ ] 审核 7 条数据与实际 `getCompatibleVersions({targetYear:2023})` 的固定包版本输出一致性。
- [ ] 核对 Safari 17.2 对应的最低 macOS/iOS 系统要求及可获取设备。
- [ ] 明确 Firefox ESR 是否单独承诺，以及能否获取用于验证的版本。
- [ ] 确认 Android WebView / WebView2 / 微信相关容器的支持定位与测试能力。
- [ ] 逐项完成实际浏览器 UA、键盘、表单、a11y、组件库和系统偏好回归，才可冻结正式支持承诺。

**现阶段 W-01 仅完成了数据核查的一部分；不得关闭 [Issue #2](https://github.com/adui-studio/normalize.css/issues/2)。**
