---
sidebar_position: 1
---

# 编码

## 分析

多发生在 windows 端，mac 端编码一般没问题。

当我们在 Windows 的控制台下输入 chcp,可以查看到当前系统默认的字符编码，  
一般都值都是 936，编码 936 也就是 gbk，而 utf8 的值是 65001。

一般我们的脚本文件（js、ps1 等）编码都为 utf-8 格式，但是 windows 系统一般默认的又是 gbk，这就 windows 系统下（中文部分）导致乱码的根源。

即当前环境编码和你的文件字符编码不相同的时候，即可发生乱码。

## 阶段 1

我们在 electron 中随便打印点中文 如 `console.log('你好')`，这是查看 electron 应用启动的控制台 含中文部分就会显示乱码， 解决办法就是将 node 程序的进程启动之前将系统编码设置为 utf-8 即可。

```shell
chcp 65001 && electron .
```

:::tips 提示
不过这对打包无用，打包启动后虽然无法方便的看到控制台，但是实际上它的输出还是会乱码。  
虽然主进程打印乱码，但是通过 icp 将中文发送到渲染进程却不会乱码！
:::

## 阶段 2

即便我们在启动之前设置了编码，但是执行 ps1 脚本文件乱码所以使用 spawn、exec 通过调用 cmd 或 powershell 等终端 去执行含中文脚本的时候 仍然会出现中文部分乱码现象。  
因为通过spawn、exec 开启的子进程 默认的执行环境编码也并不为 utf-8，同样也是 gbk，不会被父进程的编码作用。
解决办法有多种：

**方式 1: 修改 powershell 默认的执行环境编码为 utf-8**  
😊以下代码为网上查找，统统无效！

```js
const arg = ["-File", scriptPath];
const option = {
  shell: true,
  encoding: "utf8",
  env: {
    LANG: "zh_CN.UTF-8",
    LC_ALL: "zh_CN.UTF-8",
  },
};
spawn("powershell", arg, option);
```

😊找到一个冷门答案，目测有用，虽然改变了子进程的编码环境，但是这会改变当前powershell的默认语言为英文，不过影响不大，虽还不认识英语呢（推荐）

```shell
spawn("chcp 65001 &&  powershell", ...);
```

😊还有一个办法，就是在脚本文件的最顶部，添加设置chcp为utf-8，这就改变了powershell当前的执行环境默认编码了（默认为gbk） 和 你的脚本编码一致 就不会乱码了！   
但是这只是会改变 powershell 执行当前脚本及其之后的编码环境，如果在此 powershell 的输出（如果有的话）中文的话，在默认的gbk编码环境下，仍然会乱码，所以非常不推荐。
```shell title="xx.ps1"
chcp 65001
echo 呵呵
```

**方式 2: 修改 powershell 默认的执行环境编码为 gbk（强烈推荐）**  

换个思路，默认环境为gbk，那我不就不改它，我就以gbk编码环境为主。
我只需要在输出的地方 将其解码即可 （不能像utf-8那样直接 stdout.toString()，因为gbk不被支持）
```js
import iconv from "iconv-lite";

...
// stdout为spawn或exec的执行结果
iconv.decode(stdout, "cp936")
```

