# Cloudflare WARP 本地代理接入（待实测）

> [!IMPORTANT]
> **本页为官方资料核查后的接入方案，尚未完成 WARP 客户端与本扩展的端到端实测。**
> WARP 需要另外安装并在你的网络中成功连接。它不是扩展内置线路；免费不代表任何地区或网络都保证可用。

核查日期：**2026-10-26**。

## 当前验证记录

| 项目 | 结果 |
| --- | --- |
| 官方协议说明 | 已核对桌面 Local proxy 与 SOCKS5 支持 |
| macOS 安装包 | 从官方入口下载 `2026.8.2115.0`；Apple 开发者安装签名与公证校验通过，签名主体为 Cloudflare Inc. |
| 配置示例 | 已通过本扩展实际配置解析器校验，生成预期的 SOCKS5 PAC 指令 |
| WARP 安装、连接及出口 | 尚未测试；当前机器未安装客户端 |
| 扩展与 WARP 端到端配合 | 尚未测试 |

## 适用方案

Cloudflare 官方区分免费的 WARP 和付费的 WARP+。WARP 桌面客户端支持 Local proxy 模式，通过本机监听端口向指定应用提供代理；官方文档列出了 SOCKS5 支持。

本扩展支持 SOCKS5 代理配置，因此从协议与配置接口看，两者可以通过本地代理模式配合。该兼容判断依据官方文档，不能替代实际客户端与出口测试。

这里使用的是 **WARP 桌面客户端**，不是把 Cloudflare Workers 地址直接填写为代理服务器，也不需要将 Cloudflare 账号、WARP+ 密钥或 Zero Trust 注册凭据导入本扩展。

## 准备 WARP

1. 从 [Cloudflare 官方客户端安装入口](https://developers.cloudflare.com/warp-client/get-started/) 选择自己的桌面操作系统。
2. 按官方说明安装客户端。macOS 安装会添加应用和后台服务，可能需要系统授权。
3. 按 [官方 Local proxy 说明](https://developers.cloudflare.com/warp-client/warp-modes/#local-proxy)，打开 Preferences → Advanced → Configure Proxy，启用本地代理并设置监听端口。
4. 选择 Local proxy 模式并连接 WARP。不同版本的菜单名称可能变化，以当前客户端及其官方文档为准。

本指南只配置指定应用使用的本地代理。请确认实际使用的是 Local proxy 模式；WARP 的其他模式可能接管整个设备的流量或 DNS。

## 配置扩展

在 Google Access Helper 中填写：

| 字段 | 填写方式 |
| --- | --- |
| 协议 | SOCKS5 |
| 代理地址 | `127.0.0.1` |
| 端口 | WARP 中实际设置的监听端口 |
| 访问范围 | 仅 Google 服务，或按需选择全部网站 |

先保存，再确认 WARP 已连接并点击“保存并启用”。安装、导入或保存配置不会启动 WARP。

### 可导入配置示例

仓库提供 [`examples/warp-socks5.json`](../examples/warp-socks5.json)。**它假设你已经主动将 WARP 本地监听端口设置为 `40000`**；这个数字不是对所有客户端默认值的承诺。

先在 WARP 确认端口，再使用扩展的“导入配置”。若端口不同，请修改 JSON 中的 `port` 或导入后在界面修改。导入只保存配置，不会自动启用代理。

## 如何验证

1. 在 WARP 客户端确认连接状态及本地代理端口。
2. 在扩展中启用配置，确认浏览器显示本扩展已经接管代理。
3. 点击“开始诊断”，授权后查看三个固定端点的实际返回结果。启用状态只证明配置已生效，不代表 WARP 已连接成功。
4. 若需确认 WARP 出口，可将扩展临时设为“全部网站”，再访问 [Cloudflare trace](https://www.cloudflare.com/cdn-cgi/trace) 查看 `warp=on`；“仅 Google 服务”模式不会将这个 Cloudflare 域名送入代理，不能据此检查 WARP 出口。
5. 验证结束后恢复需要的访问范围，或点击“停用代理”释放本扩展的设置。

`warp=on` 的检查方法来自 Cloudflare 官方连接验证说明。本页尚未在当前机器得到这个结果，不能将此步骤描述为已通过的验证。

## 常见问题

- **本地端口无法连接**：确认客户端确实在运行、已选择 Local proxy、端口一致。扩展不会安装、启动或修复 WARP 后台服务。
- **WARP 显示连接中或失败**：先处理客户端连接问题，浏览器代理配置无法替代客户端建立隧道。
- **诊断失败但其他页面正常**：单个站点可能限流或重定向，结合 WARP 状态、实际网页和诊断错误分别排查。
- **只改成 1.1.1.1 DNS**：DNS-only 模式不转发设备的网页流量，不能等同于 WARP 本地代理。
- **WARP 使用全设备模式**：这时访问路径由 WARP 系统隧道决定；若只是使用该模式，通常不需要再启用本扩展的代理配置。

## 官方依据

- [WARP 与 WARP+ 的免费 / 付费区别](https://support.cloudflarewarp.com/hc/en-us/articles/360025731113-What-is-the-difference-between-1-1-1-1-WARP-and-WARP-Unlimited)
- [WARP 模式与 Local proxy](https://developers.cloudflare.com/warp-client/warp-modes/)
- [macOS 安装与系统组件](https://developers.cloudflare.com/warp-client/get-started/macos/)
- [Linux 初次连接与 trace 验证](https://developers.cloudflare.com/warp-client/get-started/linux/)

返回 [首页](../README.md) · [扩展安装与使用](install.md)
