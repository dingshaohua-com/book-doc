---
sidebar_position: 5
---

# 宽高

## 宽度
### 占满

```dart
const Container(
     width: double.infinity,
     child: xxx
)
```


### 按照百分比
```dart
const FractionallySizedBox(
    widthFactor: 0.8,
    child: Container(
        width: double.infinity,
        child: xxx
    )
)
```

### 最大宽度
ConstrainedBox是一个Flutter小部件（Widget），用于对其子元素施加额外的约束（constraints）。它可以限制子元素的最小和最大宽度、高度等属性。
```dart
const ConstrainedBox(
  constraints: BoxConstraints(maxWidth: 300), // 设置最大宽度为300
  child: FractionallySizedBox(
    widthFactor: 0.8,
    child: Container(
      width: double.infinity,
      color: Colors.blue, // 添加颜色以便观察效果
      child: Text('Hello, World!'),
    ),
  ),
)
```

## 弹性盒子
### 水平等比
在水平方向上（X轴）设置一个元素的固定宽度，而其他元素按照比例分配剩余空间，
``` dart
const Row(
    children: [
        // 固定宽度的元素
        Container(
            width: 100, // 固定宽度为100
            height: 100,
            color: Colors.blue,
            child: Text('固定宽度'),
        ),
        // 按比例分配剩余空间的元素
        Flexible(
            flex: 1, // 占剩余空间的1份
            child: Container(
            height: 100,
            color: Colors.green,
            child: Text('1份'),
            ),
        ),
        Flexible(
            flex: 2, // 占剩余空间的2份
            child: Container(
            height: 100,
            color: Colors.red,
            child: Text('2份'),
            ),
        ),
    ],
),
```

### 水平分布模式
如果你希望在水平布局中使用space-between的效果，即子元素在水平方向上均匀分布，
```dart
const Row(
    // 使用 space-between 效果
    mainAxisAlignment: MainAxisAlignment.spaceBetween, 
    children: [],
)
```


## 高度
### 最大高度超出滚动
使用 constraints 来约束最大高度。通过 BoxConstraints 可以设定 maxHeight。   
使用 SingleChildScrollView 包裹了 Column，这样当 Column 的内容超出 Container 的高度时，它会允许滚动。
```dart
Container(
  constraints: BoxConstraints(
    maxHeight: 300, // 设置最大高度
  ),
  child: SingleChildScrollView(
    child: Column(
      children: List.generate(20, (index) {
        return ListTile(
          title: Text('Item $index'),
        );
      }),
    ),
  ),
)

```