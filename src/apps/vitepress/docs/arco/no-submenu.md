# 仅一级菜单

默认情况和官方示例，菜单都是两级。
![](https://img.dingshaohua.com/book-fe/202412111847511.webp)

那我们如何能做到仅一级菜单呢？


## 创建路由文件
我们创建一个演示的路由文件，仅展示一级菜单。
```js
// src/router/routes/modules/simple.ts
import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SIMPLE: AppRouteRecordRaw = {
  path: '/welcome',
  name: 'welcome',
  component: DEFAULT_LAYOUT,
  redirect: '/wlcontent',
  meta: {
    locale: '欢迎页',
    requiresAuth: false,
    icon: 'icon-customer-service',
    order: 0,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: '/wlcontent',
      name: 'wlcontent',
      component: () => import('@/views/welcome/index.vue'),
      meta: {
        requiresAuth: true,
        activeMenu: 'welcome',
      },
    },
  ],
};

export default SIMPLE;
```

## 创建页面
```vue
<!-- src/views/welcome/index.vue -->
<template>
  <div>👏🏻 欢迎！</div>
</template>

<script setup lang="ts" name="welcome">
  console.log(123);
</script>
```

## 重启预览
既可以看到效果   
![](https://img.dingshaohua.com/book-fe/202412111852196.webp)

参考：   
* [如果我想创建一个一级菜单，没有子集的菜单怎么创建？](https://github.com/arco-design/arco-design-pro-vue/issues/85)   
* [可以有做一个一级菜单的demo吗？](https://github.com/arco-design/arco-design-pro-vue/issues/128)
