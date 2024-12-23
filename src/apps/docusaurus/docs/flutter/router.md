---
sidebar_position: 5
---

# 路由
同 html 一样，在 flutter app 中也存在页面之间跳转需求，flutter自然也是支持！
一共支持两种，Navigator 与 go_router!

:::tip 提示 
WidgetsApp 虽也支持路由，但功能比 Material&CupertinoApp 少很多，它没提供像 MaterialPageRoute 这样现成路由管理方式。  

下例中我们会使用 MaterialPageRoute（WidgetsApp可以直接使用它，因为它是独立的功能，它并没有强依赖于 MaterialApp） 甚至直接 Material/CupertinoApp来学习路由，熟练之后 我们再考虑自己继承PageRoute来实现一个页面跳转、页面过渡、动画、路由栈等等高级功能，目前我们不必从零开始构建这些基础功能！
:::


## Navigator路由
没有复杂深层链接的小型应用程序可以使用 Navigator，它是flutter内置的一套路由方案，Widgets/Material/CupertinoApp 都可以使用！
### 传统路由
```dart
// main.dart
import 'package:flutter/material.dart';
import 'package:demo/home.dart';

void main() {
  runApp(const MaterialApp(
    home: HomeWidget(),
  ));
}
```

```dart
// home.dart
import 'package:flutter/material.dart';
import 'package:demo/about.dart';

class HomeWidget extends StatelessWidget {
  const HomeWidget({super.key});
  @override
  Widget build(BuildContext context) {
    return Column(children: [
      const Text('首页', textDirection: TextDirection.ltr),
      ElevatedButton(
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (context) => const AboutWidget()),
          );
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
import 'package:demo/home.dart';

class AboutWidget extends StatelessWidget {
  const AboutWidget({super.key});
  @override
  Widget build(BuildContext context) {
    return Column(children: [
      const Text('关于', textDirection: TextDirection.ltr),
      ElevatedButton(
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (context) => const HomeWidget()),
          );
        },
        child: const Text('点击跳转首页'),
      )
    ]);
  }
}
```




### 命名路由
Navigator与MaterialApp.routes结合，将路由收集起来整理一个路由 表，像vue-router或react-router，这就叫做命名路由！   
本质还是Navigator，命名路由 只是对以上传统路由的一种封装，便于管理和组织页面跳转，支持简单导航和深度链接要求！

```dart
// main.dart
import 'package:flutter/material.dart';
import 'package:demo/home.dart';
import 'package:demo/about.dart';



final Map<String, WidgetBuilder> router = {
  '/': (context) => const HelloWidget(),
  '/about': (context) => const AboutWidget(),
};

void main() {
  runApp(MaterialApp(
    routes: router,
  ));
}
```

最后分别在在页面点击事件的内容，修改为如下代码
```dart
Navigator.pushNamed(context, '/about'); // home.dart
Navigator.pushNamed(context, '/'); // about.dart
```

命名路由的最大优点是直观，我们可以通过语义化的字符串来管理路由。但其有一个明显的缺点：不能直接传递路由参数。因此官方不建议使用命名路由。


## go_router路由

针对更复杂的路由管理,具有高级导航和路由要求的 Flutter 应用程序，flutter 出品了一个三方包 [go_router](https://pub.dev/packages/go_router)！

```dart
// main.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:demo/home.dart';
import 'package:demo/about.dart';

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

void main() {
  runApp(MaterialApp.router(
    routerConfig: router,
  ));
}
```

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

:::tip 我该选哪个
其实不用纠结，只要项目中用到了路由，直接上go_router即可！
:::