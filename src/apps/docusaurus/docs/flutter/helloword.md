---
sidebar_position: 3
---

# 你好世界


## 安装插件
打开你的 Android studio，安装 flutter 插件，这样你后续才能创建 flutter项目

![](https://img.dingshaohua.com/book-fe/202412021122388.png)

## 创建项目

![](https://img.dingshaohua.com/book-fe/202412021127764.jpg)

![](https://img.dingshaohua.com/book-fe/202412021129578.png)

![](https://img.dingshaohua.com/book-fe/202412021140970.png)

## 项目结构
如上 你创建完项目后，项目已经有了默认的文件和代码了，这里[简单解读一下结构](https://blog.csdn.net/2303_80346267/article/details/142998497)
```shell
demo/
├── android/
├── ios/ 
├── lib/
│   └── main.dart
├── test/
├── pubspec.yaml
└── build/
```

### lib
存放应用程序核心代码的目录，所有的 Dart 代码都放在这里。   
默认情况下，lib/ 目录中只有一个文件 main.dart，它是应用程序的入口点。

### pubspec.yaml
Flutter 项目的配置文件，它用于管理项目的依赖、资源和其他元数据，类似于node项目的 package.json
 
在这个文件中，你可以：
* 定义应用的名称、版本和描述、图标和启动画面。
* 添加第三方包（依赖）。
* 声明项目中使用的资源（图片、字体、音频等）。


### android&ios
android/ 和 ios/ 文件夹分别用于存放原生平台的相关代码和配置。这两个文件夹允许 Flutter 项目与原生 Android 和 iOS 平台进行交互，使用平台特定的功能和资源。

一般我们不会动！

### test
测试模块，Flutter 提供了强大的测试框架，你可以编写单元测试、集成测试和 Widget 测试，如果用不到可以删除！



## 简单例子
Flutter是一款移动应用程序SDK，包含框架、widget和工具, 在Flutter中,大多数东西都是widget,我们就从widget开始学起！

[一个最简单的Flutter应用程序](https://blog.csdn.net/sinat_17775997/article/details/90144258)只需要一个widget即可
```dart
import 'package:flutter/material.dart';

// 主方法（入口）
void main() {
  runApp(const MyAppWidget());
}

// 这是你应用程序的根部件（widget）。
class MyAppWidget extends StatelessWidget {
  const MyAppWidget({super.key});

  /*
   * build 作用是描述一个部件如何构建它的 UI。
   * 相当于 早期 React的render函数
   */
  @override
  Widget build(BuildContext context) {
    // Text是flutter内置的一个小组件（在flutter/material.dart中定义），作用类似于html中的p元素，
    // 前边的const说明这个text元素的内容不会更新 是死的，无状态的！
    return const Text( 
      '-----Hello World!-----',
      textDirection: TextDirection.ltr // 文本靠右
    );
  }
}
```
![](https://img.dingshaohua.com/book-fe/202412021344522.jpg)


## flutter内置组件
`package:flutter/material.dart` 包是 Flutter 提供的一组小部件，专门用于实现 **Material Design** 风格（Google 提出的设计语言，旨在创建具有一致性、直观和美观的用户界面）的 UI。它内置了不限于以下组件： 
  - **`Scaffold`**：一个标准的页面布局结构，包含了应用程序的 `AppBar`、`Drawer`、`Body` 等。
  - **`AppBar`**：一个顶部的应用栏，通常包含标题、菜单等。
  - **`Text`**：用于显示文本的部件。
  - **`FlatButton` / `ElevatedButton`**：按钮部件。
  - **`Container`**：一个用于布局的容器，可以设置大小、边距、背景色等。
  - **`Column` / `Row`**：用于纵向或横向排列其他小部件的布局部件。
  - **`Icon`**：用于显示图标的小部件。
  - **`ListView`**：用于显示列表的部件。
  - **导航和路由**：`Navigator`、`MaterialPageRoute` 等，用于在不同页面间导航。
  - **卡片、浮动按钮**：如 `Card`、`FloatingActionButton` 等，可以方便地创建具有 Material 风格的 UI 元素。
  - **`ThemeData`**：定义应用的整体样式。
  - **`Theme`**：提供当前的主题数据，可以通过 `Theme.of(context)` 获取当前的主题配置。
  - ...


总之，`package:flutter/material.dart` 是构建 Flutter 应用时最常用的包之一，提供了一个全面的组件或工具，帮助你快速开发出符合 Material Design 规范的现代应用。
