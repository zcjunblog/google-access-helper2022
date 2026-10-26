# 实现与测试

## 目录

```text
extension/
  manifest.json      MV3 清单、最小必需权限与可选诊断权限
  core.mjs           配置校验、PAC 生成、配置导入导出
  controller.mjs     串行操作、浏览器控制权与实际状态
  diagnostics.mjs    有时限的固定端点探测
  background.mjs     Chrome API 适配与消息路由
  popup.html/css/mjs 界面、授权与用户操作
tests/               单元、网络、打包和真实浏览器测试
scripts/package.py   零依赖发布打包与 SHA-256 校验和
```

扩展使用原生 ES modules，无构建步骤，无运行时第三方依赖。测试依赖 Playwright；它不会被打进扩展安装包。

## 关键行为

保存和导入仅写本地配置；启用前校验输入和 Chrome 的 `levelOfControl`。保存、应用、停用操作通过队列按顺序执行，防止同时点击造成旧操作覆盖新操作。状态来自 `chrome.proxy.settings.get()`，没有靠本地 `enabled` 标志伪造成功。

Google 模式生成内联 PAC，通过完整域名或带点的子域后缀匹配，避免将 `evilgoogle.com` 之类的域名纳入规则。主机和端口严格校验，不接受任意 PAC 或远程脚本。

停用使用 `chrome.proxy.settings.clear()` 释放本扩展的 regular 设置，包括被其他扩展或策略覆盖的暂存设置。它仅清除本扩展的配置，不会覆盖当前其他控制者；由浏览器决定后续适用设置。

诊断必须先检查可选权限，三个请求并行执行，每项最长 8 秒，省略凭据并拒绝重定向。接口不接受用户传入任意探测 URL。

## 运行检查

Node.js 22+、Python 3.9+：

```bash
npm ci
npm test
npx playwright install chromium
npm run test:browser
npm run package
```

Linux CI 首次安装浏览器依赖时使用 `npx playwright install --with-deps chromium`。

## 验证范围

- 纯逻辑测试：合法和非法配置、IPv6、PAC 主机边界与协议、版本化导入导出。
- 控制器测试：保存不启用、其他扩展与管理策略、设置失败、保存与生效配置不同、操作顺序；另有双扩展浏览器回归测试，确认释放暂存设置不会影响当前其他控制者，也不会在对方停用后恢复旧代理。
- 网络测试：本地 HTTP 服务真实返回 204、503、重定向、超时和连接失败；验证拒绝授权不发请求。
- 浏览器测试：先生成发布 ZIP 并解压，再在独立的 Chromium persistent context 内加载包中的 MV3 扩展，操作真实界面和 `chrome.proxy`，用本地 HTTP 代理验证网页请求确实被转发，检查停用、持久化、导入导出及可选权限检查。Chrome 实际接受 HTTP、HTTPS、SOCKS5 和 IPv6 配置；其中端到端转发验证使用 HTTP 测试代理，未把配置接受等同于所有协议的真实服务测试。
- 打包测试：ZIP 包含运行文件、校验和正确、重复构建输出一致，缺失资源时拒绝生成包。

浏览器测试不复用个人浏览器、不修改系统代理、不需要外部代理账号。固定 Google 站点的实际连通性依赖使用环境，不作为离线自动测试的成功前提。

截图 `docs/images/extension.png` 来自运行中的真实扩展，不是静态设计图。测试默认将截图写入忽略的 `test-results/`；需要更新文档截图时运行 `GAH_UPDATE_SCREENSHOT=1 npm run test:browser`。

## 发布

`npm run package` 根据 manifest 版本生成 `dist/google-access-helper-<version>.zip` 和 `dist/SHA256SUMS`。ZIP 中包含单一 `google-access-helper/` 文件夹，只分发 `extension/` 的运行文件，不包含开发依赖和测试代码。

参考 [Chrome proxy API](https://developer.chrome.com/docs/extensions/reference/api/proxy)、[设置控制权与生命周期](https://developer.chrome.com/docs/extensions/reference/api/types)、[MV3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3) 和 [Playwright 扩展测试](https://playwright.dev/docs/chrome-extensions)。

返回 [首页](../README.md)
