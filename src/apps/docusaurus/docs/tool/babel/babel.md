---
hide_title: true
sidebar_position: 3
---

JS 这门语言受限于历史因素，有许多问题，其中一个就是新的语言特性始终无法在浏览器中得到全面支持与应用。

如果你要写一个支持绝大多数浏览器的网页，最好的选择可能就是 ES5(旧版本的 JS)了，但你要知道 ES5 之后，JS 也一直在不停的更新，其中最重要的一个版本是 ES 6，而到今年 2022 年，已经是 ES 2022（ES13）了。

和其它语言不同，JS 是要在浏览器中运行，这就决定了你在使用 JS 时不得不考虑浏览器的支持情况。

而浏览器一方面对新特性的支持需要时间，再一个你还得考虑旧版本浏览器还是有很多人在用，这就造成一个困境：

“你可能不敢使用最新版本的 JS 语言特性”

但所幸，babel 横空出世，它就是一个作用：转换，将你写的 JS 转换成大多数浏览器都支持的语法样式。

这样，你就能够在使用 JS 最新的特性的同时，而又不用担心浏览器的兼容性问题了。

确实很棒的东西，甚至你可以说它挽救了 JS！

> 简单讲 Babel 是 Javascript 编译器 ,将 ES6,ES7 ,ES8 转换成 浏览器都支持 的ES5 语法,并提供一些插件来兼容浏览器API的工具。原理是Babel 会将源码转换 AST(抽象语法树) 之后，通过便利AST树，对树做一些修改，然后再将AST转成code。

本章参考   
[前端工程化学习笔记.酱路油过](https://www.kancloud.cn/cyyspring/webpack/2670925)   
[最新的babel兼容性实现方案.悬笔e绝](https://baijiahao.baidu.com/s?id=1709714903451987794)   
[babel 之 core-js.chao wu](https://zhuanlan.zhihu.com/p/403826116)