---
sidebar_position: 6
hide_title: true
sidebar_label: shell学习
---


## 什么是shell
有没有想过你在linux上输入的命令回车之后为何能被执行？    
回车之后，你的命令其实会被shell去解释这条命令，所以核心是shell

shell 是一个用 C 语言编写的软件(也称之为脚本解释器)，它是用户使用 Linux 的桥梁。       
shell脚本，是一种为 shell软件 编写的脚本。  
学习好shell脚本,才能更好的使用linux。

## shell 环境
跟 js、php 编程一样，只要有一个能解释执行shell脚本解释器就可以了。linux 的 shell解释器种类众多，常见的有：
```shell
Bourne Shell（/usr/bin/sh或/bin/sh）
Bourne Again Shell（/bin/bash）
C Shell（/usr/bin/csh）
K Shell（/usr/bin/ksh）
Shell for Root（/sbin/sh）
zsh
……
```
由于易用和免费，bash（也就是 Bourne Again Shell） 在日常工作中被广泛使用，也是大多数linux 系统默认的 shell。

查看你的linux系统自带哪些shell
```shell
cat /etc/shells
```

查看当前使用的shell类型
```shell
echo $SHELL
```

## 指定shell
`#!` 用来指定用何解释 来此脚本文件的 Shell程序，如指定使用Bash
```shell
#!/bin/sh
...
```

## 运行 Shell 脚本
运行 Shell 脚本有两种方法，分别如下：

方式1：作为可执行程序, 将代码保存到test.sh
```shell
./test.sh  #执行脚本
```

方式2：运行解释器+参数（shell 脚本的文件名）
```shell
/bin/sh test.sh # 同理推导出php可以这样执行/bin/php test.php
```


## 变量
**定义和使用变量**
```shell
my_name="张三" # 定义变量
echo $my_name # 使用一个定义过的变量，只要在变量名前面加美元符号即可
echo 请叫我 ${my_name}GG # 变量名外面的花括号是可选的，是为了帮助解释器识别变量的边界
```

**删除变量**
```shell
unset 变量
```

**只读变量**

只读变量不能修改，也不能删除
```shell
readonly my_age=18 # readonly来标识这是一个只读变量
my_age=20 # 修改变量，此处会报错
unset my_age # 删除变量，此处会报错
```

**变量类型**

运行shell时，会同时存在三种变量：
* 局部变量 在脚本或命令中定义，仅在当前shell实例中有效，其它shell启动的程序不能访问局部变量。
* 环境变量 所有的程序，包括shell启动的程序，都能访问环境变量。
* shell变量 由shell程序设置的特殊变量。


## 数据类型
shell是`弱类型`的编程语言，即便如此，我们也要了解一下它有哪些数据类型

### 字符串
**如何定义**

字符串是shell编程中最常用最有用的数据类型，可以用单引号，也可以用双引号，也可以不用引号。


```shell
one=hello
two='hello'
three="hello"
echo one,two,three # 打印输出 hello,hello,hello
```
**拼接**

单引号里无法使用转义字符，而双引号里可以有。
```shell
my_name="张三"

# 单引号里的任何字符都会原样输出，单引号字符串中的$变量是无效的，而双引号里可以。
name_1='hello, ${my_name}'
name_2="hello, ${my_name}"
echo $name_1  $name_2

# 单双引号都可以再嵌套一层表示变量。
name_3="hello, "$my_name""
name_4='hello, '$my_name''# 刚好解决了单引号不能使用$引入变量的问题
echo $name_3  $name_4

# 单引号里不能使用转义字符，双引可以
echo "Hello, I know you are \"$my_name\"!" # √
echo 'Hello, I know you are \'$my_name\'!' # ×
```

**长度、提取和查找**
```shell
my_name="abcde"
echo ${#my_name}   # 获取字符串长度，输出 5
echo ${my_name:1:3} # 提取子字符串，从第2位截取3个字符，输出 bcd
echo `expr index "$my_name" b`  # 查找子字符串，b出现在第2位置上，所以输出输出 2
```

### 数组
bash仅支持一维数组，不限制数组的大小，下标由 0 开始编号。获取数组中的元素要利用下标。

在 Shell 中，用括号来表示数组，数组元素用"空格"符号分割开。
```shell
my_arr=(茄子 土豆 西红柿 辣椒 豆角) # 定义数组
echo ${my_arr[1]} # 获取第2个元素，打印：土豆
echo ${my_arr[*]} # 使用@ 或 * 可以获取数组中的所有元素，打印：茄子 土豆 西红柿 辣椒 豆角
echo ${#my_arr[*]} # 数组元素个数，打印：5
```

## 运算符
Shell 和其他编程语言一样，支持多种运算符。

原生bash不支持简单的数学运算，但是可以通过其他命令来实现，例如 awk 和 expr，expr 最常用。expr 是一款表达式计算工具，使用它能完成表达式的求值操作。

### 算数运算符（用于数字）

加减乘除和取余(+、-、*、/、%)。

```shell
echo "两数之和为 : `expr 2 + 2`"
```

### 关系运算符 （用于数字）

关系运算符用于数字（或者字符串类型的数字）比较

| 运算符 |	说明 |	举例 |
| --- | --- | --- |
| -eq|	两数相等返回 true。 |	[ $a -eq $b ] 返回 false。 |
| -ne|	两数不等返回 true。 |	[ $a -ne $b ] 返回 true。 |
| -gt |	左大右返回 true。 |	[ $a -gt $b ] 返回 false。 |
| -lt |	左小右返回 true。 |	[ $a -lt $b ] 返回 true。 |
| -ge |	左大于等于右返回 true。 |	[ $a -ge $b ] 返回 false。 |
| -le |	左小于等于右返回 true。 |	[ $a -le $b ] 返回 true。 |



```shell
a=10
b=20

if [ $a -eq $b ]
then
    echo "a 等于 b"
else
    echo "a 不等于 b"
fi
```

### 字符串运算符（用于字符串）

| 运算符 | 说明 |	举例 |
| --- | --- | --- |
| -z | 串长度为0返回 true。 |	[ -z $a ] 返回 false。|
| -n | 串长度不为 0返回 true。 |	[ -n "$a" ] 返回 true。|
| $	| 串不为空返回 true。 |	[ $a ] 返回 true。|

### 逻辑运算符
* &&: 逻辑的 AND，并且的意思, 如 条件1 && 条件2
* ||：逻辑的 OR，或者的意思，如 条件1 && 条件2
```shell
a=10
b=20

# 如果a等于10 并且 b等于30则输出哈哈哈
if [[ $a -eq 10 && $b -eq 30 ]] 
then
   echo "哈哈哈"
else
   echo "嘿嘿嘿"
fi
```
还有个布尔运算符跟这个很相似，为避免混淆，先不学

### 赋值和通用关系运算符 

1、赋值运算符   

`=`。用于字符串和数字 ，比如
```shell
a='hello'
b=123
c=$a # 将a的值赋给c
d=$b # 将b的值赋给d
```
2、通用的关系运算符   
`==` 或`!=`。用于字符串和数字，很多书本把他列为术运算符运算符，提示只支持数字比较，其实不然，现在的shell已经可以用于用这个运算符来比较字符串和数字了，比如
```shell
 echo `expr 10 == 9` # 打印0，即不相等
 echo `expr ""张三 == "李四"` # 打印0，即不相等

```
### 文件测试运算符
文件测试运算符，以下列出3个，点击[这里](https://www.runoob.com/linux/linux-shell-basic-operators.html)查看更多

| 操作符 | 说明 | 举例 |
| --- | --- | --- |
| -d file |	文件是目录，返回 true。 |	[ -d $file ] 返回 false。 |
| -w file |	文件可写，返回 true。 |	[ -w $file ] 返回 true。 |
| -e file |	检测文件（包括目录）存在，返回 true。 |	[ -e $file ] 返回 true。 |

如判断文件是否存在，例子如下：
```shell
if [ -e $file ]
then
   echo "文件存在"
else
   echo "文件不存在"
fi
```

## echo
echo 指令，用于字符串的输出。
```shell
echo "你好，世界"
```

将内容输出到文件
```shell
echo "你好，世界" > myfile
```
上面这个命令执行command1然后将输出的内容存入file1。如果要将新内容添加在文件末尾，请使用`>>`操作符。

## 流程控制

### if 判断
if语句用来判定所给定的条件是否满足，根据判定的结果真或假 决定后续执行。
```shell
a=10
b=20
if [ $a == $b ]
then
   echo "a 等于 b"
elif [ $a -gt $b ]
then
   echo "a 大于 b"
elif [ $a -lt $b ]
then
   echo "a 小于 b"
else
   echo "没有符合的条件"
fi
```

### for 循环
```shell
for str in 你 好 啊
do
    echo $str
done
```
输出结果：
```shell
你
好
啊
```

### while 循环
如下，当age大于18的时候，循环就会终止
```shell
age=1
while(( $age<18 ))
do
    echo "你${age}岁，还未成年"
    let "age++"
done
```

until 循环与 while 循环在处理方式上刚好相反，这里就不在介绍


### case ... esac
与其他语言中的 switch ... case 语句类似，是一种多分支选择结构
```shell
site="google"
case "$site" in
   "baidu") echo "百度搜索"
   ;;
   "google") echo "Google 搜索"
   ;;
   "taobao") echo "淘宝网"
   ;;
esac
```

在循环过程中，有时候需要在未达到循环结束条件时强制跳出循环。

Shell使用两个命令来实现该功能：break和continue。

break命令允许跳出所有循环,终止执行后面的所有循环 而continue仅仅会跳出当前循环。

## 函数
```shell
sayHi(){ # 定义函数
    echo "嗨，我被执行了!"
}
echo "-----函数开始执行-----"
sayHi # 执行函数
echo "-----函数执行完毕-----"
```

输出类似下面：
```shell
-----函数开始执行-----
嗨，我被执行了!
-----函数执行完毕-----
```

另外函数还可以传入参数
```shell
funWithParam(){
    echo "第一个参数为 $1 !"
    echo "第二个参数为 $2 !"
    echo "参数个数 $# 个!"
    echo "输出所有参数 $* !"
}
funWithParam 1 2
```
输出类似下面：
```shell
第一个参数为 1 !
第二个参数为 2 !
参数个数 2 个!
输出所有参数 1 2 !
```


## 输入/输出重定向
重定向一般通过在命令间插入特定的符号来实现，如`>`、`>>`

| 命令 | 说明 |
| --- | --- |
| command > file | 将输出重定向到 file。 |
| command < file | 将输入重定向到 file。 |

### 输出重定向
下面这个命令执行command1然后将输出的内容存入file。
```shell
command > file
```
举个具体的例子
```shell
who > file1 # 将who执行的结果写入到file1
echo "菜鸟教程：www.runoob.com" > file2 # 将echo执行的结果写入到file2
```

### 输入重定向
本来从键盘获取输入的命令会转移到文件读取内容。
```shell
command < file
```

举个具体的例子, 统计 users 文件的行数：
```shell
wc -l < users # 将user的输出作为参数 传给wc -l命令
# wc统计文件里面有多少单词
# -l ：仅列出行；
# -w ：仅列出多少字(英文单字)；
# -m ：多少字符；
```