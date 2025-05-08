---
sidebar_position: 10
---

# 静态资源

安装并使用中间件 `koa-static`
```js
import staticServer from "koa-static";

app.use(staticServer(path.join(__dirname, "www")));
```

## 前缀
需要借助插件 `koa-mount`，即可访问类似于 `http://localhost:3000/files/xxx.zip`
```js
import mount from "koa-mount";
import staticServer from "koa-static";

app.use(mount("/files", staticServer(path.join(__dirname, "upload"))));
```

