---
sidebar_position: 1
hide_title: true
---

electron 做 mac app的时候，你会发现 除了要面临正常的业务代码编写，你还要去打包，签名、公证、发布等诸多流程。

[electron-builder 打包](pkg)，一般我们打dmg 和 pkg 包，前者用于个人分发，后者则是上传apple store分发。

一旦我们需要app做分发，我们就要对[app进行签名](sign)，否则用户是无法正常使用。

签名的时候又涉及到了证书和[权限列表文件](entitlement)，所以我们还需要准备好这些。

同时个人分发还需要[公证](notarize)，有需要了解公证部分。

apple store 上传以及传之后还有一些坑，因此你又要[了解这些](store)。

