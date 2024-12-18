---
sidebar_position: 2
---

# 安装

我这里以macos 为例，假设我们要开发andriod（实际上 flutter是跨端的，只不过开发的时候需要准备的环境不同）。


## 安装dart
你无需单独安装 Dart，因为 Flutter SDK 包含了完整的 Dart SDK，后边会有安装Dart SDK教程。


## 安装Flutter SDK
**下载和解压**   
去官网[下载SDK包](https://docs.flutter.cn/release/archive)解压！   
比如我解压后的位置在 `/Users/dsh/files.localized/soft/flutter`!


**配置环境变量**   
假定你的 Mac 运行的是最新的默认 shell 既 [zsh](https://zhuanlan.zhihu.com/p/658811059)， 
```shell
# $HOME 代表用户主目录，比如这里代表 /Users/dsh
export PATH=$HOME/files.localized/soft/flutter/bin:$PATH
```
最后，重启终端，即可生效！

**验证**   
输入 `flutter --version`，得到类似如下输出，代表成功
```shell
dsh@MacBook-Pro ~ % flutter --version
Flutter 3.24.5 • channel stable • https://github.com/flutter/flutter.git
Framework • revision dec2ee5c1f (5 周前) • 2024-11-13 11:13:06 -0800
Engine • revision a18df97ca5
Tools • Dart 3.5.4 • DevTools 2.37.3
```

## 安装 andriod环境
这里有[具体教程](/android/env)