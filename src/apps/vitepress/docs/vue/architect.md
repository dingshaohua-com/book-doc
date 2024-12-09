---
sidebar_position: 1
---

# 创建一个项目

## 初始化项目

使用脚手架工具初始化项目，vue2 以及配套的 vue cli 均已不再维护。  
vue 官网都推荐使用自家新品 [vite](https://cn.vitejs.dev/)。

```shell
npm create vite
```

根据提示，选择合适的配置项，即可创建一个项目，看一下 vue 项目的主流选项：vue3+ts。

## 使用 less

因为 vite 并没有提供默认的内置支持，所以我们需要自己安装

```shell
npm install -D less less-loader
```

要求项目中，书写样式必须 scope，防止样式污染

```html
<!-- xxx.vue -->
<style scoped lang="less">
  .logo {
    color: red;
    &:hover {
      color: blue;
    }
  }
</style>
```

## 使用短链接

当路径较为复杂的时候，导入起来就比较麻烦，可以通过一些配置来设置短路径  
开启功能支持：在 vite 配置文件中增加如下配置

```js
// vite.config.ts
export default defineConfig({
  // ...
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

这样仅仅是功能可以使用了，  
但若是 ts 项目，还需要在 ts 配置文件中做一些配置以使得支持 ts（如 ts 报错 智能路径提示）。

```js
// tsconfig.json
{
  "compilerOptions": {
    /* Sort path */
    "baseUrl": ".",
    "paths": {"@/*": ["src/*"]}
  }
}
```

![](https://img.dingshaohua.com/book-fe/20240808144627.png)
:::tip 提示
在新的 vite 脚手架创建的项目中，我发现项目中 ts 相关配置被分别提取到了 `tsconfig.app.json`和 `tsconfig.node.json`中，这可能是为了方便区分吧。建议以上代码放到`tsconfig.app.json`
:::

## 添加路由

先安装路由插件 `npm install vue-router`，再在项目根路径下创建一个路由文件

```js
// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/", // 使用动态导入来实现懒加载
      component: () => import("@/pages/home.vue"),
    },
  ],
});
```

在程序入口文件中引入

```js
// src/main.ts
...
import router from '@/router'

...
app.use(router);
...
```

最后，在根组件中引入路由组件标签

```html
<!-- src/App.vue -->
<template>
  <router-view />
</template>
```

## 封装 API

在支持 openApi 的情况下，优先推荐 API 自动生成工具 [Pont](https://github.com/alibaba/pont)（或者类似工具）。  
在没有的情况下，可以自己封装，目录结构为

```
|--src
  |--api
    |--init.ts
    |--index.ts
    |--modules
       |--student.ts
       |--teacher.ts
```

其中，将 init.ts 引入项目的入口文件 main.ts 即可。

简单描述下个文件的内容

```js
// init.ts
import axios from "axios";
import store from "@/store";
import { Message } from "element-ui";

const getFileNameFromUrl = (url) => {
  const match = url.match(/([^/]+)\.([^/]+)?$/); // 使用正则表达式匹配文件名（不包括扩展名）
  if (match && match[1]) {
    let fileName = match[1];
    // 转换为小写，并用正则表达式替换每个分隔符后的字符为大写（除非它是字符串的第一个字符）
    fileName = fileName
      .toLowerCase() // 先转换为小写
      .replace(/[-_\s]+(.)?/g, (match, p1) => (p1 ? p1.toUpperCase() : ""))
      .replace(/^./, (str) => str.toLowerCase()); // 转换为小驼峰
    return fileName;
  }
  return null; // 如果没有匹配到文件名，则返回null
};

// ---===全局默认axios配置===---
const whitePath = ["/login", "/sms-send"]; // 白名单
axios.defaults.baseURL = process.env.VUE_APP_PROXY;
axios.defaults.timeout = 10000;
axios.interceptors.request.use(
  (config) => {
    const { token } = store.state.app.loginInfo?.token || {};
    if (token) {
      config.headers["Authorization"] = token;
    } else {
      const requstUrl = config.url.replace("/api", "");
      if (!whitePath.includes(requstUrl)) {
        Message({
          message: "登录失效，请重新登录！",
          type: "error",
        });
        location.href = "#/login";
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      if (res.code == 100004) {
        Message({
          message: res.msg || "登录失效，请重新登录！",
          type: "error",
        });
        location.href = "#/login";
        return Promise.reject(new Error(res.msg || "登录失效，请重新登录！"));
      } else {
        Message({
          message: res.msg || "接口错误，请重试！",
          type: "error",
        });
        return Promise.reject(new Error(res.msg || "接口错误，请重试！"));
      }
    }
    return res.data;
  },
  (error) => {
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

// ---===将api注入全局，只需将api定义放在modules中即可===---
// 参数1：其目录路径相对于此配置文件的位置；参数2：是否搜索其子目录；参数3：匹配基础组件文件名的正则表达式
const requireComponent = require.context("./modules", false, /[\w-]+\.js$/);
// 使用 `requireComponent.keys()` 获取匹配到的文件名数组
const api = {};
requireComponent.keys().forEach(async (filePath) => {
  const fileName = getFileNameFromUrl(filePath);
  api[fileName] = requireComponent(filePath);
});
window.api = api;
```

```js
// index.js
export * as student from "./modules/student";
export * as teacher from "./modules/teacher";
```

```js
// module/teacher.js
import axios from "axios";

export const queryTeachers = (params) => {
  return axios.get("/teacher/list", { params });
};
export const queryTeacher = (params) => {
  return axios.get("/teacher", { params });
};
export const inserTeacher = (params) => {
  return axios.post("/teacher", { params });
};
export const deleteTeacher = (params) => {
  return axios.delete("/teacher", { params });
};
```

## 引入 Ui 库

虽然 antd 的 star 远比 element 多，但是在 vue 版本上，element 却比 antdv 多。  
况且 antdv 是有社区维护的，而非蚂蚁团队官方出品。  
综上选择 element ui（即便它被阿里收购了）！

现先下载`npm install element-plus`，后在入口文件中引入

```js
// main.ts
...
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

...
app.use(ElementPlus)
```

最后你就可以在组件内愉快的使用 element ui 啦

```html
<template>
  <el-button>按钮</el-button>
</template>
```

## 引入状态管理

抛弃过时的 vuex，拥抱更好用的 pinia！  
:::tip 简单易用
Pinia 的 Api 设计非常接近 Vuex5 的 提案，管理数据简单，提供数据和修改数据的逻辑即可，不像之前的 Vuex 需要记忆太多。
:::

先安装 `npm install pinia`，之后创建一个 pinia 实例 (根 store) 并将其传递给应用：

```js
// main.ts
...
import { createPinia } from 'pinia'

...
app.use(createPinia())
```

再创建一个自己的 store

```js
import { defineStore } from "pinia";

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
export const useAlertsStore = defineStore("app", {
  // 第一个参数是你的应用中 Store 的唯一 ID。
  state: () => {
    // 状态
    return {
      count: 0,
    };
  },
  actions: {
    // 修改状态的action
    increment() {
      this.count++;
    },
  },
});
```

最后，在组件中使用即可

```html
<script setup>
  import { useAppStore } from "@/store";

  const store = useAppStore();
  const test = () => {
    store.increment();
  };
</script>

<template>
  <div>{{ store.count }}</div>
  <button @click="test()">自增</button>
</template>
```

![](https://img.dingshaohua.com/book-fe/202408091501923.gif)

另外，它还允许[在组件之外使用](https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html)，允许[使用三方插件扩展](https://pinia.vuejs.org/zh/core-concepts/plugins.html)自身能力 如[持久化存储插件](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/)等等。

## 定义组件名称

`<script setup> `语法糖里不支持声明 name 属性，但是又不想写两个`<script>`标签，我们可以采用一款插件 `npm install -D vite-plugin-vue-setup-extend`，然后在 vite 中配置好此插件。

```js
// vite.config.ts
...
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

export default defineConfig({
  plugins: [...,vueSetupExtend()],
  ...
})
```

之后你就可以这样写了

```html
<script setup lang="ts" name="My App">
  ...
</script>
```

打开[vue devtool](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)，也能看到效果  
![](https://img.dingshaohua.com/book-fe/202408081632077.png)

## 自动导入

在开发 vue 项目的过程中，像 ref、react 等常用的 api 总是频繁导入，有点麻烦。
发现 github 上有一个不错的开源工具 unplugin-auto-import，可以借助它 让所需自动导入。

安装 `npm install -D unplugin-auto-import` 完成后，在 vite 配置文件中添加即可。

```js
// vite.config.js
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    ...
    AutoImport({ imports: ['vue', 'vue-router'] }),
  ],
  ...
})
```

之后，你变可以这么用了

```html
<!-- xx.vue -->
<script setup>
  const str = ref("你好，世界");
</script>

<template> {{ str }} </template>
```

**ts 支持**  
但是如果您的项目是 ts，那么还需要配置一下，否则 ts 可能会提示没有显示导入的错误。   

我们可以在 ts 的配置文件中导入相关的类型声明文件 `auto-imports.d.ts` （此文件在配置好插件后会启动项目 会自动生成）。

确保正确配置完成后 重启下 VScode。  
![](https://img.dingshaohua.com/book-fe/202408091547108.png)

```js
// tsconfig.app.json
"include": [
  ...
  "auto-import.d.ts"
]
```

**eslisnt 支持**  
如果你还用了 eslint，也需要载额外为期配置一下，否则它也会提示了没有显示导入的错误。  
![](https://img.dingshaohua.com/book-fe/202408101359889.png)

在 vite 使用 auto import 插件的时候，开启 eslint 的支持 `AutoImport({eslintrc: { enabled: true }})`，之后你再次运行项目，会发现项目中自动生成了 `.eslintrc-auto-import.json`！

我们需要将其引入到 eslint 配置文件中，因为我们使用的是新版 v9 的 eslint

```js
// eslint.config.js
...
import require from './node-helper/require.js'
import absoluteFilePath from "./node-helper/absolute-file-path.js";

// 获得 auto-imports 生成的eslint配置 并导入此
const autoImportsPath = absoluteFilePath('.eslintrc-auto-import.json')
const autoImports = require(autoImportsPath)
export default [
  ...
  {languageOptions: autoImports },
];
```

这样你再执行 `npx eslint` 就可以顺利的通过检测啦！

`require.js` 和 `absolute-file-path.js` 是我提取出去的两个帮助性文件，这里我贴出来

```js
// require.js
import { createRequire } from "module";
const require = createRequire(import.meta.url);
export default require;
```

```js
// absolute-file-path.js
import path from "path";
import process from "node:process";

export default (...arg) => {
  const rootPath = process.cwd();
  const filePath = path.join(rootPath, ...arg);
  return filePath;
};
```

## 集成 Prettier

Prettier 前端代码格式化工具。  
确保代码的缩进、括号、引号、换行等样式一致。

我们安装 `npm install -D prettier` ，然后在根目录创建配置文件。

```js
// prettier.config.js
export default {
  tabWidth: 2, // 缩进2个空格
  useTabs: false, // 缩进单位是否使用tab替代空格
  semi: true, // 句尾添加分号
  singleQuote: true, // 使用单引号代替双引号
};
```

至此，项目就已经支持 Prettier 了，  
可以使用检查命令 `npx prettier src` 或者 自动修复错误命令 `npx prettier --write src`。

若想要编辑器也支持项目中 prettier 配置，可到商店安装 prettier 插件，然后右键格式化代码的时候就可以看到 `使用prettier格式化代码`的选项。

## 集成 Eslint

ESLint 是一个代码检查工具(默认只检查 js，不支持 ts 或 css)，用来检查你的代码是否符合指定的规范。

安装 eslint `npm install -D eslint` ，选择合适的配置项， 即可自动生成 `eslint.config.js`

```shell
npm create @eslint/config
```

至此，项目就已经支持 eslint 了，  
可以使用检查命令 `npx eslint` 或者 自动修复错误命令 `npx eslint --fix`。

若想要编辑器也支持项目中 eslint 配置，可到商店安装 eslint 插件，后重启编辑器就可以看到效果  
![](https://img.dingshaohua.com/book-fe/202408101526687.png)

:::tip 注意
上诉演示提示为项目中 eslint 禁用 var 关键字，需要在 eslint 配置文件中增加此规则

```js
// eslint.config.js
...
export default [
  ...
  {rules:{'no-var': 'error'}}
];
```

:::

最后，贴出一个常用的自定义的规则

```js
// eslint.config.js
export default [
  // ...
  {
    rules: {
      "no-var": "error", // 禁止使用var
      // ---vue-eslint参考：https://eslint.vuejs.org/rules---
      "vue/multi-word-component-names": "off",
      "vue/attribute-hyphenation": ["error", "always"], // vue模板属性中划线
      "vue/component-name-in-template-casing": ["error", "kebab-case"], // vue模板使用组件名规范
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "always",
            component: "always",
          },
        },
      ], // 强制自闭合标签
      // ---tslint 规则集参考：https://typescript-eslint.io/rules---
      "@typescript-eslint/no-explicit-any": "warn", // 允许使用any类型，但是警告（默认即使警告，可以不用声明）
      "@typescript-eslint/no-var-requires": "warn", // 允许使用require，但是警告(默认不允许)
      "@typescript-eslint/no-empty-function": "off", // 允许空方法，因为可能是做单例限制构造or被注解修饰的空方法（默认为error）
      "@typescript-eslint/ban-ts-comment": "off", // 允许@ts- 指令的使用，如@ts-nocheck（默认不允许使用）
      "@typescript-eslint/no-non-null-assertion": "off", // 允许 非空断言操作符（默认为不允许）
      // '@typescript-eslint/explicit-module-boundary-types': 'off'  // 函数必须定义参数类型和返回类型，默认即是关闭校验
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];
```

## Eslint 与 Prettier

一般情况下 我们不会单独运行 prettier，而是将 prettier 集成到 eslint 中，作为一项 rule 进行提示与修复。

我们通过两个包来做到这个能力

- eslint-config-prettier：一个 ESLint 配置规则的包，它将禁用与 Prettier 冲突的 ESLint 规则。
- eslint-plugin-prettier：一个 ESLint 插件，它将 Prettier 作为规则在 ESLint 内部运行。

```
npm install -D eslint-config-prettier eslint-plugin-prettier
```

安装完成后，在 eslint 配置文件中，使用 eslint-plugin-prettier 插件即可(此插件会自动调用 eslint-config-prettier)

```js
// eslint.config.js
...
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  ...
  eslintPluginPrettierRecommended,
];
```

最后就可以看到效果了  
![](https://img.dingshaohua.com/book-fe/202408101608525.jpg)

:::tip 注意
上诉提示为项目中 prettier 要求使用单引号，需要在 prettier 配置文件中增加此规则

```js
// prettier.config.js
export default {
  ...
  singleQuote: true, // 使用单引号代替双引号
};
```

:::

**最后**  
在你的项目 pakage.json 中新增一个脚本

```
{
  ...
  "scripts": {
    ...
    "eslint": "npx eslint src --fix"
  }
}
```

这样，以后你每次提交代码前，执行一下这个命令，你犯的错误 它都帮你解决了。

## 集成 Husky

这是一个让开发人员头痛的插件，它会通过一些手段禁止不符合要求的 commit 被提交。  
遇到被限制了提交了，先不要骂娘，出于团队规范的考虑，你应该先根据提示解决自己的问题！  
Husky 在提交或推送时，自动检查提交信息、检查代码 和 运行测试。

首先安装它 `npm install -D husky` ，之后使用初始化命令 `npx husky init`，这将会 生成 .husky/pre-commit 脚本，并更新 package.json 中的 prepare 脚本。

最后，你可以在.husky/pre-commit 中编写 shell 脚本（如果你更喜欢 js 脚本，[可以看这里](https://typicode.github.io/husky/zh/how-to.html#%E9%9D%9E-shell-%E8%84%9A%E6%9C%AC%E9%92%A9%E5%AD%90)）,脚本将会在你执行 git commit 命令的时候被触发。

比如你可以如下这么写，浙江会在你提交之前检查代码，如果报错 则不予通过

```js
// .husky/pre-commit
npx eslint src
```

## 锁定 Node 版本

为了确保团队协作项目的稳定性和一致性，我们需要采取一些措施来保证项目中的 Node 版本 和 包管理工具一致。  
在项目的 package.json 文件中，可以使用 engines 字段来指定所需的 Node 版本 和 包管理器。在该字段中，我们可以定义一个范围或者具体的版本号来限制 Node 的版本。

```js
// package.json
{
  ...
   "engines": {
    "yarn": ">= 1.0.0",
    "node": "=18.0.0"
  },
}
```

这样当项目成员运行 npm install 时，npm 会自动检查 Node 版本是否满足要求，并给出警告信息。  
npm 下 engines 只是建议，默认不开启严格版本校验，只会给出提示，需要手动开启严格模式。 而 yarn 则默认开启严格模式。

```yml
# .npmrc
engine-strict = true
```

不过实测，并不好用（如 无论怎么配置 yarn 都不支持 node 版本的检测）。

**优选方案**  
除此这个方式，我们还可以利用 preinstall 在安装依赖之前做一些限制，比如使用插件 [use-yarn](https://github.com/AndersDJohnson/use-yarn)、[please-use-yarn](https://github.com/justjavac/please-use-yarn)、[only-allow](https://github.com/pnpm/only-allow)。
它们的使用方式都一样 比如，在 package.json 文件的 scripts 中添加 preinstall：

```js
// package.json
{
  "scripts": {
    "preinstall": "npx please-use-yarn"
  }
}
```

其原理简单，`npx please-use-yarn` 会执行 please-use-yarn/bin 的脚本文件做检测，知道此原理就好办了。

**优化方案**

```js
// package.json
{
  "scripts": {
    "preinstall": "node ./node-helper/preinstall.js"
  }
}
```

```js
// ./node-helper/preinstall.js
import chalk from "chalk";
import semver from "semver";
import process from "node:process";
const version = "22.0.0";
const pkgManager = "yarn";

const pkgManagerExecpath = process.env.npm_execpath || "";
const allowPkgManager = pkgManagerExecpath.indexOf(pkgManager) > -1;
if (!allowPkgManager) {
  console.log(chalk.underline.bold.red("包管理器不符合要求"));
  console.log(chalk.red("要求为：" + pkgManager));
  process.exit(1);
}

if (!semver.satisfies(process.version, version)) {
  console.log(chalk.underline.bold.red("Node版本不符合项目要求"));
  console.log(chalk.red("要求版本：v" + version));
  console.log(chalk.red("您的版本：" + process.version));
  console.log(chalk.magentaBright("推荐使用n、nvm等管理node"));
  process.exit(1);
}
```

**最终方案**  
但是考虑到在 preinstall 阶段的时候，你可能无法使用 chalk、 semver 三方包，随意我们改为如下

```js
// version-compare.js

// 版本比较函数
export default (v1, v2, operator) => {
  // 将版本号转换为数组，按.分割
  v1 = v1.split(".");
  v2 = v2.split(".");
  const maxLen = Math.max(v1.length, v2.length);

  // 补充短的版本号数组，使其长度等于最长的版本号
  for (let i = 0; i < maxLen; i++) {
    if (!v1[i]) {
      v1[i] = "0";
    }
    if (!v2[i]) {
      v2[i] = "0";
    }
  }

  // 转换成数字数组进行比较
  for (let i = 0; i < maxLen; i++) {
    const num1 = parseInt(v1[i], 10);
    const num2 = parseInt(v2[i], 10);

    if (num1 > num2) {
      return operator === ">" || operator === ">=" ? true : false;
    } else if (num1 < num2) {
      return operator === "<" || operator === "<=" ? true : false;
    }
  }

  return true; // 版本号相等
};

// 使用示例
// console.log(versionCompare('1.2.3', '1.2.4', '<')); // true
// console.log(versionCompare('1.2.3', '1.2.4', '>')); // false
// console.log(versionCompare('1.2.3', '1.2.3', '=')); // true
// console.log(versionCompare('1.2.3', '1.2.4', '>=')); // false
// console.log(versionCompare('1.2.4', '1.2.3', '<=')); // true
```

```js
// preinstall.js
import process from "node:process";
import versionCompare from "./version-compare.js";

const currentNodeVersion = process.version.replace("v", "");
const version = "20.16.0";
const pkgManager = "yarn";

const pkgManagerExecpath = process.env.npm_execpath || "";
console.log(pkgManagerExecpath);

const allowPkgManager = pkgManagerExecpath.indexOf(pkgManager) > -1;
if (!allowPkgManager) {
  console.error(`\x1B[1;31m${"*".repeat(40)}\x1B[0;0m`);
  console.error(
    `\x1B[1;31m* 包管理器不符合要求，要求为 ${pkgManager}\x1B[0;0m`
  );
  console.error(`\x1B[1;31m${"*".repeat(40)}\x1B[0;0m`);
  console.error(``);
  process.exit(1);
}

const allowNodeVersion = versionCompare(currentNodeVersion, version, ">=");
if (!allowNodeVersion) {
  console.error(`\x1B[1;31m${"*".repeat(50)}\x1B[0;0m`);
  console.error(
    `\x1B[1;31m* Node不符合项目要求v${version}, 您的为 ${process.version}\x1B[0;0m`
  );
  console.error(`\x1B[1;31m${"*".repeat(50)}\x1B[0;0m`);
  console.error(``);
  process.exit(1);
}
```


## ts不识别vue文件
增加如下代码即可
```js
// vite-env.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<_, _, any>;
  export default component;
}
```

## 表单插件
一般中后台都会大量用到表单，如果自己纯手撸，效率很低。
这里推荐将 vue 开源表单生成插件（目前start最多，且较为完善） FormCreate

![](https://img.dingshaohua.com/book-fe/202412071954123.webp)


## 表格插件
中后台，表格多用于展示数据，   
比如用户列表、角色权限列表等等，也是必不可少，

这里推荐 [vxetable](https://vxetable.cn)，推荐原因：star多、简单易用！


## mock数据
MSW 全称 Mock Service Worker  是一个用于浏览器或 Node.js 的 API 模拟库。借助它，您可以拦截传出的请求、观察它们，并使用模拟响应来响应它们。

MSW 的与众不同之处在于，它极力主张使用独立的 API 模拟层，为您的网络行为创建单一事实来源，并将其集成到您使用的任何工具中。
这带来了更具弹性的设置，并与其他库功能相结合，创造了真正无缝的 API 模拟体验。

[MSW](https://mswjs.io)是目前相当优秀的方案，但是这需要一定的难度，这里有简单和快熟开始的的[使用文档](/tool/msw/start)



