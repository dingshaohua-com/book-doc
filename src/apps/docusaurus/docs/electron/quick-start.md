---
sidebar_position: 2
---

# 快速入门
通过使用创建一个极简的 Hello World 应用一步步的带你了解它的内心世界，当然若你偷懒，也可以使用现有的 [Hello World Demo](https://github.com/electron/electron-quick-start) 。


## 准备工作
创建项目文件夹 并进行初始化（同其它Node项目一样）
```shell
mkdir my-electron-app && cd my-electron-app
yarn init -y
```


项目内安装 `yarn add --dev electron`，并修改 `package.json` 如下。
```js title="package.json"
{
  ...
  "main":"main.js",
  "scripts": {
    "start": "electron ."
  }
}
```

## 核心代码
一个简单的electron app 项目结构应该如下
```shell
|---main.js
|---index.html
|---package.json
```

```js title="main.js"
import { app, BrowserWindow } from 'electron'; // 此模块用于 控制应用程序的事件生命周期&创建和管理应用程序窗口

const createWindow =()=> {
  const mainWindow = new BrowserWindow({ // 创建一个（浏览器类型的）窗口
    width: 800,
    height: 600
  })
  mainWindow.loadFile('index.html') // 并为应用加载页面 index.html
  // mainWindow.webContents.openDevTools() // 打开开发者工具
}

//  当 Electron 准备完成的时候将会被触发此钩子，这个阶段你可以创建浏览器 窗口，并且执行一些其它API
app.whenReady().then(() => {
  createWindow()
  app.on('activate', ()=> {
    // 在mac上，如果点击dock 上此app的时候，此时app若没有窗口，则需要重新创建一个窗口（windows没有dock 不存在该场景）
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// windows下关闭所有窗口时退出应用（macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口）
app.on('window-all-closed', ()=> {
  if (process.platform !== 'darwin') app.quit()
})
```

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    hello word
</body>
</html>
```


## 效果展示
运行 `yarn start`，你将看到一个如下界面（我没windows电脑，只能在mac上演示 🥹）   
![](https://img.dingshaohua.com/book-fe/202409111753828.webp)