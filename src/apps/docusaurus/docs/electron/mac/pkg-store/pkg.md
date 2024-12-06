---
sidebar_position: 2
---

# 打包

一般我们使用 electron builder 进行打包，通过 mac字段是配置打包基本配置项目
```js title="electron-builder.json"
{ 
 "mas": {
    "icon": "public/icon/mas-icon.icns", // 图标
 },
 "mac": {
    "icon": "public/icon/mac-icon.icns", // 图标
    "category": "public.app-category.education", // 应用分类 比如 教育、美食
    "target": [
      {
        "target": "mas", // 打包格式 dmg、mas（pkg）、或其它
        "arch": ["universal"] // 支持cpu架构 x86（Intel系列）、arm(m系列)或通用版universal
      }
    ]
  },
}
```

mac是通用配置 只要是打包mac app都会走此，   
mas是指的是当mac app打包具体类型为 mas格式的时候才会走。   
mas会和mac合并，同字段会覆盖它。

之后你就可以执行打包操作了 `electron-builder！

当然如上配置只是最简单的配置，如果你需要签名等操作 还需要很多配置，具体继续回到 [简介里](intro)的指引！ 