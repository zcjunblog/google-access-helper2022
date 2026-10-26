# Google Access Helper

**浏览器扩展与代理配置工具导航**

[![Stars](https://img.shields.io/github/stars/zcjunblog/google-access-helper2022?style=flat)](https://github.com/zcjunblog/google-access-helper2022/stargazers)
[![Forks](https://img.shields.io/github/forks/zcjunblog/google-access-helper2022?style=flat)](https://github.com/zcjunblog/google-access-helper2022/forks)

[工具与官方入口](docs/alternatives.md) · [兼容性与排错](docs/migration.md) · [更新记录](CHANGELOG.md) · [参与维护](CONTRIBUTING.md)

整理 Google 相关浏览器扩展与代理配置工具的官方入口、Chrome 兼容性信息和使用资料，帮助你选择工具、理解配置要求并排查常见问题。

## 工具导航

| 工具 | 主要用途 | 官方入口 |
| --- | --- | --- |
| **ZeroOmega** | 多组代理配置与规则切换，支持 Manifest V3 | [源码与说明](https://github.com/zero-peak/ZeroOmega) · [Chrome 商店](https://chromewebstore.google.com/detail/proxy-switchyomega-3-zero/pfnededegaaopdmhkdmcofjmoldfiped) |
| **FoxyProxy** | 手动切换代理、按 URL 规则管理代理 | [源码与说明](https://github.com/foxyproxy/browser-extension) · [Chrome 商店](https://chromewebstore.google.com/detail/foxyproxy/gcknhkkoolaabfmlnjonogaaifnjlfnp) |

查看 [完整资源目录与核查记录](docs/alternatives.md)，了解各工具的版本信息、规范依据与验证范围。资料核查日期：**2026-10-26**；后续版本以各官方入口为准。

## 使用前先了解

代理配置扩展负责管理浏览器代理设置，使用时需要你已有可用的代理主机、端口和必要的认证信息。本仓库提供工具索引与说明，联网结果取决于实际使用的网络服务和配置。

建议从作者官方源码、商店或发行页获取扩展。资源目录记录的是公开资料核查结果，实际安装和服务连通性需要在你的环境中分别验证。

## 兼容性与排错

| 遇到的问题 | 参考资料 |
| --- | --- |
| Manifest V2 报错、扩展无法加载 | [Chrome 兼容性说明](docs/migration.md#为什么原来的安装方法失效了) |
| 扩展已安装，但无法访问网页 | [配置与服务排查](docs/migration.md#先确认你遇到哪一种问题) |
| 更换代理配置工具 | [建议迁移步骤](docs/migration.md#建议迁移步骤) |
| 了解 MV2 到 MV3 的开发变化 | [迁移评估要点](docs/migration.md#为什么不能直接把-2-改成-3) |

Chrome 已停止支持 Manifest V2，旧版安装教程不再适用于当前 Chrome。平台支持情况见 [Chrome 官方时间线](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline)。

## 参与维护

欢迎补充有官方来源的工具入口、修正兼容信息、完善排错步骤。提交时请注明核查日期、版本与实际验证范围，具体见 [贡献指南](CONTRIBUTING.md)。

第三方工具的开发、账号和服务由各自维护者负责。

## English

A curated directory of browser extensions and proxy configuration tools, with official links, Chrome compatibility notes, and troubleshooting guides. See the [resource directory](docs/alternatives.md) and [migration guide](docs/migration.md). Proxy configuration tools require an existing proxy service; installation and connectivity depend on your environment.
