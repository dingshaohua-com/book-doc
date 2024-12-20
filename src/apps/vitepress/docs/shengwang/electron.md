---
order: 2
---

# Electron 接入

## 安装

在安装之前，需先为 SDK 配置好当前系统信息

::: code-group

```js [macOS]
// package.json
{
 "agora_electron": {
    "platform": "darwin",
    "prebuilt": true
  }
}
```

```js [windows]
// package.json
{
 "agora_electron": {
   "platform": "win32",
   "prebuilt": true,
   "arch": "ia32"
  }
}
```

:::

好了，我们现在可以安装声网 SDK 的依赖，注意是在 electron 主进程的项目中安装

```shell
npm install agora-electron-sdk
```


## 主进程配置

声望要求 electron 项目：需要开启 node 集成，关闭上下文隔离（尽管 [electron 官方非常不提倡这么做](https://www.electronjs.org/zh/docs/latest/tutorial/security#%E6%B8%85%E5%8D%95%E5%AE%89%E5%85%A8%E5%BB%BA%E8%AE%AE)！想要用 ipc？声网 SDK 并未兼容会报错，自己研究去吧 😊）

```js
// main.js
const mainWindow = new BrowserWindow({
  // ...
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    // ...
  },
});
```

## 渲染进程配置

:::danger 跳过此步
如果你的 renderder 是传统的 Html，则无需关注此步。
:::

:::tip 术语提示
注意，renderder、web 侧指 electron 的渲染进程，区别于 electron 的主进程！
:::

因为 `agora-electron-sdk` 属于 `electron ` 进程的模块，且还用到了 webpack 的能力！

所以若你的渲染进程(既 renderer ，也就是 web) 是现代化项目（ 需要打包或者编译）的话，需要在渲染进程项目中 忽略此包被打包 或 编译 或依赖预构建 的步骤，也就是 需如下配置：

::: code-group

```js [webapck项目]
// webpack.config.js
{
  externals: {
   "agora-electron-sdk": "commonjs2 agora-electron-sdk"  // 排除agora-electron-sdk依赖项
  }
}

```

```js [vite项目]
// vite.config.js
{
  optimizeDeps: {
    exclude: ["agora-electron-sdk"]; // 排除agora-electron-sdk依赖项
  }
}
```

:::

若你不这么做，在启动 webpack 的渲染进程时，会提示无法找到模块 agora-electron-sdk。而由于 vite 项目 按需加载的特性，虽不会在启动过程立即报错，但是在使用到该模块时会报错如下：
![](https://img.dingshaohua.com/book-fe/202412201458357.png)

```
Vite: Could not resolve "../build/Release/agora_node_ext"
```

不仅仅是此插件，在 electron 集成 node 环境之后， 若在渲染进程中使用 electron 的模块或 Node 模块 最好都要这么处理！


## 测试Code
:::tip 注意
以下代码都是渲染进程项目中，既web项目中的内容
:::

我们来定义一个辅助函数

```js
// rtc-helper.js
const {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  VideoSourceType,
  VideoViewSetupMode,
} = require("agora-electron-sdk");

const APPID = "xxx"; // 填入你的 App ID
let token = "xxx"; // 填入你的临时
const channel = "xxx"; // 填入生成 Token 时使用的频道名
let uid = 123; // 用户 ID，并确保其在频道内的唯一性

/**
 * 初始化rtc
 */
export const initRtc = () => {
  const rtc = createAgoraRtcEngine();
  rtc.initialize({ appId: APPID, logConfig: { filePath: "" } });
  return rtc;
};

/**
 * 加入频道
 */
export const joinChannel = (rtc) => {
  console.log("正在加入频道...", { token, channel, uid });
  rtc.joinChannel(token, channel, uid, {
    // 使用临时 Token 加入频道
    channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting, // 设置频道场景为直播场景
    clientRoleType: ClientRoleType.ClientRoleBroadcaster, // 设置用户角色为主播；如果要将用户角色设置为观众，保持默认值即可
    publishMicrophoneTrack: true, // 发布麦克风采集的音频
    publishCameraTrack: true, // 发布摄像头采集的视频
    autoSubscribeAudio: true, // 自动订阅所有音频流
    autoSubscribeVideo: true, // 自动订阅所有视频流
  });
};

/**
 * 监听一些rtc事件
 */
export const getEventHandles = (rtc) => {
  return {
    // 监听本地用户加入频道事件
    onJoinChannelSuccess: ({ channelId, localUid }, elapsed) => {
      console.log("成功加入频道：" + channelId);
      rtc.setupLocalVideo({
        // 本地用户加入频道后，设置本地视频窗口
        sourceType: VideoSourceType.VideoSourceCameraPrimary,
        uid: uid,
        view: document.querySelector("#join-channel-local-video"),
        setupMode: VideoViewSetupMode.VideoViewSetupAdd,
      });
    },

    // 监听远端用户加入频道事件
    onUserJoined: ({ channelId, localUid }, remoteUid, elapsed) => {
      console.log("远端用户 " + remoteUid + " 已加入");
      rtc.setupRemoteVideo(
        {
          // 远端用户加入频道后，设置远端视频窗口
          sourceType: VideoSourceType.VideoSourceRemote,
          uid: remoteUid,
          view: document.querySelector("#join-channel-remote-video"),
          setupMode: VideoViewSetupMode.VideoViewSetupAdd,
        },
        { channelId }
      );
    },

    // 监听用户离开频道事件
    onUserOffline: ({ channelId, localUid }, remoteUid, reason) => {
      console.log("远端用户 " + remoteUid + " 已离开频道");
      rtc.setupRemoteVideo({
        // 远端用户离开频道后，关闭远端视频窗口
        sourceType: VideoSourceType.VideoSourceRemote,
        uid: remoteUid,
        view: document.querySelector("#join-channel-remote-video"),
        setupMode: VideoViewSetupMode.VideoViewSetupRemove,
      });
    },
  };
};
```



这是一个基于 vite 创建的 vue3 项目
```vue
<!-- app.vue -->
<script setup lang="ts">
import { initRtc, joinChannel, getEventHandles } from '@/utils/rtc-helper';

const rtcInit = async () => {
  try {
    // 初始化 RTC 引擎
    const rtc = initRtc();
    console.log('RTC初始化完成');

    const enableVideoResult = rtc.enableVideo();
    if (enableVideoResult < 0) {
      console.error(`enableVideo failed with error code: ${enableVideoResult}`);
      return;
    }
    console.log('启用视频模块');

    const ret = rtc.startPreview();
    if (ret < 0) {
      console.error(`startPreview failed with error code: ${ret}`);
      return;
    }
    console.log('开启本地视频预览');

    joinChannel(rtc);
    console.log('加入频道');

    // 注册事件回调
    const eventHandles = getEventHandles(rtc);
    rtc.registerEventHandler(eventHandles);
  } catch (error) {
    console.error('RTC初始化失败:', error);
  }
};
</script>

<template>
  <div class="welcom">
    <el-button @click="rtcInit()">开始注册</el-button>
    <div class="videos">
      <div class="video">
        <div class="join-channel-local-video"></div>
        <div class="title">本地视频窗口</div>
      </div>
      <div class="video">
        <div class="join-channel-remote-video"></div>
        <div class="title">远端视频窗口</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.welcom {
  padding: 10px;
}
.videos {
  display: flex;
  margin-left: -10px;
  margin-top: 10px;

  .video {
    width: 300px;
    height: 200px;
    margin-left: 10px;
    background-color: #adf59d;
    position: relative;
    .join-channel-local-video, .join-channel-remote-video{
      width: 100%;
      height: 100%;
    }
    .title {
      position: absolute;
      left: 0;
      top: 0;
      color: #fefefe;
      font-size: 12px;
    }
  }
}
</style>
```