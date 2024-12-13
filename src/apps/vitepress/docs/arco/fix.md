# 调整

记录应用到自己项目所做出的调整

## eslint
导入的时候， 允许 带js后缀名
```js
{
   rules: {
       'import/extensions': [
            2,
            'ignorePackages',
            {
                // js: 'never', 
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
  }
}
```

## 项目开启 esm

修改项目默认模块化标

```js
// package.json
{
      "type": "module", //  启用esm
}
```

为了适配，请将 eslirc.js 和 prttier 配置文件做 esm 的适配，如内容页改为 esm 或后缀名改为 cjs。


## 去除国际化
大部分人不需要国际化命令, [官方也在在规划提供删除国际化的命令](https://github.com/arco-design/arco-design-pro-vue/issues/34)（已经规划3年了，目测已经弃坑了）。目前可以先使用Pro的简单模式初始化项目，再去删除国际化相关的代码，工作量可能会小一点。

```
_Fix Version：_arco-design-pro-vue => 2.5.11 （简版）

Ps：$t()、t() 请结合 src/locale/zh-CN.ts 和 src/locale/zh-CN/settings.ts 进行手动替换

├── package.json #去掉 vue-i18n

├── src
│ ├── components
│ ├── breadcrumb
│ └── index.vue #去掉 $t()
│ ├── global-setting
│ └── block.vue #去掉 $t()
│ └── index.vue #去掉 $t()、useI18n()、t()
│ ├── menu
│ └── index.vue #去掉 useI18n()、t()
│ ├── message-box
│ └── locale #去掉（以下2个文件需要结合当前进行手动替换）
│ └── index.vue #去掉 $t()、useI18n()、t()
│ └── list.vue #去掉 $t()
│ ├── navbar
│ └── index.vue #去掉 $t()、LOCALE_OPTIONS、locales、useLocale()、changeLocale()
│ ├── tab-bar
│ └── tab-item.vue #去掉 $t()

│ ├── hooks
│ └── locale.ts # 去掉

│ ├── locale # 去掉

│ ├── views
│ ├── folder*
│ └── locale* #去掉
│ └── file*.ts #去掉 useI18n()、t()
│ └── file*.vue #去掉 useI18n()、t()、$t()

│ ├── router
│ ├── externalModules
│ └── arco.ts # menu.arcoWebsite 替换 'Arco Design'
│ └── faq.ts # menu.faq 替换 '常见问题'
│ ├── modules
│ └── dashboard.ts #替换menu.*
│ └── locale.ts # menu.dashboard.workplace 替换 '工作台'

│ └── App.vue # 去掉locale、useLocale()、zhCN、enUS

│ └── main.ts # 去掉i18n()

└── tsconfig.json
```