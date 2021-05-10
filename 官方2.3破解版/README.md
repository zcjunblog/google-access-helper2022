<p align="center"><img width="15%" src="icons/icon-128.png" /></p>
<h1 align="center">谷歌访问助手</h1>

最简单易用的谷歌访问助手，为chrome扩展用户量身打造。可以解决chrome扩展无法自动更新的问题，同时可以访问谷歌google搜索，gmail邮箱，google+等谷歌服务。

<table align="center">
  <tr>
    <td align="center"><img src="img/google.png" /></td>
    <td align="center"><img src="img/chrome.png" /></td>
    <td align="center"><img src="img/gmail.png" /></td>
    <td align="center"><img src="img/googleplus.png" /></td>
  </tr>
  <tr>
    <td align="center">Google搜索</td>
    <td align="center">Chrome商店</td>
    <td align="center">Gmail邮箱</td>
    <td align="center">Google+</td>
  </tr>
</table>

**本软件已破解，可永久免费使用！**

## 安装说明

由于新版本Chrome已禁止安装第三方应用，且本破解版无法上传至[Chrome网上应用店](https://chrome.google.com/webstore)，因此只能通过以下方法在开发者模式下运行：

1. 克隆本仓库到本地或下载[master.zip](https://github.com/haotian-wang/google-access-helper/archive/master.zip)后解压
2. 打开Chrome扩展程序管理器 `chrome://extensions`
3. 勾选`开发者模式`
4. 点击`加载已解压的扩展程序`，选择本扩展所在目录

## 破解说明

- 该插件的核心代码为[bg.js](bg.js)，该文件已做代码混淆和压缩，本破解版已对该文件进行格式化。


  ```javascript
  a.links.push("http://360.hao245.com");
  a.links.push("http://123.hao245.com");
  ```

- 该插件通过代理服务器访问Google，代理服务器的地址和密码以及PAC脚本均由插件动态获取。
- 研究发现，即使将`PAC脚本`替换掉，依然只能访问`Google`和`GMail`，其余网站无法打开，表明服务器端已进行了限制。

## issues 已知问题

> 之前有朋友跟我说安装后无法访问，我一度怀疑是那位朋友的网络问题。

现在重新发布一次，完整的流程走一遍。

____

### 1. 拉取代码，形成新的文件夹------`google-plug`，然后再将当前文件拉至谷歌浏览器的扩展程序：
<p align="center"><img src="./img/扩展程序安装后 0.png" /></p>

### 2. 当你成功安装后，会弹出这个窗口：
<p align="center"><img src="./img/扩展程序安装后 1.png" /></p>

### 3. 在网络请求良好的情况下，访问谷歌邮件；
<p align="center"><img src="./img/扩展程序安装后 2.png" /></p>

### 4. 登录自己的谷歌邮箱；
<p align="center"><img src="./img/扩展程序安装后 3.png" /></p>

### 5. 访问谷歌网上应用商城，添加所需的扩展程序工具；
<p align="center"><img src="./img/扩展程序安装后 4.png" /></p>

## 6. 当我们网络不佳时，github.com都无法访问；
<p align="center"><img src="./img/扩展程序安装后 5.png" /></p>