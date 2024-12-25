---
sidebar_position: 1
---

# 堆叠

堆叠 Stack ，可以让你的 widget 放置在另一个 widget 之上。  
等价于 html 中的 定位布局！

## 初步认识
Stack 小部件就像一个具有 position: relative 属性的容器，它提供了一个相对定位的上下文给它的子组件。Positioned 小部件就像是子元素的 position: absolute。它可以根据父容器（即 Stack）的边界，通过 top、left、right、bottom 等属性来精确定位其位置。

如下，Stack的宽高被图片衬起来的，Stack内的所有元素都以定位方式进行布局：
```dart
@override
Widget build(BuildContext context) {
    return const Stack(
        children: [
            Image(image: NetworkImage('https://img.dingshaohua.com/book-fe/ex.jpg')),
            Text('张三', style: TextStyle( color: Colors.white))
        ],
    );
}
```

<img src="https://img.dingshaohua.com/book-fe/202412260114581.png" width="300"/>

可以看到，两个特性：按照 children 的顺序来决定层级的、默认堆叠位置都在左上角。

## 控制位置之 alignment

通过配置 Stack 的 alignment 属性，可以统一控制堆叠位置

```
alignment: Alignment(x, y) 时，x 和 y 分别代表水平和垂直方向的对齐度，范围是 -1.0 到 1.0：
x：控制水平方向上的对齐。-1.0 表示左对齐，0.0 表示居中，1.0 表示右对齐。
y：控制垂直方向上的对齐。-1.0 表示上对齐，0.0 表示居中，1.0 表示下对齐。
因此，alignment: Alignment(0.6, 0.6) 表示子元素会被对齐到 Stack 的 60% 宽度和 60% 高度的位置（也就是偏右偏下的位置）。
```

```dart
const Stack(
    alignment: Alignment(0.6, 0.6),
    // ...
）
```

<img src="https://img.dingshaohua.com/book-fe/202412260107764.png" width="300"/>

## 控制位置之 Positioned

如果你希望所有子元素在 Stack 中根据某个对齐点排列，可以使用 alignment，  
但是如果你需要对某个元素设置精确的堆叠定位，使用 Positioned 更合适。

```dart
  @override
  Widget build(BuildContext context) {
    return const Stack(
      children: [
        Image(image: NetworkImage('https://img.dingshaohua.com/book-fe/ex.jpg')),
        Positioned(
            bottom: 0,
            left: 40,
            child: Text('张三', style: TextStyle(color: Colors.white))
        ),
      ],
    );
  }
```
<img src="https://img.dingshaohua.com/book-fe/202412260127402.png" width="300"/>