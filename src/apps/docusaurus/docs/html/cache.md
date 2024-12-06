---
sidebar_position: 3
---
# 缓存
**什么是web缓存**
用户客户端访问服务器上的资源，为提高相应速度优化用户体验，将请求过的资源在某一处存储下来，下次使用将不在重复去源处拿取的策略。

**为什么要用web缓存？**   
减少网络带宽消耗：从缓存服务器或者本地读取资源，可以更好地节省带宽流量   
优化用户体验：就近‘取材’，使得浏览器能够更快的响应用户内容，加快页面打开速度   
降低服务器压力：降低减少访问源服务器次数，减轻服务器业务处理逻辑及访问数据库等压力

**缓存分类**   
根据缓存的位置分为客户端（浏览器）缓存 和 服务端（服务器）缓存。   
客户端缓存指的是浏览器缓存, 浏览器缓存是最快的缓存, 因为它直接从本地获取(但有可能需要发送一个请求), 它的优势是可以减少网络流量, 加快请求速度。   
服务器缓存指的是反向代理服务器（nginx）或 cdn 缓存, 他的作用是用于减轻实际的 web server 的压力.



## 浏览器缓存
**缓存原理**   
一般都是指http缓存，既浏览器将用户请求过的静态资源，存储到电脑本地磁盘中。   
当浏览器再次访问时，就可以直接从本地加载了，不需要再去服务端请求了。
![](https://img.dingshaohua.com/book-fe/2024623143920.webp)

**缓存到底存在哪呢**   
按缓存位置分类我们可以分为memory cache（内存）、disk cache（硬盘）。     
缓存策略以及缓存/读取/失效的动作都是由浏览器内部判断进行的，我们只能设置响应头的某些字段来告诉浏览器，而不能自己操作。

**缓存规则**   
通过控制响应头相关字段，来控制（是否）缓存的目的。   
根据表现可以分为 强制缓存和协商缓存两种模式。   

### 强制缓存
强缓存主要使用 Expires、Cache-Control 两个头字段，两者同时存在 Cache-Control 优先级更高。当命中强缓存的时候，客户端不会再求，直接从缓存中读取内容，并返回HTTP状态码200。


**Expires**   
用于设置缓存有效期时间点，      
进行某个资源http请求的时候，先用本地的时间与这个有效期时间点比较，   
如果已经过了该时间点，则重新向服务器请求，否则从本地缓存文件中读取。
```js
res.setHeader('Expires', new Date('2024-06-30').toUTCString());
```


**Cache-Control**   
用于设置缓存有效期时间段，
如下，没间隔10s就会重新向服务器真发起一次请求，其余时间段内走缓存。
```js
res.setHeader('Cache-Control','max-age=10');
```
缺点：缓存过期以后，服务器不管文件有没有变化会再次请求服务器。缓存过期时间是一个具体的时间，这个时间依赖于客户端的时间，如果时间不准确或者被改动缓存也会随之受到影响。

### 协商缓存
向服务器发送请求，服务端需要根据这个请求的request header的以下两组参数来判断是否命中协商缓存，   
如果命中，则返回304状态码并带上新的response header通知浏览器从缓存中读取资源；

协商缓存主要有两组字段，`If-Modified-Since 和 Last-Modified` ，`Etag 和 If-None-Match` ，当同时存在的时候会以后者为主。


**If-Modified-Since 和 Last-Modified** 
对比文件修改时间   

当客户端第一次请求服务器的时候，服务端需要在响应头返回一个时间字段Last-Modified，标记此文件的最后修改时间。   
客户端下次的请求需要将这个时间放在请求头的If-Modified-Since字段里。

服务器收到这个字段和之前的Last-Modified做对比, 若不同,则说明资源更新过，给出200响应并更新Last-Modified。   
否则如果资源没有更新给出304响应, 浏览器遍继续使用上一次缓存的资源。

```js
import fs from 'fs'
import { createServer } from "http";

const httpServer = createServer((req, res) => { // 创建一个http服务
    if (req.url === '/img/1') {
        let mtimeMs = fs.statSync('./1.png').mtimeMs; // node fs获取文件的最后修改时间，单位毫秒
        mtimeMs = Math.floor(mtimeMs / 1000) * 1000;    // 这种方式的精度是秒, 所以毫秒的部分忽略掉
        const If_Modified_Since = req.headers['if-modified-since'] || null; // 获取头部的if-modified-since字段
        let oldTime = 0; // 记录上次文件修改时间
        if (If_Modified_Since) { oldTime = new Date(If_Modified_Since).getTime();} // 如果有上次，那前端必定会携带而来的
        if (oldTime !== mtimeMs) { // 做对比
            res.writeHead(200, {
                'Cache-Control': 'no-cache',
                'Last-Modified': new Date(mtimeMs).toGMTString()
            });
            res.end(fs.readFileSync('./1.png'));
        } else {
            res.writeHead(304);
            res.end();
        }
    }
});
httpServer.listen(4000, () => { console.log('服务已经启动： http://localhost:4000'); }); // 启动http服务
```
缺点：如果在同一秒既修改了文件又获取文件，客户端是获取不到最新文件的

**Etag 和 If-None-Match**   
对比文件本身变化

当客户端第一次请求服务器的时候，服务端需要在响应头返回一个时间字段Etag，Etag是基于文件内容生成的，文件的任何变动都会导致Etag改变。   
客户端下次的请求需要将这个时间放在请求头的If-None-Match字段里。

服务器收到这个字段和之前的Etag做对比, 若不同,则说明资源更新过，给出200响应并更新Etag。   
否则如果资源没有更新给出304响应, 浏览器遍继续使用上一次缓存的资源。

```js
import fs from 'fs'
import { createServer } from "http";

const httpServer = createServer((req, res) => { // 创建一个http服务
    if (req.url === '/img/1') {
        const fileBuffer = fs.readFileSync("./1.png");
        let ifNoneMatch = null;
        if (request.headers['if-none-match']) { ifNoneMatch = request.headers['if-none-match']; }

        const hash = crypto.createHash('md5').update(fileBuffer);
        const etag = `"${hash.digest('hex')}"`;
        if (ifNoneMatch === etag) { // 新旧hash对比
            response.writeHead(304);
            response.end();
        } else {
            response.writeHead(200, {
                'Cache-Control': 'no-cache',
                'etag': etag
            });
            response.end(fs.readFileSync('./1.png'));
        }

    }
});
httpServer.listen(4000, () => { console.log('服务已经启动： http://localhost:4000'); }); // 启动http服务
```


### 前端自己控制缓存   
引入了缓存固然是好事，能大大提升响应速度以及减轻服务端的压力，但是也会出现一些问题，比如我们明明更新了系统版本，为什么客户端看到的还是老文件。   
通过人工自己修改文件名或者在文件名后带上版本号、时间戳，这样客户端就会当新文件请求并使用，便不会再受以上的任何缓存策略的影响。   
现在的构建阶段基本上都不需要人工操作了，都是使用构建工具比如Wbpack、babel等构建工具自动构建，根据文件名或文件内容自动计算hash值来给文件命名。   