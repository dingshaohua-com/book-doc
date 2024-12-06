# 图标

一个应用会涉及到很多图标，比如 安装图标、快捷方式图标、应用商店图标等等。

## mac 应用图标

mac 应用图标 格式要求为`xx.icns`格式。  
这种格式的图片实际上是多个不同规格的图片压缩而成！

**那我们如何制作一个这样格式的图片呢？**  
首先你要准备好 1024*1024 和 512*512 两张分辨率的 png 图，随意放到新建的`icon.iconset`目录中

```
|-- icon.iconset
  |-- icon_512x512.png
  |-- icon_512x512@2x.png
```

通过终端进入此目录，并执行 以下命令，就会生成一个 `icon.icns`

```
iconutil --convert icns icon.iconset
```

**如何使用？**    
如果你用 electron builder 打包，只需要配置如下即可

```js title="electron-builder.json"
{
  "mas": {
    "icon": "mas-icon.icns" // 取决于你给图片的命名
  },
  "mac": {
    "icon": "mac-icon.icns",
  },
}
```

如上，mac里的icon是通用的配置，主要用于自分发 为圆角且需[要自己留白+圆角+阴影](https://developer.apple.com/design/resources)，而mas包则不用（apple store会帮你做），如果你打的是mas包，mas包的配置项将会覆盖mac配置项。   
![](https://img.dingshaohua.com/book-fe/202408281359657.jpg)


## windows 应用图标

windows 应用图标 格式要求为`xx.ico`格式。  
这种格式的图片也是多个不同规格的图片压缩而成！

**如何制作？**   
通过 [IcoFX](https://img.dingshaohua.com/book-fe/202408281405527.zip) 这款软件制作。
