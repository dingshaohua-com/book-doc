# 原生

## 获取设备宽度

比如说我们根据设备不同的宽度设置不同的样式

```dart
@override
Widget build(BuildContext context, WidgetRef ref) {
    // 获取当前设备的MediaQuery数据
    var mediaQueryData = MediaQuery.of(context);
    // 判断是否是Pad 或者 横屏
    bool isPad = mediaQueryData.size.width > 700;

    return Center(
        child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 700), // 设置最大宽度为700
            child: FractionallySizedBox(
                widthFactor: isPad? 0.4:0.68, // 如果是pad 或 横屏 则宽度占比40%，否则68%
                child: Container(
                    color: Colors.red,
                    width: double.infinity,
                    height: 40
                )
            )
        )
    )
}
```
