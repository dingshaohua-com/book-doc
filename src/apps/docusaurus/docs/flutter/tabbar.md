---
sidebar_position: 5
---
# 标签页

无论是网页，还是原生开发，tabs 都是是一种常用的布局模型。

## 顶部导航
对于 Material app，你可以使用 Scaffold widget，它是页面的基本结构，包含了 AppBar、body 和 bottomNavigationBar 等属性，还可以用它来提供默认的 banner 背景颜色，还有用于添加抽屉、提示条和底部列表弹窗等等。
```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(
    home: DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar( // 定义顶部栏,类似于html中的<header>
          bottom: const TabBar(
            tabs: [
              Tab(icon: Icon(Icons.directions_car)),
              Tab(icon: Icon(Icons.directions_transit)),
              Tab(icon: Icon(Icons.directions_bike)),
            ],
          ),
        ),
        body: const TabBarView( // 定义顶部栏,类似于html中的<content>
          children: [
            Icon(Icons.directions_car),
            Icon(Icons.directions_transit),
            Icon(Icons.directions_bike),
          ],
        ),
      ),
    ),
  ));
}
```

![](https://img.dingshaohua.com/book-fe/202412241935106.gif)



## 底部导航

假设我有如下的标签栏和对应标签页内容
```dart
/*
* 定义标签栏和标签页
* */
const _widgetOptions = <Widget>[Text('😄首页内容'), Text('搜索内容☺️')];
const _barItems = <BottomNavigationBarItem>[
  BottomNavigationBarItem(
    icon: Icon(Icons.home),
    label: '首页',
  ),
  BottomNavigationBarItem(
    icon: Icon(Icons.search),
    label: '搜索',
  ),
];
```

### 方式一
```dart
/*
* 入口函数
* */
void main() {
  runApp(const MyApp());
}

/*
* 根组件
* */
class MyApp extends StatefulWidget {
  const MyApp({super.key});
  @override
  MyAppState createState() => MyAppState();
}

class MyAppState extends State<MyApp> {
  int currentIndex = 0;
  void onTap(int index) {
    setState(() {
      currentIndex = index;
    });
  }
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(),
        body: Center(
          child: _widgetOptions.elementAt(currentIndex),
        ),
        bottomNavigationBar: BottomNavigationBar(
            currentIndex: currentIndex, onTap: onTap, items: _barItems
        ),
      )
    );
  }
}
```

### 方式二
```dart
import 'package:flutter/material.dart';

/*
* 入口函数
* */
void main() {
  runApp(const MyApp());
}

/*
* 根组件
* */
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: MyHomePage(),
    );
  }
}

/*
* 首页
* */
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});
  @override
  MyHomePageState createState() => MyHomePageState();
}

class MyHomePageState extends State<MyHomePage> {
  int currentIndex = 0;
  void onTap(int index) {
    setState(() {
      currentIndex = index;
    });
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Center(
        child: _widgetOptions.elementAt(currentIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
          currentIndex: currentIndex, onTap: onTap, items: _barItems
      ),
    );
  }
}
```
![](https://img.dingshaohua.com/book-fe/202412242327329.gif)


一般来说，如果你的应用结构比较简单，第一个方式也能满足需求；      
但如果项目较大，组件逻辑较复杂，第二种方式能够更好地进行解耦和组织。      
两者并无实质区别， 仅在组织代码和组件层次上有些不同！

另外还一个新手值得注意的是：当你使用 TabBar 和 TabBarView 时，通常 不需要在每个标签页中再次定义 Scaffold，因为 Scaffold 已经在外部的 TabBar 所在的父组件中定义好了，避免冗余的 Scaffold 定义。