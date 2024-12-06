---
hide_title: true
sidebar_position: 2
sidebar_label: vue支持
---

**参考**  
[vue 风格指南](https://v3.cn.vuejs.org/style-guide)  
[插件规则集 eslint-plugin-vue](https://eslint.vuejs.org/rules)  
[使用 Eslint & standard 规范前端代码](https://www.cnblogs.com/zhoumingjie/p/11582862.html)  
[各种 lint 预设 pk](https://www.npmtrends.com/eslint-config-airbnb-vs-prettier-vs-standard)  
[为什么推荐使用 prettier](https://blog.csdn.net/qq_21567385/article/details/109136668)  
[我为什么推荐 Prettier 来统一代码风格](https://blog.csdn.net/Fundebug/article/details/78342784)  
[Vue CLI 3.0 文档](https://www.bluesdream.com/blog/vue-cli-3-document-install-and-create.html)  
[ESLint 与 Prettier 配合使用](https://segmentfault.com/a/1190000015315545)
[Typescript 中如何正确使用 ESLint 和 Prettier](https://zhuanlan.zhihu.com/p/359174647)
[eslint中文文档](https://eslint.bootcss.com)

## vue cli

基于 webpack 构建的 vue 脚手架工具。

**选择代码检测和格式化方案**  
使用脚手架创建项目的时候，是可以直接选择 eslint 的集成。  
![](https://img.dingshaohua.com/book-fe/202411231434520.png)

```shell
选择Linter / Formatter配置:
选项：
  ESLint with error prevention only  // 自带默认规则集
  ESLint + Airbnb config  // Airbnb规则集
  ESLint + Standard config // Standard规则集
  ESLint + Prettier // Prettier则集
```

默认的规则集太简单，但大家又不喜欢自己来配置繁杂的 rules 规则，所以一般情况下都会选择一些规则集（比较流行的有 airbnb、standard、prettier 等）。

相比之下大家都推荐 Prettier 预设规范，配置更少，用起来更舒服，而且 Prettier 还提供了扩展方便集成到编辑器中进行一键`代码格式化`。

我们来看看比较也能得出结果：

![](https://img.dingshaohua.com/book-fe/202411231434521.png)

我们分别使用自带默认规则集、Standard 规则集、Prettier 则集来生成，项目看看区别(只有 extends 配置有区别，其它都一样)：

```javascript
extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
]
extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
]
extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
]
```

**选择何时进行代码检测**  
![](https://img.dingshaohua.com/book-fe/202411231434522.png)

```javascript
Pick additional lint features:
  Lint on save // 保存就检测
  Lint and fix on commit // fix和commit时候检查
```

## vite cli

下一代前端开发与构建工具，区别于 vue cli 使用的 vebpack，create-vite 在 dev server 使用原生 esm 运行时打包，生产则使用 rollup。  
支持 react、vue 框架，这里主要以 vue 举例。

create-vite 此脚手架官方可选模板并没有像 vue cli 那样可选集成了 eslint（包含 vuex、vue-router 都需要自己后续手动集成）

```shell
yarn create vite my-vue-app --template vue-ts
```

至此一个极为简单的 vite 版的 vue 项目就创建完了，接下来集成 eslint。

### 分析集成 eslint

为了方便理解，先一步一步的按照思路进行配置，否则请直接看下一步的完整配置 eslint。  
推荐配置：vite+vue3+ts+prettier 的规则校验。

**1、安装 eslint**  
安装 eslint，并初始化配置文件。

```shell
yarn add --dev eslint
```

创建 eslint 的配置文件`.eslintrc.js`内容如下，也可以用命令创建`npm init @eslint/config`

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
};
```

**2、添加执行脚本**    
在 package.json的scripts属性 添加如下：

```javascript
"lint": "eslint --cache --max-warnings 0  \"src/**/*.{js}\""
```
然后执行`npm run lint`   
就可以检查src目录下的js文件了。    
比如，rules可以设置缩进为2个空格，然后在js里故意缩进3个空格，看看是否报错。

**3、支持typescript**     
eslint默认解析器espree 只能解析 js 文件。    
安装eslint的[ts相关支持包](https://typescript-eslint.io)
```shell
yarn add --dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
```
然后在eslint的配置文件，增加 parser 字段， 添加如下代码
```shell
parser: '@typescript-eslint/parser',
plugins: ['@typescript-eslint'],
extends: [
  ...
  "plugin:@typescript-eslint/recommended"
]
```
将执行命令修改，添加`.ts`文件的检测
```shell
"lint": "eslint --cache --max-warnings 0  \"src/**/*.{js,ts}\""
```
**4、支持vue**   
截至目前，vue文件还不能被eslint检测。    
来让其支持，安装[依赖](https://eslint.vuejs.org)
```shell
yarn add --dev eslint-plugin-vue
```

之前解析器需要指定为vue，然后将之前的ts挪到解析配置项中，并添加extends，具体如下
```shell
parser: 'vue-eslint-parser',
parserOptions: {
  ...
  parser: "@typescript-eslint/parser",
},
extends: [
  ...
  "plugin:vue/vue3-recommended",
],
```
将执行命令修改，添加`.vue`文件的检测
```javascript
"lint": "eslint --cache --max-warnings 0  \"src/**/*.{js,ts,vue}\""
```


**5、支持prettier**     
安装依赖 
```shell
yarn add --dev prettier eslint-config-prettier eslint-plugin-prettier
```
然后在eslint的配置文件, extends 字段， 添加如下代码
```shell
"plugin:prettier/recommended",
```

配置prettier，prettier.config.js
```javascript
module.exports = {
  semi: true, // 句尾添加分号
  vueIndentScriptAndStyle: true, // 是否给vue中的 <script> and <style>标签加缩进
  singleQuote: true, // 使用单引号代替双引号
  trailingComma: 'none', // 选项：none|es5|all， 在对象或数组最后一个元素后面是否加逗号
  singleAttributePerLine: true, // HTML、Vue 和 JSX 中有多个属性时，会触发换行
  bracketSameLine: true // 处理singleAttributePerLine闭合标签也会独占一行问题
};

```

**6、配置自定义规则**
在eslint的配置文件，增加 rules 
```javascript
rules: {
    'prettier/prettier': 'error',
    'no-var': 'error', // 禁止使用var
    // ---vue-eslint参考：https://eslint.vuejs.org/rules---
    'vue/attribute-hyphenation': ['error', 'always'], // vue模板属性中划线
    'vue/name-property-casing': ['error', 'PascalCase'], // vue组件名规范
    'vue/component-name-in-template-casing': ['error', 'kebab-case'], // vue模板使用组件名规范
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always'
        }
      }
    ], // 强制自闭合标签
    // ---tslint 规则集参考：https://typescript-eslint.io/rules---
    '@typescript-eslint/no-explicit-any': 'warn', // 允许使用any类型，但是警告（默认即使警告，可以不用声明）
    '@typescript-eslint/no-var-requires': 'warn', // 允许使用require，但是警告(默认不允许)
    '@typescript-eslint/no-empty-function': 'off', // 允许空方法，因为可能是做单例限制构造or被注解修饰的空方法（默认为error）
    '@typescript-eslint/ban-ts-comment': 'off', // 允许@ts- 指令的使用，如@ts-nocheck（默认不允许使用）
    '@typescript-eslint/ban-types': [
      'warn',
      {
        extendDefaults: true,
        types: {
          Function: false
        }
      }
    ], // 禁止部分值被作为类型(默认[https://.../ban-types#default-options]全部error，通过types来放开校验)
    '@typescript-eslint/no-non-null-assertion': 'off' // 允许 非空断言操作符（默认为不允许）
    // '@typescript-eslint/explicit-module-boundary-types': 'off'  // 函数必须定义参数类型和返回类型，默认即是关闭校验
  }
```



### 完整配置 eslint
```javascript
module.exports = {
  root: true,
  env: {
    'vue/setup-compiler-macros': true, // 处理error ‘defineProps’ is not defined no-undef
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-var': 'error', // 禁止使用var
    // ---vue-eslint参考：https://eslint.vuejs.org/rules---
    'vue/attribute-hyphenation': ['error', 'always'], // vue模板属性中划线
    'vue/name-property-casing': ['error', 'PascalCase'], // vue组件名规范
    'vue/component-name-in-template-casing': ['error', 'kebab-case'], // vue模板使用组件名规范
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always'
        }
      }
    ], // 强制自闭合标签
    // ---tslint 规则集参考：https://typescript-eslint.io/rules---
    '@typescript-eslint/no-explicit-any': 'warn', // 允许使用any类型，但是警告（默认即使警告，可以不用声明）
    '@typescript-eslint/no-var-requires': 'warn', // 允许使用require，但是警告(默认不允许)
    '@typescript-eslint/no-empty-function': 'off', // 允许空方法，因为可能是做单例限制构造or被注解修饰的空方法（默认为error）
    '@typescript-eslint/ban-ts-comment': 'off', // 允许@ts- 指令的使用，如@ts-nocheck（默认不允许使用）
    '@typescript-eslint/ban-types': [
      'warn',
      {
        extendDefaults: true,
        types: {
          Function: false
        }
      }
    ], // 禁止部分值被作为类型(默认[https://.../ban-types#default-options]全部error，通过types来放开校验)
    '@typescript-eslint/no-non-null-assertion': 'off' // 允许 非空断言操作符（默认为不允许）
    // '@typescript-eslint/explicit-module-boundary-types': 'off'  // 函数必须定义参数类型和返回类型，默认即是关闭校验
  }
};

```


## rules

### js/ts 缩进

配置 rules 如下

```javascript
'indent': 2,
```

![](https://img.dingshaohua.com/book-fe/202411231434523.gif)

### vue 首行缩进

纯靠 Indent 会使得 Vue 设置 Script 标签首层不缩进等问题，所以我们需要使用额外插件规则集

配置 rules 如下：
其中，type 为缩进元素设置，可以设置为空格数或者“tab”，这里设置为 2，表示一个缩进为 2 个空格。然后将 baseIndent 设置为 1，表示整体移动一个缩进（表示上面设置的 2 个空格）

```javascript
'vue/script-indent': ['error', 2,
    {
    'baseIndent': 1,
    }
]
```

为了避免同时受到 indent 规则的影响，所以我们需要额外配置 overrides 排除忽略属性  
对于匹配 overrides.files 且不匹配 overrides.excludedFiles 的 文件，overrides.rules 中的规则会覆盖 rules 中的同名规则。

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

最终效果如下  
![](https://img.dingshaohua.com/book-fe/202411231434524.gif)

### vue 模板属性中划线

必须用中划线，不可用驼峰。  
此规则强制在 Vue 模板中的自定义组件上使用带连字符的属性名称。
配置 rules 如下：

```javascript
"vue/attribute-hyphenation": ["error", "always", {
    "ignore": []
}]
```

### vue 模板属性换行

在 JavaScript 中，将具有多个属性的对象拆分为多行被广泛认为是一种很好的约定，因为它更容易阅读。我们的模板和 JSX 应该得到同样的考虑。---[官网](https://vuejs.org/style-guide/rules-strongly-recommended.html#multi-attribute-elements)  
（其实我并不喜欢，因为页面会变得冗长和丑）

配置 rules 如下：
单行的时候可接受的属性个数 1，存在手动换为多行的时候 支持每行属性个数也是 1。这也是默认设置

```javascript
"vue/max-attributes-per-line": ["error", {
    "singleline": 1,
    "multiline": 1
}]
```

![](https://img.dingshaohua.com/book-fe/202411231434525.gif)

但是效果如上，并不好，存在以下问题：

- 多行属性对齐问题，没有以组件位置为 base
- 当标签上属性>1 的时候，第一个属性也应该换行，实际上没有

所以引出了另一个配置，配置 rules 如下：
单行属性时，第一个属性的位置不用换行,多行就必须要换行.  
更优秀的是它顺带处理了多行属性对齐基准问题

```javascript
"vue/first-attribute-linebreak": ["error", {
    "singleline": "ignore",
    "multiline": "below"
}]
```

![](https://img.dingshaohua.com/book-fe/202411231434526.gif)

## Prettier

如上规则，其实完成一个优秀的 eslint 配置 还需要几十个甚至上百个规则配置，实在麻烦。  
于是大家都使用了预设的规则集 Prettier。

**安装使用**

需要[安装两个](https://prettier.io/docs/en/integrating-with-linters.html)依赖（假设你没用脚手架预设）

```shell
yarn add --dev eslint-plugin-prettier eslint-config-prettier
```

eslint-plugin-prettier：这是一个 ESLint 插件，这意味着它包含 ESLint 将检查的其他规则的实现。这个插件在引擎盖下使用了 Prettier，当您的代码与 Prettier 的预期输出不同时，会引发问题。这些问题可以通过--fix 自动修复。使用这个插件，您不需要单独运行 prettier 命令，该命令将作为插件的一部分运行。此插件不会关闭与格式相关的规则，如果您手动或通过 eslint-config-prettier 发现此类规则的冲突，则需要将其关闭。

eslint-config-prettier：这是一个 ESLint 配置，它包含规则的配置（无论某些规则是开启，关闭还是特殊配置）。通过此配置，您可以通过关闭与 Prettier 冲突的格式相关规则，将其与其他 ESLint 配置一起使用，例如 eslint-config-airbnb。使用此配置，您不需要使用 prettier-eslint，因为在 Prettier 格式化代码后，ESLint 不会抱怨。但是，您需要单独运行 prettier 命令。

```javascript
extends: [
    ...
    "plugin:prettier/recommended"
]
```

完成如上配置即可。
通常情况下，默认的 prettier 规范已够我们使用，如果需要调整，直接修改 prettier.config.js 配置文件即可。

## 推荐 eslint 配置

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": "error",
  },
};
```
