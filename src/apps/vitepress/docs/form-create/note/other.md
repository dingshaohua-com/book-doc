---
sidebar_position: 1
---

# 其它

## label 独占一行
[表单全局配置项-form](https://www.form-create.com/v3/guide/global-options#form), 这个配置项可以将原ui库的表单配置项的参数传入进去，以acro design的form为例，代码和效果如下
![](https://img.dingshaohua.com/book-fe/202412171608201.png)
```js
const fApi = ref({});
const options = {
  form: { // 表单属性
    layout: "vertical", // 布局方式
  },
  submitBtn: false,
  resetBtn: false,
};
const rule = ref([
  {
    type: "input",
    field: "goods_name",
    title: "商品名称",
    value: "xxx",
    validate: [{ type: "string", required: true, message: "请输入" }],
  },
]);
```
