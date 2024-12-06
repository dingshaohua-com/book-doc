
# 安全性
早期的electron允许直接让渲染进程可以访问主进程，有用完整的nodejs和Electron环境。

```html title="index.html"
<body>
    <div>测试</div>
    <script>
        const fs = require('fs');
        const { ipcRenderer } = require('electron');
        console.log(ipcRenderer, fs);
    </script>
</body>
```

为了安全性考虑，从 Electron 20 开始，渲染进程默认启用了沙盒，这导致你无法在方便的使用上述模式。可渲染进程和主进程是需要沟通，这怎么做到呢？   


## 进程安全沟通
新模式下，为了让渲染进程能与主进程通信能够顺利沟通交互，electron提出了 预渲染脚本/预执行脚本/预脚本的 概念。
```js title="main.js"
...
const createWindow = () => {
  const win = new BrowserWindow({
    ...
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  ...
}
...
```

### 预脚本与渲染进程
预脚本最终会被插入到主窗口(页面)中执行，也就是说它最终会执行在浏览器，那它拥有访问渲染进程环境的能力
```js title="preload.js"
console.log(window)
console.log(document)

// 确保在页面完全加载后注册监听器
window.addEventListener('load', () => {  
    const myDiv = document.createElement('div');
    myDiv.innerHTML = 'hello';
    document.body.appendChild(myDiv);
});
```



### 预脚本与主进程
为了让渲染进程能与主进程通信，预脚本可以使用node和Electron部分模块，通过我们自定义的伪require实现（一切为了安全）

| 可用的 API| 	详细信息| 
|---|---|
| Electron 模块| 	contextBridge, crashReporter, ipcRenderer, nativeImage, webFrame, webUtils| 
| Node模块| 	events、timers、url| 
| Node全局对象 | 	Buffer、process、clearImmediate、setImmediate| 

为了方便使用，我们把Node基础对象也填充到了预脚本的全局上下文中


```js title="preload.js"
const events = require('node:events');

console.log(events); // 访问node模块
console.log(Buffer, process);// 访问已经垫片的全局模块
```

如果你擅自越权访问其它模块 则会提示报错
```js title="preload.js"
const fs = require('fs');
console.log(fs); // Error: module not found: fs
```

### 预脚本的核心功能
预脚本里提供了一个contextBridge对象，该对象是 主进程与渲染进程的 连接桥梁。    
可以通过它向渲染进程里注入你所需要的内容，而后客户端便可以通过`window[apiKey]`访问。   

```js title="preload.js"
const { contextBridge } = require('electron')

// 需要注意的是exposeInMainWorld注入的数据会被序列化，
// 那也就说存在JSON.stringify的缺点，
// 比如你传递一个对象，这个对象原型链上的内容会被忽略。
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})
```

```html title="index.html"
<script>
    console.log(versions)
</script>
```


后期预脚本 再结合[ICP（进程间通讯）](./comm)，就可以顺利解决主进程与渲染进程的通信。




## 依然使用不安全模式
如果你还想使用旧版的方式 直接在渲染进程使用完整的node环境，直接和主进程交互，那你可以这么做
```js title="main.js"
...
const createWindow = () => {
  const win = new BrowserWindow({
        ...
        webPreferences: {
          nodeIntegration: true, //开启渲染进程使用node语法              
          contextIsolation: false, // 上下文隔离，防止渲染进程直接访问Electron内部强大API
        }
    })
    ...
}
```

:::tip
官方文档说 关闭沙盒模式`sandbox: false`即可使用不安全模式，实测不行
:::













