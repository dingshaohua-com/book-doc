
# 创建一个项目

## 初始化项目

太简单了

## 入口文件

起始就主进程的起始入口文件。

```js title="index.js"
import "./global-data.js";
import { createMainWindow } from "./window.js";
import { registerIcpMainHandler } from "./ipc-helper.js";
import { app, BrowserWindow, globalShortcut } from "electron";

app.whenReady().then(() => {
  registerIcpMainHandler(); // 注册ipcHandler（不可重复注册）
  const win = createMainWindow();
  global.app.mainWindow = win; // 挂载全局变量
  app.on("activate", () => {
    // 当应用被激活的时候，但是当前有没有任何窗口展示，那就只能展示主窗口了
    if (BrowserWindow.getAllWindows().length === 0) {
      const win = createMainWindow();
      global.app.mainWindow = win;
    }
  });
});

app.on("window-all-closed", () => {
  globalShortcut.unregisterAll();
  if (process.platform !== "darwin") app.quit();
});
```

就以上代码做具体分析
说明：

- 定义全局变量，应用那么复杂，总有用得到的时候，你想用 redux 等管理？请自便。
- 把创建窗口的逻辑提取出去，因为这部分比较独立（一个应用可以创建多个窗口）。
- icp 的主进程与 preload 和渲染进程沟通的关键点，这里单独提出去，并且在主进程中注册 ipcHandler（后边细讲）
- 快捷键的处理，electron 中快捷键跟窗口绑定（每个窗口可以有不同的快捷键），不过窗口关闭的时候理应注销所有热键。

## 窗口的创建

窗口相关的这块代码和功能都比较独立，因此我们提取出一个单独的模块

```js title="window.js"
import path from "path";
import { fileURLToPath } from "url";
import { BrowserWindow, screen, globalShortcut } from "electron";
import server from "./server.js";
import { createMainMenu } from "./menu.js";
import { bindGlobalShortcut } from "./shortcut.js";
import { exposeIcpMainHandlerForWeb } from "./ipc-helper.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const createMainWindow = () => {
  const mainWinOtp = {
    // 创建主应用窗口
    width: 1024,
    height: 576,
    show: true,
    devTools: true,
    webPreferences: {
      webSecurity: false, // 禁用同源策略，允许跨域
      preload: path.join(__dirname, "./preload.js"), // 注入预加载文件（主进程和渲染进程沟通的桥梁[利用ipc]）
    },
  };
  const mainWin = new BrowserWindow(mainWinOtp);
  exposeIcpMainHandlerForWeb(mainWin); // 通知preload.js 注入ipcHandler到渲染进程中（preload.js利用contextBridge实现）
  bindGlobalShortcut(mainWin); // 注册窗口对应的快捷键
  if (process.platform === "darwin") {
    createMainMenu(mainWin); // 如果是macOS，还要保留原生菜单（如果你要用到自定义titleBar的话）
  }
  server(mainWin); // 启动窗口加载页面功能（用户才能看到electron窗口中的内容）
  return mainWin;
};
```

注意，创建窗口的时候，有一些事情要做

- 注册快捷键
- 向 preload 暴漏 ipcHandler（因为是发布订阅模式的参与，所以要求每次创建窗口都需要执行，若是静态的则不要[后边讲]）
- 创建菜单
- 窗口加载页面

## 注册快捷键

注意的是因为 快捷键是跟窗口有关系的（electron 规定的），所以我们会在窗口创建的时候去编写快捷键相关的逻辑，因为比较独立，因此也可以提取出去

```js title="./shortcut.js"
import { globalShortcut } from "electron";

const initGlobalShortcut = (win) => {
  if (process.platform === "darwin") {
    let contents = win.webContents;
    globalShortcut.register("CommandOrControl+C", () => {
      contents.copy();
    });
    globalShortcut.register("CommandOrControl+V", () => {
      contents.paste();
    });
    globalShortcut.register("CommandOrControl+X", () => {
      contents.cut();
    });
  }
};
// 快捷键与窗口绑定
export const bindGlobalShortcut = (win) => {
  // const win = BrowserWindow.getFocusedWindow();
  win.on("focus", () => {
    // 注册全局快捷键
    initGlobalShortcut(win);
  });

  win.on("blur", () => {
    // 失去焦点，注销快捷键
    globalShortcut.unregisterAll();
  });
};
```

## 进程通信

因为按照 electron 的官方教程来看，我们实现一个 主进程-渲染进程两边通信的话，要写很多代码（主进程、preload.js），  
慢慢的你就会发现会有很多重复性的代码，因此做了优化！

### 定义 ipcMain 的 Handler

创建一个目录，里边定义你的 ipcMain 的 Handler。

```
|--ipcmain-handler
  |--other.js
  |--widnow.js
  |--xxx
```

```js title="ipcmain-handler/other.js"
export const openDevTool = () => {
  // 当前激活的窗口
  const win = BrowserWindow.getFocusedWindow();
  win.webContents.openDevTools({
    mode: "detach",
  });
};
```

### 注入到主进程

```js title="ipc-helper.js"
import { ipcMain } from "electron";
import * as ipcmainHandlers from "./ipcmain-handler/index.js";

// 主进程中定义（注册） ipcMain.handle方法
export const registerIcpMainHandler = () => {
  for (const key in ipcmainHandlers) {
    const ipcmainHandler = ipcmainHandlers[key];
    ipcMain.handle(key, (event, ...params) => ipcmainHandler(...params));
  }
};
```

此方法在主进程的入口文件 [index.js 中执行](#入口文件)。

### 注入到 preload

因为 preload 是 主进程沟通渲染进程的核心文件，所以我们也的得动这里

```js title="preload.js"
const { contextBridge, ipcRenderer } = require("electron");

ipcRenderer.on("ipcmainHandlerKeys", (_event, ipcmainHandlers) => {
  const electronAPIContent = {};
  ipcmainHandlers.forEach((ipcmainHandlerKey) => {
    electronAPIContent[ipcmainHandlerKey] = function () {
      return ipcRenderer.invoke(ipcmainHandlerKey, ...arguments);
    };
  });
  electronAPIContent.process = process;
  electronAPIContent.onEnterFullScreen = (callback) =>
    ipcRenderer.on("enter-full-screen", (_event, value) => callback(value));
  contextBridge.exposeInMainWorld("$electron", electronAPIContent);
});
```

通过上代码我们可以看出，需要 触发 ipcmainHandlerKeys 事件，才能初始化 contextBridge.exposeInMainWorld，所以我们在[窗口创建的时候，发射事件即是最佳时机](#窗口的创建)。

```js title="ipc-helper.js"
// 向preload中定义暴漏（主要是主进程的ipcMain.handle方法）到web
export const exposeIcpMainHandlerForWeb = (win) => {
  win.webContents.on("did-navigate", (event, url) => {
    // 每次加载页面都注入 防止刷新或者跳转丢失
    if (url === win.webContents.getURL()) {
      win.webContents.send("ipcmainHandlerKeys", Object.keys(ipcmainHandlers));
    }
  });
};
```

## 菜单

自带的菜单不好看，但是兼容性好

```js title="./menu.js"
import { Menu } from "electron";
import { app } from "electron";

// 创建菜单模板并设置菜单
const getMenuTemplate = () => [
  {
    label: app.getName(),
    submenu: [
      {
        role: "about",
        label: "About " + process.name,
      },
      {
        label: "上报日志",
        click: () => {},
      },
      { role: "quit", label: "Quit " + process.name },
    ],
  },
];

export const createMenu = (win) => {
  const menuTemplate = getMenuTemplate();
  if (true) {
    // 上线后需要设置false
    menuTemplate[0].submenu = [
      ...menuTemplate[0].submenu,
      {
        label: "Open 开发者工具",
        click: () => {
          win.webContents.openDevTools({
            mode: "detach",
          });
        },
      },
    ];
  }
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};
```

## 页面加载

页面其实是在窗口中加载的，所以和窗口息息相关。  
因为这块比较独立，所以我也建议将其提出去，[同样也是在窗口创建后引入它](#窗口的创建)。。

```js title="server.js"
import { app } from "electron";
import config from "../config/config.js";

export const mainWindowServer (win, hash = "") => {
  const isPro = app.isPackaged; //生产环境
  let entryPath = (isPro?config.url:"http://localhost:8080")+(hash ? "#" + hash : hash);
  win.loadURL(entryPath);
};
```

## 全局变量

全局变量最好是以一个对象的形式挂载到 global 中管理，[在程序入口文件处进行初始化](#入口文件)

```js title="global-data.js"
// import objectWatcher from "object-watcher";

// 在主进程中定义全局变量（主进程和渲染进程共享）
global.app = {
  demoMode: false,
  mainWindow: null,
};
// // 监听sharedObject对象的所有变化（看自己是否需要）
// objectWatcher.watch(global.sharedObject, (field, oldValue, newValue) => {
//   console.log(`属性 ${field} 已经从 ${oldValue} 变化到 ${newValue}`);
// });
```
