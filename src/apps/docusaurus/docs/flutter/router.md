---
sidebar_position: 5
---

# 路由
同 vue  或 react 一样，在 flutter app 中也存在页面之间跳转需求，于是 flutter 官方推出了 自己出品的路由管理器（类似于 vue-router 或 react-router），叫做 [go_router](https://pub.dev/packages/go_router)！


你的 app 须使用 [app级组件](wedget#快速构建app类型组件) 搭建项目，才能使用路由功能，因为flutter并没有赋予普通组件路由的能力！鉴于 app级组件之一的 WidgetsApp 配置路由步骤过于麻烦，且不常见，所以我们选用更为常见  MaterialApp 来搭建我们的应用：

## 路由定义
### 基本使用
路由定义
```dart
// lib/router
import 'package:go_router/go_router.dart';
import 'package:demo/home.dart';
import 'package:demo/about.dart';

// 路由配置
final GoRouter router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeWidget(),
    ),
    GoRoute(
      path: '/about',
      builder: (context, state) => const AboutWidget(),
    ),
  ],
);
```


app使用路由
```dart
// main.dart
import 'package:flutter/material.dart';
import 'package:demo/router.dart';

void main() {
  runApp(MaterialApp.router(
    routerConfig: router,
  ));
}
```

### 封装一下
其实上边有点类似于 react 将路由作为根组件的情况，这就会造成 main.js代码过重的情。回到flutter来，我们可以将根组件提取出去, MyApp 就是根组件，这样main就不用背负太多的代码
```dart
import 'package:flutter/material.dart';
import 'package:demo/router.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: router,  // 路由配置
    );
  }
}
```

### 两者区别
* 第一个版本： MaterialApp.router 直接在 runApp() 中调用，没有额外的封装。
* 第二个版本： MaterialApp.router 被封装在 MyApp 组件内，通过 runApp(MyApp()) 启动应用。
* 虽然在组织代码结构上有所差异，但是在功能本质上没有区别。

## 使用路由
路由定义完整后，我们如何在页面使用呢？
```dart
// home.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HelloWidget extends StatelessWidget {
  const HelloWidget({super.key});
  @override
  Widget build(BuildContext context) {
    return Column(children: [
      const Text('首页', textDirection: TextDirection.ltr),
      ElevatedButton(
        onPressed: () {
          context.go('/about');
        },
        child: const Text('点击跳转关于页'),
      )
    ]);
  }
}
```

```dart
// about.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AboutWidget extends StatelessWidget {
  const AboutWidget({super.key});
  @override
  Widget build(BuildContext context) {
    return Column(children: [
      const Text('关于', textDirection: TextDirection.ltr),
      ElevatedButton(
        onPressed: () {
          context.go('/');
        },
        child: const Text('点击跳转首页'),
      )
    ]);
  }
}
```

![](https://img.dingshaohua.com/book-fe/202412230217395.gif)
