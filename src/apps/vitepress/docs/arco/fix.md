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
