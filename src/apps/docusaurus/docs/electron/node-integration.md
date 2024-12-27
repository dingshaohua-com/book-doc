---
sidebar_position: 5
---

# 集成node环境

默认情况下，
只有主进程具备node环境，   
预加载只是拥有几个相似node api（如require）的polyfill（垫片），    
而渲染进程(也就是你的web) 完全就是普通的浏览器环境！


但是开启了 nodeIntegration 之后，预加载和渲染进程就可以获取到  NodeJS 的能力，这样渲染进程可以直接使用系统相关的方法。

## 如何开启

```js
new BrowserWindow({
  height: 800,
  width: 1280,
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    nodeIntegration: true, // 集成node环境到预加载和渲染进程
  },
});
```
<!-- 注意：当你开启node集成了之后，主进程项目  "type": "module" 应该被移除 ，否则在浏览器控制台有异常提示！ -->


## 效果
```html
<!-- app.vue -->
<script setup>
const fs = require('fs'); //注意这里无法使用esm： https://github.com/electron/electron/issues/42439#issuecomment-2160822103

const test = async () => {
  console.log(fs); // 将会输出fs模块内容
};
</script>

<template>
  <button @click="test()">测试</button>
</template>
```

## 建议
官方说：绝对不要启用 Node.js 集成，要限制您授予远程内容的权限, 从而使攻击者在您的网站上执行 JavaScript 时更难伤害您的用户。


## 悖论
require和contextBridge与contextIsolation相悖。
由于require可以直接请求运行客户机上的文件，容易引起安全问题，而在新的electron中被禁止，所以在contextIsolation为true时认为require不可以启用。既如果想要使用require，则不应该使用contextBridge API， 否则会报错：
```js
Uncaught Error: contextBridge API can only be used when contextIsolation is enabled
```


结论：如果想要使用require，则不应该使用contextBridge API！