---
sidebar_position: 4
---

# 组件
flutter 将一切都视为[组件](https://docs.flutter.dev/get-started/fundamentals/widgets)，你看到的丰富多彩的的页面本质上都是由一个个小组件组合而成，如 Text、Image、Icon 等，可以把组件理解为跟网页开发中的 HTML 标签  其概念是一样的。

## 基础组件
flutter内置许多基础小组件，比如上文中出现的最简单的 Text组件，他们都位于 `flutter/widgets.dart` 包中，[这里可以查看](https://api.flutter.dev/flutter/widgets/widgets-library.html)所有基础小组件的 列表和相关用法！


## 布局组件
除了图片、文本组件，在flutter中，还有一些[单纯为布局](https://docs.flutter.dev/get-started/fundamentals/layout)而生的[布局组件](https://docs.flutter.dev/ui/widgets/layout) 类似于html中的div、span，如 Align、Padding、Center 等。它们也是内置基础组件的一种！


## 输入组件
对应html[表单级别的组件](https://docs.flutter.dev/get-started/fundamentals/user-input)，比如RichText、TextField、Checkbox等等。    
除了基础组件包提供了一些输入组件，Material包中还提供了许多高级输入组件，比如 TextFormField、CheckboxListTile 等。

## 手势组件
GestureDetector 是 flutter 内置的功能非常强大基础组件，支持多种手势识别（如点击、拖动、缩放等）：
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

高级主题组件 Material 里 也提供了一个处理手势且样式比较好看的组件 InkWell和GestureDetector，点击时显示水波纹效果。

## 有状态组件
在实际开发中，某些Widget情况下我们展示的数据并不是一层不变的：
比如Flutter默认程序中的计数器案例，点击了+号按钮后，显示的数字需要+1；
再比如在开发中，我们会进行下拉刷新、上拉加载更多，这时数据也会发生变化；


所以 flutter 将组件分为[有状态（继承StatelessWidget）和无状态（继承StatefulWidget）两种](https://docs.flutter.dev/get-started/fundamentals/widgets#widget-state)（和react的无状态组件类似），上边的例子就是无状态组件，我们来写一个有状态的：

```dart
import 'package:flutter/widgets.dart';

// 应用入口程序
void main() {
  runApp(const MyAppWidget());
}

class MyAppWidget extends StatefulWidget {
  const MyAppWidget({super.key});

  // 它是一个用于创建与该 widget 关联的 State 对象 的 工厂函数（固定写法w）！
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


### 组件和状态分离
编写有状态组件的时候，你会观察到 我们将 (Stateful)Widget 和 State分离成了两个 class，实际上这是 flutter故意这么设计的：     
* 性能：因为在Flutter中，只要数据改变了Widget就需要重新构建（rebuild），避免到 widget 不会被重复构建才这么做！
* 分工：State 是 Widget 内部状态 类，负责管理组件的状态和界面渲染，而 Widget 是个 外部可传递参数的组件(有点像hook)！

### 更新状态
注意的是 设置状态必须用 setState 才能触发 flutter更新视图，这个早期的react也一样！

<!-- 它的构造函数接受外部传入的 color 等参数（State可以通过 widget.buttonColor 可以直接获取 StatefulWidget的属性）[这种结构能够使得组件更加灵活和可复用](https://chatgpt.com/c/6766c6e2-804c-8012-8e30-d54924b9526a)。 -->

## 传递参数
### 外部参数
最简单的示例如下，我们自定义了 红色文本显示组件，然后传递它文本即可
```dart
import 'package:flutter/widgets.dart';

// 主方法（入口）
void main() {
  runApp(const MyAppWidget());
}

// 这是你应用程序的根部件（widget）。
class MyAppWidget extends StatelessWidget {
  const MyAppWidget({super.key});
  @override
  Widget build(BuildContext context) {
    return const RedTextWidget(str: '你好'); // 通过构造，传递参数
  }
}

// 这是自定义的RedTextWidget组件
class RedTextWidget extends StatelessWidget {
  final String str; // 通过定义实例的属性（相当于prop）
  const RedTextWidget({super.key, required this.str});
  @override
  Widget build(BuildContext context) {
    return Text(str, 
        style: const TextStyle(color: Color(0xFFFF0000)), 
        textDirection: TextDirection.ltr 
        );
  }
}
```


### 内部参数
如上说述，在有状态组件中，状态和组件是分离两个类，那状态类如何获取组件类定义的属性呢？

通过 `widget.xx` 获取！
```dart
import 'package:flutter/widgets.dart';

// 应用入口程序
void main() {
  runApp(const MyAppWidget());
}

class MyAppWidget extends StatefulWidget {
  final String str = '哈哈';
  const MyAppWidget({super.key});
  @override
  MyAppWidgetState createState() => MyAppWidgetState();
}

class MyAppWidgetState extends State<MyAppWidget> {
  @override
  Widget build(BuildContext context) {
    return Text(
      '来自Widget的str属性: ${widget.str}',
      textDirection: TextDirection.ltr,
    );
  }
}
```

## 快速构建App类型组件
你可能会觉得自己使用布局组件来进行繁琐的布局太麻烦！      
没关系，flutter 提供了帮助你快速构建App的组件，它们提供了应用的全局配置，比如主题、路由、导航等，定义应用的样式和行为，并提供了一些生命周期函数！

* [WidgetsApp](https://api.flutter.dev/flutter/widgets/WidgetsApp-class.html)组件，不依赖任何设计风格， 提供最基础的 App 类型组件，适合完全自定义的应用，提供最小功能集，比如导航、路由配置等（在flutter/widgets.dart中）。
* 适合合安卓风格的 [MaterialApp](https://docs.flutter.dev/ui/layout#material-apps)，并包含WidgetsApp所有能力（在flutter/material.dart中）。
* 适合Ios的[CupertinoApp](https://docs.flutter.dev/ui/layout#cupertino-apps) ，并包含WidgetsApp所有能力（在flutter/cupertino.dart中）。

这3个组件都， 都可以满足你 帮你快速搭建出 干净或不同主题的 app 😊！


:::tip 提示
后两者都基于前者做了扩展，但是一般情况下，不会直接使用WidgetsApp，而是使用MaterialApp或者CupertinoApp。

最佳实践：MaterialApp 是大多数 Flutter 应用的默认选择，很多 Flutter 开发者都是从 MaterialApp 开始的，这也是为什么官方推荐使用 MaterialApp
:::

:::warning 提示
需注意 WidgetsApp中不允许使用 Material/CupertinoApp 的组件， 这跟原生html中不允许使用vue或react组件是一个道理。
:::
