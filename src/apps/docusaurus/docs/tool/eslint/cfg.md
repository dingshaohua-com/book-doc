---
hide_title: true
sidebar_position: 2
sidebar_label: 配置
---

官方文档： https://eslint.bootcss.com

## 如何使用

安装 eslint

```shell
yarn add eslint --dev
```

初始化配置文件

```shell
yarn create @eslint/config
```

选择你喜欢的使用模式

```shell
 How would you like to use ESLint?
  To check syntax only  仅仅检查语法
> To check syntax and find problems 检查语法并找到问题
  To check syntax, find problems, and enforce code style 检查语法&找到问题，并格式化这里我们选择地2个，默认的
```

你项目的 module 类型

```shell
What type of modules does your project use?
> JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these
```

选择你用的框架

```shell
Which framework does your project use?
  React
  Vue.js
> None of these
```

完成选择后，就会生成如下配置，如果不是改为如下即可

```javascript
module.exports = {
  env: {
    node: true, // eslint的工作环境，一般都是node
  },
  extends: "eslint:recommended", // 启用最基本的内置预设规则集
  parserOptions: {
    // 解析器选项。指定你想支持的语言，默认支持es5。指定啥语言，eslint就按照啥语法检查。
    ecmaVersion: "latest",
  },
  rules: {
    // 自定义规则
    indent: ["warn", "tab"], // 首行缩进
  },
};
```

然后进入项目执行以下命令：

```shell
eslint file.js  # 仅语法检查
eslint file.js --fix #语法检查并自动修复
```

--fix 并不能修正所有代码，查看 eslint 文档就可以看到了，它只能修正那些 fixable 的规则。比如缩进可以自动修复，但是 let 误用为 const 就无法自动修复。

下边 就这些配置进行具体讲解

## 配置项

### extends

规则继承，可以直接引入三方配置好的规则集。

值为指定配置的字符串。

- 内置规则 （eslint:recommended 或 eslint:all）
- 配置文件的路径(通常为自定义规则集)
- 可共享配置的名称（通常为三方的 node_module/plug）

```javascript
extends: "eslint:recommended"
extends: "./public-eslintrc.js"
extends: "plugin:vue/vue3-essential"
```

eslint:all。 表示引入当前版本 eslint 的所有核心规则。  
eslint:recommended。 表示引入 eslint 的核心功能，并且报告一些常见的共同错误。

### overrides

v4.1.0+提出的，会覆盖全局规则，通常用于更精细的配置。  
比如 indent 缩进规则，我不想被作用到 vue 文件，那么可以如下配置：

```javascript
overrides: [
  {
    files: ["*.vue"],
    rules: {
      indent: "off",
    },
  },
];
```

### rules
自定义规则，这也是最常用的配置之一