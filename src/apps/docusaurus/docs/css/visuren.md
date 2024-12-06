---
sidebar_position: 5
---
# 视觉格式化模型

盒子模型和视觉格式化模型不是一回事！
虽然说的盒子都是同一个盒子，但是两个模型不在一个方向。
前者的内容是盒子本身的组成（边距、边框、宽高），后者则是讲盒子位置和布局。

## 简介

> how user agents process the [document tree](https://www.w3.org/TR/CSS22/conform.html#doctree) for visual [media](https://www.w3.org/TR/CSS22/media.html).
用户代理如何处理可视化媒体的文档树。
————[W3C-CSS2-视觉格式化模型](https://www.w3.org/TR/CSS22/visuren.html)
> 

这里有几个拗口的词汇，需要特殊说明，便于后续理解：
user agents：直译为用户代理UA，其实就是用户端的意思。这里用户端指的就是设备上的浏览器。
visual [media](https://www.w3.org/TR/CSS22/media.html)：可视化媒体如：显示器，打印机等视觉输出设备。
[document tree](https://www.w3.org/TR/CSS22/conform.html#doctree)：文档的树状结构，理解为文档内容就可以。

通俗理解就是：浏览器 如何 布局绘制文档内容 到显示器上。 这叫做视觉可视化模型！

在可视化格式化模型中，页面中的每个元素根据盒子模型生成零个或多个盒子。
这些框的布局受以下因素决定：

- 盒子的大小和类型（下边讲）
- 定位方案（正常文档流、浮动、绝对定位）
- 元素之间的关系
- 外部信息（窗口大小、媒体固有尺寸等）

### 视口

> 在拥有连续媒体的 用户代理会提供给用户一个视口(屏幕中的一个窗口，或者一块可视化区域)，通过视口用户可以查阅文档。当视口大小发生改变的时候，文档将会重新布局。
————[W3C-CSS2-视觉格式化模型](https://www.w3.org/TR/CSS22/visuren.html)
> 

这句话的通俗理解是，浏览器会提供一个窗口或者一块区域 来展示页面，供用户浏览。这个窗口或者这块区域就叫做视口。 简单来说 显示网页的那块区域。

当用户代理是浏览器的时候，通常一个窗口就是一个视口，但当用户代理是其它，如原生应用、小程序等，使用webview嵌套网页展示的时候，那视口就是webview的大小。

> 当视口小于文档渲染的画布区域时，用户代理应该提供滚动机制。
————[W3C-CSS2-视觉格式化模型](https://www.w3.org/TR/CSS22/visuren.html)
> 

文档渲染的[画布](https://www.w3.org/TR/CSS22/intro.html#canvas)区域 即网页的原本大小展示的那块区域。
非官方资料还特意给它们起了个名字：把网页原本大小展示叫做布局窗口 layout viewport，而原本的视口叫做视觉窗口 visual viewport。尤其在移动端设备上，理解这个概念很重要。

那结合如上，我们可以这样简单理解：当网页本身的大小超过窗口大小的时候，浏览器应该提供一个滚动条，通过滚动来显示剩余的内容。

![](https://img.dingshaohua.com/book-fe/202411302102091.jpg)

### 包含块

> In CSS 2.2, many box positions and sizes are calculated with respect to the edges of a rectangular box called a containing block. In general, generated boxes act as containing blocks for descendant boxes; we say that a box "establishes" the containing block for its descendants. The phrase "a box's containing block" means "the containing block in which the box lives," not the one it generates.
在CSS2.2中，盒子的位置和属性是参照一个叫做包含块的矩形盒子计算出来的。一般来说，元素所产生的盒子充当了它的子孙元素盒子的包含块；“盒子的包含块”一词的意思是“盒子所在的包含块”，而不是它生成的包含块。
> 

也就是说每个盒子都会产生出一个包含块。 
一般情况下”盒子的包含块“都是指它所处的包含块，即它父盒子产出的那个包含块。
包含块一般用于盒子的尺寸布局计算。

如下，p的包含块为 div橙色的内容区域。
如果我将p的宽度设置为50%，那p的最终宽度就是以包含块即div内容宽度的50%，这里有一个讲的比较好的[视频](https://www.bilibili.com/video/BV1Ar4y1W7mM)。

```html
<div>
	<p></p>
</div>
```

![](https://img.dingshaohua.com/book-fe/202411302102090.jpg)

> Each box is given a position with respect to its containing block, but it is not confined by this containing block; it may [overflow](https://www.w3.org/TR/CSS22/visufx.html#overflow).
每个盒子都相对于其包含块定位，但它不限于包含块内，它可能会[溢出](https://www.w3.org/TR/CSS22/visufx.html#overflow)。
> 

每个盒子都会参照它的包含块被放到一个位置，但这并不是说这个盒子从显示上来讲一定会被它的包含块所包含在内，也有可能[`溢出(overflow)`](https://www.w3.org/TR/CSS2/visufx.html#overflow)它的包含块。

```html
<style>
  div{
    width: 200px;
    height: 100px;
    border: red solid 6px;
    margin: 10px;
    padding: 20px;
  }
  p{
    width: 300px;
    background-color: red;
  }
</style>

<div>
  <p>你好</p>
</div>
```

![](https://img.dingshaohua.com/book-fe/202411302102089.png)

完整的包含块的定义和细节：

1. [根元素](https://www.w3.org/TR/CSS22/conform.html#root)所在的包含块是一个称为**初始包含块**的矩形，尺寸等于浏览器视口大小。
2. position为'relative' or 'static’的元素，则包含块为距它最近块级祖先构成。
3. position为fixed的元素，包含块为初始包含块。
4. position为absolute的元素，包含块由最近的带有absolute、relative、fixed定位的块级祖先构成。若祖先是行内元素的情况下,包含块是由第一个和最后一个内联元素的内边距构成。

![](https://img.dingshaohua.com/book-fe/202411302104210.png)

## 控制盒子的生成

盒子模型讲到过文档树中的元素会根据CSS引擎生成一个个你肉眼不可见的矩形的盒子，在此过程中 视觉格式化模型 也将参与其中，控制生成盒子的类型并且参与不同的格式化上下文方案 以便来实现不同布局和位置控制。

视觉格式化模型 根据元素的类型（display）来决定生成什么类型的元素盒子。

注意 1个元素也可能会生成多个盒子，比如匿名元素、伪类元素（:after等）或li元素等。
但是只有一个 **principal box** 主盒，用于存放子元素，并参与定位。
如下 无序列表前边的那个点会生成一个 **additional box 附件盒**放置**，**而后边的文字内容部分则放置在生成主盒中。

![](https://img.dingshaohua.com/book-fe/202411302104209.gif)

### 块级元素与块级盒

文档中格式化成视觉上块状的元素，称其为块级元素 `block-level element`。

block  table list-item 这些 display 值可以让一个元素成为块级元素。

一个块级元素至少会生成一个块级盒 `block-level box` 。

块级盒将参与到 块格式化上下文( BFC)。

---

有很多人还看到过块盒 `block box` 的概念，那它和块级盒 就一字之差，有什么区别呢？

> Block-level boxes that are also block containers are called block boxes.
如果一个块级盒同时也是一个块容器，则称其为块盒。
————[W3C-CSS2-视觉格式化模型](https://www.w3.org/TR/CSS22/visuren.html)
> 

问题又来了，那什么是块容器(盒) `block container (box)` 呢？

> In CSS 2.2, a block-level box is also a block container box unless it is a table box or the principal box of a replaced element.
除表格元素 或者 可替换元素生成的块级盒之外就是块容器盒。
————[W3C-CSS2-视觉格式化模型](https://www.w3.org/TR/CSS22/visuren.html)
> 

其实很好理解，块容器盒侧重于当前盒子作为**容器**一角，要容纳后代和它自身的内容。
像固定的格式table、可替换元素（即内部不能容纳子元素）的 video 和 embed 等，即便它们都是块元素，依然不能算是块容器盒。
块容器盒一定是块盒子，反之则不成立。其实我们用的块容器盒子还是挺频繁。

扩充知识点：

1. 一个主盒是块容器盒的元素叫做块容器元素 `block container element` 。
2. 如果一个块容器盒子有一个块级盒子在它里面，那么我们强制这个块容器盒子中只能存在块级盒子（这句话翻译至W3C标准，但其实我认为是有瑕疵的，只有在块级元素周围的匿名文本元素才会产生块级效果）。这句话悄悄引入了一个新的概念，就是`匿名块盒子`。我们在之后再进行具体说明。

![](https://img.dingshaohua.com/book-fe/202411302104208.png)

---

### 内联级元素和内联级盒

内联级元素 `inline-level element`  是页面中看起来不会形成新块状区域的元素。

内联级元素的 display 属为inline、inline-table和 inline-block。

一个内联级元素至少会生成一个内联级盒 `inline-level box` 。

内联级盒将参与到 内联格式化上下文( IFC)。

---

display 为 inline 的内联级盒是内联盒  `inline box` 。

display为 可替换内联/inline-block/inline-table等元素是，它叫做`atomic inline-level box` 原子内联级盒，它们作为单一的不透明盒 `opaque box` 参与其IFC。

---

### 匿名盒

为了满足CSS的FC标准（如XXFC 下边讲），视觉格式化模型特意为一些内容生成匿名盒 `anonymous box` 。块的匿名盒为 `anonymous block box` , 内联相关的匿名盒为 `anonymous inline box` 。

非块级盒和块级盒一起布局时，为了保持文档结构的一致性，并符合 CSS 中块/内联元素的布局规则，会形成匿名块框将内联元素包裹起来。

```html
<div>
  这是一些文本
  <p>这也是一些文本</p>
</div>
```

```html
<div>
  <匿名块盒>这是一些文本</匿名块盒> 
  <p>这也是一些文本</p>
</div>
```

![](https://img.dingshaohua.com/book-fe/202411302104207.png)

当block 元素内部包含有匿名文本(Anonymous Text)和inline元素，这会导致一个匿名内联盒 被生成，如右侧

```html
<div>
  这是一些文本
  <em> 这也是一些文本 </em>
</div>
```

```html
<div>
  <匿名内联盒>这是一些文本</匿名内联盒>
  <em> 这也是一些文本 </em>
</div>
```

![111.gif](https://prod-files-secure.s3.us-west-2.amazonaws.com/959a3bfe-2edc-4dc6-a76f-e68d9a3928d6/34e0457a-21e1-4c78-be93-7eea0f32d954/111.gif)

## 位置方案

在CSS2.2中，一个盒子有3中布局规范：

[`Normal flow`](https://www.w3.org/TR/CSS22/visuren.html#normal-flow) 当不使用浮动 绝对定位的时候 元素默认的布局方式。

[`Loat`](https://www.w3.org/TR/CSS22/visuren.html#floats) 盒子首先遵守正常文档流。最后再根据浮动的值向左或向右流动。

[`Absolute positioning`](https://www.w3.org/TR/CSS22/visuren.html#absolute-positioning) 当定位的属性为absolute或fixed的时。此时盒子被完全从正常流中删除。

因为内容较多，故而分成于当前章节平级菜单来讲解。

## 正常文档流

是指 HTML 文档中元素默认的布局方式，HTML 元素上从上到下、从左到右依次排列的布局模式。

在正常文档流中，块级元素在默认情况下垂直排列，每个块级元素占据一行，而行内元素在水平方向上排列，一行可以包含多个行内元素。这些元素在不设置特定的 CSS 属性或样式的情况下，根据其在 HTML 结构中的位置依次显示。

正常文档流是网页布局中的默认模式，但可以通过 CSS 来改变元素的布局方式，如浮动、定位或 弹性盒子、网格 等布局模型，来改变元素在页面中的位置和排列方式这样就可以脱离正常文档流了。

正常文档流下的布局具有以下特点：

1. **垂直排列：** 块级元素垂直排列，每个块级元素占据一行。
2. **水平排列：**内联元素水平排列，在同一行内依次显示。
3. **自然流动：** 元素根据其在 HTML 结构中的先后顺序自然地流动排列。
4. **元素尺寸自适应：** 元素的尺寸默认情况下受到内容的影响，会根据内容自动撑开或收缩。

在 HTML 文档中，处于正常文档流中的盒子都属于某种格式化上下文。
有很多不同类型的格式化上下文，如BFC、IFC、TFC、FFC、GFC 未来可能还有更多。
这些上下文决定了元素在页面上如何布局、排列和相互作用。

### FFC

**怎么形成FFC**

当元素的dispaly属性为flex / inline-flex的时候，此元素即可形成一个FFC容器。其内部的元素都会受到FFC规则布局。

**FFC渲染规则（特性）**

- 设置为 flex 的容器被渲染为一个块级元素， inline-flex 则渲染为一个行内元素
- 弹性容器中的每一个子元素都是一个弹性项目，且可以是任意数量的。
- 弹性容器外和弹性项目内的一切元素都不受外部影响。

### **BFC**

**怎么形成BFC**  

一些普通元素 和 根元素`<html>`其内部会形成一个BFC。
普通的元素怎样才能成为BFC容器呢？

- float为除 none 以外的值
- position为绝对定位的时候（absolute或fixed）
- overflow 除了 visible 以外的值
- display为inline-blocks，table-cells，table-captions

BFC特性的元素，其内部会生成了BFC容器。 容器内部中的子（包含孙子）元素会都遵循BFC渲染规则规则进行布局。

你想看看BFC长什么样？——🙂不好意思，BFC只是一个概念。它并不是伪类等实质化的东西，所以审查元素等操作可以看到。只能通过特性和形成体检去反推。

**BFC渲染规则**

- 在BFC容器中的盒子从包含块的顶部开始，按序垂直排列。
- 同一个BFC容器 相邻两个块级盒子之间的垂直间距会被折叠。
- 每个盒子的左外边缘会与包含块左边缘重合（跟排版顺序保持一致）。
- 计算BFC的高度时，其内部浮动子元素也参与计算
- BFC的区域不会与float的元素区域重叠
- BFC就是页面上的一个隔离的独立容器和渲染区域

BFC就是`块级格式化上下文`，是页面上一块独立的渲染区域，内部元素盒子都按照其特定的规则进行排列渲染，且区域内的布局与区域外的布局不相互影响。

**一些例子**

根元素属于BFC容器，两个块级元素在此容器中布局，自然要遵守BFC渲染规则：如一个占独立一块，且从上到下、从左右到右排版布局等。

```html
<body>
  <div>你好</div>
  <div>哈哈</div>
</body>
```

一个普通的块级盒子并不成为一个BFC容器。如下三个div处于同一个根元素产生的BFC容器中。

```html
<body>
  <div>你好</div>
  <div>
    <div>哈哈</div>
  </div>
</body>
```

如下.two元素 就成为了一个新的BFC

```html
<style>
  .two{
    overflow: hidden;
  }
</style>
<div>你好</div>
<div class="two">
  <div>哈哈</div>
</div>
```

BFC容器里可以包含任何类型的元素，CSS规范里

```html
<style>
  .two {
    overflow: hidden;
  }
</style>
<div class="two">
  <span>你好</span>
  <div>世界</div>
  <span>哈哈</span>
	<span>呵呵</span>
</div>
```

**易混淆点**

在 CSS 中，元素在没有触发特定的格式化上下文时，其内部元素会按照**默认的文档流布局**。块级元素在垂直方向上按照文档流一个接一个地垂直排列，行内级元素则在水平方向上依次排列。

未触发任何特定格式化上下文的元素将遵循默认的布局规则，按照文档流中的顺序进行排列，不会受到IFC或BFC或其它FC等布局规则影响。

### **IFC**

由没有包含块级盒的块盒建立，即块级元素中仅包含了内联级别元素 此块元素就会形成一个IFC。

如下 div元素就形成了一个IFC容器

```html
<div>
  <span>你好</span>
  <span>世界！</span>
</div>
```

I**FC渲染规则：**
盒子会从包含块的顶部开始，按序水平排列。
只有水平外边距、边框合内边距会保留生效，垂直上的空间样式则不生效。
盒子可以不同的方式在垂直方向上对齐，如底部、顶部或则文字基线。
IFC容器里的会产生一个行盒line box，若折行则会形成多个line box。

**IFC中永远不会存在块元素**

比如 我原本有一个ifc，之后我在ifc容器里放入了一个块元素。 那外层的div元素生成的这个ifc顷刻间就不复存在了。

```html
<div>
  <span>你好</span>
  <div>世界</div>
  <span>呵呵</span>
</div>
```

![](https://img.dingshaohua.com/book-fe/202411302104206.gif)

那此时外层div既不是ifc也不是bfc，那内部的元素该如何执行fc呢：
它产生两个匿名块与div分隔开。这两个匿名块div就i分别形成了两个IFC，每个ifc对外表现为块级元素，与中间插入的那个div垂直排列。

我们把包含着一个或多个盒子的矩形区域称为一个行盒 `line box` 这个是自动生成的。 比如一下代码就会形成，红虚线框住的那部分就是，当然现实中我们是看不到的 ,这里是为了方便理解。

```html
这是<span>行元素1</span>， 
这是<span>行元素2</span>， 
而这个是<span>行元素3</span>
```

![](https://img.dingshaohua.com/book-fe/202411302104204.png)

当行级框的总宽度小于包含它们的行盒的宽度时，它们在行盒内的水平分布由[“text-align”](https://www.w3.org/TR/CSS22/text.html#propdef-text-align)属性确定。
当行级框的总宽度大于包含它们的行盒的宽度时，它会被分割成多个内联级盒，并分布在多个行盒内。如果行盒无法拆分（例如，如果行盒就一个字，或者特定于语言的单词规则不允许在内联框中进行拆分，或者如果内联框受 nowrap 或 pre 的影响） )，那么行内框就会溢出行框。当内联级盒被分割时，边距、边框和填充在分割发生的地方看不到效果。

盒子没有宽高属性，其宽度由盒的宽度由包含块和是否浮动决定，高度是由[行高计算方式](https://www.w3.org/TR/CSS22/visudet.html#line-height)决定。

一般情况下，行级盒的左/右边缘接触其包含块的左/右边缘。

## 浮动

可以让一个盒子沿着一行向左或右移动，直到其外边缘接触包含块边缘或另一个浮动框的外边缘。

同绝对定位一样，浮动也会脱离正常的文档流。所以对于没有使用定位的普通块级盒来说，可以当做float元素不存在。但是行级盒不行会受到float元素的影响（可能为防止行里的文本覆盖），盒内的文本会给它让行空间。

当然，如果你想摆脱浮动造成的影响，可以试试清除浮动的方案。后续翻译和整理

## 绝对定位

在绝对定位模型设计中，盒子会相对于其包含块显式偏移。
（对比浮动）它完全从正常流程中删除，对后来的兄弟姐妹没有影响，绝对定位元素的内容不像浮动会围绕任何其他框流动。它们会遮盖另一个盒的内容，具体取决于 盒子的 [堆栈级别](https://www.w3.org/TR/CSS22/visuren.html#stack-level) z-index。

绝对定位的盒子会为其内部正常流程子代和绝对（但不是固定）定位的后代建立了一个新的包含块。

本文中所说的句对定位，其实就是当position的属性值为'absolute' 或 'fixed'。

## **display、position、float三者关系**

这属性都能影响元素的显示及其位置，它们之间会相互影响，我们详细了解下

1. 如果display属性被设置为none，那么position和float属性将不起作用，页面上将看不到元素。
2. 非1且元素为绝对定位。那么float属性无论显式的被设置成什么值最终它都是将被设置为none！display属性值将被重新计算，计算规则如下表所示，且元素的位置也将由相对于元素包含块的top，left，bottom，left值决定。

| 给定值 | 计算值 |
| --- | --- |
| inline-table | table |
| inline, table-row-group, table-column, table-column-group, table-header-group, 
table-footer-group, table-row, table-cell, table-caption, inline-block | block |
| others | same as specified |
1. 非2且“float”的值为非“none”，则该盒子将浮动并根据上表重新计算并设置“display”。
2. 非3且这个元素为根元素（一般为body），那么display属性将被重新计算，计算规则依然如表
3. 1. 其它情况下，display属性保持指定值不变。就是按照你给的，而不会重新被计算和设置。

## 三种布局方案比较

即正常文档流、浮动、绝对定位，这三种给元素设置位置布局方案的比较。

后续翻译 没啥技术含量

## 分层展示

普通页面元素都是统一的0层级，当元素被设置了绝对定位，那它就拥有了层级特性，且比正常文档流中的元素高一个层级，浮于它们之上。

如果像手动设置元素的层级，z-index即可。

## 文本方向

文本方向默认都是从左向右的，考虑到不同语言文字的特性，CSS特意提供了direction属性来控制文本方向，

---

参考：[扒一下W3C规范里的BFC和IFC](https://segmentfault.com/a/1190000004246731)、[CSS2 规范阅读](https://blog.csdn.net/andy_zhang2007/article/details/81251724)、[womlly可视化模型2.1翻译](https://www.cnblogs.com/womlly/p/5184394.html)、[视觉格式化模型](https://blog.csdn.net/VickyTsai/article/details/103396154)、[无聊看文档之CSS-Containing block](https://www.cnblogs.com/pomoho/p/4361012.html)、[Normal Flow和'BFC'两个概念有什么关系？](https://www.zhihu.com/question/568222940/answer/2770765021)、[块级元素在ifc中会发生什么](https://segmentfault.com/q/1010000004327697)

- 外部信息（窗口大小、媒体固有尺寸等）