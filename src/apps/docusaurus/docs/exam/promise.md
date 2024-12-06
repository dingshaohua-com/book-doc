---
sidebar_position: 1
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Promise
Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。

## Promise的状态

### 三种状态
Promise有三种状态

**进行中**  
Promise一旦被实例化，他便拥有了 pending （进行中）状态
```js
const p = new Promise(()=>{}); // 构造要求：必须传入一个方法
console.log(p); // Promise {<pending>}
```
如果你不去动它，它将永远处于pending。修改状态只能通过调用：【创建实例时 传入的函数内部里两个函数形参】来完成。

**成功**   
为了方便演示Promise状态从pending改为fulfilled，我这里特地用了延时（接口的promise不就这样吗 需要等一会才有结果）。后边失败的例子就不再这样了
```js
const p = new Promise((resolve)=>{
    setTimeout(()=>{
        resolve('hello'); // 成功
    },1000)
});

console.log(p); // Promise {<pending>}
setTimeout(()=>{
    console.log(p); // Promise {<fulfilled>: 'hello'} 
},2000)
```

**失败**   
导致失败的 会有两种情况，使用reject或发生错误
```js
const p = new Promise((_, reject)=>{
    reject('my err');
});

console.log(p); // Promise {<rejected>: 'my err'} 
```

```js
const p = new Promise((_, reject)=>{
    throw Error('my err')
});

console.log(p); // Promise {<rejected>: Error: my err
```

### 状态唯一性
Promise 的状态一经改变就不能再改变，也就是说一个Promise实例执行后只有一个状态，要么是resolve， 要么是reject 。resolve或reject后遇到reject或resolve会忽略该代码不执行。但是其他代码仍然会执行。
```js
// 打印：123 456 then:success1
const p = new Promise((resolve, reject) => {
    resolve("success1");
    console.log('123');
    reject("error");
    console.log('456');
    resolve("success2");
});

p.then(res => {
    console.log("then:", res);
}).catch(err => {
    console.log("catch:", err);
})
```

Promise 的 .then 或者 .catch 可以被调用多次, 但如果Promise内部的状态一经改变，并且有了一个值，那么后续每次调用.then或者.catch的时候都会直接拿到该值，而不会重新执行构造里的函数
```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('被执行')
    resolve('success')
  }, 1000)
})

p.then(res => {
  console.log(res)
})
p.then(res => {
  console.log(res)
})
// 打印如下
// 被执行
// success
// success
```


## 实例方法 then
then是Promise实例上的一个方法，通过调用它并传入回调，可以获得`Promise实例/对象`的结果，可以传入两个函数，分别处理成功和失败的回调。
```js
const p = new Promise((resolve)=>{
   resolve('hello');
});
p.then(res=>{console.log(res)}) // hello
```

```js
const p = new Promise((_, reject)=>{
    reject('my err'); 
});
p.then(null,(res)=>{
    console.log(res); // my err
})
```

### 执行条件
then方法即便你调用了，它本身内部代码也不会立即执行，而是要符合一些条件才能执行：
1. 需要等待其promise必须做出响应才会执行。   
```js
const p = new Promise((resolve)=>{
    setTimeout(()=>{
        resolve('hello'); 
    }, 1000)
});
p.then((res)=>{
    console.log(res); // hello
})

```

2. 另外即便promise响应了，它也不会立刻执行，因为它是异步执行，还需要等待主线同步代码完成之后才会去执行。
```js
const p = new Promise((resolve)=>{
    resolve('hello'); 
});
// 需要等待同步的循环完事之后，才能执行then内部的代码（包含这个传入的回调）
p.then((res)=>{ 
    console.log(res); // hello
})
for (let i = 0; i < 3000000000; i++) {}
```



### 返回值

**结论：then方法一定会返回一个新Promise对象**

then方法一旦被调用，就会立刻返回状态为pending一个新的`Promise对象`。
```js
const p = new Promise((resolve)=>{
    resolve('hello')
});
const pt = p.then(); // 返回一个promise给pt
console.log(pt); // Promise {<pending>}
```

如上，你没有给then传入回调函数，then内部 会等待上一个Promise（p）的状态结果 用来修改此次Promise（pt）的状态
```js
...

setTimeout(() => {
    console.log(pt); // pt状态值设置成p的最终状态值：{<fulfilled>: 'hello'}
    // 但是两者不是同一个对象（证明 then方法返回`新的Promise`）
    console.log(pt === p);  // false
})
```
:::tip 提示
`then`方法内部的执行不是同步的，也就是说 它的修改pt状态的操作 不是同步执行的，  
所以利用事件循环机制，通过定时器才能拿到pt的最终的状态。
:::


如果你调用then的时候传入了参数（回调函数），则会以你此回调函数的返回值 来决定then方法的返回值：如果你返回值不是一个新的Promise对象，则then会帮你包装成新的Promise对象（若你什么都不返回 也不会被视为默认返回了undefined）。 如果返回的是新的Promise对象 则then直接返回这个对象。
```js
const p = new Promise((resolve)=>{
    resolve('hello'); 
});
const pt = p.then(res=>{
    return res+',my friend!'
});

setTimeout(()=>{
    console.log(pt); // Promise {<fulfilled>: 'hello,my friend!'}
})
```

```js
const p = new Promise((resolve)=>{
    resolve('hello'); 
});
const pt = p.then(res=>{
    return new Promise((r)=>{ r('hi')});
});
setTimeout(()=>{
    console.log(pt); // Promise {<fulfilled>: 'hi'}
})
```

### 链式调用
通过上边我们可以得知，pt必定是一个promise，那我们依然可以用then来获得结果，所以我们可以在来一个then来获取最新pt这个promise的结果
```js
const p = new Promise((resolve)=>{
    resolve('hello'); 
});
const pt = p.then();
pt.then(res=>{
    console.log(res); // hello
})
```

再来个例子，顺便简写一下
```js
const p = new Promise((resolve)=>{
    resolve('hello'); 
});
p.then(res=>{
    return res+',my friend!'
}).then(res=>{
    console.log(res); // hello,my friend!
})
```

这就是链式调用。

当然链式调用的更大意义在于异步操作时候的嵌套地狱，而非上边简单例子-是体现不到它优越性的。比方说我有一些系统内置的接口，通过回调的形式获取结果（这也是早期处理异步的古老方案）
```js
// 系统提供 不可修改 只能使用
const api = {
    getTeachers(fn) { // 获取教师列表
        setTimeout(() => {
            fn([{ id: 20240101, name: '丁老师' }, { id: 20240102, name: '王老师' }])
        }, 2000)
    },
    getTeacher(id, fn) { // 根据教师id，获取教师详情
        const teacherDtl = {
            20240101: {
                name: '丁老师',
                age: 30,
                sex: 'boy',
                classId: 1
            },
            20240102: {
                name: '王老师',
                age: 30,
                sex: 'boy',
                classId: 2
            }
        }

        setTimeout(() => {
            fn(teacherDtl[id])
        }, 1000)
    },
    getClassInfo(id, fn) { // 根据班级id，获取班级详情
        const classDtl = {
            1: {
                name: '一(2)班',
                studentsNymber: 48,
                leave: '尖子班'
            }
        }

        setTimeout(() => {
            fn(classDtl[id])
        }, 1000)
    }
}
```

前端js怎么去利用这些api获取数据呢？--比方说获取老师列表中 排列在第1个老师的名下的班级信息
```js
api.getTeachers((teachers)=>{
    api.getTeacher(teachers[0].id,(teacher)=>{
        api.getClassInfo(teacher.classId,(classInfo)=>{
            console.log(classInfo);
        })
    })
})
```

看到没有，这就是回调地狱   
![](https://img.dingshaohua.com/book-fe/202407121018.webp)


来使用promise通过链式调用来解决这个回调地狱问题。
```js
// 写个通用方法 将传统的回调函数式异步 改为新时代的promise形式
const transToPromise = (fn)=>{
    return (...params)=>{
        return new Promise((resolve)=>{
            fn(...params,(res)=>{
                resolve(res)
            })
        })
    }
}

// 将旧的api转为promise形式
const newApi = {}
for (const key in api) {
    const fn = api[key];
    newApi[key] = transToPromise(fn)
}

// 开始表演
newApi.getTeachers().then(teachers=>{
    return newApi.getTeacher(teachers[0].id)
}).then(teacher=>{
    return newApi.getClassInfo(teacher.classId)
}).then(classInfo=>{
    console.log(classInfo);
})
```


## 实例方法 catch
catch也属于promise实例方法, 用来处理promise的状态为失败（错误或着拒绝）的情况。

如下代码 则会报错
```js
const p = new Promise((_, reject) => {
   // 浏览器抛出错误消息：Uncaught (in promise) my err 
   // 即在Promise链中未被捕获的错误
   reject('my err') 
});
```

解决办法有两种，要么通过then的第二个参数（错误回调）去处理，要么通过catch方法去捕获。若同时存在，以前边的为准，catch将不会再被执行。
```js
const p = new Promise((_, reject) => {
    reject('my err')
});
p.then(null,(err)=>{
    console.log(err); // my err
})
```

```js
const p = new Promise((_, reject) => {
    reject('my err')
});
p.catch(err => {
    console.log(err); // my err
})
```

### 返回值
catch会返回一个新的promise对象，且同then的表现一样
```js
const p = new Promise((_, reject) => {
    reject('my err')
});
const pc = p.catch(err => {
    console.log(err); // my err
    return '我拨乱反正了'
})
console.log(pc); // Promise {<pending>}
setTimeout(()=>{
    console.log(pc); // Promise {<fulfilled>: '我拨乱反正了'}
},1000)
```
另一种处理异常的方式 `p.then(null,(err)=>{return '我拨乱反正了'})`的表现 和它一样，不多做介绍。

## 实例方法 finally
finally 方法用来指定在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行的回调函数。

此方法的回调函数不接受任何参数。这表明，finally方法里面的操作，应该是与Promise状态无关的。无论 Promise 的状态如何，其回调都会被执行。它主要用于清理和最终处理逻辑，而不关心 Promise 的解决结果或拒绝原因。

```js
// 会打印 1，执行完成，最后抛出异常Uncaught (in promise) Error:2
new Promise(resolve => {
    resolve()
}).then(res => {
    console.log(1);
}).then(res => { // 因为这里发生异常，后边的链就断掉了 但是finally还会继续执行
    throw Error(2)
}).then(res => {
    console.log(3);
}).finally(()=>{
    console.log('执行完成');
})
```

使用场景：比如 对用户的增删改查的弹窗 无论成功与否 都要关闭弹窗。

### 链式

综上，它也可以用在链式上（因为链式上的每一环都属于一个新promise对象）。  比方如下代码，打印输出1之后 就报异常 从而中断后方执行了 
```js
// 会打印 1 ,然后抛出异常Uncaught (in promise) Error
new Promise(resolve => {
    resolve()
}).then(res=>{
    console.log(1);
}).then(res=>{ // 因为这里发生异常，后边的链就断掉了
    throw Error(2)
}).then(res=>{
    console.log(3);
}).then(res=>{
    console.log(4);
})
```


如果我想 把1打出来就行，异常就不用报了---你可以将catch放到结尾 这样它就捕获遇到的首个异常 并不在报错，不过后续的链也不会再执行了。
```js
// 会打印 1 Error:2
new Promise(resolve => {
    resolve()
}).then(res=>{
    console.log(1);
}).then(res=>{
    throw Error(2)
}).then(res=>{
    console.log(3);
}).then(res=>{
    console.log(4);
}).catch(e=>{
    console.log(e);
})
```


我想让 除了错误本身外，错误的前后都打印出来怎么办---用上边提到的捕获promise异常的两种办法
```js
// 会打印 1 Error:2 3 4
new Promise(resolve => {
    resolve()
}).then(res=>{
    console.log(1);
}).then(res=>{
    throw Error(2)
}).catch(e=>{
    console.log(e);
}).then(res=>{
    console.log(3);
}).then(res=>{
    console.log(4);
})
```

```js
// 会打印 1 4
new Promise(resolve => {
    resolve()
}).then(res=>{
    console.log(1);
}).then(res=>{
    throw Error(2)
}).then(res=>{
    console.log(3);
},()=>{}).then(res=>{
    console.log(4);
})
```

也就是说 当任务失败的时候，你需要处理这个异常，否则就会变成了错误，阻止 then链后续的执行。

## 静态方法 all
接收一组Promise，返回一个Prmose对象。   
等内部Promise全部处理完成，才执行then里的回调 并将结果按照顺序放入回调的形参里。   

如果Promise数组里有一个是rejected状态，则会停止执行，除非你定义了rejected回调或紧邻其后的catch。


我有一个接口定义如下
```js
// 提供的promise类型的异步接口
const api = {
    getTeacher(id) { // 根据教师id，获取教师详情
        const teacherDtl = {
            20240101: {
                name: '丁老师',
                age: 30,
                sex: 'boy',
                classId: 1
            },
            20240102: {
                name: '王老师',
                age: 30,
                sex: 'boy',
                classId: 2
            }
        }

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(teacherDtl[id])
            }, 1000)
        })
    },
}
``` 


比如放说："我要获取id为20240101和 20240102两个用户信息 并展示出来"。 我应该怎么做呢？

这是最简单的办法。
```js
const allInfo = [];
api.getTeacher(20240101).then(one=>{
    api.getTeacher(20240102).then(two=>{
        allInfo.push(one, two)
        console.log('全部获取完毕：',allInfo);
    })
})
```

显然这不是最好的办法，因为花费的时间是双倍的，因此我们可以封装一个方法来使用
```js
const promiseAll = (promises)=>{
    const finalRes = [];
    return new Promise(resove=>{
        promises.forEach((promise,index) => {
            promise.then(res=>{
                finalRes[index] = res;
                if(finalRes.filter(item=>item).length===promises.length){
                    resove(finalRes)
                }
            })
        });
    })
}

const promises = [api.getTeacher(20240101), api.getTeacher(20240102)]
promiseAll(promises).then(res=>{
    console.log('全部获取完毕：',res);
})
```

显然是极其好用的，不过 就是代码量多了，好在promise为我们封装好了 我们可以直接用
```js
const promises = [api.getTeacher(20240101), api.getTeacher(20240102)]
Promise.all(promises).then(res=>{
    console.log(res);
})
```


**存在的问题**   
Promise.all存在一个弊端，只要请求过程中某一个出现错误了，那全部都会挂掉。
如下代码，浏览器会什么都没有输出，并报一个错误：Uncaught (in promise) 失败了
```js
const getP = (type) => {
    return new Promise((resolve, reject) => {
        type ? resolve('成功啦') : reject('失败了')
    })
}

const promises = [getP(true), getP(false), getP(true)]
Promise.all(promises).then(res => {
    console.log(res);
})
```

这是为什么呢？ 参考上边咱们自己实现的promiseAll，同一个道理，所以我们可以优化一下我们自定义的这个方法，失败了也继续处理，如上调用以下方法，则不会报错，而是会正常输出结果： ['成功啦', '失败了', '成功啦']
```js
const promiseAll = (promises) => {
    const finalRes = [];
    return new Promise((resove, reject) => {
        promises.forEach((promise, index) => {
            promise.then(res => {
                finalRes[index] = res;
                if (finalRes.filter(item => item).length === promises.length) {
                    resove(finalRes)
                }
            }, (err) => {
                finalRes[index] = err;
                if (finalRes.filter(item => item).length === promises.length) {
                    resove(finalRes)
                }
            })
        });
    })
}
```

那要是我就想用Promise.all，且还想处理这个问题呢？ 你可以这么做
```js
const promises = [getP(true), getP(false), getP(true)]
const newPromises = promises.map(promise=>promise.catch(e=>Promise.resolve(e)))
Promise.all(newPromises).then(res => {
    console.log(res);
})
```


## 静态方法 any
接收一个promise的数组作为参数，返回一个promise对象。  
只要其中有一个Promise成功执行，就会将Promise对象状态改为成功fulfilled。 
```js
const getP = (type, params) => {
    return new Promise((resolve, reject) => {
        type ? resolve('成功啦:'+params) : reject('失败了:'+params)
    })
}

const promises = [getP(false, 1), getP(true,2), getP(true,3)]
Promise.any(promises).then(res => {
    console.log(res); // 成功啦:2
})
``` 

如果全部错误，会抛出一个异常 Uncaught (in promise)  AggregateError: All promises were rejected（所有的promise结果全部失败，并且没有程序捕获这个异常 所以抛出此错误）
```js
const promises = [getP(false, 1), getP(false,2), getP(false,3)]
Promise.any(promises).then(res => {
    //  Uncaught (in promise)  AggregateError: All promises were rejected
    console.log(res); 
})
```

应用场景：来自世界各地的用户访问网站，如果你有多台服务器，则尽量使用响应速度最快的服务器，在这种情况下，可以使用 Promise.any() 方法从最快的服务器接收响应。


## 静态方法 race
接收一个promise对象的数组，当任何一个promise的状态先确定（拒绝或者成功），则会执行.race中的回调函数
```js
const promises = [getP(true, 1), getP(true,2), getP(false,3)]
Promise.race(promises).then(res => {
    console.log(res); // 成功啦:1
})
```

```js
 const promises = [getPromise(false, 1), getPromise(true,2), getPromise(false,3)]
Promise.race(promises).then(res => {
    console.log(res); // Uncaught (in promise) 失败了:1
})
```


## 静态方法 allSettled
同 [all](#静态方法-all)一样，唯一不同的是如果中途有rejected也不会终止 而是作为fulfilled状态将其返回（不过会帮你组装一下数据 加入了 status、value、reason）。
```js
const promises = [getP(true, 1), getP(false,2), getP(true,3)]
Promise.allSettled(promises).then(res => {
    console.log(res); 
    //打印  [{ "status": "fulfilled", "value": "成功啦:1" },
    //     { "status": "rejected", "reason": "失败了:2" },
    //     { "status": "fulfilled", "value": "成功啦:3" }]
})
```



## Promise 总结
* 实例方法then 、 catch 、 finally 和静态方法 all、allSettled、any、race等都会返回一个新 promise（返回任意非 promise 的值都会被包裹成 promise 对象）， 所以可以链式调用。 另外如果静态这几个方法数组元素如果不是promise则直接作为一个fulfilled的promise返回
* Promise 的状态一经改变就不能再改变，拥有唯一确定性。
* catch 可以捕捉上层错误，但是对下层错误是捕捉不到的。
* 想要promise的状态为失败，只能通过reject或者throw new Error
* Promise解决的一直都是回调嵌套地狱的问题，从来没有说干掉回调一说，如果一点（哪怕是链式）回调都不想用， 接下来我们学习async/await




## async/await
async/await就是解决promise链式回调可读性和美观性差的问题，其本质是promise的语法糖。   

对于**串性请求**，推荐用它，可以达到伪同步的编码感觉。我们仍然拿上边的例子做对比，我们来对[promise的链式调用](#链式调用)进行一个优化。

会议一下，这是原来的写法promise的链式调用写法
```js
newApi.getTeachers().then(teachers=>{
    return newApi.getTeacher(teachers[0].id)
}).then(teacher=>{
    return newApi.getClassInfo(teacher.classId)
}).then(classInfo=>{
    console.log(classInfo);
})
```

这是使用async/await写法
```js
const main = async () => {
    const teachers = await newApi.getTeachers();
    const teacheInfo = await newApi.getTeacher(teachers[0].id);
    const classInfo = await newApi.getClassInfo(teacheInfo.classId);
    console.log(classInfo);
}
```

也就输说 `const res = await promise` 等价于 `promise.then(res=>{//... })`

### 深入一点
async只能用于修饰函数，且返回值永远未promise对象。    
它有点像promise构造，会给你返回一个promise对象，promise的初始化状态和return的结果有关。   

你返回基本数据，它会直接给你包装成一个状态为fulfilled的结果。
```js
const main = async () => 'hello'
const res = main();
console.log(res); // Promise {<fulfilled>: 'hello'}
```

你返回一个promise对象的时候，它会先给你返回一个为pengding的promise对象，后根据你函数内部手动返回的那个promise状态来同步此状态
```js
const p = new Promise((resolve) => {
    resolve('hello');
});
const main = async () => p;
const res = main();
console.log(res);
setTimeout(() => {
    console.log(res);
})
// 打印
// Promise {<pending>}
// Promise {<fulfilled>: 'hello'}
```

### 顶层await
最新的chrome已经支持 Top-level Await(顶级 await) 。
这就意味着 如果你想使用await 不必再用多余的async函数包裹。
```html
<script type="module">
    const p = new Promise((resolve) => {
        resolve('hello');
    });
    const res = await p;
    console.log(res);
</script>
```