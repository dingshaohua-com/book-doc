---
hide_title: true
sidebar_position: 3
sidebar_label: 图标源
---

要显示图标，Iconify 图标组件必须具有该图标的数据。   
有多种方法可以为图标提供数据，每种方法都有其优点和缺点。   

## 在线图标api
也就是完整版api、需要依赖网络，这也是iconify最常用的方式，最基本的用法。   

**优点如下**           
* 多：Iconify 公共 API提供了 100 多个图标集，其中包括超过 10 万个图标。
* 快：为缩短加载时间，API 托管在世界不同地区的多台服务器上，实现毫秒内加载。另外Iconify 图标组件还支持浏览器缓存，因此图标数据只需要加载一次。
* 爽：API 是开源的，这意味着您可以在服务器上托管自己的 API图标集。

**原理如下**   
step1：使用iconify图片组件
```html
<span data-icon="mdi:alert" class="iconify" />
<!-- 或者 -->
<Icon icon="mdi:home" />
```
step2：从 Iconify API 请求图标数据,并接受响应   
![](https://img.dingshaohua.com/book-fe/202411231457557.gif)

step3：处理占位符，替换为svg图标
```html
<svg width="1em" height="1em" viewBox="0 0 24 24" ...>...</svg>
```   

## 生成离线icon数据包
在没有互联网访问的情况下工作的最简单方法。   
您可以通过加载图标包来提供图标，而不是从 Iconify API 加载图标数据。 

iconify提供了以下方案：使用 [Iconify API](https://docs.iconify.design/sources/bundles/api.html) 生成、使用 [Iconify JSON](https://docs.iconify.design/sources/bundles/json-tools.html) 工具。   
拿Iconify API 生成器在线版来演示，输入地址回车，即可得到生成好的离线icon数据包：   
`https://api.iconify.design/mdi.json?icons=account,home&pretty=1`

```json
{
    "prefix": "mdi",
    "icons": {
        "account": {
            "body": "<path d=\"M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z\" fill=\"currentColor\"/>"
        },
        "home": {
            "body": "<path d=\"M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z\" fill=\"currentColor\"/>"
        }
    },
    "width": 24,
    "height": 24
}
```
使用
```html
<span class="iconify" data-icon="mdi:account"></span>
<span class="iconify" data-icon="mdi:home"></span>

<script src="./lib/iconify.js"></script>
<script>
    Iconify.addCollection({
        "prefix": "mdi",
        "icons": {
            "account": {
                "body": "<path d=\"M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z\" fill=\"currentColor\"/>"
            },
            "home": {
                "body": "<path d=\"M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z\" fill=\"currentColor\"/>"
            }
        },
        "width": 24,
        "height": 24
    });
</script>
```
React、vue、vite等所有框架都可按照这种方式使用。   
下边再介绍几种离线的用法

## 三方icon数据包
简称图标包，本质是一个 NPM 包，包含来自一组图标的图标数据(IconifyIcon对象)，每个文件一个图标。
使用起来较为方便，想用哪些图标，直接`yarn add 图标`即可。
```shell
yarn add --dev @iconify-icons/mdi-light
```
### react使用
```tsx
import { Icon } from '@iconify/react'; // 引入icon组件
import homeIcon from '@iconify-icons/mdi-light/home'; // 引入三方icon data包

function App() {
  return (
    <div className="App">
     <Icon icon={homeIcon} />   {/* 使用 */}
    </div>
  );
}
export default App;
```
当然，你也可以配合addIcon的方式使用，效果一样
```tsx
import { Icon, addIcon } from '@iconify/react'; // 引入icon组件
import homeIcon from '@iconify-icons/mdi-light/home'; // 引入三方icon data包

// 单个添加
addIcon("@dshvv:demo:myhome", homeIcon); 

function App() {
  return (
    <div className="App">
     <Icon icon="@dshvv:demo:myhome" />   {/* 使用 */}
    </div>
  );
}
export default App;
```

### vue使用
```vue
<template>
  <div id="app">
    <Icon :icon="homeIcon" />
  </div>
</template>

<script>
import { Icon } from '@iconify/vue2'; // vue3请引用 @iconify/vue
import homeIcon from '@iconify-icons/mdi-light/home';

export default {
  name: 'App',
  components: { Icon },
  data(){return{homeIcon}}
}
</script>
```
当然也能配合addIcon的方式使用，参考react用法

### vite用法
```vue
<script setup>
  import { Icon, addIcon } from '@iconify/vue';
  import homeIcon from '@iconify-icons/mdi-light/home'; 
</script>
<template>
  <Icon :icon="homeIcon" />
</template>
```
> 注意，这里将不能再用addIcon，用了也还是会发网络图片请求。


## Iconify icon数据集

Iconify 为了让事情变得更容易，提供了最流行的图标集合作为一个包。   
有来自 100 多个图标集的超过 10w 个图标，在`@iconify/json`包中。

### vite用法
主要利用`@iconify/iconify` + roullup（vite的编译器）+`@iconify/json`图标集来配合实现。
```shell
yarn add @iconify/iconify
yarn add --dev vite-plugin-purge-icons @iconify/json
```
```javascript
// vite.config.js
import PurgeIcons from 'vite-plugin-purge-icons'

export default {
  plugins: [
    PurgeIcons({
      /* PurgeIcons Options */
    })
  ]
}
```
```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import '@purge-icons/generated'

createApp(App).mount('#app')
```
```vue
<script setup>
  // 啥也不用写
  // Iconify这个已经被挂载到了window上
</script>

<template>
  <span class="iconify" data-icon="mdi-light:home"></span>
</template>
```