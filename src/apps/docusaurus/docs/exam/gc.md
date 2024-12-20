---
sidebar_position: 1
---

# 垃圾回收
Garbage Collection，在有些语言中 是不支持垃圾自动回收比如C++，但目前大部分语言都支持 比如Java，Python，Go，Js。

程序运行需要被加载到内存中然后再被CPU执行，在这个过程中 会产生很多垃圾，这些垃圾即程序不用了的内存空间。

将会被JS引擎内置的垃圾回收器，使用一些（确定是否垃圾的）策略自动将其回收，以释放内存空间。

垃圾回收就是内存管理的一种手段。

## 应用目标
由于基本类型的值直接存储在栈内存中，且其生命周期与变量相同，当变量离开其作用域时，其值（包括基本类型的值）也会随之销毁，因此不需要垃圾回收机制来处理。

而引用类型的值（即对象）存储在堆内存中，且其生命周期并不总是与引用它的变量相同。当变量不再引用某个对象时，该对象仍然可能存在于堆内存中，占用内存空间。此时，就需要垃圾回收机制来检测和回收这些不再被使用的对象所占用的内存空间。

## 垃圾回收策略

### 引用计数
引用计数是早先的一种垃圾回收算法。   
原理是设置一个引用数，判断当前对象的引用数是否是0，一旦为0则为垃圾，立即回收。
```js
function fn() {
  const obj = {};
  const obj2 = {};
};
fn(); 
// 函数执行完成后 会立销毁调内部定义的变量obj1和obj2这两个栈和对应的指针，
// 当前对象（即堆内存的这块区域）的引用次数由1就为0了
// 就会立即清除
```


缺点是需要一个计数器，而此计数器需要占很大的位置，因为我们也不知道被引用数量的上限。   
且无法解决循环引用的问题。
```js
function fn() {
    const obj1= {};
    const obj2= {};
    // obj1和obj2相互引用，无法被回收
    obj1.name = obj2;
    obj2.name = obj1;
};
fn();
```



### 标记清除
垃圾收集器使用该算法分为两个阶段来操作：标记和清除。  

在运行时会给内存中的所有变量都加上一个标记，假设内存中所有对象都是垃圾，全标记为0；  
然后从各个根对象开始遍历，看看是否可达，可达则不是垃圾，把不是垃圾的节点改成1；  
定期执行清理，清理所有标记为0的垃圾，销毁并回收它们所占用的内存空间；

虽然实现比较简单，打标记也无非打与不打两种情况，但是在清除之后，剩余的对象内存位置是不变的，也会导致空闲内存空间是不连续的，出现了 内存碎片，并且由于剩余空闲内存不是一整块，它是由不同大小内存组成的内存列表，这就牵扯出了内存分配的问题。


**可达性**   
在一个特定的作用域中的所有值，或者在一个作用域中正在使用的值，在该作用域中被称为 "可达"，并被称为 "可达值"，可达的值总是存储在内存中。 简单来说 就是此时此刻能不能访问到
这里列出固有的可达值的基本集合，这些值明显不能被释放。
```
当前执行的函数，它的局部变量和参数。
当前嵌套调用链上的其他函数、它们的局部变量和参数。
全局变量。
```


当数据结构在内存中时，数据结构的属性被认为是可达的，而且它们通常被保存在内存中。如果我们将一个对象存储在一个数组中，那么只要数组在内存中，即使该对象没有其他的引用，仍然可以被访问。
```js
let smashing = {name: "magazine"};
let arr = [smashing];
// 重写引用.
smashing = null;
console.log(array[0]) // {name: 'magazine'}
```

## 内存泄露
一段代码执行的时候，申请了内存，确因为不符合GC没有被及时回收 导致内存可用容量逐渐被占用变少，就叫做内存泄露，如下即可造成内存泄露
```
意外的全局变量。
未清理的定时器
闭包
循环引用
当 DOM 元素被移除或销毁时,如果相关的事件监听器没有被正确地解绑,那么监听器上对 DOM 元素的引用将一直存在
```


## 内存溢出
当程序运行需要的内存超过了剩余的内存时，就会抛出内存溢出的错误。

当内存泄露的多了就会造成内存溢出，会导致浏览器崩了 甚至电脑卡死