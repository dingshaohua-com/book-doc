---
sidebar_position: 5
---

# Ts 支持

## 项目启动
如果单次启动 可以使用 `node --experimental-transform-types ./app.ts`   
如果需要监听变化并热更新内容，则需要使用 三方插件 [ts-node-dev](https://github.com/wclr/ts-node-dev)：`ts-node-dev ./app.ts`


## 三方包类型支持
koa官方支持 ts，@koa/router 则需要安装`npm install --D @types/koa__router`

## ts配置
tsconfig.json
```js
{
  "compilerOptions": {
    "strict": false,
    "esModuleInterop":true, // 不然 koa 模块报错
    "noEmit":true, // allowImportingTsExtensions 需要此配置项
    "allowImportingTsExtensions": true // 允许导入 ts 模块
  }
}
```