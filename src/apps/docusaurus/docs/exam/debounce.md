---
sidebar_position: 1
---

# 防抖节流
防抖和节流都是前端开发中常用的性能优化技术，用于控制事件的触发频率，以提高性能和用户体验，常用在用户输入、滚动条滑动或提交表单等行为上。

## 防抖
如果下达该命令后，在n毫秒内再次下达该命令，则取消刚刚下达的命令，只执行新命令。   
对于`动作间的时间间隔小于n的`连续动作，以最后一次为准。


```jsx live
function Demo() {
    // 定义防抖
    const debouncing = (fn, wait)=>{
       let timer = null;
       return (...arg)=>{
            timer && clearTimeout(timer);
            timer = setTimeout(()=>fn.apply(this, arg),wait)
       }
    }
    // 测试
    const test = debouncing((arg)=>{alert(arg)},2000)
    return <button onClick={function(){test('你好')}}>测试防抖</button>
}
```

如上代码，点击按钮的时候你手抖了，按钮一直被点击，只要间隔小于2秒，就不会真的执行。   
什么时候你不抖了，也就是说不少于2秒了，才真的弹窗提示你。   





## 节流
节流，可以理解为节省流量。当一个请求被用户在短时间内不停点击时（用户频繁发送一个数据请求），   
为了减轻服务器压力，需要设定一个时间，使得在规定的这个时间内，无论用户请求了多少次，就当一次执行。   
例子：玩游戏回城按钮按多次等于按一次。


### 定时器实现
不会点了立刻执行弹窗或打印，因为fn在setTimeout内执行。
```jsx live
function Demo() {
    // 定义防抖
    const throttle = (fn, wait)=>{
       let timer = null;
       return function(...arg){
            if(!timer){
                timer = setTimeout(()=>{
                    timer = null;
                    fn.apply(this, arg)
                },wait)
            }
       }
    }
    // 测试
    const test = throttle((arg)=>{alert(arg)},2000)
    return <button onClick={function(){test('你好')}}>测试节流</button>
}
```

### 时间戳实现
第一次肯定会执行
```jsx live
function Demo() {
    // 定义防抖
    const throttle = (fn, wait)=>{
       let previous = 0;
       return (...arg)=>{
            if(Date.now()-previous>wait){
                previous = Date.now();
                fn.apply(this, arg)
            }
       }
    }
    // 测试
    const test = throttle((arg)=>{alert(arg)},2000)
    return <button onClick={function(){test('你好')}}>测试节流</button>
}
```