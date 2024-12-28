# 打包

## 什么是打包

你的 electron app 总归是要发给别人一个安装包或者程序吧，不可能吧源码发给用户然后让他 `yarn electron .` 吧？！  
Electron 目前有两种打包工具：[electron-builder](https://www.electron.build) 和 electron-packager，目前前者用的多，所以主要讲前者。

在 electron 项目中 安装 `npm i --D electron-builder` ，安装完毕执行它进行打包 `npm i --D electron-builder` ，之后你项目根目录就会出现打包后的目录 dist。

## 配置文件

配置可以在 package.json 里配置 build 字段，也可以单独创建一个文件叫 `electron-builder.json` ，在里面写。

```json
{
  "appId": "com.dsh.demo",
  "productName": "xx助手",
  "electronLanguages": ["zh-CN"],
  "buildDependenciesFromSource": true,
  "nodeGypRebuild": false,
  "npmRebuild": false,
  "asar": false,
  "buildVersion": "1",
  "artifactName": "${productName}-${version}.${ext}",
  "directories": {
    "output": "../../../dist"
  },

  "mac": {
    "icon": "src/files/logo/logo.icns",
    "target": [
      {
        "target": "dmg",
        "arch": ["universal"]
      }
    ],
    // "publish": {
    //   "provider": "generic",
    //   "url": "https://file.dingshaohua.com/demo-app/update"
    // },
    "x64ArchFiles": "*"
  },
  "win": {
    "icon": "src/files/logo/logo.ico",
    "target": [
      {
        "target": "nsis",
        "arch": ["ia32", "x64", "arm64"]
      }
    ]
    // "publish": {
    //   "provider": "generic",
    //   "url": "https://file.dingshaohua.com/car-app/update"
    // }
  },
  "nsis": {
    "oneClick": false,
    "perMachine": true,
    "allowElevation": true,
    "allowToChangeInstallationDirectory": true,
    "deleteAppDataOnUninstall": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  },
  "extraResources": ["electron-builder.json"]
}
```

## 开始打包

在 package.json 中添加打包脚本：

```json
{
  // ...
  "scripts": {
    "dev": "electron .", // 启动
    "build": "electron-builder"  // 打包
  }
}
```

## 打包内容

打包后的内容都在 dist 里，打包后有两种核心的东西：绿色可直接运行程序，一个是压缩后的程序。  
这两个任意一个都可以发给用户的，就是看你的决定！

windows 下，`酷狗 Setup 1.0.0.exe` 双击即可以执行，`win-unpacked` 为未压缩的程序根目录 进入目录后执行 酷狗.exe。

```shell title="windows"
| --dist
  | --win-unpacked
    | --locales
    ｜--resources
    ｜ --...
    | --酷狗.exe
  | --酷狗 Setup 1.0.0.exe
```

macOs 下 一个是安装包 `酷狗-1.0.0.dmg`需要安装，另一个是能直接运行的应用程序 `酷狗.app` 需要双击 Contents>MacOS>酷狗（不过 macos 做了优化，实际上文件夹 酷狗.app 看起来像可执行文件一样，双击即可执行， 其内容是在 显示包内容的情况下才能看到）。

```shell title="macOs"
| --dist
  | --mac
    | --酷狗.app
      ｜--Contents
        ｜ --Frameworks
        ｜ --MacOS
          ｜--酷狗
        ｜ --Resources
        ｜ --Info.plist
        ｜ --PkgInfo
  | --酷狗-1.0.0.dmg
```

## 打包后目录分析

### 根目录

为了更好的分析项目内容，我们都是看未压缩的结构：酷狗.app（macOS）、win-unpacked（windows），同时我们也把它们称为 打包后的 `根目录`，不过实际上 酷狗.app/Contents 才是真正意义的 macOS app 根目录。

### 资源目录

项目中用到的文件都会被打包到这里，  
默认情况下，项目源码会被打包到此目录下的 app 中，即 resources/app。

后续的 files 字段、extraResources 字段 会作用此目录的生成。

<!-- electron-builder 打包虽然帮我们把一些文件过滤掉不进行打包（指node-modules），[但是我们的项目源码是没有经过任何处理的被打包了进去](https://github.com/imweb/blog/issues/8)。 -->

<!-- ```shell
dist/mac/测试应用.app/Contents/driver
dist\win-unpacked\driver
``` -->

## 配置项

electron-builder 在打包的时候，会读取[配置项](https://www.electron.build/configuration/configuration)。  
可以在 `package.json` 中配置，也可以在项目的根目录创建一个配置文件 `electron-builder.json` ，建议后者。

配置项分为两类，通用配置项、(windows/mac)平台专用配置项目。

### asar

是否加密打包后的代码 （为 asr 格式），  
如果调试阶段建议开启，这样就可以直接修改打包后的代码来直接调试了。

macOS 应用中 你的源码将会打包在 `测试应用.app/Contents/Resources/app`目录下。  
windows 应用中，你的源码将会打包在 `win-unpacked\resources\app`目录下。

### files

用来自定义需要打进安装包里的文件，如果你使用了，将会覆盖此字段的默认配置值：默认配置为 项目中默认除 node_modules（dependencies 会被打进 Electron 应用的包里，而 devDependencies 则不会）之外的 所有文件都将打包到 app 中。

```js title="files默认配置"
[
  "**/*",
  "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
  "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
  "!**/node_modules/*.d.ts",
  "!**/node_modules/.bin",
  "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
  "!.editorconfig",
  "!**/._*",
  "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
  "!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
  "!**/{appveyor.yml,.travis.yml,circle.yml}",
  "!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}",
];
```

#### 初步尝试

如果你想自己决定打进包的文件，你可以配置此文件，比如我只想把项目中 src 内容打包进去，其它都忽略，你可以这么写 `files:['src']`，之后查看打包，会报错，  
因为只要你配置 默认的导入全部规则将会被取消 即 自动添加 "!\*_/_"覆盖，但是打包之后的文件内必须包含 package.json，所以 不论你想导入什么 必须要带上 package.json，即`files:['package.json', 'src']`，再次打包即可看到打包后的目录将会是如下：

```shell title="打包后目录/.../resources"
| --app
  | --package.json
  ｜ --node_modules
  | --src
```

也就是说 如果你开启了自定义 files，那的 files 字段的内容最终会是如下

```js
[
  ...// 原先默认的
  "!**/*",
  "node_modules",
  "package.json",
  "src",
];
```

这也从侧面说明，如果你开启了自定义 files 字段，

1. electron-builder 会自动关闭打包所有文件进 app 内 即` "!**/*"` 。
2. 但因为 `node_modules`和 `package.json`是必须的，非常重要，所以 electron-builder 又回帮你加到打进列表中。
3. 最后才会把你自定义的 files 字段内容追加上去。

#### 打进指定目录

如上，默认会在打包后的 app 里创建同层级目录。  
但是比如 我想将 src 目录内容，打包到 abc 中怎么做呢？

```js title="electron-builder.json"
{
  ...
  files: [
    {
      from: "src",
      to: "abc",
    },
  ];
}
```

这样打包后的目录结构将会是

```shell title="打包后目录/.../resources"
| --app
  | --package.json
  ｜ --node_modules
  | --abc
```

如果你想打包到打包后存放源码路径的根目录中，如 `测试应用.app/Contents/Resources/app`直接目录下，你可以将 to 字段设置为空字符串即可。

#### 排除目录

如果你不想将某个目录或者文件打包进入 app 中，只需要在规则前加一个 `!`即可，比如 `["!src/*"]`

### extraResources

指定文件夹复制到打包后应用程序的根目录/resources 文件夹下(Windows)，或 Content/resources 文件夹下(MacOS)。

一般用于包含额外的文件或目录到应用的最终安装包里。这些文件可能是配置文件、字体、数据库初始化脚本等等 非程序本身相关的代码文件。

配置同 files 一样。

```js
"extraResources": [
  {
    "from": "other-res/adbtool/mac",
    "to": "adbtool",
    "filter": ["**/*"] // 必须
  }
]
```

访问方式，在 electron 的生产（electron 表现为打包后）模式下 ，通过 `process.resourcesPath` 来访问。
在 dev 环境下，。。。不存在 extraResources 的概念，就根据你源文件的位置 合理的使用 `app.getAppPath()`、`process.cwd()`、`__dirname`获取即可。

### extraFiles

打包额外文件配置项，配置 extraFiles 后，electron-builder 在打包时会将指定文件夹复制到打包后[应用程序的根目录下](#根目录)（也就是比 extraResources 向外一层）。
配置方式也和 files 一样。
获取方式，利用获取 extraResources 来获取， `path.join(process.resourcesPath, ".")`。  
同样的 dev 模式下 也不存在这个。

#### 配置

比如，尝试 将原项目中的 driver 目录打包到程序根目录下 `"extraFiles": ["driver"]`，打包后是这样的结构

```shell
｜ --resources
  ｜ --app
  ｜ --driver
```

可以看出，配置后，会将 driver 目录放入 和项目源码目录（app 文件夹）同层级下，即应用程序的根目录/resources 下。

需要注意的是，如果你在 extraFiles 中配置了某个文件或文件夹，那么 files 会自动将其排除。也就是说你在 打包后 `测试应用.app/Contents/Resources/app`将不存在此目录。

同样它也支持 fromTo 模式。

#### 使用

在开发阶段和打包后 获取项目根目录有所区别，开发时获取到的是项目根目录，打包后获取到的是应用程序根目录。

process.cwd()可以获取 Node.js 进程当前的工作目录，也就是说无论什么环境，都可以精准无误的访问到根目录。

```js
const driverPath = path.join(process.cwd(), "resources", "driver");
```

### extraMetadata

会被注入到打包后 文件 packge.json 内。

```js
 "extraMetadata": {
    "main": "index.js"
  },
```
