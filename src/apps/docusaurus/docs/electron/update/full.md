# 全量更新
Electron 处理 app 更新官方推荐的是使用 `electron-updater` 这个插件，该插件目前已经被 electron 官方收编，其文档被收纳到了 [electron 官方文档中](https://www.electron.build/auto-update)，这个插件本质上是全量更新！

## 基本使用

### 安装插件
```shell
npm i --D electron-updater
```

### 添加升级代码

可以在一个合适的地方，调用更新检查方法，比如在应用启动时调用。

```js title="index.js"
import { autoUpdater } from "electron-updater";

app.whenReady().then(() => {
  autoUpdater.checkForUpdates();
  autoUpdater.on("update-available", (info) => {
    autoUpdater.downloadUpdate(); // 当有可用更新的时候触发，下载更新。
  });
  autoUpdater.on("update-downloaded", (res) => {
    autoUpdater.quitAndInstall(); // 下载后重启应用并安装更新
  });
  // ...
});
```

但是这还远远不够，你还要告诉 electron-updater 去哪儿更新，以及远程端该准备些什么！

### 增加升级配置

那 mac 为例，修改打包配置

```js title="electron-builder.json"
{
  ...
  "mac": {
    ...
    "publish": {
      "provider": "generic",
      "url": "https://file.dingshaohua.com/some-dir"
    }
  }
}
```

Provider 表示以何种方式进行应用的升级

- github: 使用 GitHub Releases 作为更新源。
- gitlab: 使用 GitLab Releases 作为更新源。
- s3: 使用 Amazon S3 或兼容 S3 的存储作为更新源。
- spaces: 使用 DigitalOcean Spaces 作为更新源。
- generic: 使用一个通用的 HTTP 服务器作为更新源。你需手动上传更新文件此服务器，并确保访问 URL 正确。

### 执行构建操作

此时执行构建操作，会发现构建包里多出两个文件 `dist/latest-mac.yml` 和 `xx.app/Contents/Resources/app-update.yml`。

第一个文件记录了 app 最新的版本（也就是当前你打包的这个）信息，这个需要上传到你如上配置的服务器地址上 （如 我这里是 https://file.dingshaohua.com/some-dir）。


```yml title="latest-mac.yml"
version: 0.0.2
files:
  - url: 测试-0.0.2-mac.zip
    sha512: OkQAAn9yQlHRbQu0hOuYeoo5Hb8yatsZAUaVERQZUTrs0znCNaE2oWGfQbbBPGSGTkApbs+ghRHzpBgC2qW0dw==
    size: 123792442
  - url: 测试-0.0.2.dmg
    sha512: I31O1I2cZsI92PJ1y5vroopjfo4MP3kvzyYqPANNIzv+XF1xpqYRFAwnge+ydSY0YeKXok5JIUeo2thKX9EgJw==
    size: 128102867
path: 测试-0.0.2-mac.zip
sha512: OkQAAn9yQlHRbQu0hOuYeoo5Hb8yatsZAUaVERQZUTrs0znCNaE2oWGfQbbBPGSGTkApbs+ghRHzpBgC2qW0dw==
releaseDate: "2024-10-01T11:03:17.142Z"
releaseNotes: "新增动态转发功能\r\n修复Bug，优化UI"
```

第二个文件代表升级配置信息，这个文件在 app 内部，将在应用启动时调用检查更新方法的时候被调用。

```yml title="app-update.yml"
provider: generic
url: https://file.dingshaohua.com/some-dir
updaterCacheDirName: some-dir-updater

```

updaterCacheDirName: some-dir-updater 指的是 从远端下载的更新目录位置。

### 上传构建包到服务器

如上，除将 `latest-mac.yml` 上传到你配置服务器上，还需要将 `dist/测试-0.0.1-mac.zip` 上传到你配置的服务器地址上。

注意的是更新安装包，一定要打两个target 传到服务器上，一个是dmg 一个是zip，[这两个都需要上传](https://github.com/electron-userland/electron-builder/issues/6951#issuecomment-2227992474)。
```js title="electron-builder.json"
// 这样就可以打两个包了
"mac": {
    "icon": "src/files/logo/logo.icns",
    "target": [
      {
        "target": "dmg",
        "arch": ["universal"]
      },
      {
        "target": "zip",
        "arch": ["universal"]
      }
    ],
  },
```

### 验证

需要在打包后验证，dev 模式无法验证。  
比如说先打一个 0.0.2 的包放到服务器上，然后再打一个 0.0.1 的包，然后再上传到服务器上安装测试升级即可。

❌ 以上的代码，的确能更完成更新，但是用户体验不好：用户在无感知的情况下 会下载和重启并安装最新版本。

## 优化版本

通过 ipc 和渲染进程结合，

1. 由 web 发起检查，即 web 调用 checkForUpdates。
2. 当存在更新版本的时候，通知 web（用户），
3. web（用户）再确定是否下载，当用户确定下载的时候，通知用户下载进度
4. 下载完成后，通知用户，让用户决定现在是否重启更新！

以下是 autoUpdater 相关伪代码，相信大家都能看懂，利用这些代码，可以将更新做的很完美

```js title="main/ipc/auto-update.js"

import { autoUpdater } from "electron-updater";
import webSendEnum from "../web-send-enum";

// 检查更新（可以暴露给渲染进程，由渲染进程在合适的时机调用，比如用户点击 检查更新、或者web启动的时候）
export const checkUpdate = () => {
  autoUpdater.checkForUpdates();
};

// 下载更新（可以暴露给渲染进程，由渲染进程在合适的时机调用）
export const downloadUpdate = () => {
  autoUpdater.downloadUpdate();
};

// 重启并安装更新（可以暴露给渲染进程，由渲染进程在合适的时机调用）
export const quitAndInstall = () => {
  autoUpdater.quitAndInstall();
};

// 封装更新相关的进程通信方法
const handler = ({ type, data }) => {
  const win = global.app.mainWindow;
  win.webContents.send('update', { type, data });
};

// 监听升级失败事件
autoUpdater.on("error", (error) => {
  handler({
    type: "update-error",
    data: error,
  });
});
//监听发现可用更新事件
autoUpdater.on("update-available", (message) => {
  handler({
    type: "update-available",
    data: message,
  });
});
//监听没有可用更新事件
autoUpdater.on("update-not-available", (message) => {
  handler({
    type: "update-not-available",
    data: message,
  });
});

// 更新下载进度事件
autoUpdater.on("download-progress", (progressObj) => {
  handler({
    type: "download-progress",
    data: progressObj,
  });
});
//监听下载完成事件
autoUpdater.on("update-downloaded", (releaseObj) => {
  handler({
    type: "update-downloaded",
    data: releaseObj,
  });
});
```

```js title="main/preload.js"
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("$electron", {
   onUpdate:(callback) => ipcRenderer.on("update", (_event, value) => callback(value)),
});
```

最后在客户端，我们可以这么做
```js title="renderer/app.vue"

// 中划线转大小驼峰命名工具函数
export const kebabCase_to_camelCase = (fileName, upperCamel = false) => {
  // 转换为小写，并用正则表达式替换每个分隔符后的字符为大写（除非它是字符串的第一个字符）
  let newfileName = fileName
    .toLowerCase() // 先转换为小写
    .replace(/[-_\s]+(.)?/g, (match, p1) => (p1 ? p1.toUpperCase() : ""))
    .replace(/^./, (str) => str.toLowerCase()); // 转换为小驼峰
  if (upperCamel) {
    newfileName = newfileName.charAt(0).toUpperCase() + newfileName.slice(1);
  }
  return newfileName;
};

const checkUpdateEvent = {
  onUpdateError(params) {
    console.log("升级失败", params);
  },
  onUpdateNotAvailable(params) {
    console.log("无更新", params);
  },
  onUpdateAvailable(params) {
    console.log("有更新可用", params);
    window.$electron.downloadUpdate();
  },
  onDownloadProgress(params) {
    console.log("下载中", params);
  },
  onUpdateDownloaded(params) {
    console.log("下载完成", params);
    console.log("重启生效", params);
    window.$electron.quitAndInstall();
  },
};

onMounted(() => {
  if (window.$electron) {
    window.$electron.checkUpdate();
    window.$electron.onUpdate((info) => {
      const eventName = "on" + kebabCase_to_camelCase(info.type, true);
      checkUpdateEvent[eventName](info.data);
    });
  }
});
```

## 其它
### 更多配置项
以上示例已经能完美的制作更新了，若你还不满足，[考虑结合以下 api](https://www.electronjs.org/docs/latest/api/auto-updater#methods)

```js
autoUpdater.updateConfigPath = path.join(app.getAppPath(), "app-update.yml"); // 更新配置文件地址
autoUpdater.autoDownload = false; // 自动下载配置，若为true, 则当发现一个可用更新的时候，会自动开始下载升级包
autoUpdater.forceDevUpdateConfig = true; // 开发环境下强制更新
autoUpdater.setFeedURL("http://cos.dingshaohua.com"); // 设置升级包所在的地址
autoUpdater.autoInstallOnAppQuit = true; // 应用退出后自动安装
```

## 旧版本注意
旧版里一定要包含 app-update.yml，否则相当于没有自动更新的能力！

如果用户收的旧版本 app，你还没有集成autoUpdater，那么你需要说服他来一次完整的全量更新，而非热更新！


## mas格式不支持
![](https://img.dingshaohua.com/book-fe/202412311359031.png)

由于 apple store里的 app必须开启沙盒权限，这就导致mas格式的（也就是上架到 苹果应用商店）的 app 无法使用 electron-updater 进行更新，只能通过新版全量覆盖的方式进行更新。
![](https://img.dingshaohua.com/book-fe/202412311357872.png)

这里有有两个相关 issue： [issue1](https://github.com/ElectronNET/Electron.NET/issues/840), [issue2](https://github.com/electron-userland/electron-builder/issues/4039)



## 一定要签名
正如[这个人所提](https://github.com/electron-userland/electron-builder/issues/8178#issuecomment-2089916226)，我们必须对 新旧版本包 的app 进行签名（公证非必须），才能自动重启安装 `autoUpdater.quitAndInstall()`。否则执行这个方法会没有反应，后期再次验证，无论是mac和win最好都要签名。


## 关闭并安装失败
如果你在 macOS 上遇到了 `quitAndInstall` 没有反应的问题，[可以尝试以下代码](https://github.com/electron-userland/electron-builder/issues/1604)：
```js
const quitAndInstall = () => {
  const electron = require('electron');
  const app = electron.app;
  const BrowserWindow = electron.BrowserWindow;
  app.removeAllListeners('window-all-closed');
  var browserWindows = BrowserWindow.getAllWindows();
  browserWindows.forEach(function (browserWindow) {
    browserWindow.removeAllListeners('close');
  });
  autoUpdater.quitAndInstall();
};
```