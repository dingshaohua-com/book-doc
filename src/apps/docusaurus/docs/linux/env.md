---
sidebar_position: 7
hide_title: true
sidebar_label: 环境变量
---

<!-- 集成图标文档参考这里https://github.com/facebook/docusaurus/issues/1258#issuecomment-594393744 -->
```mermaid
graph LR;
	环境变量分类-->按照生命周期来分-->永久的;
					按照生命周期来分-->临时的;
	环境变量分类-->按照作用域来分-->全局的;
					按照作用域来分-->用户的;
```

1. 永久的：需要用户修改相关的配置文件，变量永久生效。
2. 临时的：用户利用export命令，在当前终端下声明环境变量，关闭Shell终端失效。
3. 系统环境变量：系统环境变量对该系统中所有用户都有效。
4. 用户环境变量：顾名思义，这种类型的环境变量只对特定的用户有效。

## 查看
查看当前有哪些环境变量
```shell
[root@VM-24-8-centos ~]# env
NVM_DIR=/root/.nvm
LANG=zh_CN.UTF-8
HISTTIMEFORMAT=%F %T 
HOSTNAME=VM-24-8-centos
OLDPWD=/root
NVM_CD_FLAGS=
JAVA_HOME=/home/jdk1.8.0_141
MVN_HOME=/home/apache-maven-3.6.3
XDG_SESSION_ID=14135
USER=root
PWD=/root
HOME=/root
SSH_CLIENT=223.72.93.16 15351 22
SSH_TTY=/dev/pts/0
MAIL=/var/spool/mail/root
TERM=xterm
SHELL=/bin/bash
NVM_BIN=/root/.nvm/versions/node/v16.13.1/bin
SHLVL=1
PROMPT_COMMAND=history -a; history -a; printf "\033]0;%s@%s:%s\007" "${USER}" "${HOSTNAME%%.*}" "${PWD/#$HOME/\~}"
LOGNAME=root
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/0/bus
XDG_RUNTIME_DIR=/run/user/0
PATH=/root/.nvm/versions/node/v16.13.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/home/jdk1.8.0_141/bin:/home/apache-maven-3.6.3/bin:/root/bin
NVM_INC=/root/.nvm/versions/node/v16.13.1/include/node
HISTSIZE=3000
LESSOPEN=||/usr/bin/lesspipe.sh %s
_=/usr/bin/env
...
```

## 修改
### 全局有效
在`/etc/profile`文件中添加变量 对所有用户生效。如配置java环境变量，在此文件最后一行添加如下
```shell
export JAVA_HOME=/home/jdk1.8.0_141
```
修改文件后要想马上生效还要运行source /etc/profile，不然只能在下次重进此用户时生效。

### 单一用户有效
在用户目录下的`~/.bash_profile`文件中增加变量，只对此用户生效。，如配置java环境变量，在此文件最后一行添加如下
```shell
export JAVA_HOME=/home/jdk1.8.0_141
```
### 临时有效
在shell的命令行下直接使用export 变量名=变量值。如配置java环境变 1量
```shell
export JAVA_HOME=/home/jdk1.8.0_141
```
### 其它
set命令显示当前shell的变量，这个可以先不用学习，用的较少