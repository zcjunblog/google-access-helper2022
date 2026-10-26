# 扩展版本与权限清单

> 由 `python3 scripts/catalog.py` 自动生成，请修改源 manifest 后重新生成。

本页只读取仓库内的声明文件，不执行扩展、不连接服务、不构成安全审计。

MV2 在当前 Chrome 中已不受支持；MV3 也仅表示声明的规范版本，未经本仓库运行验证。
`minimum_chrome_version` 是原作者声明的历史最低版本，不代表今天仍然兼容。

| 目录 / 源文件 | 扩展名称 | 版本 | Manifest | 当前 Chrome 状态 |
| --- | --- | --- | --- | --- |
| [Astar-1.3.0&#95;0](../Astar-1.3.0_0/manifest.json) | Astar VPN - Free and fast VPN for everyone | 1.3.0 | 2 | 不支持（MV2） |
| [Greenhub绿墙-0.9.20&#95;0](../Greenhub%E7%BB%BF%E5%A2%99-0.9.20_0/manifest.json) | Greenhub Free VPN - Secure and Unblock VPN | 0.9.20 | 2 | 不支持（MV2） |
| [开发版-谷歌服务助手2.6.2&#95;0](../%E5%BC%80%E5%8F%91%E7%89%88-%E8%B0%B7%E6%AD%8C%E6%9C%8D%E5%8A%A1%E5%8A%A9%E6%89%8B2.6.2_0/manifest.json) | 谷歌上网助手 开发版 | 2.6.2 | 2 | 不支持（MV2） |
| [彩-谷歌服务助手3.0.7&#95;0](../%E5%BD%A9-%E8%B0%B7%E6%AD%8C%E6%9C%8D%E5%8A%A1%E5%8A%A9%E6%89%8B3.0.7_0/manifest.json) | 谷歌访问助手 | 3.0.7 | 2 | 不支持（MV2） |
| [绿-谷歌服务助手2.1.0&#95;0](../%E7%BB%BF-%E8%B0%B7%E6%AD%8C%E6%9C%8D%E5%8A%A1%E5%8A%A9%E6%89%8B2.1.0_0/manifest.json) | iGG谷歌学术助手 | 2.1.0 | 2 | 不支持（MV2） |
| [黄-谷歌服务助手4.1&#95;0](../%E9%BB%84-%E8%B0%B7%E6%AD%8C%E6%9C%8D%E5%8A%A1%E5%8A%A9%E6%89%8B4.1_0/manifest.json) | PP谷歌访问助手-为国出征-国庆版 | 4.1 | 2 | 不支持（MV2） |

## Astar-1.3.0&#95;0

- 声明的最低 Chrome 版本：18.0.0
- 必需 API 权限：management、privacy、proxy、webRequest、webRequestBlocking
- 必需主机访问范围：http://&#42;/&#42;、https://&#42;/&#42;
- 可选 API 权限：未声明
- 可选主机访问范围：未声明
- 内容脚本 matches（未扣除 exclude_matches 等限制）：&lt;all&#95;urls&gt;

## Greenhub绿墙-0.9.20&#95;0

- 声明的最低 Chrome 版本：未声明
- 必需 API 权限：alarms、proxy、storage、webRequest、webRequestBlocking
- 必需主机访问范围：&lt;all&#95;urls&gt;
- 可选 API 权限：未声明
- 可选主机访问范围：未声明
- 内容脚本 matches（未扣除 exclude_matches 等限制）：&#42;://&#42;.twitter.com/&#42;、&lt;all&#95;urls&gt;

## 开发版-谷歌服务助手2.6.2&#95;0

- 声明的最低 Chrome 版本：17.0.0
- 必需 API 权限：management、proxy、webRequest、webRequestBlocking
- 必需主机访问范围：&lt;all&#95;urls&gt;
- 可选 API 权限：未声明
- 可选主机访问范围：未声明
- 内容脚本 matches（未扣除 exclude_matches 等限制）：未声明

## 彩-谷歌服务助手3.0.7&#95;0

- 声明的最低 Chrome 版本：55.0.0
- 必需 API 权限：notifications、proxy、tabs、unlimitedStorage、webRequest、webRequestBlocking
- 必需主机访问范围：&lt;all&#95;urls&gt;
- 可选 API 权限：未声明
- 可选主机访问范围：未声明
- 内容脚本 matches（未扣除 exclude_matches 等限制）：未声明

## 绿-谷歌服务助手2.1.0&#95;0

- 声明的最低 Chrome 版本：33.0.0
- 必需 API 权限：alarms、management、notifications、proxy、storage、webRequest、webRequestBlocking
- 必需主机访问范围：&lt;all&#95;urls&gt;
- 可选 API 权限：未声明
- 可选主机访问范围：未声明
- 内容脚本 matches（未扣除 exclude_matches 等限制）：未声明

## 黄-谷歌服务助手4.1&#95;0

- 声明的最低 Chrome 版本：未声明
- 必需 API 权限：management、notifications、proxy、storage、tabs、webRequest、webRequestBlocking
- 必需主机访问范围：&lt;all&#95;urls&gt;
- 可选 API 权限：未声明
- 可选主机访问范围：未声明
- 内容脚本 matches（未扣除 exclude_matches 等限制）：&lt;all&#95;urls&gt;

## 如何理解这些声明

- `proxy`：允许扩展管理浏览器代理设置。
- `webRequest` / `webRequestBlocking`：涉及网络请求观察或拦截；迁移时需要逐项评估。
- `management`：涉及其他扩展的信息或管理能力，具体操作仍受浏览器权限规则约束。
- `<all_urls>` 或广泛的主机匹配：声明了较广的访问范围，并不直接证明扩展有恶意行为。
- 声明清单不能证明服务可用、代码可信或隐私承诺已被验证。

返回 [项目首页](../README.md) · [迁移与排错](migration.md)
