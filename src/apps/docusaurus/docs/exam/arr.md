---
sidebar_position: 1
---

# 数组方法
数组是前端算法核心的基础部分，经常容易考：你知道数组有哪些常用方法吗，介绍一下？



## 考试题
### 能否手动实现map
```js
Array.prototype.mapp = function (fn) {
    const res = [];
    for (const it of this) {
        res.push(fn(it))
    }
    return res;
}

const arr = [3, 4, 1];
const newArr = arr.mapp(item => item+1)
console.log(newArr); // [4,5,2]
```