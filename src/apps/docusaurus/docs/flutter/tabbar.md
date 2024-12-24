---
sidebar_position: 5
---

无论是网页，还是原生开发，tabs 都是是一种常用的布局模型。

## 方式一
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

