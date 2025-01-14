---
sidebar_position: 3
---
# 中间件

## 什么是中间件

在Koa中，中间件呈现为一个异步函数，该函数支持 async/await 语法。

该异步函数接收两个参数， ctx 和 next：
ctx 是上下文对象 是对当前HTTP请求的封装，用于处理 HTTP 请求和响应。
next 是一个函数，执行后返回一个 Promise 对象。它的作用是将程序的执行权交给下一个中间件，等下一个以及后面的中间件全部执行结束后，再回到当前中间件继续执行。



## 定义中间件
### 具名中间件
除了我们一开始举例的匿名中间件，我们还可以具名中间件，这样在 Debug 时就会显示函数名，有助于定位调试。
```js
// 定义中间件，命名为 logger
async function logger(ctx, next) {
    // do something
};

// 注册中间件
app.use(logger)
```


### 中间件参数
在创建公共中间件时，可以将中间件包装在另外一个函数中，这有利于功能扩展。
```js
// 定义 logger 函数，用于扩展功能
function logger(format) {
  format = format || ":method :url";

  // 返回一个中间件函数
  return async function (ctx, next) {
    const str = format
      .replace(":method", ctx.method)
      .replace(":url", ctx.url);

    console.log(str);

    await next();
  };
}

// 注册中间件
app.use(logger());
app.use(logger(":method"));
app.use(logger(":method :url"));
```

## 执行顺序
下面通过具体代码来演示中间件的执行顺序，代码如下：
```js
const Koa = require("koa");
const app = new Koa();

// the first middleware
app.use(async function (ctx, next) {
  console.log(">> one");  // 1
  await next();           // 2
  console.log("<< one");  // 3
});

// the second middleware
app.use(async function (ctx, next) {
  console.log(">> two");  // 4
  ctx.body = "two";       // 5
  await next();           // 6
  console.log("<< two");  // 7
});

// the third middleware
app.use(async function (ctx, next) {
  console.log(">> three");// 8
  await next();           // 9
  console.log("<< three");// 10
});

app.listen(3000, () => {
  console.log("[demo] server is running at http://localhost:3000");
});

// 访问后会输出如下
// >> one
// >> two
// >> three
// << three
// << two
// << one
```

通过上述代码演示，我们知道了中间件的处理流程大致分为三部分：
1. 前期处理
2. 交给其他中间件处理并等待（这一步就是调用了 next 方法）
3. 后期处理

Koa 应用程序由一组中间件组成，所以整个的处理过程就类似于先进后出的堆栈结构（有点像 Java 的拦截器行为），可以用如下这张洋葱切面图形象地来解释多个不同功能的中间件的执行顺序。   
![](https://img.dingshaohua.com/book-fe/202501150007091.jpg)   


## 三方中间件
基于中间件的特性，很多[三方插件](https://www.kancloud.cn/zengqs1976/uni-app/1143243)利用它实现扩展koa的诸多实用功能，包括且不仅限于如下
### koa-router
路由是Web框架必不可少的基础功能，koa.js为了保持自身的精简，并没有像Express.js自带了路由功能，因此koa-router做了很好的补充，作为koa星数最多的中间件，koa-router提供了全面的路由功能，比如类似Express的app.get/post/put的写法，URL命名参数、路由命名、支持加载多个中间件、嵌套路由等。其他可选路由中间件：koa-route, koa-joi-router, koa-trie-router

### koa-bodyparser
koa.js并没有内置Request Body的解析器，当我们需要解析请求体时需要加载额外的中间件，官方提供的koa-bodyparser是个很不错的选择，支持x-www-form-urlencoded, application/json等格式的请求体，但不支持form-data的请求体，需要借助 formidable 这个库，也可以直接使用 koa-body 或 koa-better-body

### koa-views
koa-views对需要进行视图模板渲染的应用是个不可缺少的中间件，支持ejs, nunjucks等众多模板引擎。

### koa-static
Node.js除了处理动态请求，也可以用作类似Nginx的静态文件服务，在本地开发时特别方便，可用于加载前端文件或后端Fake数据，可结合 koa-compress 和 koa-mount 使用。

### koa-session
HTTP是无状态协议，为了保持用户状态，我们一般使用Session会话，koa-session提供了这样的功能，既支持将会话信息存储在本地Cookie，也支持存储在如Redis, MongoDB这样的外部存储设备。

### koa-jwt
随着网站前后端分离方案的流行，越来越多的网站从Session Base转为使用Token Base，JWT(Json Web Tokens)作为一个开放的标准被很多网站采用，koa-jwt这个中间件使用JWT认证HTTP请求。

### koa-helmet
网络安全得到越来越多的重视，helmet 通过增加如Strict-Transport-Security, X-Frame-Options, X-Frame-Options等HTTP头提高Express应用程序的安全性，koa-helmet为koa程序提供了类似的功能，参考Node.js安全清单。

### koa-compress
当响应体比较大时，我们一般会启用类似Gzip的压缩技术减少传输内容，koa-compress提供了这样的功能，可根据需要进行灵活的配置。

### koa-logger
koa-logger提供了输出请求日志的功能，包括请求的url、状态码、响应时间、响应体大小等信息，对于调试和跟踪应用程序特别有帮助，koa-bunyan-logger 提供了更丰富的功能。

### koa-convert
对于比较老的使用Generate函数的koa中间件(< koa2)，官方提供了一个灵活的工具可以将他们转为基于Promise的中间件供Koa2使用，同样也可以将新的基于Promise的中间件转为旧式的Generate中间件。


## 参考
[Koa 中间件详解](https://www.jianshu.com/p/307f129fe459)
