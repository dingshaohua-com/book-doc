---
sidebar_label: express 
sidebar_position: 1
---

# 简介

Express 是基于 Node.js 平台,快速、开放、极简的 Web 开发框架， 通俗的理解: Express 的作用和 Node.js 内置的 http 模块类似,是专门用来创建 Web 服务器的。

Express 从来就不是开箱即用的（比如对比 eggjs），所以需要我们自己建项目，并安装它，然后慢慢创建目录结构。

## 启 http 服务

```js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("hello word");
});
app.get("/", (req, res) => {
  res.send("hello word");
});
// app.namespace("/teacher", () => {
//   app.get("/", (req, res) => {
//     res.send("hello this is teacher");
//   });
// });
app.listen("3002", () => {
  console.log("启动成功 http://localhost:3002");
});
```

## 路由

[官方文档](https://expressjs.com/zh-cn/guide/routing.html)  
其实上边启服务的时候，我们已经写了一个路由，如 app.get。  
但是这仅适用于小型应用或简单的路由逻辑场景，并不使用适用于大型应用或需要模块化管理路由的场景。

Express 为我们提供了路由模块化管理的能力，我们可以将路由逻辑分离到不同的文件中，然后通过 app.use() 方法将这些路由挂载到应用中。

```js title="my-router.js"
import express "express";

const router = express.Router();
// 定义 home page 路由
router.get("/", function (req, res) {
  res.send("Birds home page");
});
// 定义 about 路由
router.get("/about", function (req, res) {
  res.send("About birds");
});
export default router;
```

```js title="app.js"
// ...
var myRouter = require("./routers/my-router.js");
app.use("/my-router", myRouter);
```

### 定义方式

如上，定义路由有两种方式， [区别如下](https://www.zhihu.com/question/53982540)

应用级中间件

```js
//这种类似于 应用级（具名）中间件，只要是http请求+且请求path为 /test，就会都会执行。
app.use("/test", yourMiddleware);
// 这种和上边等价，只不过限定了请求方法为get
app.get("/test", yourMiddleware);
```

和路由级中间件

```js
// 这种是路由级（匿名）中间件，http任意path和任意method的请求都会执行
// (第一个参数路径可选 其实用法和上边第一个差不多)。
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});
// 这种和上边等价，只不过限定了请求方法为get，path为 /
router.get("/", function (req, res) {
  res.send("Birds home page");
});
```

两者的使用场景是：路由 router 级别的中间件，可以作为 app 级别的中间件的扩展，从而减小 app 级别路径处理的臃肿，提高可维护性和扩展性。如果你需要定义路由 还是建议 `express.Router()`

### 命名空间

如果我分模块了之后，我想按照模块层级开发和访问 比如 `/teacher/detail`

你可以这样写

```js
app.namespace("/teacher", () => {
  app.get("/", (req, res) => {
    res.send("hello word");
  });

  app.get("/detail", (req, res) => {
    res.json({
      code: 0,
      data: 123,
    });
  });
});
```

如果你用路由了，则可以这样写

```js
const router = express.Router();
router.get("/", (req, res) => {
  res.send("hello word");
});
router.get("/detail", (req, res) => {
  res.json({
    code: 0,
    data: 123,
  });
});
app.use("/teacher", router);
```

## 接受参数

get 参数

```js
router.post("/test", (req, res) => {
  const { id, type } = req.query;
});
```

post 参数，获取稍微麻烦一些，需要使用中间件（不过已经内置到 express 中了）

```js
app.use(express.json()); // 解析post参数 req.body获取
app.use(express.urlencoded({ extended: true })); // 解析from参数

router.post("/test", (req, res) => {
  const { id, type } = req.body;
});
```

## 响应内容

**返回 string 与 json**

```js
// 返回文本string
res.send("hello");
// 返回json
res.json({
  code: 0,
  data: "xx",
});
```

**返回页面**  
可以自定义一个中间件

```js title="render-html.js"
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default (req, res, next) => {
  res.renderHtml = function (filePath) {
    res.sendFile(path.resolve(__dirname, `../views/${filePath}.html`));
  };
  next();
};
```

然后使用

```js title="app.js"
import express from "express";

const app = express();
app.use(renderHtml);
router.get("/hi", (req, res) => {
  res.renderHtml("index");
});
```

## 模版引擎

虽然现在前后端分离了，但是我们还是要了解一下。  
Node.js 中常见的模板引擎包括：Pug (原名 Jade)、EJS、Handlebars、Mustache、Marko

每种模板引擎都有其特点和适用场景,在选择模板引擎时，需要考虑项目需求、社区支持、学习曲线和个人喜好等因素。以下是使用一些流行的模板引擎创建简单视图的示例代码

Pug (Jade)，点赞 21.6k

```js
const pug = require("pug");
const html = pug.render("h1 Pug is great", { pretty: true });
console.log(html);
```

EJS，点赞 7.7k

```js
const ejs = require("ejs");
const html = ejs.render("<h1>EJS is <%= text %></h1>", { text: "great" });
console.log(html);
Handlebars;
```

Handlebars，点赞 301

```js
const Handlebars = require("handlebars");
const template = Handlebars.compile("<h1>{{ text }}</h1>");
const html = template({ text: "Handlebars is great" });
console.log(html);
```

Mustache，点赞 3k

```js
const Mustache = require("mustache");
const html = Mustache.render("<h1>{{ text }}</h1>", {
  text: "Mustache is great",
});
console.log(html);
```

Nunjucks，点赞 8.5k

```html
<div>{{ content }}</div
```

pug 不支持使用现有的 html 文件作为模板 而是单独创建了一套语法体系，如果是你更熟悉 html，则不推荐使用此框架。在结合点赞量，我推荐使用[Nunjucks](https://nunjucks.bootcss.com)。

### 配置 Nunjucks

先安装 `yarn add nunjucks`，再在 express 中使用它

```js title="app.js"
var app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.get("/", function (req, res) {
  res.render("index.html");
});
```

### vscode 支持

虽然 nunjucks 可以支持任意格式的模板，但是官方还是建议 `index.njk`。  
但是这样 vscode 就不会支持高亮和格式化了，这时候我们安装同名 vsocde 插件即可。

## 静态资源

默认情况下 express 将项目跟路径中的 public 作为默认 静态资源，直接可以通过 `http://xxx/a.png`访问。

如果你想自定义，你可以手动指定：

```js
app.use(express.static(path.resolve("app", "public"))); //配置静态资源目录
```

## 热更新

[nodemon](https://github.com/remy/nodemon) 支持服务的热更新，如 `nodemon index.js`：监视 node.js 应用程序中的任何更改并自动重启服务器 - 非常适合开发。

默认情况下监听 js 文件，如果想自定义监听配置项可以在根目录创建一个配置文件如下

```js title="nodemon.json"
{
  "watch": ["./**/*.njk"],
  "ext": "js json njk"
}
```

## ws 的支持

### 原生
express 结合 ws，若是原生，可以使用 [ws](https://github.com/websockets/ws) 三方库

注意的是原生的WebSocket并没有唯一标识ID的改念（原生的connection函数都不支持参数），需要结合前端传来的参数自己组装，但是 ws 库并没有封装，不过sokit.io倒是封装了。



```js title="后端 app.js"
const server = app.listen("3002", () => {
  console.log("启动成功 http://localhost:3002");
});
wsInit(server);
```

```js title="后端 wsInit.js"
import { WebSocketServer } from "ws";
import _ from "lodash";

export default (server) => {
  const wss = new WebSocketServer({ server });
  wss["mclients"] = []; // 在wss上挂载一个mclients 自己维护的clients属性，方便使用（主要是外部）。
  wss.on("connection", (ws, req) => {
    ws.send("hello, 你已经链接成功啦");

    // 将WebSocket实例与客户端标识符关联起来
    const params = new URL(req.url, "http://example.com").searchParams;
    const client = { id: params.get("id"), ws };
    wss.mclients.push(client);

    // 监听各种事件
    ws.on("error", console.error);
    ws.on("message", (params) => {
      console.log("收到消息", params);
    });
    ws.on("close", () => {
      _.remove(wss.mclients, client);
    });
  });
};
```

```js title="前端 index.html"
const wsUrl = `http://localhost:3002?id=xxx`;
const ws = new WebSocket(wsUrl);
ws.onopen = () => {
  status.value = "ws连接成功";
  ws.onmessage = (e) => {
    recieveMsg.value.push(e.data);
  };
};
ws.onclose = () => {
  ws = null;
};
ws.onerror = () => {
  ws = null;
};
```

### sokit.io
如果更喜欢用 sokit.io，也是支持的。

```js title="后端 app.js"
const server = app.listen("3002", () => {
  console.log("启动成功 http://localhost:3002");
});
wsInit(server);
```

```js title="后端 wsInit.js"
import { Server } from "socket.io";

export default (server) => {
  const ws = new Server(server);
  // const urlParams = socket.handshake.query; // 获取URL参数
  ws.on("connection", (socket) => {
     console.log("连接成功，id：" + socket.id); // 随机生成，无法自定义
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
```

```js title="前端 index.html"
// 注意前后端的sokit.io版本保持一致，否则可能无法连接上
const ws = io(`http://localhost:3002`, {
  // query: {
  //   id: id.value, // 这里不用传唯一表示，链接成功后会有 socket.id（和原生的区别）
  // },
  transports: ["websocket"],
});
ws.on("connect", (socket) => {
  console.log("连接成功，id：" + socket.id); // 会和客户端id保持一致
});
ws.on("disconnect", (e) => {
  console.log("断开连接");
});
ws.on("error", (error) => {
  console.error("Error:", error);
});
```


