---
sidebar_position: 1
---

# 闭包
## 定义

定义一个能够读写其它函数内部变量的函数，直观来看就是函数嵌套函数，这种情况下会形成闭包。

## 好处

### 封装私有变量

在Class之前，Js都是使用闭包来达到私有变量的效果。

```jsx
const people = (function () {
  let name = "张三";
  return {
    // name, // 不能定义变量，这将是深拷贝，并不会跟随上方再改变，要想获取最新的 只能用函数
    getName() {
      return name;
    },
    setName(val) {
      name = val; // 此处 触发而形成了闭包
    },
  };
})();

people.setName("李四");
console.log(people.getName()); // 李四
```

当然并非非得有返回值，还可以挂外部提供的变脸 或全局（jquery就是这样做的）

```jsx
(function () {
  let name = "张三";
  window.people= {
    getName() {
      return name;
    },
    setName(val) {
      name = val; // 此处 触发而形成了闭包
    },
  };
})();
people.setName("李四");
console.log(people.getName()); // 李四
```

### 延长变量生命周期

比如 计数器

```jsx
const counter = (() => {
  let i = 0;
  return () => {
    return ++i;
  };
})();
console.log(counter()); // 1
console.log(counter()); // 2
```

### 最好的例子

递归中应用到了 闭包的两大好处：
首先res是封装的私有变量，外部不能更改，只能通过函数返回获得。
其次 将res从handle提取出来，这样就保证了res的生命周期，即便hadle执行完，也不会被重置。

```jsx
// 根据树形结构组织架构找出年龄最大的
const findOlder = (tree) => {
  let res;
  const handle = () => {
    //  res = xxx;
  };
  handle(tree);
  return res;
};
const res = findOlder({});
```