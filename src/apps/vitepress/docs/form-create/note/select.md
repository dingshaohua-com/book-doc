---
sidebar_position: 1
---

# 自定义 select

看到 [issue](https://github.com/xaboy/form-create/issues/404) 里有人发出了这个困惑，刚好我也遇到了，再此做个记录。

用到两个知识点，建议可先看看文档： [children](https://www.form-create.com/v3/guide/rule#children)、slot（[设置组件的插槽](https://www.form-create.com/v3/examples/slot)、[插槽方式渲染组件](https://www.form-create.com/v3/examples/slot-component)）。

## 效果

<img src="https://img.dingshaohua.com/book-fe/202412171534442.gif" style="border: #eee solid 1px;"/>

## arco design 为例

注意下，我这里用的是字节跳动的 ui 库 [arco design](https://arco.design)， 而图标用也是它家的[iconBox](https://arco.design/iconbox)（其实 如下的 icons 就是一个简单的包含图片组件的数组）。

```vue
<template>
  <form-create
    v-model:api="fApi"
    v-model="formModel"
    :rule="rule"
    :option="options"
  >
    <!-- 自定义展示select选中后的结果 -->
    <template #type-selectLabelComponent>
      <div class="select-label">
        <component :is="formModel.ddd"></component>
        <span class="label"> {{ formModel.ddd }}</span>
      </div>
    </template>
    <!-- 自定义展示select的下拉option效果 -->
    <template #type-selectOptComponent="slotProps">
      <div class="icon-option">
        <component :is="slotProps.rule.props.name"></component>
        <span class="label">{{ slotProps.rule.props.name }}</span>
      </div>
    </template>
  </form-create>
</template>
<script setup name="Demo">
import * as icons from "@arco-iconbox/vue-icons";

const rule = [
  {
    type: "select",
    field: "myIcon",
    title: "应用icon",
    validate: [{ type: "string", required: true, message: "请选择" }],
    children: [
      {
        // 自定义展示select选中后的结果 https://arco.design/vue/component/select#label
        type: "div",
        slot: "label",
        children: [
          {
            cache: false, // 关闭缓存，不然vue状态变化后，组件不更新 https://github.com/xaboy/form-create/issues/482
            type: "selectLabelComponent",
          },
        ],
      },
      ...Object.keys(icons).map((icon) => ({
        // 自定义展示select的下拉option效果
        type: "a-option",
        props: {
          value: icons[icon].name,
          key: icons[icon].name,
        },
        children: [
          {
            type: "selectOptComponent",
            props: { ...icons[icon] },
          },
        ],
      })),
    ],
  },
];
</script>
<style lang="less" scoped>
.icon-option {
  display: flex;
  align-items: center;

  svg {
    font-size: 20px;
  }
  .label {
    font-size: 12px;
    margin-left: 10px;
  }
}
.select-label {
  .icon-option;
}
</style>
```
