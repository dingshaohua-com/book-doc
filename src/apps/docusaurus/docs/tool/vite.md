---
sidebar_position: 2
---

## 简介
[vite](https://cn.vitejs.dev/) 是一款前端构建工具。   


它的特色：
### 脚手架能力
按你所需拉取对应的模板代码下载到你的本地，还帮你集成了很多现代化前端工具，包括并不限制于 打包器 以便于前端模块化开发 文件切割、代码语法检查和美化工具、编译器 以便于对如react/vue支持/ts支持/less支持等（如 babel、）

### 内置了一套服务器
在开发阶段会使用到，得益于此你可以体验到热更新HMR、以及本地HTTP服务能力（如完美的处理跨域）。   

通过跟踪vite源码分析可知 vite是用的node创建的http服务，但不是原生的 `http.createServer`，而是一个流行的node框架 [connect](https://github.com/senchalabs/connect)（可不要小瞧它，express和koa等都是基于它）。


教一下简单的定位方式吧？
1. 根据vite创建的项目得知 每次 `npm run dev`调用的是 你安装的 vite依赖
2. 找到vite依赖的packge.json里的bin 发现是`bin/vite.js` 
3. 定位到 vite 包下的[此路径](https://github.com/vitejs/vite/blob/main/packages/vite/bin/vite.js)，会发现核心在第60行的`start`
4. 其start是调用了 `../dist/node/cli.js`,找到[这个文件](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/cli.ts)
5. 打开你就会发现 这个cli文件就是处理 咱们平时输入的命令行执行的任务的，比如打包、启动、预览 刚好对应vite项目里的packge.json的。不过我们只看第136行 跟dev相关的 
```js
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
``` 
6. 会发现它调用了同级目录下的 `./server`的createServer方法 在第154行，然后我们找到[这个方法的定义](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/index.ts#L425)
7. 发现它调用了自身文件的的`_createServer`方法，而_createServer函数内第463和464行可看出，这里就是用了 `connect()`创建的服务。


### 生产环境和构建环境
Vite 核心功能是对构建工具的高阶封装，它的内部使用的是其它的打包工具，最核心的就是esbuild和Rollup打包工具。

在开发环境下，由 esbuild 执行依赖预构建工作。而在生产环境下，由 Rollup 完成打包工作，[这里查看更多](https://cn.vitejs.dev/guide/why#why-not-bundle-with-esbuild)。   
其中开发环境下，打包时并不会产生文件，而是直接将页面所需的打包后的文件放入内存，这样修改和更新预览等操作响应更快。