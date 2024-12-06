# 上传 apple store

## 上传流程
你需要登陆 Apple store connect 创建你的软件信息。

拿到 xx.pkg 后，通过 专业的上传工具 [Transporter](https://apps.apple.com/tw/app/transporter/id1450874784) 上传即可（上传到 apple store 的包 必须是 pkg 格式，其它格式无法上传。）。

传完之后，你可以在 Apple store connect 中看到你的应用，在这里你可以设置内侧、公测和最终发版到 apple store

## 缺少出口合规证明

当你上传应用到 Apple store connect，看到提示 "缺少出口合规证明"

<img src="https://img.dingshaohua.com/book-fe/202408301505791.jpg" width="400px"/>

这是因为 apple 想知道你应用的加密方式，如果你的程序没有加密，你可以在 electron builder 中配置即可。

```js
{
    "mac": {
        ...
        "extendInfo": {
            ...
            "ITSAppUsesNonExemptEncryption": false,
        },
    },
}
```


## 关于版本
macos 或 ios 开发中，版本有两种，一个是常规版本 version，还有一个是 build。前者对外，后者对内。那为什么要这么做？
呢？

因为apple store（Transporter）不允许上传同版本 version，所以要用 build 字段来区分。

在electron项目中，macos的app取决于 package.json 中的 version 字段。而 build 则取决于 electron-builder.json 的 buildVersion 字段。 效果如下 标明该软件的主版本为 7.25.4而 内部版本为 0.35。

<img src="https://img.dingshaohua.com/book-fe/202408301517673.png" width="400px"/>
