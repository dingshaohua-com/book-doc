---
sidebar_position: 8
---

# 请求上下文
在上一章节中，我们学会了把 jwt 解析出的 user 挂在到 ctx。   
但是我们在非中间件中使用的时候，是不太方便获取的。

像 Java 用 ThreadLocal，在 Node 中可以用 AsyncLocalStorage 来做“每个请求线程的私有上下文”。

## 创建上下文实例
```js
// utils/request-context.ts
import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();
export default {
  run: (callback: (...args: any[]) => void) => {
    asyncLocalStorage.run(new Map(), callback);
  },
  set: (key: string, value: any) => {
    const store = asyncLocalStorage.getStore();
    if (store) store.set(key, value);
  },
  get: (key: string) => {
    const store = asyncLocalStorage.getStore();
    return store ? store.get(key) : undefined;
  }
};
```

## 封装一个中间件
再封装一个中间件，并在项目中使用。
```js
// middleware/request-context.ts
import context from '../utils/reques-context.ts';

export default function requestContextMiddleware() {
    return async (ctx, next) => {
        await new Promise((resolve, reject) => {
            context.run(() => {
                next().then(resolve).catch(reject);
            });
        });
    };
}
```

```js
// app.ts
app.use(koaJwt); // 1. 使用 koa-jwt 中间件（验证 JWT）
app.use(contextMiddleware()); // 2. 自定义中间件：创建上下文容器（多了这行：重点这里）
app.use(userMount); // 3. 自定义中间件：解析 token 并挂载 payload 到 ctx 和 context上
app.use(router()); // 4. 路由
```

最后我们将上一章节userMount 中间件也做一点改动
```js
// middleware/user-mount.ts
import jwt from "jsonwebtoken";
import context from '../utils/reques-context';

const userMount = async (ctx, next) => {
    if (ctx.header?.authorization) {
        const token = ctx.header.authorization.replace('Bearer ', '');
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            ctx.state.user = user;
            context.set('user', ctx.state.user); // 多了这行
        } catch (err) {
            console.error('Token 解析失败:', err);
        }
    }
    await next();
}
export default userMount;
```

## 使用
比如我们在 service 层使用
```js
// service/user.ts
export const queryOne = async (params) => {
  const user = context.get('user');
  console.log('当前登录用户：', user);
  // ...
};
```

这样咱们就实现的是一种“登录后挂载用户信息到全局上下文”，这样在 非请求链（比如 utils、service、job、定时任务等） 中也能拿到当前登录用户 —— 类似 Java 中的 ApplicationContext + ThreadLocal 的组合。