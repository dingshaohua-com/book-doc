---
sidebar_position: 2
---
# 脱离文档流

在Web中正常的文档流中，HTML文档会受到一些规则约束。每个块级元素垂直地从视图的顶部向下堆叠、每个行元素会仅仅挨着。

但元素要是使用了某些特定的样式属性后，此元素就会脱离文档流。

当一个元素脱离正常文档流后，它将不再受正常文档流的规则约束和管理。这个元素在原文档流中所占的空间也被清除掉了，其它盒子在定位的时候，会当做脱离文档流的元素不存在而进行定位。

能够实现脱离文档流的只有 `float` 和 `position` 。

假设说我有一个灰色的容器，容器内部有3个盒子，颜色分别为红黄蓝。代码和效果如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .wrapper {
        background-color: gray;
        position: relative;
        width: 600px;
        height: 300px;
        color: gray;
      }
      .one {
        width: 60px;
        height: 60px;
        background-color: red;
      }
      .two {
        width: 80px;
        height: 80px;
        background-color: yellow;
        left: 40px;
        top: 10px;
      }
      .three {
        width: 100px;
        height: 100px;
        background-color: blue;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="one">1</div>
      <div class="two">2</div>
      <div class="three">3</div>
    </div>
  </body>
</html>
```

<img src="https://img.dingshaohua.com/book-fe/202411301518846.png" width="70%"/>

## position

当定位属性的值不是static和relative的时候，他就会脱离文档流。 比如下边黄色的元素：

```css
.wrapper {
  /*...*/
  position: relative;
}
.two {
  /*...*/
  position: absolute;
}
```

![](https://img.dingshaohua.com/book-fe/202411301523943.png)

## float

当使用浮动属性的时候，当前元素也会脱离正常文档流。

```css
.two {
  /*...*/
  float: right;
}
```

![](https://img.dingshaohua.com/book-fe/202411301527932.png)

**不完全脱离**   

需要注意的是，使用float脱离文档流时，其他盒子会无视这个元素，但其他盒子内的文本依然会为这个元素让出位置，环绕在周围(相当于部分无视)。

这是因为浮动布局最早就是为了实现图片的文字环绕效果。这就是它的特性！

**例子1**

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

![](https://img.dingshaohua.com/book-fe/202411301529746.png)

**例子2**

```html
<style>
  .two {
    /*...*/
    float: right;
  }
</style>
<!-- ... -->
<div class="three">
	我是3 我是3 我是3 我是3
</div>
<!-- ... -->
```

![](https://img.dingshaohua.com/book-fe/202411301530851.png)

## 高度塌陷

当使用这些属性的时候 元素本身就会脱离文档流，此时如果其父元素没有设置高，那父元素的高度就**无法被脱离正常文档流的子元素撑开**，即为0。

如果父元素后边有其它元素，则它就会被覆盖。

这就是高度塌陷！

### 浮动导致

举个例子，以下是浮动导致的高度塌陷

```html
<style>
  .wrapper {
    background-color: gray;
    width: 300px;  color: gray;
    position: relative;
  }
  .wrapper > .one {
    width: 60px; height: 60px;
    background-color: red;
    float: left;
  }
  .box {
    background-color: pink;
    width: 400px; height: 200px;
  }
</style>
<div class="wrapper">
  <div class="one">1</div>
</div>
<div class="box">哈哈</div>
```

![](https://img.dingshaohua.com/book-fe/202411301530139.png)

解决办法：清除浮动

- 给父元素设置一个高
- 给父元素样式`overflow: hidden|auto`
- 在父元素后边多加一个元素添加样式`clear: both` （当然使用伪类将父元素after转为block并设置次样式也可以）
- 给浮动元素后边加一个元素添加样式`clear: both` （当然使用伪类将浮动元素after转为block并设置此样式也可以）

### postion导致

因为浮动属于半脱离正常文档流，所以父元素或兄弟元素还受其影响，所以大家还想着如何利用它的宽高，如何清除这些副作用（至少还会将它的宽高丢失视为副作用），将它的脱离文档流的影响减到最小。

但定位是完全脱离文档流，导致的高度塌陷，无可挽回，也没人考虑过挽回。

使用定位，元素的index就会比默认正常流的的多一级，位于它们上方。

```html
<style>
  .wrapper {
    background-color: gray;
    width: 300px;
    color: gray;
    position: relative;
  }
  .wrapper > .one {
    width: 60px;
    height: 60px;
    background-color: red;
    position: absolute;
    left: 10px;
  }
  .box {
    background-color: pink;
    width: 400px;
    height: 200px;
  }
</style>
<div class="wrapper">
  <div class="one">1</div>
</div>
<div class="box">哈哈</div>
```

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/959a3bfe-2edc-4dc6-a76f-e68d9a3928d6/69046497-4d6b-4142-9522-683cb16113ba/Untitled.png)

要想父元素有高，就老老实实的给父元素个高即可。