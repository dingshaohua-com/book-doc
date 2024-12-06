---
sidebar_position: 1
---

# vue 相关

## vue style scop
对于 Vue.js 中的 style scoped 原理，这是 Vue 组件样式封装的一个特性。当你为一个 Vue 组件添加 scoped 属性到 `<style>` 标签时，Vue 会为该组件的 HTML 元素添加一个唯一的属性（如 data-v-f3f3eg9），并在 CSS 选择器中添加该属性以实现样式的局部作用域。


```html
<template>
    <div class="example"> 测试 </div>
</template>
<style scoped>
.example {
  color: red;
}
</style>
```

最终会被编译为
```html
<div class="example" data-v-f3f3eg9> 测试 </div>
<style>
.example[data-v-f3f3eg9]{
    color: red;
}
</style>
```


## v-model的原理
v-model是一个指令，多用于表单控件上，比如input。   
它接受一个状态，并且根据你的输入实时修改此状态的值。  

v-model是一个语法糖，它等价于：
```html
<input :value="val" @input="e=>{val=e.target.value}">
```
也就是说 它借助于v-bind和v-on来实现的。


## nextTick解释下
为什么会出现这个api呢？  
vue更新dom 不是实时的，而是异步的，而nextTick是vue自己封装的一个异步方法，根据事件循环机制，这样（如果有需要）就可以获取到更新状态后的最新dom了。


我保证，面试官肯定会问你 那你说说为什么 vue更新dom 不是实时的？      
首先vue是一款mvvm的框架，此类型框架的重要特色数据驱动视图。  
此模式下 你不需要显示的操作dom 来更新展示，vm（数据状态）的变更会直接导致视图自动更新。

其原理是 基于proxy的数据劫持+发布订阅者模式 来操作（数据驱动视图）的： 
1. 收集依赖 vue在编译模板的时候 获得模板中哪些地方使用了状态 计算属性，找到并调用对应的get，即通过数据劫持来获取状态变更  并推送到与之对应的发布订阅集里
2. 当你更新状态的时候，会调用其set函数，然后在set内部 vue会执行emit触发的更新操作。
3. 发布订阅接收到更新操作后 就会更新页面渲染 使用最新数据。
更新过程中 还涉及的更新的diff算法。

注意第3步中 更新页面dom的是事件时候 vue是开启了一个新的事件队列，而时间队列会在下一个事件循环才会被执行，这样做的好处是：避免实时更新dom 造成浏览器卡顿 提升用户的体验和性能，利用这个时间做出diff算法 差量更新，优化更新机制 相近时间多次修改同一状态最终只会执行一次真实dom更新。

nextTick是使用promise封装的，当然也做了降级处理 在不支持primise的环境下使用定时器。



## 父组件和子组件的渲染顺序
即钩子执行顺序。  
无论是挂载还是更信，总是副组件先开始挂载或更新或是销毁  但是中途要等待子组件完成后 他们才能完成。

Vue的组件渲染顺序是从父组件到子组件。这是因为在Vue中，父组件是负责管理和控制子组件的，父组件渲染完成后，才能知道自己需要渲染哪些子组件。所以，为了确保子组件的渲染是在合适的时机进行，Vue采取了先父后子的渲染顺序。

子组件的渲染依赖于父组件的数据。Vue组件之间通过props属性进行数据传递，子组件的渲染需要根据父组件传递的数据来确定显示内容。如果先渲染子组件，此时还没有父组件的数据，子组件就无法正确渲染。因此，先渲染父组件可以确保子组件的渲染所依赖的数据已经准备好。

组件的渲染顺序也符合数据流的思想。在Vue中，数据是单向流动的，父组件通过props向子组件传递数据，而不会发生子组件直接修改父组件数据的情况。为了保证数据流的顺畅和一致性，先渲染父组件再渲染子组件是必要的。

1、挂载渲染的顺序   
父组件 beforeCreate   
父组件 created   
父组件 beforeMount   
子组件 beforeCreate
了组件  created   
子组件 beforeMount   
子组件  mounted   
父组件 mounted   


2、更新的顺序   
父组件 beforeUpdate   
子组件 beforeUpdate   
子组件 updated   
父组件 updated   


3、销毁的顺序   
父组件 beforeDestroy   
子组件 beforeDestroy   
子组件 destroyed   
父组件 destroyed   

## 钩子函数有哪些  


https://zhuanlan.zhihu.com/p/697855958
beforeCreate    
在 Vue 实例创建之前执行，此时实例的数据观测和事件机制都尚未初始化，无法访问到 this 实例。

created   
在 Vue 实例创建之后执行，此时已经完成了数据观测和事件机制的初始化，可以访问到 this 实例。

beforeMount     
在挂载元素之前执行，此时模板编译已完成，但是尚未挂载到页面中。


mounted   
在挂载元素之后执行，此时实例已经挂载到页面上，可以访问到渲染后的DOM元素，可以在这个生命周期函数中进行DOM操作。


beforeUpdate