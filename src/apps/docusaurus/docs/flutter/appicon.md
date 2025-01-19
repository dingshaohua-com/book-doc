# app icon


## 插件
### flutter_launcher_icons
插件 [flutter_launcher_icons](https://pub.dev/packages/flutter_launcher_icons)，可以一键生成启动图和图标，   
```yml titile="pubspec.yaml"
dependencies:
  flutter_launcher_icons: ^0.14.3 # 启动图

flutter_launcher_icons:
  android: true
  ios: true
  image_path: "assets/img/ic_launch.png"
```

最后执行命令，即可生成资源到项目中
```shell
dart run flutter_launcher_icons
```

注意的是，它[不支持 svg](https://stackoverflow.com/a/68243936/24214332) 等[矢量图](https://github.com/fluttercommunity/flutter_launcher_icons/issues/20)，尽管安卓原生已经支持！

[设置图标背景颜色的方案](https://github.com/fluttercommunity/flutter_launcher_icons/issues/618#issuecomment-2526372765)
```yaml
android: true
ios: true
image_path: "assets/images/icon.png"
adaptive_icon_background: "#ffffff"
adaptive_icon_foreground: "assets/images/icon.png"
```

仍需注意的是，这个icon图一定要设置合适的内边距，否则不是超出，就是显得小，建议按照ios app icon 的边距来就可以。

### flutter_native_splash
插件 [flutter_launcher_icons](https://pub.dev/packages/flutter_native_splash) 主要用于生成启动图。

[从 Android 12 开始，不支持全屏启动画面](https://stackoverflow.com/questions/74553692/flutter-splashscreen-not-full-screen-android-12)。

所以为了之后的发展考虑，推荐 flutter_launcher_icons



## 安卓

### 图标
设计好icon，png 或 svg 等格式都可以，然后 按照[这个教程](https://www.bilibili.com/video/av433668097)即可


### 名称
编辑 `android/app/src/main/AndroidManifest.xml`，找到 `android:label`，修改对应的值即可

## 启动图




## 参考
[Flutter之修改App的图标、名称](https://blog.csdn.net/nonagontech/article/details/141871234)   
[Flutter | 兩個平台App Icon的設置方式](https://yiichenhi.medium.com/flutter-%E5%85%A9%E5%80%8B%E5%B9%B3%E5%8F%B0app-icon%E7%9A%84%E8%A8%AD%E7%BD%AE%E6%96%B9%E5%BC%8F-647e7bc2e680)   
[flutter_launcher_icons使用](https://juejin.cn/post/6844904118876651527)



