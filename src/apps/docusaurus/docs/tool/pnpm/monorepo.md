---
sidebar_position: 1
sidebar_label: 多仓 
---

# 单仓多项目

## 概念
Monorepo，即“单个仓库多项目管理”，是一种项目代码管理方式，它将多个项目（如应用、库、工具等）代码集中管理在一个仓库中。
```shell
project
├── node_modules/
│   ├── lib@1.0.0
├── src/
│   ├── ProjectA
│   ├── ProjectB
│   └── ProjectC
└── package.json
```


这种方式有助于简化代码共享、版本控制、构建和部署等方面的复杂性，并提供更好的可重用性和协作性。   
这种方法已被广泛采用，包括一些知名公司如Google、Facebook和Microsoft等。


Monorepo不仅限于前端开发，它在多种编程语言和开发环境中都有应用，只是被前端更多的使用而已。   
Monorepo[不仅限于Pnpm，yarn和npm同样也有办法支持](https://juejin.cn/post/7241012621608140857)，只不过Pnpm支持的更好而已！


## pnpm-workspace.yaml
pnpm默认仓库为单一仓库(单体仓库) multirepo，如果你想要开启多仓能力 monorepo，根目录下必须有用于定义工作空间的范围的多仓的核心配置文件：

```yml title="pnpm-workspace.yaml"
packages:
  # 指定根目录直接子目录中的包
  - 'my-app'
  # packages/ 直接子目录中的所有包
  - 'apps/*'
  # components/ 子目录中的所有包
  - 'components/**'
  # 排除测试目录中的包
  - '!**/test/**'
```

## 优化启动与打包
针对node项目，比如 node、express、koa、vue、react等等项目，每个项目都有自己的打包和启动方式，这就我们去整合。

### 屏蔽子项目script
首先我们需要屏蔽掉项目的 package.json 中各自的script脚本命令，
```js .vscode/settings.json
{
  "npm.exclude": ["**/apps/**"]
}
```
这样，在vscode中最左侧的Vscode脚本中就不会显示那么乱！

### 主项目创建启动或打包命令
在主项目的根目录，创建一个bin文件夹，里边放置 dev.js 和 build.js，分别用来管理启动和打包

#### 启动
通过 `@inquirer/prompts` 这个三方包，再结合我们的脚本：用户执行此脚本 npm run build，就可以列出所有的项目，按下空格选择 回车启动！
```js
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { checkbox } from '@inquirer/prompts';

// 获取都有哪些项目
const ignoreDir = [".DS_Store"];
const appsDir = path.resolve("apps");
const apps = fs.readdirSync(appsDir, { withFileTypes: true }).filter(it=>!ignoreDir.includes(it.name));

// 根据用户选择，启动指定项目
const answer = await checkbox({
  message: '选择需要启动的项目？',
  instructions: "😍空格键多选，回车键确定启动💏",
  choices: apps.map(item=>({name: item.name, value: item.name}))
});

answer.forEach((appName) => {
  const app = apps.find(it=>it.name===appName) 
  if (ignoreDir.includes(app.name)) return false;
  const appPath = path.resolve(app.parentPath, app.name);
  spawn("npm run", ["--prefix", appPath, "dev"], {
    stdio: "inherit",
    shell: true,
  });
});
```



## 参考
[Monorepo多项目管理不再难！](https://juejin.cn/post/7454035377106599963)
