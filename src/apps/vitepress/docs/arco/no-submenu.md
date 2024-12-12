# 仅一级菜单

默认情况和官方示例，菜单都是两级。
![](https://img.dingshaohua.com/book-fe/202412111847511.webp)

那如何能做到仅一级菜单呢？

## 创建路由文件

我们创建一个仅展示一级菜单 演示的路由文件。

```js
// src/router/routes/modules/no-submenu.ts
import { DEFAULT_LAYOUT } from "../base";
import { AppRouteRecordRaw } from "../types";

const NOSUBMENU: AppRouteRecordRaw = {
  path: "/welcome-temp",
  name: "welcome-temp",
  component: DEFAULT_LAYOUT,
  redirect: "/welcome",
  meta: {
    locale: "欢迎页",
    requiresAuth: false,
    icon: "icon-customer-service",
    order: 0,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: "/welcome",
      name: "welcome",
      component: () => import("@/views/welcome.vue"),
      meta: {
        requiresAuth: true,
        activeMenu: "welcome-temp",
      },
    },
  ],
};

export default NOSUBMENU;
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

效果如下  
![](https://img.dingshaohua.com/book-fe/202412111852196.webp)

参考：

- [如果我想创建一个一级菜单，没有子集的菜单怎么创建？](https://github.com/arco-design/arco-design-pro-vue/issues/85)
- [可以有做一个一级菜单的 demo 吗？](https://github.com/arco-design/arco-design-pro-vue/issues/128)

## 优化

### 封装方法
这样每次写很繁琐，通过观察可以发现其实都是有规律存在， 我们可以封装个方法。

```js
/**
 * 生成不包含子菜单项的菜单
 *
 * @param oldMenu 旧的菜单数据，可以是 AppRouteRecordRaw 数组或单个 AppRouteRecordRaw 对象
 * @returns 生成的新菜单数据
 */
const genNoSubMenuItem = (
  oldMenu: Array<AppRouteRecordRaw> | AppRouteRecordRaw
) => {
  const handler = (item: AppRouteRecordRaw) => {
    return {
      path: `${item.path}-temp`,
      name: `${String(item?.name)}-temp`,
      component: DEFAULT_LAYOUT,
      redirect: item.path,
      meta: {
        locale: "欢迎页",
        requiresAuth: false,
        icon: item.meta?.icon,
        order: item.meta?.order || 0,
        hideChildrenInMenu: true,
      },
      children: [
        {
          ...item,
          meta: {
            ...item.meta,
            requiresAuth: true,
            activeMenu: `${String(item?.name)}-temp`,
          },
        },
      ],
    };
  };
  const isObject = !Array.isArray(oldMenu);
  if (isObject) return handler(oldMenu);
  return oldMenu.map((item) => handler(item));
};
```


### 使用
最后我们使用即可,
```js
const NOSUBMENU: AppRouteRecordRaw = {
  path: '/welcome',
  name: 'welcome',
  component: () => import('@/views/demo/welcome.vue'),
  meta: {
    order: 0,
    locale: '欢迎',
    requiresAuth: true,
    icon: 'icon-customer-service',
  },
};
export default genNoSubMenuItem(NOSUBMENU);
```

当然传数组也是可以
```js
const NOSUBMENU: Array<AppRouteRecordRaw> = [
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('@/views/demo/welcome.vue'),
    meta: {
      order: 0,
      locale: '欢迎',
      requiresAuth: true,
      icon: 'icon-customer-service',
    },
  },
  {
    path: '/list',
    name: 'list',
    component: () => import('@/views/demo/list.vue'),
    meta: {
      order: 0,
      locale: '列表',
      requiresAuth: true,
      icon: 'icon-customer-service',
    },
  },
];

export default genNoSubMenuItem(NOSUBMENU);
```