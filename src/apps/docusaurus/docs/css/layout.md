---
sidebar_position: 3
---
# 布局模式

1990年，（造原子弹）CERN的**蒂姆·伯纳斯·李**创建了HTML技术。
不过，蒂姆对排版兴趣不大，毕竟他只是一个理科男，蒂姆最初的计划中，HTML也是用来定义文章结构的，而非外观展示！
因此，蒂姆在HTML最初的规范当中提到了大约 20 个用来标记网页的 HTML 标签，没有包含任何有关精确调整页面布局的内容，只能用标签来进行简单布局。

这里有1990年他创建的[世界第一个网站](https://info.cern.ch)，打开就可以看到 还是比较简陋的。

![](https://img.dingshaohua.com/book-fe/202411301551709.png)

当时很流行的一个方法就是利用单像素透明图片来控制元素间隔。

## 表格布局

标签和单像素图片的用法终究都还比较局限。后来人们发现，对于页面布局来说，表格是一个有力的工具。到了1996年，表格布局流行了起来，比如Netscape网站早期也使用了表格布局，甚至有些网站现在都还是。

最初的HTML规范当中，表格的初衷其实是用来以行列划分 组织表状 数据的，但很快大家就意识到，单元格里面可以放各种HTML元素，于是整个表格就成了一个二维的页面布局。

![](https://img.dingshaohua.com/book-fe/202411301551708.jpg)

## **帧布局**

在表格布局大行其道的同一时间，在HTML里分帧布局也很流行。通过使用`<frameset>`和`<frame src>`标签，一个HTML页面中的一些区域可以包含另外的HTML文件。帧甚至还可以嵌套使用。下图展示了如何用`<frameset>`在一个页面中包含5个不同的页面。

```html
<frameset rows="60px,*">
  <frame src="./frames/navgation.html" />
  <frameset cols="100px, *">
    <frame src="./frames/left.html" />
    <frame src="./frames/content.html" />
  </frameset>
</frameset>
```

![](https://img.dingshaohua.com/book-fe/202411301551707.png)

现在不鼓励使用 frame，已从相关的 web 标准中移除，推荐用[`<iframe>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe) 代替。

## 分区响应图

同时期，[分区响应图](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/map)布局方案也是比较常用的一种方案，它是一种特殊的图片，面积往往比较大，上面有一些区域可以直接点击 即所谓的热点，链接到其他页面。

```html
<img src="blue.png" usemap="#myMap" alt="Blue Map"/>
<map name="myMap">
   <area href="area1.html" shape="rect" coords="5,8,30,32" alt="area1" />
   <area href="area2.html" shape="rect" coords="34,8,50,32" alt="area2" />
   <area href="other.html" shape="default" alt="default"/>
</map>
```

![](https://img.dingshaohua.com/book-fe/202411301551706.png)

如上点击这些热点即可跳转到对应的页面！

## CSS布局

1996年CSS诞生！浏览器大战者们（网景和微软）达成共识，决定逐渐淘汰`展示类标签的布局方式`，转而使用结构和展示的分离CSS来布局。

CSS发明的时候，提供了一些专用的布局标签和属性以及概念，下边我们就来一一了解！

### 行块元素概念与display

行/块元素这是一个在CSS 1.0规范中提出的概念，根据元素展示（是否换行）的表现，划分归类！

h1和p、table以及div属于`块类型`元素，img、font以及（在后来HTML4.0提出的）span属于`行类型`元素。块元素独占一行，有宽高和边距，而行元素则都不会有！

html中所有元素都默认有display这个样式属性，用来决定是行(inline)还是块(block)。如果需要，你也可以手动的去显示修改它。

### **DIV和盒模型概念**

`<div>`元素起初是作为CSS的一部分被发明的，用来把页面组织成逻辑上独立的几个部分。它的设计初衷其实是替代当时最常用的表格布局。它内部可以包含文字和图片，从而形成盒子。

CSS1将网页每个元素都视为一个个盒子，可以通过控制盒子的大小、边框、填充等属性来实现页面布局。

### 正常布局流

[Normal Flow Layout](https://www.w3.org/TR/CSS22/visuren.html#normal-flow)

当我们未对元素设置任何CSS布局样式时，浏览器默认的 HTML 布局方式，就是正常的布局流，也称为文档流CSS Flow Layout或Normal Flow。

在正常布局流中：网页元素按照行、块元素进行从上到下、从左到右依次排列的布局方式。

下列布局技术会覆盖默认的布局行为：display、position、float。

### 浮动布局

Float Layout

这是个在CSS 1即提出的属性。

浮动布局是通过设置元素的float属性，使其脱离正常布局流，并根据浮动方向排列在页面中。

浮动布局最早是为了实现图片的文字环绕效果，目前也常用于构建多列布局、图文混排等场景。

```html
<style>
  .wrapper img{float: right}
</style>
<div class="wrapper">
  <h1>小白兔和小灰兔</h1>
  <img src="./img/pic.jpg" width="400px" />
  <p>老山羊在地里收白菜，小白兔和小灰兔来帮忙。</p>
  <p>收完白菜，老山羊把一车白菜送给小灰兔。小灰兔收下了，说：“谢谢您！”</p>
  <p>老山羊又把一车白菜送给小白兔。小白兔说：“我不要白菜，请您给我一些菜籽吧。”老山羊送给小白兔一包菜籽。</p>
  <p>小白兔回到家里，把地翻松了，种上菜籽。</p>
  <p>过了几天，白菜长出来了。小白兔常常给白菜浇水，施肥，拔草，捉虫。白菜很快长大了。</p>
  <p>小灰兔把一车白菜拉回家里。他不干活了，饿了就吃老山羊送的白菜。</p>
  <p>过了些日子，小灰兔把白菜吃完了，又到老山羊家里去要白菜。</p>
  <p>这时候，他看见小白兔挑着一担白菜，给老山羊送来了。小灰兔很奇怪，问道：“小白兔，你的菜是哪儿来的？”</p>
  <p>小白兔说：“是我自己种的；只有自己种，才有吃不完的菜。”</p>
  <p>小白兔和小灰兔的故事告诉我们要从小养成热爱劳动的习惯，就像小白兔说的：只有自己种，才有吃不完的菜。</p>
</div>
```

![](https://img.dingshaohua.com/book-fe/202411301551705.png)

### 定位布局

Positioning Layout

这是个在CSS 2提出的属性。

定位能够让我们把一个元素从它原本在正常布局流中应该在的位置移动到另一个位置。比浮动方案更加的灵活和随意。

定位属性有5种定位方式：static，relative，fixed，absolute，sticky，其中默认static。

```html
<style>
  .wrapper {
    background-color: gray;
    position: relative;
    width: 600px; height: 300px;
    color: gray;
  }
  .one{
    width: 60px; height: 60px;
    background-color: red;
  }
  .two{
    width: 80px; height: 80px;
    background-color: yellow;
    position: absolute;
    left: 40px; top: 10px;
  }
  .three{
    width: 100px; height: 100px;
    background-color: blue;
  }
</style>
<div class="wrapper">
  <div class="one">1</div>
  <div class="two">2</div>
  <div class="three">3</div>
</div>
```

![](https://img.dingshaohua.com/book-fe/202411301551704.png)

当定位属性值为static或relative，其控制的元素仍未脱离文档流，因此此时元素的布局仍然属于Normal Flow。若其它几个属性值则不是如此！

### 弹性盒子

[Flexbox Layout](https://www.notion.so/96a637522c8242098f0d7fa9c2170bc6?pvs=21)

很长一段时间内，都是 `position+float+display` 属性组合使用来布局。但是这并非一帆风顺，总会遇到相当多的难题，比如：垂直居中🙂 等问题。  且随着iphone的问世，智能手机让布局的响应式变得也非常重要，这些都让开发者痛苦已久！

好在W3C积极解决问题，在2009年提出此概念。最新在2018已经处于候选推荐阶段，即将成为标准，不过所有的浏览器目前均已支持！

弹性布局，是一种新的布局方式，其布局可以让元素在水平和垂直方向上表现出合适的效果。具有灵活性强、适应性好的特点，常用于构建响应式布局和自适应布局。

![](https://img.dingshaohua.com/book-fe/202411301551703.png)

### 网格布局

[Grid Layout](https://www.notion.so/70a1b2f39af04717ae17a3cb473c5a4b?pvs=21)

如果说弹性盒子是解决了一维的布局难题，那么网格就是解决了网页布局中的二维难题！

网格布局，让元素在二维网格中的布局。具有灵活性强、可扩展性好的特点，可以实现复杂的布局结构和自适应调整。

事实上，早在2010年此布局方案就被提出。
起因是一些微软员工一直在为他们的浏览器探索更好的布局方案，慢慢探索形成的。
2011年他们便向W3C提交了草案，目前也是候选推荐阶段，即将成为标准。浏览器支持率基本都没问题！

![](https://img.dingshaohua.com/book-fe/202411301551701.jpg)

## 多列布局

Multiple Column Layout

是一种基于CSS多列属性的布局方式，可以将网页内容按照多栏的方式排列，从而实现不同于传统单列布局的排版效果。

当需要在页面中展示大量文本时，如果每段的文本都很长，阅读起来就会非常麻烦，有可能读错行或读串行。而多列布局指的就是您可以将文本内容分成多块，然后让这些块并列显示，类似于报纸、杂志那样的排版形式。

![](https://img.dingshaohua.com/book-fe/202411301551700.png)

multi-column布局制定的非常非常的早，在CSS2.0时期规范就着手制定了，最后跟着1999的CSS3草案一起提出，直到目前2024年 multi-column布局仍处于草案阶段。好在目前浏览器都已经支持，而且看趋势也有火的趋势！

---

部分参考：[网页布局简史](https://zhuanlan.zhihu.com/p/104927765)、[一文搞懂Grid 布局](https://blog.csdn.net/pz1021/article/details/108863522/)、[谈谈关于CSS发展史的那点事](https://blog.csdn.net/m0_67840539/article/details/130824794)
