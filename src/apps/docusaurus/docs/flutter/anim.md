# 动画

## 动态隐藏导航条
```dart
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:imusic/components/player_ball.dart';

/*
* 定义标签栏和标签页
* */
var _barItems = <BottomNavigationBarItem>[
  BottomNavigationBarItem(
      icon: SvgPicture.asset("assets/img/bottom_bar/songs.svg",
          width: 30, height: 30),
      label: '歌单'),
  BottomNavigationBarItem(
      icon: SvgPicture.asset("assets/img/bottom_bar/top.svg",
          width: 30, height: 30),
      label: '排行'),
  BottomNavigationBarItem(
      icon: SvgPicture.asset("assets/img/bottom_bar/me.svg",
          width: 30, height: 30),
      label: '我的'),
];

class ScaffoldWithNavBar extends StatefulWidget {
  final StatefulNavigationShell navigationShell;
  final bool showNavBar;

  const ScaffoldWithNavBar({
    required this.navigationShell,
    this.showNavBar = false,
    Key? key,
  }) : super(key: key ?? const ValueKey('ScaffoldWithNavBar'));

  @override
  _ScaffoldWithNavBarState createState() => _ScaffoldWithNavBarState();
}

class _ScaffoldWithNavBarState extends State<ScaffoldWithNavBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _heightAnimation;

  @override
  void initState() {
    super.initState();

    // 初始化动画控制器
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );

    // 定义高度动画
    _heightAnimation = Tween<double>(  // 用于定义动画的起始和结束值
      // 表示动画开始时的高度为 0 像素（假设这是底部导航栏的高度），end: 60 表示动画结束时的高度为 60 像素（完全隐藏）。
      begin: 0,
      end: 64,
    ).animate(CurvedAnimation(
      parent: _controller, // parent 参数绑定到 _controller
      curve: Curves.easeInOut, // curve 参数设置为 Curves.easeInOut，表示动画在开始和结束时都会逐渐加速和减速，中间部分速度较快。
    ));



    // 初始化动画状态
    if (widget.showNavBar) {
      _controller.forward(); // 显示
    } else {
      _controller.reverse(); // 隐藏
    }
  }

  @override
  void didUpdateWidget(covariant ScaffoldWithNavBar oldWidget) {
    super.didUpdateWidget(oldWidget);

    // 根据 showNavBar 的变化触发动画
    if (widget.showNavBar) {
      print("显示");
      _controller.forward(); // 显示
    } else {
      print("隐藏");
      _controller.reverse(); // 隐藏
    }
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      body: Stack(
        children: [
          widget.navigationShell,
          const PlayerBall(), // 悬浮播放小球
        ],
      ),
      bottomNavigationBar: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          // 当高度接近 0 时，移除导航栏内容
          if (_heightAnimation.value <= 0.1) {
            return const SizedBox.shrink(); // 返回空组件以释放空间
          }
          return SizedBox(
            height: _heightAnimation.value, // 动态调整高度
            child: child,
          );
        },
        child: BottomNavigationBar(
          items: _barItems,
          currentIndex: widget.navigationShell.currentIndex,
          onTap: (int index) => _onTap(context, index),
        ),
      ),
    );
  }

  void _onTap(BuildContext context, int index) {
    var initialLocation = index == widget.navigationShell.currentIndex;
    widget.navigationShell.goBranch(index, initialLocation: initialLocation);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
```