# 存储

在开发 app 的过程中，难免不会用到本地存储，将一些常用数据缓存到到本地的能力。

## shared_preferences

记得安装 [shared_preferences]((https://pub.dev/packages/shared_preferences)) 插件

```dart
import 'package:shared_preferences/shared_preferences.dart';


final SharedPreferencesAsync asyncPrefs = SharedPreferencesAsync();
await asyncPrefs.setBool('repeat', true);
await asyncPrefs.setString('action', 'Start');
final bool? repeat = await asyncPrefs.getBool('repeat');
final String? action = await asyncPrefs.getString('action');
await asyncPrefs.remove('repeat');
// Any time a filter option is included as a method parameter, strongly consider
// using it to avoid potentially unwanted side effects.
await asyncPrefs.clear(allowList: <String>{'action', 'repeat'});
```

目前 它不支持设置缓存时长，需要你自己设定逻辑即可！