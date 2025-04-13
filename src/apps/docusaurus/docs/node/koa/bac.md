---
sidebar_position: 8
---

# 越权访问

‌Broken Access Control（BAC）‌，即越权访问，它是Web应用程序中一种常见的漏洞，存在范围广、危害大的特性。

## 举个例子
比如说，我有4个表：doc（文档） 隶属于 book（书籍），book 隶属于shelf（书架），而shelf 表才跟 user（用户）有关联。

登录用户，访问 类似于  https://xxx.com/book?book_id=1&doc_id=2 查看自己的文档。  
但是用户如果不小心输入不属于自己的 book_id和doc_id而越权访问或编辑其他人的文件改如何应对？

当然我们可以在每次 crud 的时候都去多联表查询，也麻烦。   
能不能写一个中间件来统一鉴权？


## 封装一个中间件

### 封装一个service
将检验的核心逻辑封起来，作为一个 service 或 util都可以
```js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const docBelongUser = async (docId: number, userId: number) => {
    const doc = await prisma.doc.findFirst({
        where: {
            id: docId,
            book: {
                shelf: {
                    user_id: userId
                },
            },
        },
        select: { id: true },
    })
    if (!doc) {
        const err: any = new Error('权限不足或资源不存在')
        err.status = 403
        throw err
    }
}
export default docBelongUser;
```

### 封装一个middleware
```js
import docBelongUser from '../utils/doc-belong-user.ts'

const checkDocOwnership = async (ctx, next) => {
    const userId = Number(ctx.state.user.id)
    const docId = Number(ctx.query.id)
    try {
        await docBelongUser(docId, userId)
        await next()
    } catch (e) {
        ctx.status = e.status;
        ctx.body = {
            msg: e.message
        }
    }
}
export default checkDocOwnership;
```

## 使用此中间件
```js
const router = new Router({ prefix: '/doc' });
router.get('/',checkDocOwnership, async (ctx) => {
 // todo：查询并返回
});
```

如果越权访问的，将直接返回错误的 403 http 请求，且内容为 `{mag: "权限不足或资源不存在"}`

