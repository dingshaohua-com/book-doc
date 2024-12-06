---
sidebar_position: 1
---

# vue 状态管理

在 vue2，vuex 是管理状态的主流，到了 vue3 则 pinia 成了主流！
这是因为 Pinia 是基于 Vue 3 的 Composition API 设计的，这使得它更加灵活和可组合。  
而 Vuex 则是基于 Vue 2 的 Options API 构建的。

## PiniaVsVuex3.x

### 初始化
Vuex需要显式安装插件并创建store，而Pinia则更直观，无需安装插件，而是创建一个实例直接注册到Vue应用中。

```js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex); // 安装插件

new Vue({
  store: new Vuex.Store({}), // 挂在到vue实例上
  render: (h) => h(App),
}).$mount("#app");
```

```js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia); // 注册到Vue应用
app.mount("#app");
```


### 使用
在组件内部，Vuex通过`this.$store`访问状态和触发变更，而Pinia则使用Composition API风格，通过`setup`函数内的`useStore`来访问。
```html
<template>
    <div>
       <div> {{count}} </div>
       <button @click="increment()">测试</button>
    </div>
<template>
<script>
export default {
  computed: {
    count() {
      return this.$store.state.count;
    }
  },
  methods: {
    increment() {
      this.$store.commit('increment');
    }
  }
}
</script>
```

```html
<template>
    <div>
       <div> {{count}} </div>
       <button @click="increment()">测试</button>
    </div>
<template>
<script setup>
import { useStore } from './store'
const count = store.count;
const increment = store.increment;
</script>
```

### 定义
Vuex将状态、actions和getters分开定义，而Pinia则在一个对象中统一定义，简化了代码结构。  
Pinia 相较于 Vuex 更加简洁、直接，特别是去掉了 mutations 的概念(action可以直接修改 state，不需要像 Vuex 那样通过 mutation。)，简化了代码结构。
```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  actions: {
    increment({ commit }) {
      commit('increment');
    }
  },
  getters: {
    doubleCount: state => state.count * 2
  }
});
```

```js
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++;
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2
  }
});
```


### 模块化支持
Vuex需要手动配置模块到modules里，而Pinia的每个store都可以视为一个模块，支持更灵活的模块化。
```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}
const store = new Vuex.Store({
  modules: {
    a: moduleA
  }
});
```

```js
// 使用 defineStore 分别定义不同的模块并在组件中自由使用。
export const useModuleA = defineStore('moduleA', {
  // ...
});
```


### ts支持
Pinia从一开始就设计成支持TypeScript，而Vuex的TypeScript支持稍显不足，需要额外的类型声明等配置。

在这个例子中，count的状态被明确地标记为number类型。当你在组件中使用这个store时，TypeScript可以提供类型检查和自动完成功能。
```js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0 as number
  }),
  actions: {
    increment() {
      this.count++;
    }
  }
});
```

Vuex中，如果没有额外的配置，TypeScript可能无法识别状态的类型。你需要使用Module类型来提供类型信息
```js
import { Store, Module } from 'vuex';

interface State {
  count: number;
}

const store: Store<State> = new Vuex.Store<State>({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  }
});
```
