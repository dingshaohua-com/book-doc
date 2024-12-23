---
sidebar_position: 1
---

# 事件循环
<!-- JS是一门单线程的语言，意味着同一时间内只能做一件事，但是这并不意味着单线程就是阻塞，而实现单线程非阻塞的方法就是事件循环。

JS代码是自上向下执行的，在主线程中立即执行的就是同步任务，比如简单的逻辑操作及函数，


在JavaScript中，所有的任务都可以分为 -->
单线程语言是指在执行过程中只有一个线程在工作，代码按照顺序逐行执行的编程语言，这意味着同一时间内只能做一件事，像JS、Python、Lua等都是单线程语言。 

为什么要这么设计：JS这门语言主要是用来实现用户和浏览器网页的交互，这个过程涉及到对DOM节点的操作，如果JS支持多线程，一个在节点上添加内容，一个要对这个dom节点进行删除，到底是以哪个为准？所以这就是为什么JS从一出现就秉承着单线程的运行机制。

可单线程语言最大的问题就是怕耗时过长的任务阻塞后续代码执行，如果说耗时长是因为计算量大、CPU一直忙着计算的话倒也还好，可事实是——大部分时间浪费在了网络请求数据上，还有其他的如网络请求、文件读写、定时器等。


好在虽然JS这门语言本身是单线程语言，但是浏览器自身却实是多线程的，执行JS代码的为JavaScript引擎线程（也成为主线程 或 执行栈）、渲染页面的叫做渲染线程、还有网络请求线程、定时触发器线程、浏览器事件线程等等。  
JS的异步正是利用了浏览器的多线程来为其服务的：比如JS代码中遇到了耗时较长的任务 如网络请求，浏览器会将请求这个操作给交给一个专门的网络请求线程去处理，当请求完成时，网络请求线程会将对应的（如果有的话）回调函数推入到任务队列中。
JS主线程上的代码都执行完成后，浏览器将会去异步任务队列中拿取任务推入主线程执行。

如上通过JS提出了同步任务和异步任务的概念来解决这些问题，这就很好的解决了 单线程的弊端问题。

:::tip 事件循环是个人吗，会休息吗？
浏览器主线程里执行栈都执行完成了，同时异步线程还在执行中，尚未推进任务队列中。
此时 `事件循环er`（是一段浏览器底层实现的方法 可能是C语言写的） 会处于休眠等待任务中   
当异步线程执行完毕，推入到任务队列的时候，此时`事件循环er`将被唤醒，继续从同步到异步队列的一套手段按部就班执行
:::







## 同步
是指浏览器执行JS代码会从上到下的按照顺序逐行执行。  
同步操作是阻塞的，即一个同步操作在执行完成之前会阻止后续的代码执行。   
好在单线程代码写起来简单，逻辑清晰。在JS中，大多数代码都是同步的，除了一些特定的异步API。
```js
function synchronousTask() {
    console.log('开始同步任务');
    for (let i = 0; i < 3000000000; i++) {} // 空循环，模拟耗时操作
    console.log('同步任务结束');
}
console.log('开始');
synchronousTask(); // 调用同步任务
console.log('结束'); // 只有在同步任务完成后才会执行
```

## 异步
异步主要是在一些需要等待操作结果的复杂操作中，比如网络请求、文件读写等。   
这些操作需要等待一定时间才能获取结果，如果使用同步代码来实现，就会导致代码的执行被阻塞。   
一些特定的异步API 才会触发异步操作。  


```js showLineNumbers
console.log(1);
fetch('http://jsonplaceholder.typicode.com/posts').then((res)=> {console.log(2);})
console.log(3);
```

如上代码的执行逻辑是：
* 第1步：将第1行代码`console.log(1)`推入JS主线程（也叫做执行栈）执行
* 第2步：浏览器执行2行，遇到fetch的调用，被识别为异步操作，
      浏览器会将这个网络请求的任务交给一个专门的网络请求线程去处理。
      等请求完成后将fetch的回调推入异步**任务队列**中
* 第3步：将第1行代码`console.log(3)`推入JS主线程执行
* 此时所有的同步任务执行完毕，浏览器开始执行异步任务，开始去遍历异步任务队列里的任务。发现里边有一条异步任务代码（fetch的那个自定义的回调），开始推到主线程执行，`console.log(2)` 


### 宏任务队列与微任务队列
为了满足实际开发的需要，JS将异步任务队列的两种分类 宏任务任务队列与微任务任务队列。   
它们的核心区别就在于 执行顺序优先级问题，微任务的优先级要大于宏任务。  
![](https://img.dingshaohua.com/book-fe/202406250137.jpg)


微任务主要有：Promise.then，process.nextTick等
宏任务主要有：异步Ajax请求，定时器，文件操作，用户交互事件等。

```js
console.log(1); // step 1: 同步执行
setTimeout(() => {
    console.log(2); // step 4: 异步宏任务执行
})
new Promise(resolve => {
    console.log(3); // step 2: 同步执行
    resolve()
}).then(res => {
    console.log(4); // step 4: 异步微任务执行
})
console.log(5); // step 3: 同步执行
```


只要微任务队列不空，宏任务队列永远不会被推送到主线程去执行。   
以下代码大概意思是：当微任务任务队列的任务完成时，又向微任务任务队列加了一条，根本没给宏任务队列执行的机会
```js showLineNumbers
setTimeout(() => {
    console.log(1); // step 3: 异步宏任务执行
})
new Promise(resolve => resolve()).then(res => {
    console.log(2); // step 1: 异步微任务执行
    new Promise(resolve => resolve()).then(res => {
        console.log(3); // step 2: 异步微任务执行
    })
})
```

**先进先出**    
任务队列（无论是宏还是微），是一个先进先出（FIFO）的数据结构。  
![](https://img.dingshaohua.com/book-fe/202406250138.webp)

```js
setTimeout(() => {
    console.log(1); // step 2: 这个则慢一些
}, 2000)
setTimeout(() => {
    console.log(2); // step 1: 这个异步线程线先执行完，其回调先推入任务队列中
}, 1000)
```

<!-- https://www.cxyxiaowu.com/2071.html -->
<!-- https://www.cnblogs.com/luzeyu/p/17860700.html -->