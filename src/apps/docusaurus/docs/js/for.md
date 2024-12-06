---
sidebar_position: 2
---

# 循环

## 普通for

```jsx
const array = ['你好', '世界'];
for (let index = 0; index < array.length; index++) {
    const element = array[index];
    console.log(element);
}
```

### 停止循环

continue、break使用来终止循环。
前者退出当前循环 进入下一轮循环，后者直接结束当前和后续的循环！

```jsx
const array = ['你好', '世界']
for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element === '你好') {
        break;
    }
    console.log(element);
}

// 使用break，将不会有任何打印
// 使用continue，则会打印 世界
```

除此之外，还可以利用外包函数返回false，来终结整个for循环的执行。

```jsx
const array = ['你好', '世界','哈哈'];
(() => {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element === '世界') {
            return false;
        }
        console.log(element);
        
    }
})()
// 打印 你好
```

## forEach

增强for

```jsx
const array = ['你好', '世界'];
array.forEach((element, index) => {
    console.log(element, index);
});
// 打印 你好 0，世界 1
```

### 停止循环

普通 for中退出循环有2种方式（ break，continue）对forEach均无效，会语法报错。

可使用return false，但是效果却和普通 for不同，而是相当于普通for中的continue。

```jsx
const array = ['你好', '世界', '哈哈'];
array.forEach(element => {
    if (element === '世界') {
        return false;
    }
    console.log(element);
})
```

如果想要彻底结束整个循环，可以抛出错误（此方法 可以应用到任何循环上）。

```jsx
const array = ['你好', '世界', '哈哈'];
array.forEach(element => {
    if (element === '世界') {
        throw Error('');  //这样循环就会被迫结束 
    };
    console.log(element);
})
```

### 副作用

```jsx
const array = ['你好', '世界', '哈哈'];
array.forEach(element => {
    if (element === '世界') {
        element = 'word'
    }
})
console.log(array );
// 打印 ['你好', '世界', '哈哈']
```

无副作用，不会修改原始数据。

## for of

普通循环的扩展，常用于遍历数组

```jsx
const array = ['你好', '世界', '哈哈'];
for (const i of array) {
    console.log(i);
}
// 输出 
// '你好'
// '世界'
// '哈哈'
```

### 停止循环

和普通for循环方式一样。

### 副作用

无副作用

```jsx
const array = ['你好', '世界', '哈哈'];
for (let i of array) {
    if (i === '世界') {
        i = 123
    }

}

// 输出 '你好', '世界', '哈哈'
console.log(array);
```

## for in

普通循环的扩展，常用于遍历对象

```jsx
const person = {
    name: '张三',
    age: 20
};
for (const i in person) {
    console.log(i, person[i]);
}

// 输出 
// name 张三
// age 20
```

停止循环方式也和普通for一样，也无副作用