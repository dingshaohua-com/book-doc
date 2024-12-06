# 公证

2019年苹果宣布在Mac App Store以外通过其他途径分发的所有Mac软件，必须获得Apple的公证才能默认在macOS上运行。

公证的本质，就是把安装包传到苹果服务器上，苹果会对安装包进行检查，通过之后即认证成功，这是为了确保用户的安全

换句话说，如果你是做个人分发的，那么你的安装包仅仅是签名 是还不够的，必须要再来一步 公证，否则依然会提示恶意软件 未知来源等恶毒提示！


## 如何公证
苹果已经废弃了 macOS notarization 的传统工具 altool ，推出新的工具 notarytool，也是以命令行的方式使用。 使用步骤为：提交公证申请-->查询公证进度-->将公证信息注入到安装包中。
感兴趣这里可以查看 [electron-Mac 最新签名公证 notarytool](https://blog.csdn.net/Crystal_Mr_Rose/article/details/136351429) 相关教程。

显然，这并不符合懒人思维，electron 将其自动化了 并封装成了一个依赖包 @electron/notarize。

安装完它后`yarn add --dev @electron/notarize` ,增加其配置文件
```js title="notarize-conf.js"
import { notarize } from "@electron/notarize";

const notarizing = async (context) => {
  const { electronPlatformName, appOutDir } = context;
  const appName = context.packager.appInfo.productFilename;
  const config = {
    appPath: `${appOutDir}/${appName}.app`, //打包后的放置app文件的命名和路径【固定写法】
    appBundleId: "com.xxx.xxx",
    appleId: "xxx@qq.com",
    appleIdPassword: "xxxx", // 临时密码
    ascProvider: "团队ID",
    tool: "notarytool", // 公证工具 固定写法
    teamId: "团队ID",
  };
  const res = await notarize(config);
  console.log(config, res);
  return res;
};
export default notarizing;
```

最后在 electron-builder 打包工具中使用即可

```js title="electron-builder.json"
{
  ...
  "afterSign": "do-notarize.js",
}
```

**解释一下认证配置 config 的一些参数：**  
`appPath`：打包后应用的路径，.app 或者 .dmg 结尾。  
`appBundleId`：包名,跟 Electron-builder 配置的 appId 一致。  
`appleId`：苹果开发者的账号，若自己是属于开发者，填写自己的即可。  
`ascProvider`：证书的提供者，通过 mac 钥匙串访问查看。你所有使用的签名证书，括号里面的就是证书提供者。 一般同 teamId。  
`tool`：签名工具，公证工具。  
`teamId：` 团队 ID [点击这里查看](https://developer.apple.com/account)。  
`appleIdPassword`：应用专用密码，[点击此处生成即可](https://appleid.apple.com/account/manage)。  
![](https://img.dingshaohua.com/book-fe/202408131741655.jpg)

配置完如夏后，electron-builder 会在打包完成后自动将安装包和相关信息传到苹果的公证审核。





## 开始公证

配置完如上后，electron-builder 会在打包完成后自动将安装包和相关信息传到苹果的公证审核。

应用程序公证如果失败，终端会有提示具体信息，如果成功 因为该方法将返回一个 void Promise，所以你不会得到任何回应（即没有输出 就是最好的结果）。请注意，公证可能需要几分钟，之后你会收到成功的邮件。

过程可能会提示 "skipped macOS notarization reason='notarize' options were unable to be generated"。[这不重要，因为该消息来自 electron-builder，告诉您它无法公证，因为您没有为其提供配置选项，但是，@electron/notarize 仍将继续在 afterSign 钩子中对其进行公证。](https://stackoverflow.com/questions/78302621/not-able-to-notarize-electron-app-skipped-macos-notarization-reason-notarize)


:::tip 提示
公证的过程比较漫长，因为需要上传安装包（取决于安装包大小 和 你网络的带宽）！
:::

## 公证校验

为了验证公证是否有效，可以使用 stapler 命令行实用程序：

```
stapler validate path/to/your.app
```

如果输出 `The validate action worked!`，则意味着公证成功！   
如果输出`xx.app does not have a ticket stapled to it.`，则意味着没有公证！   


## 其它
如开头所说，mas（pkg）包不必公证，应为apple公司会在你上传的时候帮你公证，你只需要对mas包签名即可。