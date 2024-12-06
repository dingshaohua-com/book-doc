---
sidebar_position: 1
---

# socket.io

## 基本使用

服务端安装 `yarn add socket.io`，并使用

```js title="server.js"
import { Server } from "socket.io";
const io = new Server(httpServer, {
  cors: {
    origin: "*", // 允许任何来源
    methods: ["GET", "POST"], // 允许的 HTTP 请求类型
  },
});
io.on("connection", async (socket) => {
  console.log("连接成功，id：" + socket.id);
  socket.on("disconnect", () => {
    console.log("客户端断开连接");
  });
});
```

客户端安装 `yarn add socket.io-client`，并使用

```html title="index.html"
<script>
  import { io } from "socket.io-client";

  const socket = io("http://localhost:3002");
  socket.on("connect", () => {
    console.log("连接成功，id：" + socket.id);
    socket.on("disconnect", () => {
      console.log("客户端断开连接");
    });
    socket.on("error", (error) => {
      console.error("Error:", error);
    });
  });
</script>
```

## 命名空间

默认命名空间为 `/`，可以省略不写

```html title="index.html"
<script>
  io(`http://localhost:3002`);
</script>
```

```js title="server.js"
const io = new Server(server);
io.on("connection", async (socket) => {
  console.log("有客户端链接上啦");
});
```

我们来设置一个命名空间

```html title="index.html"
<script>
  io(`http://localhost:3002/abc`);
</script>
```

```js title="server.js"
const io = new Server(server);

io.of("/abc").on("connection", async (socket) => {
  console.log("有客户端链接上啦");
});
```

1. 命名空间并不会在浏览器网络请求 url 上体现，而是作为没次消息发送的前缀，这是 socket.io 自己做了层封装，而非 webscket 的 api。
2. 默认的命名空间也叫主命名空间（mian nsp），命名空间是精准匹配的，所以 `/abc` 不会触发默认的命名空间。

获取某个客户端加入了的房间号

```js title="server.js"
console.log(socket.rooms); // Set { <socket.id> }
socket.join("room1");
console.log(socket.rooms); // Set { <socket.id>, "room1" }
```

## 路径

默认为 socket.io，即查看浏览器网络监控 既可以看到 `http://localhost:3002/socket.io/?EIO=4&transport=polling&t=P84S3kH`。

我们自定义 path 为 def，代码如下

```html title="index.html"
<script>
  io(`http://localhost:3002`, {
    path: "/def",
  });
</script>
```

```js title="server.js"
const io = new Server();
io.path("/def");

io.on("connection", async (socket) => {
  console.log("有客户端链接上啦");
});
// 解决在调用函数前服务已绑定http.Server,io.path 将不起作用的问题
io.listen(server);
```

使用场景：多个 ws 服务，每个服务都有自己的 path，这样来管理不至于业务混乱。

## 获取客户端

```js
io.sockets.sockets; // 返回主命名空间上的所有客户端
io.of("/user").sockets; // 返回 user名空间上的所有客户端
```

官方在 v4 版本又推出了 fetchSockets 的方式来获取当前链接的客户端（不知道为什么）。

```js
// 返回主命名空间上的所有客户端
const sockets = await io.fetchSockets();
// 返回主命名空间-房间为room1 上的所有客户端
const sockets = await io.in("room1").fetchSockets();
```

## 收发消息

客户端向服务端发送消息

```html title="index.html"
<script>
  const ws = io(`http://localhost:3002`);
  ws.emit("message", "hello");
</script>
```

```js title="server.js"
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("有客户端链接上啦");
  socket.on("message", (e) => {
    cosnole.log(e);
  });
});
```

服务端向客户端推送消息

```js title="server.js"
const io = new Server(server);
io.on("connection", async (socket) => {
  console.log("有客户端链接上啦");
  socket.emit("message", "hello");
});
```

```html title="index.html"
<script>
  const ws = io(`http://localhost:3002`);
  ws.on("message", (e) => {
    cosnole.log(e);
  });
</script>
```

<!-- 通过观察不难看出请求requesturl 为http:192.168.2.125/socket.io/?EIO=........................   这里socket 与 http 的原理与关系不再说明，简单点来说就是要想建立socket 必须首先通过http 握手 然后upgrade 更新到socket连接，那么我将nignx 的配置文件配置如下，即可完成对socket 的外网代理
 -->

## 参数

websokit 也是可以在 connect 的时候通过 url 传递参数的。  
socket.io 更是做了一层封装，便于存取。

```html title="index.html"
<script>
  const ws = io("http://localhost:3002", {
    query: {
      app: app.value,
      version: version.value,
    },
  });
</script>
```

```js title="server.js"
const io = new Server(server);
io.on("connection", async (socket) => {
  console.log('接收到url参数'，socket.handshake.query)
});
```
