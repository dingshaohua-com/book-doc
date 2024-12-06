---
sidebar_position: 10
---

# 其他

## 箭头函数  
xxx

## 事件循环
指的是JS代码的执行过程。主要突出了在单线程的背景下，利用异步来处理多任务的过程。

## 从输入URL开始
xxx


## 防抖节流
xxx


## 引用类型的操作

### 数组

增加

开头和结尾插入

```jsx
push() // 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
unshift() // 方法可向数组的开头添加一个或更多元素，并返回新的长度。
```

中间插入

```jsx
arr.splice(array.length,0,6,8,9);
```

## 互联网简史

注意：平时我们所说的互联网、因特网、万维网 它们并不是一回事。

**互联网：**泛指由通信设备（如计算机、手机等）组成的网络。

**因特网：**指由成千上万台设备组成的数据网络，属于互联网中的其中一种。

**万维网：**由不同的文档、多媒体文件连通而形成的逻辑网络；

## 发布订阅模式
发布订阅模式又叫观察者模式它是指对象之间一对多的依赖关系。两块代码之间可以通过此模式进行沟通，进而达到解耦效果！

下边是一个最简单的例子：

```jsx
class Pubsub{
    events = {};
    on(event, handler){ // 订阅者，注册到事件中心
        if(this.events[event]){
            this.events[event].push(handler)
        }else{
            this.events[event] = [handler]
        }
    };
    emit(event, arg){ //发布者，触发
        if(this.events[event]){
            this.events[event].forEach(handler => {
                handler(arg)
            });
        }else{
            throw Error('抱歉，事件中心没有找到'+event+', 无法为你触发！')
        }
        
    };
}

const pubsub = new Pubsub();
pubsub.on('test',(msg)=>{
    console.log('我被触发啦，而且还接收到了参数:' +msg);
})
pubsub.emit('test','你好，世界')
```

有时候，我们还需要将注册到事件中心中的事件 移除，来 让我们完善它。

```jsx
class Pubsub {
    events = {};
    on(event, handler) { // 订阅者，注册到事件中心
        if (this.events[event]) {
            this.events[event].push(handler)
        } else {
            this.events[event] = [handler]
        }
    };
    off(event, handler) {  // 订阅者，从事件中心退订 
        if (this.events[event]) {
            this.events[event].forEach((h, index) => {
                if (handler === h) {
                    this.events[event].splice(index, 1)
                } else {
                    throw Error('抱歉，事件中心虽找到' + event + ', 但并无其回调函数！')
                }
            });
        } else {
            throw Error('抱歉，事件中心没有找到' + event + ', 无法为你退订！')
        }
    };
    emit(event, arg) { //发布者，触发
        if (this.events[event]) {
            this.events[event].forEach(handler => {
                handler(arg)
            });
        } else {
            throw Error('抱歉，事件中心没有找到' + event + ', 无法为你触发！')
        }

    };
}

const pubsub = new Pubsub();
const handler = (msg) => {
    console.log('我被触发啦，而且还接收到了参数:' + msg);
};
pubsub.on('test', handler)
pubsub.emit('test', '你好，世界')
pubsub.off('test', handler)
pubsub.emit('test', '你好，世界1')
```

当然，有很多三方库用起来也简单方便，这样我们就不用重复造轮子了，比如：[mitt](https://github.com/developit/mitt)