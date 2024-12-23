---
sidebar_position: 1
---

# 基本使用

## 初始化

初始化，将会在你的项目的 public 目录里 生成一个 msw 的 lib 文件 `mockServiceWorker.js`

```js
npx msw init ./public
```

## 启动服务

注册和激活 msw 的相关的 Service Worker

```js
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

const worker = setupWorker(...handlers);
await worker.start(); // Promise<{ pending }>
```

具体到在项目中使用，我们可以封装一个方法

```js
// api mock相关
const enableMocking = async () => {
  if (process.env.NODE_ENV !== "development") return;
  const { worker } = await import("@/mocks");
  await worker.start({
    onUnhandledRequest(request, print) {
      // 决定如何对未处理的请求做出反应: 如果url不包含/api的内容 就返回，否则就警告
      if (request.url.indexOf("/api") === -1) return;
      print.warning();
    },
  });
};
enableMocking();
```

## 处理器

处理器才是 mock 最核心 和 真正接收响应和处理数据的地方！

```js
import { http } from "msw";

export const handlers = [
  http.get("/user", ({ request }) => {
    return [];
  }),
  http.post("/login", () => {
    return {};
  }),
];
```

### 返回格式

如上，返回的数据可能对前端不友好，我们需要规范 返回格式

```js
import { HttpResponse, http } from "msw";

// 定义统一返回格式（对，就像你真的在写接口一样）
const JsonResult = {
  error(msg: string) {
    return HttpResponse.json({
      code: 0,
      msg,
    });
  },
  sucess(data) {
    return HttpResponse.json({
      code: 1,
      data,
    });
  },
};

//  在处理器中使用
const handlers = [
  http.post("/login", () => {
    return JsonResult.sucess({});
  }),
];
```

### baseUrl

[MSW 没有提供使用其 API 设置基本 URL 的方法，您应该自行设置基本 URL](https://github.com/mswjs/msw/discussions/1696)！

先定义好 baseUrl

```shell
# .env.development
VITE_APP_BASE_API = '/api'
```

当然，我们封装的 http 请求，也要使用

```js
// api.js
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API;
```

最后，给 msw 做适配

```js
const baseURL = import.meta.env.VITE_APP_BASE_API;

http.post(baseURL + "/login", async ({ request }) => {
  // 解构POST参数
  const res: any = await request.json();
  const { account, password } = res;
  if (account === "admin" && password === "password") {
    return JsonResult.sucess({
      token: "abc2025",
    });
  } else {
    return JsonResult.error("账号或密错误");
  }
});
```
