---
order: 2
---

# Web 接入

## 安装

安装声网 SDK for web 的依赖

```shell
npm install agora-rtc-sdk-ng
```

:::tip 针对 Ts
node_modules/agora-rtc-sdk-ng 路径下提供了 .d.ts 文件导出详细的类型定义，[API 文档的 Global 页面](https://doc.shengwang.cn/api-ref/rtc/javascript/globals)列出了所有 SDK 导出的模块和类型。
:::

## 测试 Code

我们来定义一个辅助函数

```js
// rtc-helper.js
import AgoraRTC from "agora-rtc-sdk-ng";

let rtc = {
  // For the local audio and video tracks.
  localAudioTrack: null,
  localVideoTrack: null,
  client: null,
};

let options = {
  appId: "xxx",
  channel: "xxx",
  token: "xxx",
  uid: 456,
};

/**
 * 开始直播或观看
 */
export const startBasicLiveStreaming = async () => {
  rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

  document.getElementById("host-join").onclick = async function () {
    rtc.client.setClientRole("host");
    await rtc.client.join(
      options.appId,
      options.channel,
      options.token,
      options.uid
    );
    // Create an audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a video track from the video captured by a camera.
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // Publish the local audio and video tracks to the channel.
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
    // Dynamically create a container in the form of a DIV element for playing the local video track.
    const localPlayerContainer = document.createElement("div");
    // Specify the ID of the DIV container. You can use the `uid` of the remote user.
    localPlayerContainer.id = options.uid;
    localPlayerContainer.textContent = "Local user " + options.uid;
    localPlayerContainer.style.width = "640px";
    localPlayerContainer.style.height = "480px";
    document
      .querySelector("#join-channel-local-video")
      .append(localPlayerContainer);

    rtc.localVideoTrack.play(localPlayerContainer);

    console.log("publish success!");
  };

  document.getElementById("audience-join").onclick = async function () {
    rtc.client.setClientRole("audience");
    await rtc.client.join(
      options.appId,
      options.channel,
      options.token,
      options.uid
    );
    rtc.client.on("user-published", async (user, mediaType) => {
      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success");

      // If the subscribed track is video.
      if (mediaType === "video") {
        // Get `RemoteVideoTrack` in the `user` object.
        const remoteVideoTrack = user.videoTrack;
        // Dynamically create a container in the form of a DIV element for playing the remote video track.
        const remotePlayerContainer = document.createElement("div");
        // Specify the ID of the DIV container. You can use the `uid` of the remote user.
        remotePlayerContainer.id = user.uid.toString();
        remotePlayerContainer.textContent =
          "Remote user " + user.uid.toString();
        remotePlayerContainer.style.width = "640px";
        remotePlayerContainer.style.height = "480px";
        document
          .querySelector("#join-channel-remote-video")
          .append(remotePlayerContainer);

        // Play the remote video track.
        // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
        remoteVideoTrack.play(remotePlayerContainer);
      }

      // If the subscribed track is audio.
      if (mediaType === "audio") {
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        // Play the audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }
    });

    rtc.client.on("user-unpublished", (user) => {
      // Get the dynamically created DIV container.
      const remotePlayerContainer = document.getElementById(user.uid);
      // Destroy the container.
      remotePlayerContainer.remove();
    });
  };

  document.getElementById("leave").onclick = async function () {
    // Close all the local tracks.
    rtc.localAudioTrack.close();
    rtc.localVideoTrack.close();
    // Traverse all remote users.
    rtc.client.remoteUsers.forEach((user) => {
      // Destroy the dynamically created DIV containers.
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
    });

    // Leave the channel.
    await rtc.client.leave();
  };
};
```

这是一个基于 webpack 创建的 vue2 项目

```vue
<!-- app.vue -->
<template>
  <div class="live-room-plus-h5-container">
    <!-- <el-button @click="rtcInit()">注册</el-button> -->
    <div>
      <button type="button" id="host-join">作为主播加入</button>
      <button type="button" id="audience-join">作为观众加入</button>
      <button type="button" id="leave">离开</button>
    </div>
    <div class="videos">
      <!--在界面中添加本地视频窗口 -->
      <div id="join-channel-local-video"></div>
      <!--在界面中添加远端视频窗口 -->
      <div id="join-channel-remote-video"></div>
    </div>
  </div>
</template>
<script>
import { startBasicLiveStreaming } from "@/utils/rtc-web-helper.js";
export default {
  mounted() {
    startBasicLiveStreaming();

  },
};
</script>
<style lang="less" scoped>
.app {
  .videos {
    display: flex;
    .join-channel-local-video,
    .join-channel-remote-video {
      width: 300px;
      height: 250px;
    }
  }
}
</style>
```

以上为官方的示例代码，你可以参考这个示例代码进行优化。
