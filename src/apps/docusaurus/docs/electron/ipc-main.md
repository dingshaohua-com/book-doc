---
sidebar_position: 3
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";


# 进程通信
electron 中将web和node分别做为两个独立的进程--渲染进程和主进程！正如一开始[所提](/electron/intro#electron是什么)，`electron app` 里的 web需要助于node环境实现强大的功能。这就涉及到了如何实现这两个进程间的沟通？！

## ipc初识
icp（进程通信单词的缩写）是electron提供的一个概念，以便于 渲染进程和主进程之间的顺利通信。

electron提供了很多icp相关的对象和方法，比如ipcMain、ipcRenderer、ipcMainHandle、ipcRendererInvoke等等，供我们在不同的需求场景下使用。



**预加载脚本-preload.js**  
出于安全考虑渲染进程无法直接访问node和Electron环境，所以electron提供了一个预加载脚本的概念，以便于渲染进程和主进程之间的顺利通信，预加载脚本最终会被注入到 渲染进程中。因此我们可以将预加载脚本称为 两进程沟通的 **桥梁（别致的JSBridge）**。


## 渲染器进程到主进程(单项)

```js title="preload.js"
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendMsg: (msg) => ipcRenderer.send('test-call', msg)
})
```

```html title="index.html"
<button>给主进程发消息</button>
<script>
   const btn = document.querySelector('button');
   btn.onclick = async () => {
        electronAPI.sendMsg('你好，能听到我说话吗？');
    }
</script>
```

```js title="main.js"
ipcMain.on('test-call', function (event, arg) {
    console.log("主进程收到消息:", arg);
});
```


##  渲染进程到主进程(双向)
渲染器进程代码调用主进程模块并等待结果，这个就叫做双相ICP，通常使用此模式从 Web 内容调用主进程 API 并需要一个结果。
```js title="preload.js"
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (path) => ipcRenderer.invoke('readFileEvent', path),
})
```
```html title="index.html"
<button>给主进程发消息</button>
<script type="module">
    const res = await electronAPI.readFile('a.txt');
    console.log(res);
</script>
```
```js title="main.js"
app.whenReady().then(() => {
    ...
    ipcMain.handle("readFileEvent", (event, param) => { 
        console.log(param);
        const res = fs.readFileSync(param)
        return res.toString();
    })
})
```



## 主进程到渲染进程

通过`win.webContents.send`这样就可以了发了.

```js title="main.js"
// win是BrowserWindow的一个实例，注意send参数必须是可序列化的数据 
win.webContents.send('testMsg', '你好啊，我是主进程');
```

```html title="index.html"
<div class="msg"></div>
<script>
    window.electronAPI.onTestMsg((value) => {
        const msgEl = document.querySelector('.msg');
        msgEl.innerHTML = value;
    })
</script>
```
```js title="preload.js"
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    onTestMsg: (callback) => ipcRenderer.on('testMsg', (_event, value) => callback(value)),
})
```