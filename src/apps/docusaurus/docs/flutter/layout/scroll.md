---
sidebar_position: 3
---

# 列表加载和刷新

在 Flutter 中，可以通过结合 `RefreshIndicator`（下拉刷新）和 `ListView.builder`（上拉加载）实现下拉刷新和上拉加载的功能。

以下是完整的实现步骤和代码示例：

---

## 实现步骤

### 1. 下拉刷新
使用 `RefreshIndicator` 包裹 `ListView.builder`，并定义一个异步方法来刷新数据。

### 2. 上拉加载
使用 `ScrollController` 监听滚动事件，当用户滚动到底部时触发加载更多数据。

### 3. 状态管理
定义 `isLoading` 来控制加载状态，避免重复触发加载更多的逻辑。

---

## 完整代码示例

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

## 代码详解

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