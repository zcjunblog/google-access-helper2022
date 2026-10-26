# Google Access Helper

**浏览器扩展资源整理 · 兼容性指南 · 历史版本档案**

[![Stars](https://img.shields.io/github/stars/zcjunblog/google-access-helper2022?style=flat)](https://github.com/zcjunblog/google-access-helper2022/stargazers)
[![Forks](https://img.shields.io/github/forks/zcjunblog/google-access-helper2022?style=flat)](https://github.com/zcjunblog/google-access-helper2022/forks)

[现代工具入口](docs/alternatives.md) · [版本与权限清单](docs/extension-catalog.md) · [迁移与排错](docs/migration.md) · [更新记录](CHANGELOG.md) · [参与维护](CONTRIBUTING.md)

这个仓库起初用于汇总 Google Access Helper 等浏览器扩展的不同版本和安装方法。现在补充当前工具入口、Chrome 兼容性说明和可复现的版本清单，帮助你判断旧插件为什么失效、接下来该查什么资料。

> **兼容性核查：2026-10-26。** 仓库内六个历史扩展均使用 Manifest V2，不能按原教程在当前 Chrome 上使用。Google 已停止支持 MV2；旧文件保留用于版本对照与研究，第三方服务连通性未经验证。[查看官方时间线](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline)

## 从这里开始

| 你想做什么 | 建议入口 |
| --- | --- |
| 找当前的代理配置扩展 | [ZeroOmega、FoxyProxy 的官方入口与核查记录](docs/alternatives.md) |
| 查看仓库里有哪些版本、申请了哪些权限 | [自动生成的扩展清单](docs/extension-catalog.md) |
| 处理 Manifest V2 报错、代理冲突或登录失败 | [迁移与排错指南](docs/migration.md) |
| 分析数据或核对本地文件 | [结构化 JSON](data/extensions.json) · [生成工具](scripts/catalog.py) |

**代理配置扩展需要你已有可用的代理服务。** 安装工具本身不会提供网络线路，也不保证能访问特定网站；本仓库不提供代理服务器、账号或订阅。

## 本次更新

- **当前资源入口**：整理 ZeroOmega 和 FoxyProxy 的源码、Chrome 商店链接与版本快照，标明资料核查和实际测试的区别。
- **兼容性说明**：解释 MV2 停用，以及安装成功、服务器可达和账号可用为什么是不同问题。
- **可复现清单**：从原始 `manifest.json` 提取版本、本地化名称、API 权限和访问范围，输出 JSON 与 Markdown。
- **持续校验**：通过测试和 GitHub Actions 检查清单是否与源文件一致。

## 历史扩展档案

以下为第三方扩展的历史文件，目录路径保持不变。收录不代表由本仓库开发，也不代表当前服务仍可用。

| 历史目录 | 内容 |
| --- | --- |
| [Astar-1.3.0_0](Astar-1.3.0_0/) | Astar 历史版本 |
| [Greenhub绿墙-0.9.20_0](Greenhub%E7%BB%BF%E5%A2%99-0.9.20_0/) | Greenhub 历史版本 |
| [开发版-谷歌服务助手2.6.2_0](%E5%BC%80%E5%8F%91%E7%89%88-%E8%B0%B7%E6%AD%8C%E6%9C%8D%E5%8A%A1%E5%8A%A9%E6%89%8B2.6.2_0/) | 谷歌上网助手开发版 |
| [彩-谷歌服务助手3.0.7_0](%E5%BD%A9-%E8%B0%B7%E6%AD%8C%E6%9C%8D%E5%8A%A1%E5%8A%A9%E6%89%8B3.0.7_0/) | 谷歌访问助手历史版本 |
| [绿-谷歌服务助手2.1.0_0](%E7%BB%BF-%E8%B0%B7%E6%AD%8C%E6%9C%8D%E5%8A%A1%E5%8A%A9%E6%89%8B2.1.0_0/) | iGG 谷歌学术助手历史版本 |
| [黄-谷歌服务助手4.1_0](%E9%BB%84-%E8%B0%B7%E6%AD%8C%E6%9C%8D%E5%8A%A1%E5%8A%A9%E6%89%8B4.1_0/) | PP 谷歌访问助手历史版本 |

扩展名称和版本以 [manifest 清单](docs/extension-catalog.md) 为准。旧域名、更新地址和依赖保留在原文件中，未核实其当前运营者或可用性。

## 本地生成与验证

只需 Python 3.9 或以上版本，无第三方依赖。工具只读取声明文件，不执行扩展代码，也不发起网络请求。

```bash
git clone https://github.com/zcjunblog/google-access-helper2022.git
cd google-access-helper2022

# 生成版本与权限清单
python3 scripts/catalog.py

# 只检查清单是否过期，不修改文件
python3 scripts/catalog.py --check

# 运行测试
python3 -m unittest discover -s tests -v
```

输出文件为 [`data/extensions.json`](data/extensions.json) 和 [`docs/extension-catalog.md`](docs/extension-catalog.md)。工具扫描仓库一级扩展目录，名称使用扩展声明的默认语言；无法解析的翻译名称回退为目录名。权限来自 manifest 声明，不等同于完整代码审计。

## 项目边界与贡献

本仓库维护资源索引、文档和清单工具；第三方扩展的账号、服务和商店发布由其原作者管理。发现信息过期，可按 [贡献指南](CONTRIBUTING.md) 提交来源与核查日期。

历史扩展及所含第三方依赖的权利归各自权利人所有。仓库没有统一许可证，不应将收录行为理解为对全部文件的重新授权；复制、修改或分发前请核对对应许可。

## English

A collection of historical browser extensions, current resource links, and Chrome compatibility notes. All six bundled extensions use Manifest V2 and are unsupported on current Chrome. The Python inventory tool reads local manifests without running extension code or contacting services. See the [catalog](docs/extension-catalog.md) and [current resource directory](docs/alternatives.md). Third-party ownership and licensing remain with the respective authors.
