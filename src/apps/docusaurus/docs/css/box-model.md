---
sidebar_position: 4
---
# 盒模型

## 前置知识

在学习本章之前，我们先了解下前置的知识。

Document tree：文档树。根据[DOM](https://dom.spec.whatwg.org)中的描述 根节点为Document的节点树是文档树。即整个页面就是一颗文档树

visual formatting model：视觉可视化模型，盒子模型这一章和视觉可视化模型两者相辅相成，建议一起阅读！

## **什么是盒模型**

> The CSS box model describes the rectangular boxes that are generated for elements in the document tree and laid out according to the visual formatting model.
CSS盒模型描述了  **文档树中的元素** 会生成矩形盒子，并且这些盒子也将参与 **视觉格式化模型** 进行布局。
———以上出自W3C [CSS2.2](https://www.w3.org/TR/CSS22/box.html)的描述，当然[CSS3](https://www.w3.org/TR/css-box-3/)还单独拉出来一张讲盒子模型！
> 

也就是说 文档树中的元素会根CSS引擎所创建生成一个个你肉眼不可见的矩形的盒子，而且这些盒子还会参与**视觉格式化模型**的布局展示，这个就是盒模型**。**

## 为什么有盒模型这个概念？

CSS除了设置除了颜色, 字体, 背景之外的样式，还有个重要的作用就是布局！

在CSS诞生以前，早期的布局基于简单标签、空白图片做间距、表格布局等方案，布局极为繁琐。

CSS1里就提到用盒模型的方案解决**布局**，用盒模型来控制 元素的大小 以及元素之间的位置关系等。

## 盒模型的构成

页面中的每个元素都被看作一个矩形盒子，这个盒子包含蓝色部分元素的内容、绿色部分内边距、黄色部分边框 和橙色部分外边距。
****

![](https://img.dingshaohua.com/book-fe/202411302056243.png)

![](https://img.dingshaohua.com/book-fe/202411302056241.jpg)

##