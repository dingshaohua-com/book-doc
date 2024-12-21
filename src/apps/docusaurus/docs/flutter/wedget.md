---
sidebar_position: 4
---

# 组件
flutter 将一切都视为[组件](https://docs.flutter.dev/get-started/fundamentals/widgets)，丰富多彩的页面都是由一个个小组件组合而成，比如 Text、Image、Icon 等等，这跟网页开发中的 HTML 标签类似。

## 基础组件
flutter内置许多基础小组件，比如上文中出现的最简单的 Text组件，他们都位于 `flutter/widgets.dart` 包中。

[这里可以查看](https://api.flutter.dev/flutter/widgets/widgets-library.html)所有基础小组件的 列表和相关用法！


## 布局组件
除了图片、文本组件，在flutter中，还有一些[单纯为布局](https://docs.flutter.dev/get-started/fundamentals/layout)而生的[布局组件](https://docs.flutter.dev/ui/widgets/layout) 类似于html中的div、span，如 Align、Padding、Center 等。它们也是内置基础组件的一种！


## 主题组件
你可能会觉得自己使用布局组件来进行繁琐的布局太麻烦！      
没关系，flutter 提供了许多高级主题组件，比如适合安卓风格的 [MaterialApp](https://docs.flutter.dev/ui/layout#material-apps)、适合Ios的[cupertino-apps](https://docs.flutter.dev/ui/layout#cupertino-apps) 等，这些组件可以让你快速搭建出 不同主题的页面。

注意它们不再是内置的基础组件包里的东西，需要引入自己对应的包！


## 输入组件
对应html[表单级别的组件](https://docs.flutter.dev/get-started/fundamentals/user-input)，比如RichText、TextField、Checkbox等等。    
除了基础组件包提供了一些输入组件，Material包中还提供了许多高级输入组件，比如 TextFormField、CheckboxListTile 等。

## 手势组件
GestureDetector 也是flutter内置的基础组件，是一个功能非常强大的组件，支持多种手势识别（例如点击、拖动、缩放等）。你可以使用它来处理点击事件。 
```dart
import 'package:flutter/widgets.dart';

// 应用入口程序
void main() {
  runApp(const MyAppWidget());
}

class MyAppWidget extends StatelessWidget {
  const MyAppWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(  // 将 Center 放在最外层来居中整个 GestureDetector
      child: GestureDetector(
        onTap: () {
          print('哈哈，点我了');
        },
        child: const Text(
          '哈哈',
          textDirection: TextDirection.ltr,
        ),
      ),
    );
  }
}
```  

Material主题包里 也提供了一个处理手势的组件，样式比较好看些： InkWell和GestureDetector 点击时显示水波纹效果。

## 有/无状态组件
flutter将组件分为[有状态和无状态两种](https://docs.flutter.dev/get-started/fundamentals/widgets#widget-state)（和react的无状态组件类似），比如我们上一节写的就是无状态组件，接下来我们写一个有状态的。

```dart
// import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

// 应用入口程序
void main() {
  runApp(const MyAppWidget());
}

class MyAppWidget extends StatefulWidget {
  const MyAppWidget({super.key});

  @override
  MyAppWidgetState createState() => MyAppWidgetState();
}

class MyAppWidgetState extends State<MyAppWidget> {
  int count = 0;

  @override
  Widget build(BuildContext context) {
    return Center(  // 将 Center 放在最外层来居中整个 GestureDetector
      child: GestureDetector(
        onTap: () {
          setState(() {
            count++;
          });
        },
        child: Text(
          '点我后边会自增: $count',
          textDirection: TextDirection.ltr,
        ),
      ),
    );
  }
}
```

StatefulWidget 和 State 被设计成分离的，这样可以保持灵活性，尤其是在组件复杂性增加时，有助于维护和扩展：StatefulWidget 和 State 被设计成分离的，主要目的是保持灵活性和清晰的职责划分，尤其是在组件的复杂性增加时，这种设计可以更好地支持维护和扩展。通过分离 State 和 StatefulWidget，你可以在不影响 UI 逻辑的情况下管理组件的状态，同时也可以在不改变状态管理的情况下修改 UI。

State 是 StatefulWidget 组件的 内部状态 类，负责管理组件的状态和界面渲染，而 StatefulWidget 本身是一个 外部可传递参数的组件，它的构造函数接受外部传入的 color 等参数（State可以通过 widget.buttonColor 可以直接获取 StatefulWidget的属性）[这种结构能够使得组件更加灵活和可复用](https://chatgpt.com/c/6766c6e2-804c-8012-8e30-d54924b9526a)。

还需要注意的是 设置状态必须用 setState 才能触发 flutter更新视图，这个早期的react一样！