---
sidebar_position: 4
---

# 签名

最近开发 electron app，发现我发给别人的 xxx.app 或者 xxx.dmg 或者 xxx.pkg ，总有用户给我抱怨打不开，甚至有的用户直呼 “你这个 app 有病毒吧”！  
很是郁闷，最终经过一番深度调研和填坑，总结了此文！

问题的核心原因就在于 **签名**，签名类似于网站的备案，证明你的 app 有权威机构颁发的证书，证明你的 app 是清白干净无害的！

如果不签名，别人下载完你的 app 并打开， 大概率会发生如下 毛骨悚然的弹窗：
![](https://img.dingshaohua.com/book-fe/202408291558395.webp)

可以看出早期的 macos 系统，好歹你用右键>打开 还能正常使用！  
新版的 macos，已经直接给你弹【无法打开】，右键也不行，你只能去 mac 系统设置>隐私与安全>信任刚才的软件，更绝的是 最新的 macos 上这个设置项也被隐藏了！

换言之，apple 公司逼迫开发者 必须花钱申请证书 给 app 签名，并美其名曰 **安全**！

## macos app 的分发 （理论）

何为分发？😊 就是把你的软件分享给别人，然后别人安装能用！

可不要觉得发给别人，就叫分发了，要知道 ios 的安装包为 xx.ipa，你即便拿到分享给别人也没用，别人也无法安装，背后的原因是那欠抽的苹果做了限制，让你必须上架到 apple store，它好抽成 ！

macos 的分发 有两种渠道，一个是上架 apple store，另一个就是个人分发 即分享给别人安装包。

## app 签名（理论）

早期的很多系统对其平台下的 app 并没有签名的概念，比如 andriod、ios、macos。
后来随着越来越多的破解软件、钓鱼软件（伪装正版 内嵌病毒或盗取信息）出现，使得各大系统厂商迫不得已都慢慢的加上了一种防御手段---签名！

签名就是将软件开发者信息、制作时间等等信息 在制作安装包的时候 嵌入进去，如果有心怀不轨的人破解了软件 就会导致签名失效，针对签名失效的软件，一般各大系统均会给出有好的提示，如 “签名无效，请注意鉴别安全”，或者直接禁止你安装 “签名无效，无法安装”。

**再来说说 macos app 的签名**  
早期的 mac 为了开拓市场 丰富其生态， 对个人分发支持很友好， 只要你将安装包分享给别人， 别人就能安装。
后期 mac 生态做大做强了之后 并且为了安全考虑 以及看不得光的利益，要求开发者必须对其 app 进行签名。

## 签名分类（理论）

根据分发类型不同，分为两类签名: 个人分发、apple store 上架，用哪套取决于你的分发渠道。

签名需要用到证书，证书包含软件开发者相关信息，在你打包的时候，打包器（如 xcode、electron-builder）会读取你安装的证书 结合 其它信息一起注入到 app 中，从而完成签名。

对应的证书也有两类: 个人分发签名所需证书、上架 apple store 签名所需证书，分别对应两类不同的签名策略。

要签名，就必须安装证书（具体安装哪些证书 取决于你），这是签名的前置工作。

## 证书生成（实操）

证书是 apple 公司颁发的，只有 app 开发者才可以去申请，因此你必须花点银子去注册 开发者账号，也不多 😊 ‌ 个人账号 ‌ 的费用为$99/年，‌ 企业账号 ‌ 的费用为$299/年。

这个 因为我不是管理员跟不是 Team 的 agent（owner），所以我是没有权限生成证书的，更不可能为了学习总结 话费 600 块 申请个人开发者。所以这个过程自行脑补。

## 证书安装（实操）

如果要签名的平台是 darwin，darwin 代表要将应用发布到 mac 端，但是不经过 app store（如 dmg），那么需要的证书是 `Developer ID Application: * (*)`

```
Developer ID Installer
Developer ID Application
```

如果要签名的平台是 mas，mas 平台代表要将应用发布到 app store，那么需要的证书是 `3rd Party Mac Developer Application: * (*)`

```shell
3rd Party Mac Developer Installer
3rd Party Mac Developer Application
```

若两者都需要，那都安装呗（记得安装到 登陆类别的证书中， 最好的方式是直接打开钥匙访问>登陆 拖进去即可），最终如下  
![](https://img.dingshaohua.com/book-fe/202408291052441.jpg)

:::tip 安装 3rd 证书的坑
安装 3rd 证书会有坑，证书无效，具体解决方案文末有提。
:::

## 开始签名（实操）

### 指定使用的证书

通过 identity 指定打包签名所用证书，其实以不配置，electron-builder 在打包的时候会自动寻找证书，推荐不配置。

```js title="electron-builder.json"
{
    "mac": {
      "identity": "xxx (xxxxxxxx)"
    },
    "mac": {
      "identity": "xxx (xxxxxxxx)"
    }
}
```

### 指定描述文件

描述文件，内部定义了 apple 开发者账号相关信息，打包工具利用它最终会将信息注入到打包后的 info.plist 内，如果上传到 app store 必须配置此项，否则签名异常。

去 apple 开发者后台，生成后放到项目中 如下配置应用到即可。

```js title="electron-builder.json"
{
    "mac": {
      "provisioningProfile": "MacDevelopment.provisionprofile",
    }
}
```

### 开始签名

此时执行 `electron builder` 打包即可，在打包过程中你会看到签名的提示：  
![](https://img.dingshaohua.com/book-fe/202408131615108.jpg)

```shell
  • electron-builder  version=24.13.3 os=23.6.0
  • loaded configuration  file=/Users/admin/files/code/live-electron/electron-builder.json
  • description is missed in the package.json  appPackageFile=/Users/admin/files/code/live-electron/package.json
  • writing effective config  file=dist/builder-effective-config.yaml
  • packaging       platform=darwin arch=x64 electron=31.3.1 appOutDir=dist/mac
  • signing         file=dist/mac/xx.app platform=darwin type=distribution identity=A7DFC**** provisioningProfile=none
  • skipped macOS notarization  reason=`notarize` options were unable to be generated
  • building        target=DMG arch=x64 file=dist/xx-1.0.0.dmg
  • building block map  blockMapFile=dist/xx-1.0.0.dmg.blockmap
✨  Done in 105.28s.
```

另外 验证是否签名，你还可以在软件包内容中你可以看到 \_CodeSignature 的文件夹，表示该应用已经被成功签名了。

## 坑

### 3rd 证书无效

当安装完 3rd 证书后，我们可以看到证书提示 签名无效  
![](https://img.dingshaohua.com/book-fe/202408291446454.jpg)

如果此时手动强制对证书信任（右键>显示简介>信任>始终信任），然后再打包，打包过程中签名步骤依然会失败

```shell
Warning: unable to build chain to self-signed root for signer "3rdParty Mac Developer Application: xxx"
```

通过关键字 chain to 再结合搜索我们可得知，这是证书链除了问题，结合 3rd 证书详情信息，我们可以得知我们少安装了 AppleWWDRCA 证书,而且是 G3 版本
![](https://img.dingshaohua.com/book-fe/202408291459127.jpg)

那我们去[苹果官网下载](https://www.apple.com/certificateauthority)，然后安装证书到 `钥匙串>系统类型`中。
![](https://img.dingshaohua.com/book-fe/202408291517149.jpg)

最后查看你的 3rd 证书 即显示为 `此证书有效`，再次打包 签名即可成功！

### 签名了谁？

默认情况下，electron builder 仅仅只会签名 .app 文件。  
如果你要想给 dmg 也签名，你需要额外配置。

```js title="electron-builder.json"
{
  "dmg": {
    "sign": true
  }
}
```

（不过在 mas 打包下，除了.app外 其实pkg文件也会被签名）



<!-- ## 自分发打包
如果不上传apple store，我们只需要配置 mac 字段即可，此字段官方解释为 “这些选项适用于任何 macOS 目标”，无论你是打mas、dmg、zip，他们默认都会继承此配置项。
```

``` -->
