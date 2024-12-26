---
order: 2
---

# 推送拆解

介绍作为主播使用，如何本地初始化、预览 以及推送出去~

## 准备好参数

这些参数都是注册声网账号的时候，在后台管理页面可以获得

```js
// 声网的一些配置参数
onst params = {
  appId: "123", // 提供你在声网创建应用时，该应用的的 App ID
  token:"456", // 填入app的临时 Token （声网提供的token有效期24小时，后你需要重新生成）
  channel: "first",   // 生成 Token 时使用的频道名称
  uid: 789,   // 用户 ID，并确保其在频道内的唯一性，否则会被相互顶掉
};

```

## 创建实例

这一步是创建声网实例

```js
const rtc = createAgoraRtcEngine();
```

## 初始化

```js
rtc.initialize({ appId: params.appId });
rtc.enableVideo(); // 启用视频模块
```

### 获取硬件信息

如果你要获得设备信息，这里就可以做了（因为启用视频模块成功后，才能获得视频设备信息）

```js
// 获取一些硬件信息
const syncDevices = () => {
  // 摄像头设备
  const videoDeviceManager = rtc.getVideoDeviceManager();
  const videoDevices = videoDeviceManager.enumerateVideoDevices();
  const videoDevice = videoDeviceManager.getDevice();
  console.log("所有：", videoDevices, "当前：", videoDevice);
  // videoDeviceManager.setDevice(deviceId); // 设置摄像头

  // 麦克风设备
  const audioDeviceManager = rtc.getAudioDeviceManager();
  const micDevices = audioDeviceManager.enumerateRecordingDevices();
  const micDevice = audioDeviceManager.getRecordingDevice();
  console.log("所有：", micDevices, "当前：", micDevice);
  // audioDeviceManager.setRecordingDevice(deviceId); // 设置麦克风

  // 扬声器设备
  const audioDevices = audioDeviceManager.enumeratePlaybackDevices();
  const audioDevice = audioDeviceManager.getPlaybackDevice();
  console.log("所有：", audioDevices, "当前：", audioDevice);
  // audioDeviceManager.setPlaybackDevice('deviceId xxx'); // 设置扬声器
};
```

### 设置本地视频窗口

需要在[预览本地视频窗口前](#预览本地视频窗口) 或 [加入频道](#加入频道)设置好,负责无法进行这些操作（即摄像头能打开，但是无法看到本地画面）

```js
rtc.setupLocalVideo({
  sourceType: VideoSourceType.VideoSourceCameraPrimary,
  uid: params.uid,
  view: document.querySelector("#join-channel-local-video"), // 设置本地视频窗口
  setupMode: VideoViewSetupMode.VideoViewSetupAdd,
});
```

### 预览本地视频窗口

在开播前，提前开启本地摄像头，预览效果！

本设置为可选，因为在加入频道摄像头就会被自动打开，此步仅仅是让摄像头提前打开！

```js
rtc.startPreview();
```

### 加入频道

应当让老师提前加入频道，
加入频道 不等同于开播，我们只需将`推送音视频轨道`临时关闭即可，后续主播点击开播时再打开即可！

这样频道至少会被创建，观众可以提前进入直播间（频道会在第一人使用的时候被创建）！

```js
const { ChannelProfileType, ClientRoleType } = require("agora-electron-sdk");

rtc.joinChannel(params.token, params.channel, params.uid, {
  channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting, // 设置频道场景为直播场景
  clientRoleType: ClientRoleType.ClientRoleBroadcaster, // 设置用户角色为主播（默认为观众）
  publishMicrophoneTrack: false, // 发布麦克风采集的音频（如果为true，摄像头会在后台开启）
  publishCameraTrack: false, // 发布摄像头采集的视频 （如果为true，麦克风会在后台开启）
});
```

### 监听回调事件

```js
rtc.registerEventHandler({
  // 监听本地用户加入频道事件
  onJoinChannelSuccess: ({ channelId, localUid }, elapsed) => {
    console.log("成功加入频道：" + channelId);
  },
  // 报告当前直播信息
  onRtcStats: (connection, res) => {
    // res.cpuAppUsage  // App cpu使用率
    // res.cpuTotalUsage   //cpu总使用率
    // res.lastmileDelay  // 网络延时
    // res missPackage // 丢包率
  },
  // 报告本地视频流状态监控
  onNetworkQuality: (connection, remoteUid, txQuality, rxQuality) => {
    let netQuality = "未知";
    if (txQuality == 1 || txQuality == 2) {
      netQuality = "优良";
    } else if (txQuality == 3) {
      netQuality = "一般";
    } else if (txQuality == 4) {
      netQuality = "差";
    } else if (txQuality == 5 || txQuality == 6) {
      netQuality = "糟糕";
    }
    console.log('网络状态', netQuality);
  },
});
```

## 开播

如上说提，我们在[加入频道](#加入频道)的时候，并没有推流，开播的时候则需要做这个操作!
这样观众才能看到你的视频画面！

```js
const options = new ChannelMediaOptions();
options.publishCameraTrack = true;
options.publishMicrophoneTrack = true;
rtc.updateChannelMediaOptions(options);
```

## 下播

```js
rtc.stopCameraCapture(VideoSourceType.VideoSourceCameraPrimary); //关闭摄像头
// 停止推流
const options = new ChannelMediaOptions();
options.publishCameraTrack = false; // 停止摄像头推流
options.publishMicrophoneTrack = false; // 停止麦克风推流
rtc.updateChannelMediaOptions(options);
```
