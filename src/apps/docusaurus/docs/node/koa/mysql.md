---
sidebar_position: 6
---

# mysql 支持

## mysql

node-mysql 包 简称 mysql 包（不要和数据库 mysql 搞混概念） ，是一款 mysql 数据库链接驱动，类似于 jdbc.jar

### 安装和配置

安装后`npm install mysql`，在项目创建一个导出 mysql 的链接实例。

```js
// bd-pool.js
import mysql from "mysql2";

// 数据库配置
const config = {
  host: "localhost", //url
  port: 3306, //端口
  user: "root", //库名称
  password: "123456", //数据库密码
  database: "sys", //表名称
};
// 数据库连接池(数据库连接实例)
const dbPool = mysql.createPool(config);
export default dbPool;
```

### 使用

查询学生表中所有记录

```js
const sql = "SELECT * FROM student";
dbPool.query(sql, (error, results, fields) => {
  console.log(results);
});
```

结合 koa 的路由，你需要这么用

```js
router.get("/users", async (ctx) => {
  const sql = "SELECT * FROM user";
  const results = await new Promise((resolve, reject) => {
    dbPool.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
  ctx.body = results;
});
```

## mysql2

nodejs 的 mysql 模块虽然功能强大，但是由于发布的时间比较久，后续的版本有些地方跟不上大前端技术的迭代脚步，还是存在一些缺点：

- 回调问题，mysql 的操作都是通过回调函数来执行，这就回到了我们熟悉的“回调地狱”，过多的回调函数嵌套，会大大的破坏代码的可读性和可维护性。
- Promise 和 async/await，跟早起的 node 其他模块一样，mysql 模块并不支持 Promise 和 async/await 语法，要使用这些语法，需要自形封装 mysql 的操作。
- 缺少高级功能支持，例如：语句预处理、流式查询等，对新版本的 mysql 支持不足（mysql8 的密码加密格式问题等）
- 性能问题，在大数据量或者高并发的情况下，mysql 模块会出现性能受限的情况，主要原因是其无法发挥 nodejs 的异步特性和性能特性。

针对上面的问题，[mysql2](https://sidorares.github.io/node-mysql2/zh-CN/docs)做了很多改进，mysql2 基于 mysql-native 项目进行改进，同时兼容 mysql 的 API。

### 安装和配置

安装后`npm install mysql2`，在项目创建一个导出 mysql 的链接实例。

```js
// bd-pool.js
import mysql from "mysql2/promise";

// 数据库配置
const config = {
  host: "localhost", //url
  port: 3306, //端口
  user: "root", //库名称
  password: "123456", //数据库密码
  database: "sys", //表名称
};
// 数据库连接池(数据库连接实例)
const dbPool = mysql.createPool(config);
export default dbPool;
```

### 使用

可以很方便的结合 koa 的路由

```js
router.get("/users", async (ctx) => {
  const sql = "SELECT * FROM user";
  const [results] = await dbPool.query(sql);
  ctx.body = results;
});
```

## ORM

不想手撸 sql 语句吗？ 想偷懒？ ORM 框架就是做这个的，比如[Prisma](https://prisma.yoga)、[TypeORM](https://typeorm.bootcss.com)、[sequelize](https://www.sequelize.cn)  
通过配置数据库表结构和自定义的实体映射（orm），提供一种简单的对数据增删改查操作，使开发人员可以使用面向对象的编程风格来操作数据库。

具体选哪个 [网上有很多比较](https://www.cnblogs.com/sexintercourse/p/14978846.html)，我们暂时以目前流行和 star 最多的 Prisma 为例子。

### 安装和初始化

`npm install prisma`之后，初始化它 `npx prisma init`, 这个命令会干两件事情

- 创建一个名为 prisma 的目录，并且目录里面有 schema.prisma 文件，这个文件主要是放 表结构的
- 创建一个名为.env 的配置文件，这个是用来链接数据库的，数据库的连接串就放在这里

```shell
# .env
DATABASE_URL="mysql://user:pass@localhost:3306/school?schema=public"
```

```js
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 检测数据库连通

```shell
npx prisma db pull
```

### 使用

要想 crud 等，需要先安装 Prisma 客户端 `npm install @prisma/client`, 然后执行 `npx prisma generate` 来生成客户端代码（既操作表 crud 的代码，包含 js和cs），最后你就可以使用啦

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
router.get("/users", async (ctx) => {
  // 这里
  const results = await prisma.user.findMany();
  ctx.body = results;
});
```

:::tip 
npx prisma generate, 这个命令会读取Prisma Schema文件（通常位于prisma/schema.prisma），并生成相应的客户端代码，这些代码会被放置在node_modules/.prisma/client目录下。当Prisma Schema发生变化 或者 数据库表结构有变化时，需要重新生成Prisma Client(既重新执行 npx prisma generate)以确保代码的更新。
:::
