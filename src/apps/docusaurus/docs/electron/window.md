---
sidebar_position: 4
---

# 窗口

窗口是 electron app 对外展示的主体。
你的 electron app 就是通过窗口来展示应用内容。

通常我们所说的 窗口指的就是一个浏览器窗口 `BrowserWindow`,当你的 electron app 就绪后 此时就需要创建窗口并加载页面了。

```js
app.whenReady().then(() => {
  new BrowserWindow({
    // ... options
  }).loadFile("index.html");
});
```

![](https://img.dingshaohua.com/book-fe/202409131426614.webp)

## 尺寸

宽和高、以及最大宽高等和尺寸相关属性

```js
const win = new BrowserWindow({
  width: 800,
  height: 600,
  minWidth: 400,
  minHeight: 300,
  maxWidth: 1000,
  maxHeight: 800,
  resizable: false, // 禁止改变窗口大小
});
win.setMinimizable(false); // 隐藏窗口最小化按钮
win.setMaximizable(false); // 隐藏窗口最大化按钮
win.setMinimumSize(960, 600); // 动态设置窗口尺寸
```

## 无边框

默认为有边框，无边框下 windows 和 mac 的展示效果：其实就是隐藏了 titleBar 标题栏

```js
new BrowserWindow({
  width: 300,
  height: 160,
  frame: false,
});
```

看看对比：左边为默认正常 右边为无边框（上 mac，下 windows）

![](https://img.dingshaohua.com/book-fe/202409121431041.webp)

## 透明

默认不透明，设置为透明后则能透过 app 看到电脑桌面，下边左右对比不透明的图

```js
new BrowserWindow({
  width: 300,
  height: 160,
  transparent: false,
});
```

看看对比：右边为默认正常 左边为无边框（上 mac，下 windows）
![](https://img.dingshaohua.com/book-fe/202409121504650.webp)

:::tip 与无边框
如果设置了窗口透明，则无边框属性强制为 true， 即便你手动设置成了有边框也会无效。  
另外 transparent 不可以动态设置，一旦启用就无法程序内部动态修改，如果你有类似的需求 不妨创建多个窗口来取代
:::

## 标题栏

titleBarStyle 即 标题栏，一般包含 logo、标题、窗口操作按钮。

### 隐藏

我们可以通过设置 titleBarStyle 来设置标题栏的样式，比如隐藏

```js
new BrowserWindow({
  width: 300,
  height: 160,
  titleBarStyle: "hidden",
  titleBarOverlay: true, //防止 windows 下窗口原生控制按钮会被页面内容覆盖（mac的不会被覆盖）
});
```
看看对比：左边为无边框 右边为默认正常（上 mac，下 windows）
![](https://img.dingshaohua.com/book-fe/202409121710861.webp)

### 控制按钮

控制按钮 指的是 窗口的 最小化、最大化、关闭 按钮。  
mac 在右侧，而 windows 在左侧。

**隐藏**  
windows 下只要定义只要定义 隐藏标题栏，就会连同操作按钮一起隐藏。  
mac 则不需要隐藏标题栏，只需定义 `win.setWindowButtonVisibility(false)` 即可隐藏操作按钮（win 无效）。

```js
const mainWindow = new BrowserWindow({
  width: 300,
  height: 160,
});
mainWindow.setWindowButtonVisibility(false);
```
看看对比：左边为隐藏 右边为默认正常
![](https://img.dingshaohua.com/book-fe/202409131348474.webp)

**hover 显隐**  
当鼠标放上去的时候，控制按钮会显示出来，移开时则会隐藏（注意，此属性仅支持 mac）。

```js
const mainWindow = new BrowserWindow({
  width: 300,
  height: 160,
  titleBarStyle: "customButtonsOnHover",
});
```

![](https://img.dingshaohua.com/book-fe/202409131411210.gif)

**位置**  
当 titleBarStyle 设置为 hiddenInset 时候，可以明显感觉到比设置为 hidden 时，窗口的控制按钮 的位置更偏上一点（注意，此属性仅支持 mac）。

```js
const mainWindow = new BrowserWindow({
  width: 300,
  height: 160,
  titleBarStyle: "hiddenInset",
});
```

![](https://img.dingshaohua.com/book-fe/202409131440587.webp)

如果你想更精准的设置，可以通过坐标去控制（注意，此属性仅支持 mac）。

```js
const mainWindow = new BrowserWindow({
  width: 300,
  height: 160,
  titleBarStyle: "hidden", // 必须设置，否则下边无效
  trafficLightPosition: { x: 1, y: 1 },
});
```

![](https://img.dingshaohua.com/book-fe/202409131500793.webp)



### 自定义

在你大展拳脚之前，要了解几个默认布局的相关参数：   
mac 和 windows下默认的组件的相关尺寸
![](https://img.dingshaohua.com/book-fe/202409141730295.webp)




好了，接下来我们学习如何自定义款好看的标题栏！   
在隐藏标题栏的情况下，我们可以通过 titleBarOverlay 来实现覆盖标题栏默认样式（此字段，必须 在titleBarStyle 为 hidden情况下 方可生效）。  
。

```js
const mainWindow = new BrowserWindow({
  width: 300,
  height: 160,
  titleBarStyle: "hidden",
  titleBarOverlay: {
    color: "green", // 按钮背景色（仅支持windows）
    symbolColor: "blue", // 按钮颜色 （仅支持windows）
    height: 60 // 标题栏高度
  },
});
```
![](https://img.dingshaohua.com/book-fe/202409131520466.png)
---




最后让我们结合web来自定义一个完美的标题栏吧！
