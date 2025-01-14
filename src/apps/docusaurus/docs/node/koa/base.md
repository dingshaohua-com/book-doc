---
sidebar_position: 2
---

# 常用的


## 热更新
默认情况下，node程序在你改完代码后需重启才会生效，，这就给我开发造成很大的不便。   

[nodemon](https://github.com/remy/nodemon) 是一个三方模块，支持服务的热更新，监视 node.js 应用程序中的任何更改并自动重启服务器, 非常适合开发。   
如 `nodemon app.js`。


## 中间件
以下代码中，app 是一个 Koa 实例对象，它用 use 方法注册了一个函数，这个函数就是中间件。
```js
app.use(async (ctx, next) => {
  await next();
  ctx.response.type = "text/html";
  ctx.response.body = "<h1>Hello World</h1>";
});
```
Koa 应用程序 本质上是一个包含一组中间件函数的koa实例对象，所以中间件是 koa 的核心！   
[点击这里查看更多](/node/koa/middleware)关于中间件的介绍！





## 路由
针对不同的路径或者请求方式，后端要做出对应的处理和响应，这就是路由：负责分发请求和处理响应！   
koa官方并没有像express提供原生的路由系统能力，都是三方在做，这里以[@koa/router](https://github.com/koajs/router)为例子：
```js
import Koa from "koa";
import Router from "@koa/router";

const app = new Koa();
const router = new Router();
router.get("/", ctx => {
  ctx.body = 'Hello World!';
});
router.get('/home', ctx => {
  ctx.body = '<h1>欢迎光临home页面</h1>';
});

app.use(router.routes());
app.listen(3001);
```

[更多路由知识](/node/koa/router)请查看这里！


