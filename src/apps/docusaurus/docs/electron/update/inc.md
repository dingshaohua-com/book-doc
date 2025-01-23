# 增量更新
增量更新 需要我们自己编写更新逻辑，以及自己维护安装包和升级文件。

## 升级配置文件
这个其实就是用来获取最新版本号，是否有可用升级，以及下载地址等等配置，一般放在服务器上。
或者你写接口也行，那不还得写个服务么，反而麻烦。

至于格式无所谓 比如 yml、json、xml等，这里就定位json吧：
```json title="latest.json"
{
    "version": "1.1.3",
    "baseVersion": "1.1.2",
    "releaseDate": "2025-01-20T07:40:00.880Z",
    "releaseNotes": "修复了一些BUG",
    "forceUpdate": false,
    "diffPlatform": false,
    "filePath": "app.zip",
    "justPlatform":false,
    "notifyNum": 3,
}
```
* version：目前最新版本, 通过 app 内 package.json获得
* baseVersion：壳/基版本，通过app.getVersion获得，用于标记此版本是基于哪个全量版本的增量包。
* releaseDate：发布时间
* releaseNotes：更新说明
* forceUpdate：是否强制更新
* diffPlatform：是否差异化更新，若true则filePath必须返回一个对象 用来区分不同平台安装包地址 `{windows: '/windows/app.zip'}`
* filePath：安装包下载地址
* justPlatform：为fase时候意思是全平台更新，否则值为数组指定只更新的平台，比如`windows`、`macos`等。
* notifyNum：提示更新次数，比如设置为3，只会提示用户3次，如果用户再次期间依然选择不升级，则再也不给他提示，就让他用旧版本的吧。


## 更新逻辑之baseVersion
比如 我当前的版本是1.1.0，我需要更新到最新版本1.1.3，      
但是1.1.3是基于1.1.2的全量更新版本打出的增量包，所以我需要先将自己本地 APP 更新到1.1.2才行，然后再从1.1.2通过增量包方式升级到1.1.3。   
这用户体验也太差了！

所以我们为了还在用1.1.0的用户能有更好的体验，我们要为针对 1.1.3，除了要打一个增量更新包（给1.1.2用），还要打一个全量更新包（给1.10用）。
这样只要当前用户本地的 app 的 baseVersion 小于增量包的 baseVersion，就提示用户全量更新。

为了防止针对 baseVersion 不同，从而导致增量更新异常， 要做两件事：
* 每一个发版都要打两个包，一个是增量更新包，另一个是全量更新包！
* baseVersion不同时，直接将用户的全量升级即可，否则才能调用增量更新！

来一个生活例子吧：    
你本来是有一部手机是大哥大，   
你想给他升级照相分辨率更清晰像素，          
那你首先得升级到能拍照的手机，  
最后再给他升级分辨率更清晰模块   


## 增量更新逻辑
这部分代码写在主进程里
```

```
