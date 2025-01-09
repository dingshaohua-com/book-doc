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
### 前言
在App 中通常会把主要的几个页面放在下方icon，让使用者能够方便操作，这个元件在flutter 中称为BottomNavigationBar。
而GoRouter则是Flutter 官方所提供的套件，可以用来整合整个专案的路由。   
当这两个功能整合在一起的时候，一个不小心呈现出来的效果就会差很多。   

准备：先创建一个新的项目 叫做my_app！
```shell
flutter create my_app
cd my_app
```

### 加入BottomNavigationBar
在MyHomePage元件中找到build的方法，在Scaffold 加上bottomNavigationBar的属性，加上两个有icon 的元件。
之后执行指令flutter run就可以看到：画面的下方有一个icon 的区块，显示刚刚所加入的search 和add。
```dart
@override
Widget build(BuildContext context) {
  return Scaffold(
    bottomNavigationBar: BottomNavigationBar(
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.search),
          label: 'search',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.add),
          label: 'add',
        ),
      ],
    ),
    appBar: AppBar(
      title: Text(widget.title),
    ),
    body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          const Text(
            'You have pushed the button this many times:',
          ),
          Text(
            '$_counter',
            style: Theme.of(context).textTheme.headline4,
          ),
        ],
      ),
    ),
  );
}
```
<img src="https://img.dingshaohua.com/book-fe/202501100005570.png" width="300" />

### 加入GoRouter
接着要来加入[GoRouter](https://pub.dev/packages/go_router)这个插件。
#### 定义Router
定义两个route，会使用同一个元件，但是透过传入不同title 的内容来做识别。
找到MyApp 这个元件，在build 里面加上这段。
```dart
var router = GoRouter(
  initialLocation: '/page1',
  routes: [
    GoRoute(
      path: '/page1',
      name: 'page1',
      builder: (BuildContext context, GoRouterState state) =>
          const MyHomePage(
        title: 'search',
      ),
    ),
    GoRoute(
      path: '/page2',
      name: 'page2',
      builder: (BuildContext context, GoRouterState state) =>
          const MyHomePage(
        title: 'add',
      ),
    ),
  ],
);
```
接着要调整MyApp 的 return 的行为：原本是用MaterialApp，现在要来改用MaterialApp.router才能加上路由的设定。
```dart
return MaterialApp.router(
  title: 'Flutter Demo',
  theme: ThemeData(
    primarySwatch: Colors.blue,
  ),
  // 把原本的 home 属性刪除并加上这段
  routeInformationProvider: router.routeInformationProvider,
  routeInformationParser: router.routeInformationParser,
  routerDelegate: router.routerDelegate,
);
```
最后 回去调整BottomNavigationBar 的行为，监听onTap的事件，来达到切换页面的效果。
```dart
bottomNavigationBar: BottomNavigationBar(
items: const [
  BottomNavigationBarItem(
    icon: Icon(Icons.search),
    label: 'search',
  ),
  BottomNavigationBarItem(
    icon: Icon(Icons.add),
    label: 'add',
  ),
],
// 监听点击事件
onTap: (index) => context.go('/page${index + 1}'),
```


改好以后重新启动，即可看到效果，整个页面包含NavigationBar 随着导航的切换也都会跟着重新载入（请先忽略点选了第二页但是icon 还是停留在第一页的问题）。   
<img src="https://img.dingshaohua.com/book-fe/202501100006760.gif" width="300" />


#### 使用ShellRoute
根据[GoRouter 的介绍](https://pub.dev/documentation/go_router/latest/go_router/ShellRoute-class.html)，当有需要BottomNavigationBar 的时候，应该要采用ShellRoute的架构，就能够只有内容重新载入。
接着就要动一个比较大的工程，要将Scaffold 整个拉出来放到ShellRoute 中。

建立一个新的组件，就叫它`ScaffoldWithBottomNavBar`，这里为方便 我就不摘取核心代码了，偷个懒直接一个main.dart 到底。
```dart
class ScaffoldWithBottomNavBar extends StatefulWidget {
  const ScaffoldWithBottomNavBar({Key? key, required this.child})
      : super(key: key);
  final Widget child;

  @override
  State<ScaffoldWithBottomNavBar> createState() =>
      _ScaffoldWithBottomNavBarState();
}

class _ScaffoldWithBottomNavBarState extends State<ScaffoldWithBottomNavBar> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'search',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.add),
            label: 'add',
          ),
        ],
        onTap: (index) => context.go('/page${index + 1}'),
      ),
      // 內容由外面來決定
      body: widget.child,
    );
  }
}
```
然后 把这个元件加到路由的定义中。
```dart
var router = GoRouter(
  initialLocation: '/page1',
  routes: [
    // 在原本的路由前面加上 ShellRoute 并且回传刚刚所建立的元件
    ShellRoute(
      builder: ((context, state, child) =>
          ScaffoldWithBottomNavBar(child: child)),
      routes: [
        GoRoute(
          path: '/page1',
          name: 'page1',
          builder: (BuildContext context, GoRouterState state) =>
              const MyHomePage(
            title: 'search',
          ),
        ),
        GoRoute(
          path: '/page2',
          name: 'page2',
          builder: (BuildContext context, GoRouterState state) =>
              const MyHomePage(
            title: 'add',
          ),
        ),
      ],
    ),
  ],
);
```
最后 回到MyHomePage元件将原本加关于 BottomNavigationBar 代码移除掉（因为前面已经将其抽出去放到ShellRoute 中）。
```dart
@override
Widget build(BuildContext context) {
  return Scaffold(
  	// 移除 bottomNavigationBar 属性
    appBar: AppBar(
      title: Text(widget.title),
    ),
    body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          const Text(
            'You have pushed the button this many times:',
          ),
          Text(
            '$_counter',
            style: Theme.of(context).textTheme.headline4,
          ),
        ],
      ),
    ),
  );
}
```
都改完后可以看到，BottomNavigationBar 的区块是固定的了，点击切换只有内容页是不同。   
<img src="https://img.dingshaohua.com/book-fe/202501100007316.gif" width="300" />

### 结论
在web 上会很习惯这种功能的存在，转到flutter 时，一时间没找到也没特别注意到问题，后来是测试的时候才被点出来😅。   
一个元件使用上的小地方，用错方法就会让使用者看起来没有那么舒服！

最后附上完整的代码。
```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// 定义标签栏和标签页
var _barItems = <BottomNavigationBarItem>[
  const BottomNavigationBarItem(
    icon: Icon(Icons.home),
    label: '首页',
  ),
  const BottomNavigationBarItem(
    icon: Icon(Icons.account_circle),
    label: '我的',
  ),
];

// 定义路由路径
var _routes = <String>[
  '/home',
  '/about',
];

class ScaffoldWithNavBar extends StatefulWidget {
  const ScaffoldWithNavBar({super.key, required this.child});
  final Widget child;

  @override
  State<ScaffoldWithNavBar> createState() => _ScaffoldWithNavBarState();
}

class _ScaffoldWithNavBarState extends State<ScaffoldWithNavBar> {
  int currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        items: _barItems,
        onTap: (index) {
          setState(() {
            currentIndex = index;
          });

          context.go(_routes[index]);
        },
      ),
      body: widget.child, // 这里应该是从路由中传入的页面
    );
  }
}

// GoRouter配置
final GoRouter _router = GoRouter(
  initialLocation: '/home',
  routes: [
    ShellRoute(
      builder: (context, state, child) {
        return ScaffoldWithNavBar(child: child);
      },
      routes: [
        GoRoute(
          path: '/home',
          builder: (context, state) {
            return const HomeScreen();
          },
        ),
        GoRoute(
          path: '/about',
          builder: (context, state) {
            return const AboutScreen();
          },
        ),
      ],
    ),
  ],
);

void main() {
  runApp(MaterialApp.router(
    routerConfig: _router,
  ));
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('首页')),
      body: const Center(child: Text('这是首页 页面')),
    );
  }
}

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('关于')),
      body: const Center(child: Text('这是关于页 页面')),
    );
  }
}
```

<img src="https://img.dingshaohua.com/book-fe/202501100011997.webp" width="300" />

注意： 如果切换底部导航切换页面的时候出现一瞬黑屏闪烁，[那是官方bug](https://github.com/flutter/flutter/pull/154057)，将flutter 升级到 v3.27 及其以上就好了。

---
参考
[[flutter] 在GoRoute 中使用NavigationBar](https://jiaming0708.github.io/2023/01/09/flutter-goroute-with-navigation-bar/)


