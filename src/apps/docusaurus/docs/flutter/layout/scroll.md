---
sidebar_position: 3
---

# 滚动组件

Flutter 提供了很多 可滚动组件（Scrolling Widget） ，如以下：

- ListView 用于创建垂直或水平排列的滚动列表。
- GridView 用于创建二维网格状的滚动视图。
- PageView 用于实现可滚动页面，可用于引导页、轮播图等。

在 Flutter 中，可滚动组件的核心架构主要由 Scrollable、Viewport 和 Sliver 三个角色组成。以下是它们的职责和相互关系：

- Scrollable 是滚动的核心逻辑实现，处理用户交互和滚动偏移量。
- Viewport 根据 Scrollable 的滚动位置，确定显示的内容区域。
- Sliver 提供具体的内容布局，并动态加载和管理其子组件。

## 类型

### ListView

```dart
const ListView.builder(
  itemCount: 5,
  itemBuilder: (_, index) => ListTile(title: Text('$index')),
);
```

<img src="https://img.dingshaohua.com/book-fe/202501220043176.png" width="300"/>

### GridView

```dart
const GridView.builder(
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2, // 每行2列
    crossAxisSpacing: 10.0,
    mainAxisSpacing: 10.0,
  ), // 定义网格布局的规则和约束。它决定了网格项的大小、排列方式以及网格之间的间距
  itemCount: 3,
  itemBuilder: (context, index) {
    return Container(
      color: Colors.blue,
      child: Center(child: Text('Item $index')),
    );
  },
);
```

<img src="https://img.dingshaohua.com/book-fe/202501220043781.png"  width="300"/>

### PageView

<img src="https://img.dingshaohua.com/book-fe/202501220050512.webp"  width="300"/>

## 加载与刷新

在 Flutter 中，RefreshIndicator 是一个用于实现下拉刷新效果的组件，常用于与可滚动组件（如 ListView、GridView）结合，提供用户刷新的交互体验

以下是完整的实现步骤和代码示例：

---

### 实现步骤

1. 下拉刷新：使用 `RefreshIndicator` 包裹 `ListView.builder`，并定义一个异步方法来刷新数据。
2. 上拉加载：使用 `ScrollController` 监听滚动事件，当用户滚动到底部时触发加载更多数据。
3. 状态管理：定义 `isLoading` 来控制加载状态，避免重复触发加载更多的逻辑。

---

### 完整代码示例

```dart
import 'package:flutter/material.dart';

class SongsPage extends StatefulWidget {
  const SongsPage({super.key});

  @override
  SongsPageState createState() => SongsPageState();
}

class SongsPageState extends State<SongsPage> {
  final List<String> _items = []; // 数据列表
  final ScrollController _scrollController = ScrollController();
  int _page = 1;
  bool _isLoadingMore = false; // 上拉加载状态

  @override
  void initState() {
    super.initState();
    _loadInitialData(); // 初始加载数据
    _scrollController.addListener(() {
      // 检测是否滚动到底部
      if (_scrollController.position.pixels ==
              _scrollController.position.maxScrollExtent &&
          !_isLoadingMore) {
        _loadMoreData();
      }
    });
  }

  // 下拉刷新
  Future<void> _refreshData() async {
    setState(() {
      _page = 1; // 重置页码
      _items.clear(); // 清空旧数据
    });
    await _loadInitialData(); // 重新加载数据
  }

  // 加载初始数据
  Future<void> _loadInitialData() async {
    List<String> newData = await _fetchData(_page);
    setState(() {
      _items.addAll(newData);
    });
  }

  // 上拉加载更多
  Future<void> _loadMoreData() async {
    setState(() {
      _isLoadingMore = true;
    });

    List<String> newData = await _fetchData(_page + 1);
    setState(() {
      _page++; // 更新页码
      _items.addAll(newData);
      _isLoadingMore = false;
    });
  }

  // 模拟数据请求
  Future<List<String>> _fetchData(int page) async {
    await Future.delayed(const Duration(seconds: 2)); // 模拟网络延迟
    return List.generate(10, (index) => 'Item ${(page - 1) * 10 + index + 1}');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('下拉刷新 & 上拉加载')),
      body: RefreshIndicator(
        onRefresh: _refreshData,
        child: ListView.builder(
          controller: _scrollController,
          itemCount: _items.length + 1, // 包含加载指示器
          itemBuilder: (context, index) {
            if (index == _items.length) {
              // 底部加载指示器
              return _isLoadingMore
                  ? const Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Center(child: CircularProgressIndicator()),
                    )
                  : const SizedBox.shrink();
            }
            return ListTile(title: Text(_items[index]));
          },
        ),
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose(); // 释放资源
    super.dispose();
  }
}
```

---

**代码详解**

1. **下拉刷新**：

   - 使用 `RefreshIndicator` 包裹 `ListView.builder`。
   - 定义 `_refreshData()` 方法重置数据并加载第一页。

2. **上拉加载**：

   - 使用 `ScrollController` 检测滚动事件。
   - 在 `itemBuilder` 中根据 `index` 判断是否显示加载指示器。

3. **异步加载数据**：

   - 模拟网络请求，`_fetchData()` 返回分页数据。

4. **状态管理**：
   - `isLoadingMore` 防止重复触发加载更多。

---

运行效果：

- 下拉刷新可清空并重新加载数据。
- 滚动到底部会加载下一页数据，同时显示加载指示器。

## 自定义滚动组件

前面介绍的 ListView、GridView、PageView 都是一个完整的可滚动组件（所谓完整是指它们都包括 Scrollable 、 Viewport 和 Sliver）。

但假如我们想要在滚动部分区域内加一些其他组件，如下效果
<img src="https://img.dingshaohua.com/book-fe/202501220136627.webp"  width="300"/>

我们可以通过使用自定义滚动组件 CustomScrollView 来做：

```dart
var otherView = SliverToBoxAdapter(
  child: Container(
    height: 300,
    color: Colors.red,
    child: const Text("哈哈"),
  ),
);
var listView = SliverList(
  delegate: SliverChildBuilderDelegate(
    (_, index) => ListTile(title: Text('$index')),
    childCount: 10,
  ),
);
CustomScrollView(
    slivers: [otherView, listView],
);
```

在 Flutter 中，CustomScrollView 的 slivers 属性只接受 Sliver 类型的组件，因此不能直接将普通的 Container 或 Text 放入 slivers 中。你的代码中直接将 Container 和 listView 添加到 CustomScrollView 的 slivers 中，会导致错误。如果你想在 CustomScrollView 中使用普通组件，可以用 SliverToBoxAdapter 将它们包装起来。

另外，可滚动组件都有对应的 Sliver：如
* ListView提供了SliverList
* GridView提供了SliverGrid
* 更多参考 [这里](https://www.cnblogs.com/linuxAndMcu/p/18458653)





