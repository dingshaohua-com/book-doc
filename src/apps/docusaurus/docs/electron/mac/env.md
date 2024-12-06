---
sidebar_position: 1
---

# 环境变量

## 问题
macos中，在开发阶段或者终端启动程序 和 在程序坞中使用软件 获取到的环境变量是不同的。

后者获取到的环境变量 是残缺不全的，比如少了 `/etc/paths`等。

这就导致我想判断用户是否安装好了某些软件环境无法实现！


好在有人[提前帮我踩坑](https://stackoverflow.com/questions/62067127/path-variables-empty-in-electron)，并且找到了[相关插件](https://github.com/sindresorhus/fix-path)解决！