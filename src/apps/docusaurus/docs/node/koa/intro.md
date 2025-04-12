---
sidebar_position: 1
---
# 简介

[koa](https://koajs.bootcss.com)是express的next version，更加的现代和纯净。

对比 express 
* 它 使用更为先进的 async/await，使得原本遍地回调的代码看起来更加清晰。
* 它 纯净，没有内置捆绑任何中间件，尽管使用的时候需要安装。



只需要创建一个空项目，并安装 `npm install koa`，然后创建一个启动入口，最后执行启动 `node ./app.js`即可
```js title="app.js"
import Koa from 'koa';

const app = new Koa();

// response
app.use(ctx => {
  ctx.body = 'Hello Koa!!';
});

app.listen(3001, () => {  
  console.log('服务已经启动：http://localhost:3001');
});
```

官方目前没有一个快速搭建 koa 项目的方式，像 Vue-cli 一样。   
可能是搭建一个 koa 项目成本也很低。   
倒是一个工具 —— koa-generator，可是好几年没更新了，建议不要用！
