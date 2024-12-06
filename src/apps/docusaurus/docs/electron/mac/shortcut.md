---
sidebar_position: 1
---

# 快捷键

快捷键是指的是 多个功能键组合 来唤起程序的某项功能能力，例如 `Control+C`或`Control+Shift+Z`。

在开发 electron 应用的过程中 通过在主进程中使用内置的`globalShortcut`模块，此模块可以在操作系统中注册/注销全局快捷键, 以便可以为操作定制各种快捷键。

## 注册快捷键

在 app 模块的 ready 事件就绪之前，globalShortcut 不能使用。  
所以我们一般注册快捷键是在 app.whenReady 时去做。

```js
import { app, globalShortcut } from "electron";

app.whenReady().then(() => {
  // register 方法，注册单个快捷键。（比如：注册一个 'CommandOrControl+Y' 快捷键）
  globalShortcut.register("CommandOrControl+X", () => {
    console.log("你在剪切");
  });

  // registerAll 方法，注册一组快捷键。
  const accelerators = ["CommandOrControl+C", "CommandOrControl+V"];
  globalShortcut.registerAll(accelerators, () => {
    console.log("你貌似在复制或者粘贴");
  });
});
```

## 注销快捷键

一般离开应用的时候，我们将取消快捷键的注册。  
所以我们将在`will-quit`钩子中进行快捷键的注销操作。

```js
app.on("will-quit", () => {
  // 注销单个快捷键
  globalShortcut.unregister("CommandOrControl+X");

  // 注销所有快捷键
  globalShortcut.unregisterAll();
});
```

## 注册状态

用于检测当前应用是否注册过这个快捷键。

```js
const res = globalShortcut.isRegistered("CommandOrControl+Z");
console.log("CommandOrControl+Z" + (res ? "已经" : "尚未") + "注册");
```

## 其它

### 跨平台注意

因为要同时兼顾 macOS 和 windows，所以 CommandOrControl 来表示控制键。  
在 macOS 上控制键为 Command，其它系统均为 Control 键。  
同样的 Option 键也只有在 macOS 上才起作用，其它都是 Alt 键。

### mac 默认快捷键的问题

复制、粘贴和剪切 这些快捷键， 在 mac 上的 electron 应用中并不生效，需要我们自己注册。

```js
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

app.whenReady().then(() => {
  // ...
  const win = createMainWindow();
  initGlobalShortcut(win);
});
```

### 与系统全局快捷键冲突

除了在 app 的"will-quit"阶段注销快捷键外，我们还可以在应用失去焦点（blur）的时候主动应用的注销快捷键，以避免和系统快捷键冲突。

```js
win.on("blur", () => {
  // 失去焦点，注销快捷键
  globalShortcut.unregisterAll();
});
```

但是这样当我们再次切换软件的时候，electron 应用的快捷键又可能丢了，所以综上，得出一个完美结论

```js
app.whenReady().then(() => {
  const win = createMainWindow();
  win.on("focus", () => {
    // 获得焦点，注册快捷键
    initGlobalShortcut(win);
  });
  win.on("blur", () => {
    // 失去焦点，注销快捷键
    globalShortcut.unregisterAll();
  });
});
app.on("window-all-closed", () => {
  globalShortcut.unregisterAll(); //窗口销毁的时候也需要移除监听，否则会报错 Error: Object has been destroyed
  if (process.platform !== "darwin") app.quit();
});
```
