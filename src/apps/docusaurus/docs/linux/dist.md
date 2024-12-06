---
hide_title: true
sidebar_position: 3
sidebar_label: 磁盘管理
---

磁盘管理好坏直接关系到整个系统的性能问题。
磁盘管理常用三个命令为 df、du 和 fdisk。
```shell
df # disk full 列出文件系统的整体磁盘使用量
du # disk used 检查磁盘空间使用量
fdisk #用于磁盘分区
```

## 磁盘空间占用
**整体磁盘使用量**

查看磁盘空间占用
```shell
df # 如果不指定具体目录，则会将系统内所有的文件系统列出来！
...
df /home -h # 将 /home所属的可用的磁盘容量
文件系统        容量  已用  可用 已用% 挂载点
/dev/vda1      79G   11G   66G   14% /
df /data -h # 将 /data 所属的可用的磁盘容量
文件系统        容量  已用  可用 已用% 挂载点
/dev/vda1      79G   11G   66G   14% /
df /mydist -h # 将 /mydist 所属的可用的磁盘容量
文件系统        容量  已用  可用 已用% 挂载点
/dev/vdb1      195M   12M  184M   6% /mydist
```
选项与参数：
* -a ：列出所有的文件系统，包括系统特有的 /proc 等文件系统；
* -k ：以 KBytes 的容量显示各文件系统；
* -m ：以 MBytes 的容量显示各文件系统；
* -h ：以人们较易阅读的 GBytes, MBytes, KBytes 等格式自行显示；
* -H ：以 M=1000K 取代 M=1024K 的进位方式；
* -T ：显示文件系统类型, 连同该 partition 的 filesystem 名称 (例如 ext3) 也列出；
* -i ：不用硬盘容量，而以 inode 的数量来显示

**文件本身大小**

df 命令统计的是所属磁盘（分区）的大小，要想统计某个文件夹或文件本身的大小需要使用 du 。    
比如查看home下demo的文件夹大小，便可以得出所占大小为16kb
```shell
du /home/demo -h
8.0K    /home/demo/文件夹1
16K     /home/demo
```
选项与参数：
* -a ：列出所有的文件与目录容量，因为默认仅统计目录底下的文件量而已。
* -h ：以人们较易读的容量格式 (G/M) 显示；
* -s ：列出总量而已，而不列出每个各别的目录占用容量；
* -S ：不包括子目录下的总计，与 -s 有点差别。
* -k ：以 KBytes 列出容量显示；
* -m ：以 MBytes 列出容量显示；





## 分区、格式化和挂载
以如何给电脑加块磁盘并且正常使用，来学习这块。     
当我们在电脑上装上一块硬盘或U盘时，Windows系统能够自动识别该硬盘并分配一个盘符，这实际上是Windows系统能自动挂载硬盘，而不是像Linux系统那样还需要运行命令手动挂载磁盘。所以接下来我们就学些如何给装有linux系统的电脑装块硬盘，并让其识别和能被使用。


**1、查看当前所有磁盘信息**

`lsblk`命令 用于列出所有可用块设备的信息，如下即可得知目前电脑上一共有3块磁盘sr0、vda、vdb   
其中10GB的vdb即是我刚才插入的新磁盘名字。
```shell
[root@VM-24-8-centos ~]# lsblk
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
vda    253:0    0    80G  0 disk 
└─vda1 253:1    0    80G  0 part /
vdb    253:16   0    10G  0 disk 
```

**2、分区**

全新的硬盘是不能使用的，因为需要分区，如同windows一样，你也需要将一块硬盘分区为C、D。    
一般Linux 系统目录结构/dev（Device缩写）目录下存放的是外部设备，在 Linux 中访问设备的方式和访问文件的方式是相同的。    
所以推测新的硬盘（装置）的位置应该是`/dev/vdb`,使用`fdisk -l`即可输出所有的硬盘和其下分区具体信息，如下，所以我们推测没错。
```shell
[root@VM-24-8-centos ~]# fdisk -l
# 第一块磁盘信息
Disk /dev/vda：80 GiB，85899345920 字节，167772160 个扇区
单元：扇区 / 1 * 512 = 512 字节
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节
磁盘标签类型：dos
磁盘标识符：0x89ee0607
# 第一块磁上的分区列表
设备       启动  起点      末尾      扇区 大小 Id 类型
/dev/vda1  *     2048 167772126 167770079  80G 83 Linux

# 第二块磁盘信息
Disk /dev/vdb：10 GiB，10737418240 字节，20971520 个扇区
单元：扇区 / 1 * 512 = 512 字节
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节
磁盘标签类型：dos
磁盘标识符：0x7d1085d3
```

找到磁盘后开始对其分区，输入命令
```shell
磁盘标识符：0x7d1085d3
[root@VM-24-8-centos ~]# fdisk /dev/vdb   #第1步：打开fdisk软件

欢迎使用 fdisk (util-linux 2.32.1)。
更改将停留在内存中，直到您决定将更改写入磁盘。
使用写入命令前请三思。


命令(输入 m 获取帮助)：n  # 第2步：n创建分区
分区类型
   p   主分区 (0个主分区，0个扩展分区，4空闲)
   e   扩展分区 (逻辑分区容器)
选择 (默认 p)：p # 第3步：选择分区类型，默认即可
分区号 (1-4, 默认  1): 1 # 第4步：给分区选一个id，默认即可
第一个扇区 (2048-20971519, 默认 2048): 2048 # 第5步：给分区选其实位置，默认即可
上个扇区，+sectors 或 +size{K,M,G,T,P} (2048-20971519, 默认 20971519): +200M  # 第6步：给分区设置大小

创建了一个新分区 1，类型为“Linux”，大小为 200 MiB。
命令(输入 m 获取帮助)：w # 第6步：输入w，意思是保存操作
分区表已调整。
将调用 ioctl() 来重新读分区表。
正在同步磁盘。
```
此时再执行`lsblk`或`fdisk -l`或者`blkid`既可以看到我们对这块新硬盘创建的新分区
```shell
[root@VM-24-8-centos ~]# lsblk
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
vda    253:0    0    80G  0 disk 
└─vda1 253:1    0    80G  0 part /
vdb    253:16   0    10G  0 disk 
└─vdb1 253:17   0   200M  0 part  # 这里MOUNTPOINT为空说明该分区尚未挂载
```

**3、格式化并指定文件系统**

给刚才分的区格式化并指定文件系统类型
```shell
mkfs.xfs /dev/vdb1
```

**4、挂载分区到系统**

不同于windows，linux需要手动挂载分区，方可使用新磁盘。

找到你创建分区vdb1的uuid，记下来
```shell
[root@VM-24-8-centos ~]# blkid
/dev/sr0: BLOCK_SIZE="2048" UUID="2022-01-09-00-05-05-00" LABEL="config-2" TYPE="iso9660"
/dev/vda1: UUID="659e6f89-71fa-463d-842e-ccdf2c06e0fe" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="89ee0607-01"
/dev/vdb1: UUID="5cd54cb8-656f-4477-a620-b19b164d651a" BLOCK_SIZE="512" TYPE="xfs" PARTUUID="7d1085d3-01"
```
    
我们创建一个目录，名字随意，比如叫做`/mydist`,然后将vdb1分区挂载到这里。    
编辑`vim /etc/fstab`，增加如下这行
```shell
UUID=5cd54cb8-656f-4477-a620-b19b164d651a /mydist                       xfs    defaults        0 0
```

然后再来看看是不是已经挂载上了
```shell
[root@VM-24-8-centos ~]# lsblk
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
...
vdb    253:16   0    10G  0 disk 
└─vdb1 253:17   0   200M  0 part /mydist  # 这里MOUNTPOINT说明该分区已经挂载到了/mydist上了
```
当然也可以用mount来进行挂载，挂载的办法有很多，这里说一种。

**5、结语**

到此，你就可以快乐的使用你的新磁盘啦。    
无论你在`/mydist`存多少东西，甚至此处坏掉，都不会影响你的系统，它和你的系统所用的第一块(主)硬盘完全独立分开的。