---
sidebar_position: 4
---

# 路由

koa 官方并没有像 express 提供路由原生支持能力，都是三方在做！  
最出名莫属于 [koa-router](https://github.com/ZijianHe/koa-router)，但是目前基本上处于[维护瘫痪状态，各种特性、PR、Issue 都基本上没人处理了](https://www.zhihu.com/question/310604967)。还好 koa 社区 fork 并继续维护 改名为 [@koa/router](https://github.com/koajs/router)。

## 不用路由

路由本质就是中间件，如果不用路由 我们照样可以手写中间件来处理和响应 用户的请求：

```js
const Koa = require("koa");
const app = new Koa();

const route = (ctx, next) => {
  console.log(ctx.path);
  switch (ctx.path) {
    case "/":
      ctx.body = "<h1>欢迎光临index page 页面</h1>";
      break;
    case "/home":
      ctx.body = "<h1>欢迎光临home页面</h1>";
      break;
    default:
      // 404页面
      return;
  }
};

app.use(route);
app.listen(3001);
```

但是 这种方式不是很好，当我们项目变得很大的时候，我们需要编写很多 switch-case 这样的语句，代码变得更加耦合，这也是我们为什么推荐使用专业的路由插件的原因了！

```js
import Koa from "koa";
import Router from "@koa/router";

const app = new Koa();
const router = new Router();
router.get("/", (ctx) => {
  ctx.body = "Hello World!";
});
router.get("/home", (ctx) => {
  ctx.body = "<h1>欢迎光临home页面</h1>";
});

app.use(router.routes()); // 加载路由中间件
app.listen(3001);
```

## 路由前缀

嵌套的子路由自动地被继承其了父路由作为它的前缀

```js
const router = new Router({
  prefix: '/users'
});
router.get('/', ...); // responds to "/users"
router.get('/:id', ...); // responds to "/users/:id"
```

## 获取参数

### get

访问 `http://localhost:3001/user?id=1`

```js
router.get("/user", (ctx) => {
  console.log(ctx.query); // {id:1}
});
```

### post

@koa/router 针对 post 请求，参数并不好获取，  
需要安装三方插件 `@koa/bodyparser` 或者 `koa-body`（推荐）(express 已经将其内置了，但是 koa 坚持精简)

```js
import Koa from "koa";
import Router from "@koa/router";
import { bodyParser } from "koa-body";

const app = new Koa();
app.use(bodyParser());
const router = new Router();
router.post("/user", (ctx) => {
  console.log(ctx.request.body); // {id:1}
});
```

### restfull

访问 `http://localhost:3001/user/1`

```js
router.get("/user/:id", (ctx) => {
  console.log(ctx.params); // {id:1}
});
```

## 分割模块

一般情况下，我们会将路由按照功能拆分成不同模块文件，用于我的代码更加的清晰，比如:

```
router
  | --- root.js
  | --- user.js
  | --- index.js
```

虽然我手动也能做出模块汇总合并，但是我还是[推荐别人造好的轮子](https://stackoverflow.com/a/39301972/24214332)来做: [koa-combine-routers](https://github.com/saadq/koa-combine-routers)

```js title="router/root.js"
import Router from "@koa/router";

const router = new Router();
router.get("/", async (ctx, next) => {
  ctx.body = "Hello";
});
export default router;
```

```js title="router/user.js"
import Router from "@koa/router";

const router = new Router({ prefix: "/user" });
router.get("/", (ctx) => {
  ctx.body = "i am user";
});
export default router;
```

```js title="router/index.js"
import userRouter from './user.js'
import rootRouter from './root.js'
import combineRouters from 'koa-combine-routers'

const router = combineRouters(
  rootRouter,
  userRouter
)

export default router;
```


最后，我们在 入口文件使用即可
```js title="app.js"
import Koa from "koa";
import router from './router/index.js'

const app = new Koa();

app.use(router())
app.listen(3001);
```