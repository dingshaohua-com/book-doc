---
sidebar_position: 4
---

# 上下文隔离

本文参考： https://www.bookstack.cn

## 是什么？


上下文隔离是指Electron为渲染进程的网页（通常是一个网站）与预加载脚本（preload script）各自运行在各自独立的上下文环境里， 彼此不能直接访问对方的变量、函数等。  
这有助于提高安全性，防止预加载脚本被网页中的恶意代码影响。

这意味着，实际上，您的预加载脚本访问的 window 对象并不是网站所能访问的对象。  
例如，如果您在预加载脚本中定义 window.hello = 'wave' 并且启用了上下文隔离，当网站尝试访问 window.hello 对象时将返回 undefined。

:::tip 提示
自 Electron 12 以来，默认情况下已启用上下文隔离，并且它是 所有应用程序推荐的安全设置。
:::

## 如何关闭

正如官方说听提，是及其不愿推荐关闭，   
但你要为了方便 非这么做，也不是不可：

```js
new BrowserWindow({
  height: 800,
  width: 1280,
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    contextIsolation: false, //关闭上下文隔离
  },
});
```

## 迁移
### 未隔离
如果你之前旧项目 未进行上下文隔离时， 这么写：
```js
// preload.js
window.myAPI = {
  doAThing: () => {}
}
```
```js
// renderer.js
window.myAPI.doAThing()
```
### 隔离
现在升级到新版Electron，出于安全考虑，你开始按照官方的做法进行隔离，但是在渲染进程中，总归是要和预加载脚本进行通信的。

好在官方提供了 新的方式 [contextBridge](https://www.bookstack.cn/read/electron-27.0-zh/e36a08efb1f9e904.md) ，利用它我们可以手动暴漏内容给渲染进程（网站）。
```js
// preload.js
const { contextBridge } = require('electron')
contextBridge.exposeInMainWorld('myAPI', {
  doAThing: () => {}
})
```
```js
// renderer.js
window.myAPI.doAThing()
```


<!-- 这对安全性很重要，因为它有助于阻止网站访问 Electron 的内部组件 和 您的预加载脚本可访问的高等级权限的API  -->
