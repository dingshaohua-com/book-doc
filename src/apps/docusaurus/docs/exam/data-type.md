---
sidebar_position: 1
---

# 判断类型
JS存在数据类型，虽然不像其它语言分类那么严谨。

## 完美的方式
```js
const i = 1;
const type = Object.prototype.toString.call(i);
console.log(type); //  [object Number]
console.log(type === '[object Number]');
```
不会繁育自定义类型


## typeof
typeof只能判断基本数据类型和function，判断复杂类型的则均返回object
```js
console.log(typeof 1); // number
console.log(typeof 'abc'); // string
```

## instanceof
检测某个对象是不是属于某个类的实例。  
弊端是通过原型链集成的也会返回true。
```js
console.log(1 instanceof Number); // false
console.log(new Number(1) instanceof Number); // true
console.log(new Number(1) instanceof Object); // true
```

## 通过构造函数获取
弊端是有的没构造函数 有的构造 可能被改过。
```js
console.log(new Number(1).constructor.name); // Number
```