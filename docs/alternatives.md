# 当前工具与官方入口

核查日期：**2026-10-26**。以下是代理配置工具，可用于管理你已有的代理服务；它们不等同于旧插件所提供的第三方网络服务。

## 资源目录

| 工具 | 适合的需求 | Chrome 规范依据 | 官方入口 |
| --- | --- | --- | --- |
| ZeroOmega（Proxy SwitchyOmega 3） | 多组代理配置、规则切换、沿用 SwitchyOmega 的操作习惯 | 项目 README 和 Chrome 商店均明确说明支持 Manifest V3 | [源码与说明](https://github.com/zero-peak/ZeroOmega) · [Chrome 商店](https://chromewebstore.google.com/detail/proxy-switchyomega-3-zero/pfnededegaaopdmhkdmcofjmoldfiped) · [官方 Releases](https://github.com/zero-peak/ZeroOmega/releases) |
| FoxyProxy | 手动切换代理、按 URL 规则管理代理 | 上游 `src/manifest.json` 声明 `manifest_version: 3` | [源码与说明](https://github.com/foxyproxy/browser-extension) · [Chrome 商店](https://chromewebstore.google.com/detail/foxyproxy/gcknhkkoolaabfmlnjonogaaifnjlfnp) · [官方下载导航](https://getfoxyproxy.org/downloads/) |

这些项目独立于本仓库，由各自作者维护。本页提供入口，不打包或修改它们的发行文件，也没有对其代码做完整审计。

## 本次核查记录

| 项目 | 查到的公开信息 | 核查范围 |
| --- | --- | --- |
| ZeroOmega | Chrome 商店版本 **3.5.2**，更新日期 **2026-09-10**；GitHub 发布版本 [v3.5.2](https://github.com/zero-peak/ZeroOmega/releases/tag/v3.5.2) | 已核对项目 README、官方发布页与商店入口；未安装或进行代理连通性测试 |
| FoxyProxy | Chrome 商店版本 **9.7**，更新日期 **2026-09-08**；核查时上游 [源码 manifest](https://github.com/foxyproxy/browser-extension/blob/master/src/manifest.json) 版本为 **9.8**、规范为 MV3 | 已核对源码、作者下载页与商店入口；源码与商店版本不同，未将开发分支当作已发布版本；未安装或测试服务 |

版本号是本次核查的快照，后续更新以各官方入口为准。“页面可访问”“源码声明 MV3”“实际安装通过”“特定网络下可以连接”是不同结论，本页只记录前两项。

## 选择与使用

1. 先确认你已有可用的代理主机、端口及必要的认证信息。没有这些信息时，安装代理管理扩展不会自动提供线路。
2. 根据规则管理需求，选择其中一个工具，通过上表官方入口安装。
3. 配置前导出现有设置，停用其他可能控制同一浏览器代理设置的扩展，再检查当前生效的配置。
4. 若仍无法访问，按 [迁移与排错指南](migration.md) 分别检查浏览器、代理配置、账号和服务状态。

Chrome 商店本身无法访问时，可查看项目的官方 Releases 和安装说明；是否提供离线安装文件由项目作者决定。安装方式以对应项目的当前官方说明为准。

## 平台与开发资料

- [Chrome：Manifest V2 支持时间线](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline)
- [Chrome：Manifest V3 概览](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
- [Chrome：迁移到 Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate)
- [Chrome：proxy API](https://developer.chrome.com/docs/extensions/reference/api/proxy)

新增资源时，请提供作者源码、商店或发行入口、核查日期及实际验证范围，见 [贡献指南](../CONTRIBUTING.md)。

返回 [项目首页](../README.md)
