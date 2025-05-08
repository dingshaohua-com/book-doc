---
sidebar_position: 12
---

# 跨域处理
在 nginx中，做代理即可
```js
server {
    // ...

    location / {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods GET,POST,PUT,DELETE,PATCH,OPTIONS;
        add_header Access-Control-Allow-Headers Origin,X-Requested-Width,Content-Type,Accept;

       // ...
    }
}
```


但是我们这里是 koa，koa（也就是nodejs）服务本身处理
```js
import cors from "@koa/cors";

const app = new Koa();
app.use(cors());
```