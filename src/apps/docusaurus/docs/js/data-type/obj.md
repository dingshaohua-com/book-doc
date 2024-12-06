---
sidebar_position: 1
---

# 对象

## 删

```jsx
const obj = { name: '张三', age: 20 };
delete obj.age
console.log(obj); // 打印 { name: '张三'};
```

## 查询

Object.keys、Object.values查询对象的所有key和value

```jsx
const obj = { name: '张三', age: 20 };
console.log(Object.keys(obj)); // ['name', 'age']
console.log(Object.values(obj)); //  ['张三', 20]
```

Object.entries 将对象键值对 以数组的形式展示

```jsx
const obj = { name: '张三', age: 20 };
console.log(Object.entries(obj)); // [['name', '张三'] ['age', 20]]
```