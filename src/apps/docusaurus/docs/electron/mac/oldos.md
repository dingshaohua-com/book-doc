---
sidebar_position: 1
---

# 兼容性
electron 从28开始支持原生esm。   
electron 从27开始 放弃对macOs 10.15之前版本的兼容。    
electron v26系列的最后一个版本是 26.6.10。   
macOs 10.14.5开始，开发的软件需要公证。   
[Electron 将在 Electron23 中开始结束 Windows 7, Windows 8 和 Windows 8.1 的支持](https://www.electronjs.org/zh/blog/windows-7-to-8-1-deprecation-notice)， 为v22.3.27。   



## 解决办法
如果你需要兼容10.15之前的版本，则需要将 electron 降级到 26.6.10 版本。

如果你使用了esm，还需要[做兼容处理](https://stackoverflow.com/questions/70478747/how-to-use-es-module-but-not-commonjs-with-electron-16)：项目新建入口文件 `index.cjs`
```js title="index.cjs"
const path = require("path");

(async function () {
  globalThis.electron = await require("electron")
  
  const indexPath = path.join(__dirname,"index.js");
  await import(indexPath)
})()
```

并且修改入口文件地址
```js title="package.json"
{
    ...
    "main": "index.cjs",
}
```

## 注意事项
如上写法会造成一些代码不生效，比如你在 index.js中 如下代码
```js title="index.js"
import { app } from "electron";
app.commandLine.appendSwitch('lang', 'zh-CN'); // 设置electron默认语言为中文
```

需要改为
```js title="index.cjs"
...
(async function () {
  ...
  globalThis.electron.app.commandLine.appendSwitch('lang', 'zh-CN'); // 设置为中文
  ...
})()
```