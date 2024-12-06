---
sidebar_position: 8
---

# 编写loader（待修订 整合）
默认情况下，webpack 自身只理解和处理 Js和json文件（开箱子带的能力），但是我们项目中还存在着许多其它模块类型的文件。

当Js文件中导入任何类型的模块（例如ts、css、、less、img文件），webpack便无法理解了。

好在webpack开放了允许三方扩展，来让webpack支持对其它模块的理解和处理，它就是loader。

## 简单例子

### 引入一个不支持的类型文件

举个例子，让webpack处理markdown文件。  比如我有如下文件  `readme.md`

```markdown
你好
```

然后我在JS文件中去导入它

```jsx
import readme from './readme.md'

console.log(readme);
```

打包它  `npm run webpack`

```bash
*  正在执行任务: npm run webpack 
$ webpack
asset index.js 4.88 KiB [emitted] (name: main)
asset index.html 279 bytes [compared for emit]
runtime modules 937 bytes 4 modules
cacheable modules 497 bytes
  ./src/index.js 491 bytes [built] [code generated]
  ./src/readme.md 6 bytes [built] [code generated]
webpack 5.90.3 compiled successfully in 102 ms
Done in 0.48s.
```

是不是好奇，这里为何没有报错 缺少loader解析？ —这里后边再讲。 

此时刷新浏览器看看效果，就会出现报错了。

```bash
readme.md:1 Uncaught ReferenceError: 你好 is not defined
    at eval (readme.md:1:1)
    at ./src/readme.md (index.js:29:1)
```

### 分析打包后的文件

依据 `webpack.config.js` 的 `output` 我们找到打包后的文件：

```bash
eval("你好");
console.log((_readme_md__WEBPACK_IMPORTED_MODULE_0___default()));
```