---
sidebar_position: 1
---

# 数组

## 增

### 尾部插入

push 向数组尾部添加一个元素，返回数组新的长度。

```jsx
const arr = ['你好', '世界'];
const res = arr.push('哈哈');
console.log(arr, res);
// ['你好', '世界', '哈哈'] 3
```

### 头部插入

unshift 向数组头部添加一个元素，返回数组新的长度。

```jsx
const arr = ['你好', '世界'];
const res = arr.unshift('哈哈');
console.log(arr, res); // ['哈哈', '你好', '世界'] 3
```

### 指定位置插入

splice 在指定位置做（增删改）操作，这里演示的是在指定位置添加的能力

```jsx
const arr = ['你好', '世界'];
const res = arr.splice(1,0,'哈哈','嘻嘻')
console.log(arr, res); // ['你好', '哈哈', '嘻嘻', '世界'] []

```

## 删除

### 尾部删除

pop 尾部删除一个元素，返回删除的那个元素

```jsx
const arr = ['你好', '世界','哈哈'];
const res = arr.pop();
console.log(arr, res); //  ['你好', '世界'] '哈哈'
```

### 头部删除

shift 头部删除一个元素，返回删除的那个元素

```jsx
const arr = ['你好', '世界','哈哈'];
const res = arr.splice(1,0)
console.log(arr, res); //  ['世界', '哈哈'] '你好'
```

### 指定位置删除

splice 在指定位置做（增删改）操作，这里演示的是在指定位置删除的能力，返回删除的那个元素

```jsx
const arr = ['你好', '世界','哈哈'];
const res = arr.splice(2,1); // 从第2个角标开始删除，删除1个长度  
console.log(arr, res);  // 打印 ['你好', '世界'] ['哈哈']
```

## 更改

splice 在指定位置做（增删改）操作，这里演示的是在指定位置更改的能力，返回被替换的那个元素

```jsx
const arr = ['你好', '世界', '哈哈'];
const res = arr.splice(1, 1, '中国'); // 从第1个角标开始删除，替换1个长度  
console.log(arr, res); // ['你好', '中国', '哈哈'] ['世界']
```

[index] 或者直接使用角标方式更改

```jsx
const arr = ['你好', '世界', '哈哈'];
arr[1] = '中国'; 
console.log(arr, res); // ['你好', '中国', '哈哈'] ['世界']
```

## 查询

[index] 或 arr.at(index)  查询指定角标元素

```jsx
const arr = ['你好', '世界', '哈哈'];
console.log(arr[0] , arr.at(1) ); //  你好 世界
```

find 与 findIndex 用于查询符合条件的元素，前者返回符合条件的元素本身，后者返回索引。

```jsx
const arr = [3, 2, 1, 6, 5];
const res = arr.find(item => { // 查找并返回满足特定条件的第一个元素
        return item>2
})
console.log(res); // 返回3 
```

```jsx
const arr = [3, 2, 1, 6, 5];
const res = arr.findIndex(item => { // 查找并返回满足特定条件的第一个元素的索引
        return item>2
})
console.log(res); // 返回0 
```

some与every，some查询是否满足条件，只要有一个满足则返回true，并立刻终止循环。every查询是否满足条件，只要有一个不满足则返回false，并立刻终止循环。

```jsx
const arr = [3, 2, 1, 6, 5];
const res = arr.some(item => {
    return item > 2
})
console.log('存在大于2的元素：'+res);
```

```jsx
const arr = [60, 59, 100, 70];
const res = arr.every(item => {
    return item > 59
})
console.log('大家都及格了：'+res);
```

## 生成

concat与解构（合并），均可以用来合并数组。

```jsx
const arr1 = ['你好'];
const arr2 = ['世界']
// 注意合并并无副作用，不会改变arr1和arr2的值
console.log(arr1.concat(arr2)); // 输出 ['你好', '世界']
console.log([...arr1,...arr2]); // 输出 ['你好', '世界']
```

map （映射）根据已存在的数组，创建一个新的数组。

```jsx
const students = [
    { name: '张三', age: 21 },
    { name: '李四', age: 16 },
    { name: '王五', age: 20 }
];
const res = students.map(item => {
    item['notChild'] = item.age > 18
    return item;
});
console.log(res);
```

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/959a3bfe-2edc-4dc6-a76f-e68d9a3928d6/1ffd984f-a90d-4644-ae46-892ad34a1c3b/Untitled.png)

filter（过滤） 将数组根据条件过滤，返回满足的数组

```jsx
const students = [
    { name: '张三', age: 21 },
    { name: '李四', age: 16 },
    { name: '王五', age: 20 }
];
const res = students.filter(item => {
    return item.age > 18;
});
console.log(res);
// 打印 
// [
//     { name: '张三', age: 21 },
//     { name: '王五', age: 20 }
// ];
```

sort （排序），返回排序后的新数组

```jsx
const students = [
    { name: '张三', age: 21 },
    { name: '李四', age: 16 },
    { name: '王五', age: 20 }
];
// 若 a 小于 b，则返回一个小于零的值，数组将按照升序排列。
// 若 a 等于 b，则返回 0，a b位置维持原样。
// 若 a 大于 b, 则返回一个大于零的值，数组将按照降序排列。
const res = students.sort((a,b) => {
    return a.age-b.age;
});
console.log(res);
// 打印 
// [
//     { name: '李四', age: 16 },
//     { name: '王五', age: 20 }
//     { name: '张三', age: 21 },
// ];
```

flat和flatMap（打平 降维），将多维数组铺开、扁平化处理，无副作用 不会改变原始数组

```jsx
const arr = [[1, 2], [3, 4], 5];
console.log(arr.flat()); //参数为展开的程度，默认为1， 打印[ 1, 2, 3, 4, 5 ]

const arr = [[1, 2], [3, 4, [4, 6]], 7];
// Infinity打平所有嵌套，打印[ 1, 2, 3, 4, 5,6,7 ]
console.log(arr.flat(Infinity)); 
```