---
sidebar_position: 1
---

# 预加载文件

预加载文件（preload script）是 Electron 中用于在渲染进程加载页面之前，在浏览器中既执行一些脚本的文件，如果脚本中存在打印信息，那你可以在浏览器的控制台就可以看到。

严格来说，预加载文件属于渲染进程的一部分。

它跟 IPC 没有必然的关系，他不是为了 IPC 而存在的，毕竟 preload script 存在早于 IPC！

## 初识

### 定义

定义预加载文件实在主进程在创建 App 窗口的时候，指定 preload 属性即可。

```js
new BrowserWindow({
  // ...
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    // ...
  },
});
```

### 什么样

```js
// preload.js
console.log(123);
```

![](https://img.dingshaohua.com/book-fe/202412271725771.gif)

看到这段代码执行的左侧目标是 vm 而不是文件，这是因为：Chrome DevTools 在为暑输出溯源的时候，针对动态生成的或注入的（如 eval ），会显示为 vm。那也就是说，这个预加载文件并没有以文件的形式被写入到渲染进程（既网页）中。

## 与主进程隔离

默认情况下，预加载文件是与主进程隔离的。  
这是 electron 的预加载代码本身是要放在浏览器执行的，如果预加载文件还能连通，那多危险：想想一下，向你网页中注入恶意脚本 用来控制用户设备。

我们来验证一下隔离，如图能 浏览器控制台会报找不到 fs 模块的错误（因为 fs 模块属于主进程的依赖）！

```js
const fs = require("fs");

console.log(fs);
```

![](https://img.dingshaohua.com/book-fe/202412271831056.png)


### 垫片
其实严格来说，预加载脚本连 require也不支持，因为那也是主进程node的能力。  
但是为什么没报错呢：这是因为 electron 为了让你写起来舒服，帮你在实现了 require的polyfill（垫片）。也就是说这个require是假的，并非node那个require，而是electron帮你实现的。

既然是假的，那就有一定的局限性，不可能做到和原生的一模一样（要是一样 那还怎么隔离 主进程）,只允许你访问一下API：
| 可用的 API| 	详细信息| 
|---|---|
| Electron 模块| 	contextBridge, crashReporter, ipcRenderer, nativeImage, webFrame, webUtils| 
| Node模块| 	events、timers、url| 
| Node全局对象 | 	Buffer、process、clearImmediate、setImmediate| 

```js title="preload.js"
const events = require('node:events');

console.log(events); // 访问node模块
console.log(Buffer, process);// 访问已经垫片的全局模块
```

