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

## 缓存

标签页的缓存其实就是组件对本身的状态缓存。默认情况下，当你在标签页之间切换时，Flutter 会销毁当前的组件并重新创建新的组件。

```dart
import 'package:flutter/material.dart';


class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  int count = 0;

  @override
  void initState() {
    super.initState();
    // 通过看这里的输出，可以以此判断组件是否被重新加载
    print('执行了');
  }

  @override
  Widget build(BuildContext context) {
    return Center(
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


/*
* 定义标签栏和标签页
* */
const _widgetOptions = <Widget>[HomePage(), Text('搜索内容☺️')];
const _barItems = <BottomNavigationBarItem>[
  BottomNavigationBarItem(
    icon: Icon(Icons.home),
    label: '首页',
  ),
  BottomNavigationBarItem(
    icon: Icon(Icons.account_circle),
    label: '关于',
  ),
];

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

<img src="https://img.dingshaohua.com/book-fe/202501091312789.webp" width="200"/>

如果你希望在切换时不丢失状态（例如滚动位置、表单输入等），你可以将页面组件进行缓存，以下是具体方式！

### 方式一 IndexedStack

使用 IndexedStack 组件缓存页面 , IndexedStack 组件会把组件一次性先创建好，堆叠窗口，通过 index 切换显示对应的窗口。所以我们只需要将上一步 MyAppState 组件 build 的 body 部分换成 IndexedStack 组件 包裹即可，其它都不变

```dart
body: IndexedStack(
  index: currentIndex,
  children: _widgetOptions,
)
```

<img src="https://img.dingshaohua.com/book-fe/202501091318764.webp" width="200"/>

### 方式二 PageView（推荐）
使用PageView组件，组件混入AutomaticKeepAliveClientMixin配合使用，即可实现组件缓存。
```dart
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> with AutomaticKeepAliveClientMixin<HomePage> {
  @override
  bool get wantKeepAlive => true; // 组件（页面）是否开启缓存（第1步）

  int count = 0;

  @override
  void initState() {
    super.initState();
    // 通过看这里的输出，可以以此判断组件是否被重新加载
    print('执行了');
  }

  @override
  Widget build(BuildContext context) {
    super.build(context); // 注意这里必须写，调用父类build机制（第2步）
    return Center(
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

/*
* 定义标签栏和标签页
* */
const _widgetOptions = <Widget>[HomePage(), Text('关于页面 ☺️')];
const _barItems = <BottomNavigationBarItem>[
  BottomNavigationBarItem(
    icon: Icon(Icons.home),
    label: '首页',
  ),
  BottomNavigationBarItem(
    icon: Icon(Icons.account_circle),
    label: '关于',
  ),
];

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
  late PageController _pageController; // （第3-1步）

  @override
  void initState() {
    super.initState();
    _pageController = // （第3-2步）
        PageController(initialPage: currentIndex, keepPage: true);
  }

  @override
  void dispose() { // （第3-3步）
    _pageController.dispose();
    super.dispose();
  }

  void onTap(int index) {
    setState(() {
      currentIndex = index;
      _pageController.jumpToPage(currentIndex); // （第3-4步）
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: Scaffold(
      appBar: AppBar(),
      body: PageView( // （第3-5步）
        physics: const NeverScrollableScrollPhysics(), // 禁止左右滑动切换页面
        controller: _pageController,
        children: _widgetOptions,
      ),
      bottomNavigationBar: BottomNavigationBar(
          currentIndex: currentIndex, onTap: onTap, items: _barItems),
    ));
  }
}

```


虽然效果也是做方式一一样，但是推荐这种方式，因为可以更好的控制具体某一个页面是否开启缓存！

参考： [stackoverflow](https://stackoverflow.com/questions/49439047/how-to-preserve-widget-states-in-flutter-when-navigating-using-bottomnavigation)、[Flutter实现页面状态缓存的几种方法](https://blog.csdn.net/weixin_45295253/article/details/125368884)

## 与路由结合
