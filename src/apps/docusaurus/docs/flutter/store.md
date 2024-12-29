---
sidebar_position: 7
---

# 全局状态
类似于vue中的vuex、react中的redux，flutter及其周边社区在这几年也在努力的自己的全局状态管理器。   
从 [Provider](provider) 到 [Riverpod](https://pub.dev/packages/riverpod) 等有众多的 [三方库](https://juejin.cn/post/7271496874942349352) 如[雨后春笋般](https://juejin.cn/post/7371720794979188777)冒出！

本文主要讲的是 Riverpod，其实网上相关博文也很多 [跟🤡杰哥一起学Flutter](https://juejin.cn/post/7359402114018689076)、[重走Flutter状态管理之路](https://juejin.cn/post/7098144503063642143)！


## 安装
pubspec.yaml
```yml
dependencies:
  # ...
  flutter_riverpod: ^2.6.1 # 全局状态管理工具
```

## 基础使用
### 入口集成Riverpod
首先需要 将根组件用 ProviderScope 包裹，   
因为 ProviderScope 组件 为你的应用提供管理和使用全局状态的一个上下文容器。

这个和你在react使用redux，是一样的！

```dart title="main.dart"
import 'package:flutter_riverpod/flutter_riverpod.dart';

/*
* 入口函数
* */
void main() {
  runApp(const ProviderScope(child: MyApp()));
}
```


### 定义状态
同样，这也和vuex、redux一样，你需要定义一个状态文件
```dart title="store.dart"
import 'package:flutter_riverpod/flutter_riverpod.dart';

final msgProvider = StateProvider<String>(
      (ref) => "hello",
);
```


### 页面使用
页面组件需要继承自 ConsumerWidget。   
![](https://img.dingshaohua.com/book-fe/202412292001669.gif)
```dart title="demo_page.dart"
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:demo/store.dart';

class DemoPage extends ConsumerWidget {
  const DemoPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 获取全局状态 msg
    final msg = ref.watch(msgProvider);
    return Column(
      children: [
        Text(msg),  // 读取
        ElevatedButton(
          onPressed: () {
            ref.read(msgProvider.notifier).state = "你好"; // 设置
          },
          child: const Text('测试'),
        )
      ],
    );
  }
}
``` 

## 页面更多使用方式
如上的使用方式如果不能是你满意：不想改变原有继承，不想与 Riverpod 状态紧密耦合。   
那你还可以这么用：使用 Consumer 在 StatelessWidget 中监听状态
```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:demo/store.dart';

class DemoPage extends StatelessWidget {
  const DemoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer(builder: (context, ref, child) {
      // 获取全局状态 msg
      final msg = ref.watch(msgProvider);
      return Column(children: [
        Text(msg), // 读取
        ElevatedButton(
          onPressed: () {
            ref.read(msgProvider.notifier).state = "你好"; // 设置
          },
          child: const Text('测试'),
        )
      ]);
    });
  }
}
```


## 定义状态
### 状态类型
其实我们在[这一步](store#定义状态)的时候，已经简单的定义了一个状态 ，这是一个可读可写的状态，但是有时候我们希望这个状态是只读的，我么可以这么定义
```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final msgProvider = Provider<String>(
      (ref) => "hello",
);
```
这样，你再调用修改的API，就会报错！

### 参数解读
定义状态的一些关键字解读
* StateProvider：管理可变的状态，它允许你通过 .state 来读取和更新状态。
* ProviderScope ：Riverpod 的根组件，管理应用的所有 Provider。它通常放置在 MaterialApp 或 CupertinoApp 上层。
* ConsumerWidget：Riverpod 的一种特殊类型的 StatelessWidget，它可以通过 WidgetRef 访问和订阅 Provider。每当 Provider 中的状态变化时，ConsumerWidget 会自动重新构建。
* ref.watch：监听 counterProvider 的值。当 counterProvider 的值发生变化时，Counter 组件会自动重新构建并显示新的值。
* ref.read：获取 StateProvider 的 StateController，然后通过 .state 修改它的值。


## 和redux或vuex对比
Riverpod 与 Vuex 不同，Vuex 或 redux 则更加灵活且不干扰原组件的生命周期和继承模型 相当的解耦合，但Riverpod 在 Flutter 中的集成方式更为 紧密，尤其是涉及到组件的构建和状态管理时。   
使用 Riverpod 时，往往会要求你的组件继承 ConsumerWidget，或者使用 Consumer 来访问 Riverpod 管理的状态。

所以如果你是 web前端开发者，学Riverpod时候，思维要稍微转变一点点！