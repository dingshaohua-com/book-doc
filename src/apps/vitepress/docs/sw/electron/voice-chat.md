---
order: 4
---

# 连麦

连麦是指两个人或多个人通过网络语音或视频通话进行实时交流的活动。在直播行业中，连麦通常指的是主播与其他主播、嘉宾或者观众之间的互动交流。

但是连麦未必只是语音交流，也可能会开视频，也可能上台的时候什么都不开（麦克风 or 摄像头）。

## 观众

### 初始化 RTC

```js
const rtc = createAgoraRtcEngine();
rtc.initialize({
  appId: params.appId,
  channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting, // 设置频道场景为直播
});
```

### 加入频道
观众加入频道的时候，需要设置角色为观众（audience），并且不发布音频和视频流，和主动订阅其他用户和主播音视频流。
```js
rtc.joinChannel(params.token, String(params.channel), Number(params.uid), {
  channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting, // 设置频道场景为直播场景
  clientRoleType: ClientRoleType.ClientRoleAudience, // 设置用户角色为观众；如果要将用户角色设置为观众 ClientRoleBroadcaster
  publishMicrophoneTrack: false, // 发布麦克风采集的音频
  publishCameraTrack: false, // 发布摄像头采集的视频
  autoSubscribeAudio: true, // 自动订阅所有音频流
  autoSubscribeVideo: true, // 自动订阅所有视频流
});
```

### 开启麦克风监听

这样可以监听到音量变化，从而得知谁在说话，这个应该在初始化后就调用，会触发 `onAudioVolumeIndication`

```js
rtc.enableAudioVolumeIndication(2000, 3, false);
```

### 连麦

```js
// 只是改变角色（仅能改变当前用户），不要立刻推流,应该添加 麦克风和摄像头开关按钮在做这些动作
const showMeStatus = ref(false);
const doVoiceChat = async () => {
  showMeStatus.value = !showMeStatus.value;
  const role = showMeStatus.value
    ? ClientRoleType.ClientRoleBroadcaster
    : ClientRoleType.ClientRoleAudience;
  rtc.setClientRole(role);
};
```

### 注册监听事件

```js
const remoteUsers = ref([]); // 定义当前秀台（既已连麦的用户）
rtc.registerEventHandler({
    // 监听当前秀台上 谁在说话
  onAudioVolumeIndication: (
    connection,
    speakers,
    speakerNumber,
    totalVolume
  ) => {
    remoteUsers.value.forEach((user) => {
      delete user.speak;
    });

    speakers.forEach((speaker) => {
      const exist = remoteUsers.value.find(
        (item) => item.remoteUid === speaker.uid
      );
      if (exist) {
        exist.speak = speaker;
      }
    });
  },

  // 监听当前用户用户角色变化会，变成主播时，应该推到remoteUsers 既上秀台
  onClientRoleChanged(connection, oldRole, newRole, newRoleOptions) {
    const oldIndex = remoteUsers.value.findIndex(
      (item) => item.remoteUid === connection.localUid
    );
    const exist = oldIndex > -1;
    // 本地切换角色
    console.log("onClientRoleChanged", connection, newRole);
    // const role = showMeStatus.value ? ClientRoleType.ClientRoleBroadcaster : ClientRoleType.ClientRoleAudience;
    if (newRole == ClientRoleType.ClientRoleBroadcaster) {
      if (!exist) {
        remoteUsers.value = [
          {
            connection,
            remoteUid: connection.localUid,
            elapsed: "local",
            videoMuted: 1,
            audioMuted: 1,
          },
          ...remoteUsers.value,
        ];
      }
    } else {
      if (exist) {
        remoteUsers.value.splice(oldIndex, 1);
      }
    }
    console.log(remoteUsers.value);
  }, 
  

// 监听远端用户用户角色变化会，变成主播时，应该推到remoteUsers 既上秀台
  onUserJoined: (connection, remoteUid, elapsed) => {
    console.log("远端加入");
    if (route.query.teacher_id == remoteUid) {
      renderTeacherVideo(connection, remoteUid, elapsed);
    } else {
      const exist = remoteUsers.value.find(
        (item) => item.remoteUid === remoteUid
      );
      if (!exist) {
        remoteUsers.value = [
          ...remoteUsers.value,
          { connection, remoteUid, elapsed, videoMuted: 1, audioMuted: 1 }, // 默认视频和音频状态都是禁用
        ];
      }
    }
  },

  // 监听远端用户用户离开
  onUserOffline: (connection, remoteUid, reason) => {
    console.log("远端离开");
    const existIndex = remoteUsers.value.findIndex(
      (item) => item.remoteUid === remoteUid
    );
    if (existIndex > -1) {
      ElMessage.warning("用户" + remoteUid + "已离开，离开原因：" + reason);
      remoteUsers.value.splice(existIndex, 1);
    }
  },

  // 监听远端用户麦克风状态
  onUserMuteAudio: (connection, remoteUid, muted) => {
    console.log("onUserMuteAudio", remoteUid, muted);
    remoteUsers.value.forEach((user) => {
      if (user.remoteUid == remoteUid) {
        user.audioMuted = muted;
      }
    });
  },

  // 监听远端用户摄像头状态
  onUserMuteVideo: (connection, remoteUid, muted) => {
    console.log("onUserMuteVideo", remoteUid, muted);
    remoteUsers.value.forEach((user) => {
      if (user.remoteUid == remoteUid) {
        user.videoMuted = muted;
      }
    });
  },
});
```
