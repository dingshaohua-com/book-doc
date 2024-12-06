---
sidebar_position: 3
---

# 权限

## 核心权限配置文件
:::tip 提示
只有需要签名的时候 才需要使用配置权限文件。   
不过话说回来，现在 app 不都会签名吗
:::

electron项目中，我们用到的权限 如音视频、文件资源，都需要申明到权限配置文件 `entitlements.plist` 中。   
然后在你的应用代码内部 使用 js api唤起授权弹窗。   
除此之外，还需要在electron builder中 标明权限使用说明。



如果没有定义并使用 entitlements.plist ， 在代码内部唤起授权弹窗 `systemPreferences.askForMediaAccess("xx")`的时候，应用则会闪退

```shell
-------------------------------------
Translated Report (Full Report Below)
-------------------------------------

Process:               xxx [1084]
Path:                  /Volumes/VOLUME/*/xx.app/Contents/MacOS/xx
Identifier:            com.dyxc.liveTeaching
Version:               1.0.0 (1.0.0)
Code Type:             X86-64 (Native)
Parent Process:        launchd [1]
User ID:               501

Date/Time:             2024-08-14 14:05:13.8215 +0800
OS Version:            macOS 13.6.3 (22G436)
Report Version:        12
Bridge OS Version:     8.2 (21P2057)
Anonymous UUID:        62DD98C3-4A94-868D-0446-6884F284741A


Time Awake Since Boot: 350 seconds

System Integrity Protection: disabled

Crashed Thread:        28  Dispatch queue: com.apple.root.default-qos

Exception Type:        EXC_CRASH (SIGABRT)
Exception Codes:       0x0000000000000000, 0x0000000000000000

Termination Reason:    Namespace TCC, Code 0
This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an com.apple.security.device.camera key with a string value explaining to the user how the app uses this data.

Thread 0:: CrBrowserMain Dispatch queue: com.apple.main-thread
0   libsystem_kernel.dylib        	    0x7ff80acb85a2 mach_msg2_trap + 10
...
```

如果没有设置extendInfo来向apple描述你使用权限的声明，则在上传apple store的时候会提示相关报错，无法上传包。


### 音视频权限
通过设置音视频权限，来了解 electron for mac 中，权限如何设置！

如项目中使用到了音视频权限，需要在项目中必须添加权限列表文件，否则会在打包时报错。

```xml title="entitlements.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//ZN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.device.audio-input</key>
    <true/>
    <key>com.apple.security.device.camera</key>
    <true/>
  </dict>
</plist>
```

我们在 electron builder 配置使用权限文件，另外还要向苹果说明你使用权限的目的（非程序使用）
```js title="electron-builder.json"
{
  "mac": {
    ...
    "entitlements": "entitlements.plist",
    "hardenedRuntime": true, // 强制使用安全运行时，防止沙箱绕过（必须）
    "extendInfo": {
      "NSMicrophoneUsageDescription": "请允许访问麦克风",
      "NSCameraUsageDescription": "请允许访问摄像头"
    }
  },
}
```

除此之外，你还要在程序中唤起授权弹窗，向用户索取音视频权限。
```js title="electron-project/main.js"
import { systemPreferences } from "electron";

const askEntitlement =  async () => {
  const microphonePrivilege =
    systemPreferences.getMediaAccessStatus("microphone");
  const cameraPrivilege = systemPreferences.getMediaAccessStatus("camera");
  if (microphonePrivilege !== "granted") {
    await systemPreferences.askForMediaAccess("microphone");
  }
  if (cameraPrivilege !== "granted") {
    await systemPreferences.askForMediaAccess("camera");
  }
};

askEntitlement();
```

但是当你开启了 hardenedRuntime 来加强应用的安全性时，那么你需要把这个安全性放宽一点。也就是说你需要在 entitlements.mac.plist 里在指定一下下面的属性:[com.apple.security.cs.allow-jit](https://link.zhihu.com/?target=https%3A//developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_cs_allow-jit)、[com.apple.security.cs.allow-unsigned-executable-memory](https://link.zhihu.com/?target=https%3A//developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_cs_allow-unsigned-executable-memory)、[com.apple.security.cs.allow-dyld-environment-variables](https://link.zhihu.com/?target=https%3A//developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_cs_allow-dyld-environment-variables)  。 那么现在最终的 entitlements.mac.plist 内容如下:
```xml title="entitlements.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//ZN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.allow-dyld-environment-variables</key>
    <true/>
    <key>com.apple.security.device.audio-input</key>
    <true/>
    <key>com.apple.security.device.camera</key>
    <true/>
  </dict>
</plist>
```


### 网络权限
如果你的应用需要访问网络，需要添加网络权限。
```xml
<key>com.apple.security.network.client</key>
<true/>
<key>com.apple.security.network.server</key>
<true/>
```


### 沙箱权限（mas必须）
如果打包为mas 平台，即需要上传到apple store， 必须要添加沙箱权限，否则审核不会通过，而dmg等其它则没必要添加此权限。
```xml title="entitlements.plist"
<key>com.apple.security.app-sandbox</key>
<true/>
```


## 继承权限文件（mas必须）
如果打包为mas 平台，即需要上传到apple store，   
必须添加entitlementsInherit 继承权限列表配置文件，   
用于允许开发者指定一个或多个父级 plist 文件（如从 network进程、渲染进程等），从中继承权限设置。

固定写法，如下即可。
```js title="electron-builder.json"
{
  ...
  "mas":{
    ...
    "entitlementsInherit": "entitlements.inherit.plist",
  }
}
```

```xml title="entitlements.inherit.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//ZN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.inherit</key>
    <true/>
  </dict>
</plist>
<true/>
```

## testFleght权限文件（mas必须）
如果要分发到testFleght 供测试（一般都是必须），必须配置针对它的权限配置文件，固定写法 如下即可
```js title="electron-builder.json"
{
  ...
  "mas":{
    ...
    "entitlementsLoginHelper": "entitlements.loginhelper.plist",
  }
}
```

```xml title="entitlements.loginhelper.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>com.apple.security.app-sandbox</key>
        <true/>
        <key>com.apple.security.cs.allow-jit</key>
        <true/>
    </dict>
</plist>
```





<!-- 
## 参考

[Electron-builder 构建 MacOS 应用小白教程（打包 & 签名 & 公证 & 上架）](https://juejin.cn/post/7009179524520738824)  
[超完整的 Electron 打包签名更新指南，这真是太酷啦！](https://juejin.cn/post/7350495799661477926)  
[Mac Electron 应用如何进行签名（signature）和公证（notarization）？](https://www.jindouyun.cn/document/industry/details/184160)

## 临时

```js
"extendInfo": {
      "ITSAppUsesNonExemptEncryption": false, // 解决上传apple store connect里提示 “缺少出口合规证明”，意思是不加密（添加沙箱权限导致）
      "NSMicrophoneUsageDescription": "请允许访问麦克风",  // 如果签名 则必须plist里神明权限，并在此定义访问权限的原因 最终会被打包的inf.plist内
      "NSCameraUsageDescription": "请允许访问摄像头"
    },
```

另外 mac 是通用打包配置，mas 是 mac 的 pkg 格式配置（用于上传到 apple store 分发），dmg 是 dmg 格式的配置（用户个人分发），他们两个最终会和通用配置合并。

不论是个人还是 apple store 分发，都需要签名，否则可能会导致用户不能安装，
签名就需要权限列表文件，是必须的。

权限还需要结合 NSMicrophoneUsageDescription 诸如此类授权说明，否则（无论 dmg 还是 pkg）签名也不过

如果上 apple store 分发，至少还需要添加必要的沙箱权限，而且本地会会打不开 mas 包（pkg 和对应.app），这是正常的，上传后在下载就可以了。 -->
