---
sidebar_position: 7
---

# 登录鉴权
## 创建JWT签名密钥
这个密钥在生成和校验 token 都要用到，建议配置到环境变量中。
```sh
# .env
JWT_SECRET="my_first_secret"
```


## koa-jwt
该模块允许您在Koa程序中使用 JSON Web 令牌验证 HTTP 请求，在以后的每一次请求中它都会去校验你令牌的合法性。
```js
import KoaJwt from "koa-jwt";

// 给路由加上了 `JWT` 校验，并使用 `unless` 去排查不需要校验的路由(注意：放在路由前面)
const koaJwt = KoaJwt({
  secret: process.env.JWT_SECRET
}).unless({
  path:[/^\/login/, /^\/register/]
})
app.use(koaJwt);

// 正常路由定义
app.use(router());
```

如上定义的接口，在请求的时候必须带上令牌信息，否则报 401
```js
// 客户端请求
// 使用时要在前面增加 Bearer,为什么要这样加？不能不加？就留给大家去探索了！
axios.get('/xxx',{
    headers: {
        Authorization: 'Bearer xxx' // 这里的 xxx 就是 token，是由后端给的（登录成功后存到本地中）
    }
})
```

## jsonwebtoken
jsonwebtoken就是 jwt，用于（给前端）产出 令牌（token）！

### 生成令牌
```js
import jwt from "jsonwebtoken";

// 生成唯一令牌
const genToken = (payload) => {
    const params = { expiresIn: '1h' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, params);
    return token;
}
// 参数意义：
// payload：载体，一般把用户信息作为载体来生成token
// secret：秘钥，可以是字符串也可以是文件
// expiresIn：过期时间 1h表示一小时
```

一般会在登录成功之后执行此操作,
```js
// 登录
router.post("/login", async (ctx, next) => {
  const user = await prisma.user.findFirst({ where: ctx.request.body });
  if(user){
    ctx.body = JsonResult.success({
      token: genToken(user)
    })
  }else{
    ctx.body = JsonResult.failed("暂未注册，请先注册！");
  }
})
```



### 解密令牌
jwt.verify（来自 jsonwebtoken 库）和 koa-jwt 的 Token 验证本质上是相同的，但它们的应用场景和灵活性不同。

koa-jwt 是一个 Koa 中间件，会自动检查请求头中的 Authorization，如果 Token 无效（签名错误、过期等），直接返回 401 Unauthorized，并终止请求。

jwt.verify 是 手动验证 Token 的底层方法，通常在以下场景使用：需要自定义错误处理（而非直接 401）、需要获取 Token 的解码内容、非 HTTP 场景的验证
```js
import jwt from "jsonwebtoken";

try {
  const decoded = jwt.verify(token, 'wrong-secret');
  console.log('令牌有效，解码后内容为', decoded)
} catch(err) {
  console.log('令牌无效，错误为', err)
}
```

### 自定义401
如果你不想给用户返回 401 错误，可以通过中间件的方式进行拦截处理
```js
// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});
```

### 挂在全局
在 Koa 应用中使用 `koa-jwt` 中间件时，默认情况下它会验证 JWT 的有效性，但不会自动将解析后的 **payload** 挂载到 `ctx` 上。如果你需要在后续中间件或路由中访问 JWT 的 payload（例如用户信息），可以通过自定义中间件来实现。在 `koa-jwt` 之后添加一个中间件，手动解析并挂载 payload 到 `ctx.state.user`（或其他自定义属性）：

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');

const app = new Koa();
const router = new Router();

// 1. 使用 koa-jwt 中间件（验证 JWT）
app.use(koaJwt({
  secret: process.env.JWT_SECRET,
}).unless({
  path: [/^\/login/, /^\/register/]
}));

// 2. 自定义中间件：解析 token 并挂载 payload 到 ctx
app.use(async (ctx, next) => {
  if (ctx.header && ctx.header.authorization) {
    const token = ctx.header.authorization.replace('Bearer ', '');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      ctx.state.user = payload; // 挂载到 ctx.state.user
      // 或者挂载到其他属性，如 ctx.user
    } catch (err) {
      // 如果 token 解析失败，可以忽略（因为 koa-jwt 已经验证过有效性）
      console.error('Token 解析失败:', err);
    }
  }
  await next();
});

// 3. 路由示例：访问挂载的 payload
router.get('/protected', async (ctx) => {
  // 从 ctx.state.user 获取 payload
  ctx.body = {
    message: '访问受保护的路由',
    user: ctx.state.user // 这里可以拿到 JWT 的 payload
  };
});

app.use(router.routes());
app.listen(3000);
```


## 其他
### 明文密码
密码建议不要明文入库，[可以使用 node 自带的 crypto 模块进行加密](https://segmentfault.com/a/1190000044078177)

### jwt原则
koa-jwt 验证 Token 的有效性，本质上是 验证 JWT 的签名是否由合法的 secret（或密钥）生成，同时会检查 Token 的结构、有效期等标准字段。

### 重启程序导致token失效
那是因为咱们之前生成的 token都存在后端项目的变量中，而变量是基于内存的，要想 token 不受限于程序的启停，建议把 token 存储到 no-sql 数据库中，作为缓存，比如 redis可以缓存 token，并设置过期时长。