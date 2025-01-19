# 顶部栏

## 嵌套关系

一个app中，最好是最外层的跟组件不设置appBar，然后子页面按照自己的需求决定是否设置和设置如何样式的appBar
```dart
// App.dart
const Scaffold(
    appBar: AppBar(), // 建议这里不要写
    body: const Demo();
)

// Demo.dart
class Demo  extends StatelessWidget{
 @override
 Widget build(BuildContext context) {
    return const Scaffold(
        appBar: AppBar(), // 否则这里将重叠
        body: const Text('哈哈')
    )
 }
}
```

## 最小高度
appBar默认情况下会给你留足放置内部标题的高度，可有时候，我们仅仅想让其等于状态栏的高度.      
这样还可以让此页面的状态栏改为不透明。
```dart
const Scaffold(
    appBar: PreferredSize(
        preferredSize:  const Size.fromHeight(0), // 设置AppBar的最小高度
        child: AppBar(
            backgroundColor: Colors.blue,
            // title: Text('自定义AppBar高度'),
        ),
    ),
    body:xxx
)
```


## 状态栏不占据高度
有些时候我们希望布局直至到状态栏下边，和状态栏重叠（别管我为啥这么做）
```dart
const Scaffold(
    appBar: AppBar(
        // 设置背景透明
        backgroundColor: Colors.transparent,
        leading: IconButton(
            icon: const Icon(Icons.arrow_back), // 返回按钮
            onPressed: () {
                context.pop(); // 返回按钮点击事件
            },
        ),
    ),
    extendBodyBehindAppBar: true, // 让body延伸到AppBar后面 如果不延伸，也不会是透明
    body: xxxx
)
```
