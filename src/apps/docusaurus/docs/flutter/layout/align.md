---
sidebar_position: 2
---

# 对齐

## 单个对齐 Align

Align 是一个单独的 widget，用来控制子元素在其父容器中的 对齐方式。它不仅仅局限于主轴方向，还可以在水平和垂直方向上灵活控制子元素的位置。

通过设置 alignment 属性来指定内部元素的对齐方式：

```dart
  // Alignment.center: 居中对齐（默认值）。
  // Alignment.topLeft: 左上角对齐。
  // Alignment.topCenter: 顶部居中对齐。
  // Alignment.topRight: 右上角对齐。
  // Alignment.centerLeft: 垂直方向居中，左对齐。
  // Alignment.centerRight: 垂直方向居中，右对齐。
  // Alignment.bottomLeft: 左下角对齐。
  // Alignment.bottomCenter: 底部居中对齐。
  // Alignment.bottomRight: 右下角对齐。
  Align(
  alignment: Alignment.center,  // 默认居中对齐
  child: Text("我是居中的元素"),
)

```

你还可以使用自定义的对齐点，指定 alignment:

```dart
  // Alignment(x, y)，
  // x 和 y 是 [-1, 1] 范围内的值
  // x = -1 表示最左边，x = 1 表示最右边。
  // y = -1 表示最上面，y = 1 表示最下面。
  // x = 0 和 y = 0 则表示居中。
alignment: Alignment(0.8, -0.8),
```


## 单个对齐 Center
Center 是 Align 的一个简化版本，它仅仅是将 alignment 设置为 Alignment.center。

## 多个元素对齐方式
mainAxisAlignment 与 crossAxisAlignment 主要用于 Flex 类布局（如 Row 和 Column），控制的是子元素在主轴上（X轴）和交叉轴（Y轴）的排列方式。

![](https://docs.flutter.cn/assets/images/docs/ui/layout/row-diagram.png)



在以下示例中，3 个图像每个都是是 100 像素宽。渲染框（在本例中是整个屏幕）宽度超过 300 像素，因此设置主轴对齐方式为 spaceEvenly 会将空余空间在每个图像之间、之前和之后均匀地划分。
```
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  children: [
    Image.asset('images/pic1.jpg'),
    Image.asset('images/pic2.jpg'),
    Image.asset('images/pic3.jpg'),
  ],
);
```
![](https://docs.flutter.cn/assets/images/docs/ui/layout/row-spaceevenly-visual.png)

## 对比
Align 控制当前元素在父容器的任意位置。   
mainAxisAlignment适用于弹性盒子中控制子元素的布局方式。  