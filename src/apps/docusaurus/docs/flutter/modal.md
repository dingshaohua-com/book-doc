---
sidebar_position: 7
---

# 弹窗

介绍几个常用的交互组件，如：dialog、toast 等。

## toast

官方没有内置支持，需要安装三方包，[fluttertoast](https://pub.dev/packages/fluttertoast) 正是一款简单的 toast 能力包。

```dart
import 'package:fluttertoast/fluttertoast.dart';

Fluttertoast.showToast(
    msg: "这是一个轻量级弹窗",
    toastLength: Toast.LENGTH_SHORT,
    gravity: ToastGravity.CENTER, // 水平和垂直居中
);
```

## showModalBottomSheet

底部弹出式菜单组件，这是 material[内置组件](https://api.flutter.dev/flutter/material/showModalBottomSheet.html)

```dart
showModalBottomSheet(
    context: context,
    builder: (BuildContext context) {
        return Container(
            height: 200,
            color: Colors.red,
            child: Center( child: const Text('Hello word')),
        );
    },
);
```

![](https://img.dingshaohua.com/book-fe/202501012348854.gif)

## showDialog
模态窗组件，这是 material[内置组件](https://api.flutter.dev/flutter/material/showDialog.html)
```dart
showDialog(
    context: context,
    builder: (buildContext) => AlertDialog(
        title: const Text('Demo'),
        content: const Text(
            'Are you ok?',
        ),
        actions: [
            TextButton(
            style: TextButton.styleFrom(
                textStyle:
                    Theme.of(context).textTheme.labelLarge,
            ),
            child: const Text('no'),
            onPressed: () {
                // Flutter 中用于关闭当前页面或弹出当前路由的一种方法。
                // 它的作用是从当前的导航栈中移除顶层路由，并返回到上一个路由。
                Navigator.of(context).pop();
            },
            ),
            TextButton(
            style: TextButton.styleFrom(
                textStyle:
                    Theme.of(context).textTheme.labelLarge,
            ),
            child: const Text('yes'),
            onPressed: () {
                Navigator.of(context).pop();
            },
            ),
        ]
    )
);
```
![](https://img.dingshaohua.com/book-fe/202501020021325.gif)

## 自定义弹出页面
如果不利用以上现有能力，我们自己也可以写一个！

结合 Visibility，来控制隐藏或显示
```dart
Visibility(
    visible: isVisible,
    child: const Text('hello word')
)
```

注意两点：
1. 如果你启用了导航栏 bottomNavigationBar，那么你自定义的组件将无法覆盖到它，必要时需要也用Visibility控制它隐藏
2. 一般将全局的弹窗式页提前注册到 MaterialApp>body中，然后通过Visibility控制它隐藏，并且使用Scaffold+Positioned。



## Overlay
Overlay 本身是用来插入浮动的元素，它通常会使用 OverlayEntry 来插入一个 widget。这个 widget 是 浮动的，它可以显示在屏幕的任何地方！

| **Flutter**       | **HTML/CSS 类比**                               | **功能描述**                                |
|-------------------|------------------------------------------------|---------------------------------------------|
| `Visibility`      | `visibility: hidden` / `visibility: visible`    | 控制元素的可见性，但元素仍然占用布局空间。       |
| `Overlay`         | `position: absolute` / `position: fixed`        | 将元素浮动显示在页面的顶部，通常不占用布局空间。 |

- **`Visibility`** 在 Flutter 和 CSS 中都用于控制元素的显示与隐藏，但隐藏的元素依然会占据空间。
- **`Overlay`** 在 Flutter 和 CSS 中都用于在页面上 **浮动** 显示内容，通常不影响布局，且可以在页面的任何位置显示。

```dart
class DemoScreen extends StatelessWidget {
  // 1. 创建一个 OverlayEntry
  late OverlayEntry _overlayEntry;

  // 2. 控制弹出层的显示与隐藏
  void _showOverlay(BuildContext context) {
    _overlayEntry = _createOverlayEntry(context);
    Overlay.of(context).insert(_overlayEntry); // 将 OverlayEntry 插入 Overlay
  }
  void _hideOverlay() {
    _overlayEntry.remove(); // 移除 OverlayEntry
  }

  // 3. 创建 OverlayEntry（即弹窗界面的内容）
  OverlayEntry _createOverlayEntry(BuildContext context) {
    return OverlayEntry(
      builder: (context) => Positioned(
        top: 230.0,
        right: 50.0,
        left: 50.0,
        child: Material(
          color: Colors.transparent,
          child: Container(
            height: 200.0,
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.5),
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('弹窗界面'),
                  ElevatedButton(
                    onPressed: () {  _hideOverlay();},
                    child: const Text('关闭弹窗'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title:const Text('弹窗示例')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => _showOverlay(context), // 显示弹窗界面
          child: const Text('显示弹窗'),
        ),
      ),
    );
  }
}
```

![](https://img.dingshaohua.com/book-fe/202501020133862.gif)