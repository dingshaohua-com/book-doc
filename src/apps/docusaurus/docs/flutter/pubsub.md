---
sidebar_position: 8
---

# 发布订阅模式

这个不用多说了，什么语言里都存在！

在工具包中 [event_bus](https://pub.dev/packages/event_bus) 是比较出名的，就用它吧！

## 安装

pubspec.yaml

```yml
dependencies:
  # ...
  event_bus: ^2.0.1 # 发布订阅
```

## 基本使用

### 定义事件

创建 事件定义 文件，并初始化和定义事件

```dart title="emiiter.dart"
import 'package:event_bus/event_bus.dart';

## 创建实例
EventBus eventBus = EventBus();

// 定义事件（在强语言中，根据类型来发射和订阅不同事件，而在js中是通过自定义的name）
class PlayEvent {
  final Map<String, dynamic> data;
  PlayEvent(this.data);
}
class CustomEvent {
  final Map<String, dynamic> data;
  CustomEvent(this.data);
}
```

### 应用中订阅

```dart title="main.dart"
import 'package:imusic/emiiter.dart';
/*
* 入口函数
* */
void main() {
    // 注册监听
    eventBus.on<PlayEvent>().listen((event) {
        print('Received play event: ${event}');
    });

    // 发射事件
    eventBus.fire(CustomEvent({'name': '张三'}));
    
    runApp(const MyApp());
}
```
