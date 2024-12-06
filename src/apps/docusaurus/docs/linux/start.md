---
sidebar_label: 前言
hide_title: true
sidebar_position: 1
---

## 简介
Linux，全称GNU/Linux，是一种免费使用和自由传播的**操作系统**，对比你用的windows就是收费的。   

Linux有上百种不同的发行版，一般我们使用都是使用其发行版，而不会直接使用托瓦兹1991发布的内核（从技术上来说，托瓦兹开发的只是Linux的内核）。


1、linux核心只有内核部分，安装完后，用户界面/软件都没有，没有任何用户交互的功能，仅仅是一个系统的支持程序，是系统的心脏，是最基层的代码，并不是一个我们传统意义上的操作系统，无法直接使用。

2、linux发行版，就是在内核的基础上，加入用户界面，各种软件的支持。比如CentOS、小红帽等等。在内核的基础上，开发不同应用程序，组成的一个完整的操作系统。 发行版更加准确的来说应该叫做以“Linux为核心的操作系统软件包”

在各类发行版在使用过程当中由于内核都是来自同一个，所以在内核层面不存在兼容性问题，但由于外层的不同所以给我们带来的不一样的使用体验。

## linux内核
一个完整的Linux内核一般由5部分组成，它们分别是内存管理、进程管理、进程间通信、虚拟文件系统和网络接口。

知道有这些就行了，没人会直接用内核做系统。
## linux发行版
Linux 的发行版说简单点就是将 Linux 内核与应用软件做一个打包

现有超过300个Linux发行版，而且大多数都比较活跃，这些发布者既有商业公司，也有开源社区。

国外出名发行版有Ubuntu，Fedora，RedHat，CentOS，Debian。    
国内发行版有中兴新支点、统信uos等、红旗Linux以及相对比较成熟的深度deepin。

我们平常所说的安装个Linux操作系统指的都是安装一个Linux的发行版。
![](https://img.dingshaohua.com/book-fe/202411231531798.jpg)

不同发行系统，内置的软件也不尽同，如软件管理器：Redhat用的是yum，Debian用的是deb，而Arch则用的是pacman

## 查看版本
如何查看Linux内核版本号和发行版本号呢？    
查看操作系统版本一般有三个命令：
```shell
lsb_release -a  // 适用于所有Linux发行版
cat /etc/redhat-release // 适用于Redhat
```

查看系统内核版本一般有两个命令：
```shell
cat /proc/version
uname -a
```

## 二次封装
Linux发行版本虽然众多，但是真正属于原始内核构建的Linux版本只有少数几个。   
比如Ubuntu是基于Debian二次封装的，CentOS则是基于Redhat。   
这就决定了Ubuntu/CentOS和Debian/Redhat大多数情况下可能非常一致，但又有一些不同。    
CentOS只是把Redhat的品牌信息去掉，Ubuntu在Debian的基础上做了许多的变更，如加了Snap软件管理。   
以下介绍了大致的发行版本之间的关系    
![](https://img.dingshaohua.com/book-fe/202411231532560.png) 

## windows露个脸
既然Linux有内核，那么Windows有内核么？    
Windows显然也是有内核的说法的，命令`VER`即可查看当前windows系统的内核版本号。   
![](https://img.dingshaohua.com/book-fe/202411231532561.png)
