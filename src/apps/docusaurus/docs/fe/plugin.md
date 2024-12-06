---
hide_title: true
sidebar_position: 3
sidebar_label: 插件
---

除了基础外，    
插件和辅助工具也是比较重要的知识点。    
也要了解和熟悉！
## 插件
插件也叫库、包，其实都是一回事，就是别人写的好的功能文件。    
你只需要引入，就能使用它的功能，而不用关心它的具体实现。

举个例子：
```js
// 加法函数
const add = (x,y)=>{
    return x+y;
}
// 使用加法函数
add(1,2);
```

我们使用插件简化代码编写
```js
// 引入插件
import _ from 'lodash';

// 使用加法函数
_.add(1,2);
```


推荐一些优秀插件    
[jquery](https://jquery.com/)：方便快速地的操作页面内容。   
[lodash](https://www.lodashjs.com)：万能插件，如计算器、数组对象操作。   
[dayJs](https://dayjs.fenxianglu.cn/)：解析、验证、操作和显示日期和时间。   
[echarts](https://echarts.apache.org/zh/index.html)：页面可视化，如柱状图、饼状图。




## 辅助工具
很长一段时间大家都用 css 和 js 来编写页面的样式和交互部分，但由于这两门语言本身不够优秀，大佬们自研的一些对其弥补性的语言，也要我们学习。    
1.微软发明的 Typescript。   
2.开源者发明的 Less、Scss。
### less  
一门 css 扩展语言，也叫做 css 预处理器。  
less 支持嵌套，继承等各种骚操作。

来对比下原生 css 就能看出它的优秀之处

```css title="style.css"
.wrapp {
  width: 200px;
}
.wrapp > .box1 {
  background-color: blue;
  color: red;
}
.wrapp > .box2 {
  background-color: blue;
  color: red;
  width: 100px;
}
```

```less title="style.less"
.wrapp {
  .box1 {
    background-color: blue;
    color: red;
  }
  .box2 {
    .box1;
    width: 100px;
  }
}
```

需要注意的是浏览器并不能解析 less，需要编译成 css 或者使用插件来使其支持！

点击[这里](https://less.bootcss.com)，查看官方文档！
:::tip 提示
sass 和 less 的诞生背景和用法几乎和 less 一样，这里不再赘述！
:::

### typeScript

号称 Js 的一个超集，微软发明的编程语言。
它提供了很多功能，如：类型、注解等功能。

这些功能很有用，尤其是`类型`支持，因为 js 是弱类型语言，很多错误直到运行时才能发现。而 ts 使这些错误提前暴漏在编译阶段。

```ts title="index.ts"
const add = (x: number, y: number) => {
  return x + y;
};
// error-next
add(1, "2"); //编译报错:需传数字类型参数
```

同样的，浏览器也不支持 ts，也需要工具将其编译成 js 文件供浏览器使用！

[TypeScript 入门教程](http://ts.xcatliu.com)    
[TypeScript 官方文档](https://www.tslang.cn)
