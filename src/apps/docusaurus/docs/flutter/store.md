---
sidebar_position: 7
---

# 全局状态

类似于 vue 中的 vuex、react 中的 redux，flutter 及其周边社区在这几年也在努力的自己的全局状态管理器。  
从 [Provider](provider) 到 [Riverpod](https://pub.dev/packages/riverpod) 等有众多的 [三方库](https://juejin.cn/post/7271496874942349352) 如[雨后春笋般](https://juejin.cn/post/7371720794979188777)冒出！

本文主要讲的是 Riverpod，其实网上相关博文也很多 [跟 🤡 杰哥一起学 Flutter](https://juejin.cn/post/7359402114018689076)、[重走 Flutter 状态管理之路](https://juejin.cn/post/7098144503063642143)！

## 安装

pubspec.yaml

```yml
dependencies:
  # ...
  flutter_riverpod: ^2.6.1 # 全局状态管理工具
```

## 基础使用

### 入口集成 Riverpod

首先需要 将根组件用 ProviderScope 包裹，  
因为 ProviderScope 组件 为你的应用提供管理和使用全局状态的一个上下文容器。

这个和你在 react 使用 redux，是一样的！

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

同样，这也和 vuex、redux 一样，你需要定义一个状态文件

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

其实我们在[这一步](store#定义状态)的时候，已经简单的定义了一个状态 ，这是一个**可读可写**的状态，但是有时候我们希望这个状态是**只读**的，我么可以这么定义

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final msgProvider = Provider<String>(
      (ref) => "hello",
);
```

这样，你再调用修改的 API，就会报错！

### 引用类型的状态

1. 不可变状态：   
无论是基本数据类型还是复杂对象类型（引用类型），在 Riverpod 中都强调不可变性。每次状态更新时，都需要返回一个新的对象实例，而不是直接修改现有对象。

2. copyWith 方法：   
为了更新复杂对象类型的状态，copyWith 方法是常见的做法。它通过创建一个新的对象副本并修改其中的部分字段来更新状态，确保了状态对象的不可变性。
copyWith 还非常适用于嵌套对象的状态更新，可以递归地使用 copyWith 方法来更新嵌套对象，而不是直接修改嵌套对象的属性。

3. 否需要第三方库（如 cloneDeep）？    
通常情况下，使用 copyWith 就足够了。如果需要处理更复杂的深拷贝逻辑，或者你需要定制某些深度拷贝的行为（比如忽略某些字段或深度拷贝复杂对象的特殊需求），可以使用第三方库（如 json_serializable）来帮助你生成深拷贝的代码。但大多数情况下，copyWith 和 Dart 的内建功能已经足够应对常见的需求。


#### 😊 简单引用类型状态


定义复杂数据类型的状态，可不像定义基本数据类型那么简单：如同 Redux 一样，Riverpod 也强调每次状态更新都必须 返回一个新的状态对象，而不能直接修改现有状态。这个原则的目的是确保状态的变化是可追踪和可调试的，从而避免副作用。两者都强调 **不可变状态** 和 创建新状态副本 的方式来触发 UI 更新。

:::tip
基本类型（Primitive types） 的更新确实与引用类型（如类对象、集合等）不同。在 Dart 中，基本类型的变量存储的是其值而不是引用，所以更新基本类型的值时，不需要像引用类型那样担心对象的不可变性和引用副本的问题。
:::

所以针对 引用类型的状态，我们需要提供一个 copyWith 的方法来方便使用的地方来更新数据！

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

class UserState {
    String name;
    int Age;
    UserState({
        this.name='',
        this.age=-1
    });
    UserState copyWith({ String? name, int? age}) {
        return UserState(
            name: name ?? this.name,
            age: age ?? this.age,
        );
    }
}
final userProvider = StateProvider<UserState>(
      (ref) => User(),
);
```

在使用的地方，我们这么用

```dart
// 获取当前状态
UserState userState = ref.read(userProvider.notifier).state;

// 创建新的 userState，并更新其name和age
ref.read(userProvider.notifier).state = userState.copyWith(
  name: '张三'，
  age: 10
);
```

#### 😊 嵌套引用类型状态

如果涉及到更复杂的引用类型状态，我们可以这么做

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

class Wife {
    String name;
    int Age;
    Wife({
        this.name='',
        this.age=-1
    });
    Wife copyWith({ String? name, int? age}) {
        return Wife(
            name: name ?? this.name,
            age: age ?? this.age,
        );
    }
}

class ManState {
    String name;
    int Age;
    Wife wife;
    ManState({
        this.name='',
        this.age=-1,
        Wife? wife
    }): wife = wife ?? Wife(); // 如果没有传入 wife，则创建一个新的
    ManState copyWith({ String? name, int? age, Wife? wife,}) {
        return ManState(
            name: name ?? this.name,
            age: age ?? this.age,
            wife: wife ?? this.wife, 
        );
    }
}
final mainProvider = StateProvider<ManState>(
      (ref) => ManState(),
);
```

使用的时候，以此类推
```dart
// 获取当前状态
ManState manState = ref.read(manProvider.notifier).state;

// 创建新的 userState，并更新其name和age
ref.read(manProvider.notifier).state = manState.copyWith(
  name: '张三'，
  age: 20,
  wife: state.wife.copyWith(
    name: '小红'，
    age: 18,
  ),
);
```

:::tip 融汇贯通
Redux / Vuex / Flux：前端框架的状态管理（如 Redux 和 Vuex）都强调 不可变性 和 单向数据流。这些概念与 Flutter 的 Riverpod 和 Provider 很相似，都要求每次更新状态时，不直接修改原有状态，而是返回一个新的状态对象。这种方式可以避免副作用，并且帮助状态变化的可追踪性。
:::

### 参数解读

定义状态的一些关键字解读

- StateProvider：管理可变的状态，它允许你通过 .state 来读取和更新状态。
- ProviderScope ：Riverpod 的根组件，管理应用的所有 Provider。它通常放置在 MaterialApp 或 CupertinoApp 上层。
- ConsumerWidget：Riverpod 的一种特殊类型的 StatelessWidget，它可以通过 WidgetRef 访问和订阅 Provider。每当 Provider 中的状态变化时，ConsumerWidget 会自动重新构建。
- ref.watch：监听 counterProvider 的值。当 counterProvider 的值发生变化时，Counter 组件会自动重新构建并显示新的值。
- ref.read：获取 StateProvider 的 StateController，然后通过 .state 修改它的值。

## 和 redux 或 vuex 对比

Riverpod 与 Vuex 不同，Vuex 或 redux 则更加灵活且不干扰原组件的生命周期和继承模型 相当的解耦合，但 Riverpod 在 Flutter 中的集成方式更为 紧密，尤其是涉及到组件的构建和状态管理时。  
使用 Riverpod 时，往往会要求你的组件继承 ConsumerWidget，或者使用 Consumer 来访问 Riverpod 管理的状态。

所以如果你是 web 前端开发者，学 Riverpod 时候，思维要稍微转变一点点！
