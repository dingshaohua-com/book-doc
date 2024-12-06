---
hide_title: true
sidebar_position: 2
sidebar_label: 图表组件
---

图标组件是用来负责渲染图标的。   
除了`Iconify SVG原生版组件`还支持很多常用的框架版本组件，如：react版组件、vue版组件等。  
## Iconify SVG原生
Iconify最原始简单基本用法。

### 使用

```html
<script src="https://code.iconify.design/2/2.0.4/iconify.min.js"></script>
<span class="iconify-inline" data-icon="fa-solid:home"></span>
```
如果要更换图标，只需要修改`data-icon`属性即可，如改为`fa-regular:home`。  
点击[图标集合](https://icon-sets.iconify.design/)，查看支持的所有的图标。

### 样式

1、修改颜色

```html
<span class="iconify-inline" data-icon="fa-solid:home" style=" color:red;"></span>
```

官方文档更详细，点击[这里](https://docs.iconify.design/icon-components/svg-framework/color.html)查看。

2、尺寸

```html
<span class="iconify-inline" data-icon="fa-solid:home" style="font-size:24px;"></span>
```

官方文档更详细，点击[这里](https://docs.iconify.design/icon-components/svg-framework/dimensions.html)查看。

3、旋转  
有两种方式可以做到旋转

```html
<!-- svg内部转换，高度还是默认1em(16)，但是宽度变成了14px，即14x16。可能会变小。 -->
<i class="iconify" data-icon="fa-solid:home" data-rotate="90deg"></i>
<!-- css整体旋转，18*16变成了16x18。 可能会与周围的元素重叠。 -->
<i class="iconify" data-icon="fa-solid:home" style="transform:rotate(90deg);"></i>
```

官方文档更详细，点击[这里](https://docs.iconify.design/icon-components/svg-framework/transform.html)查看。

4、对齐  
block 是居中对齐，inline 是基线对齐。其实这个 font 是一样的。

```html
<head>
  <style>
    p { position: relative; font-size: 24px; line-height: 32px; }
    p:after,p:before {  content: ""; position: absolute; left: 0; right: 0; border-bottom: 1px dotted #ccc; }
    p:before { top: 6px;}
    p:after { bottom: 7px;}
  </style>
</head>
<body>
  <p> Block:
    <span class="iconify" data-icon="line-md:image-twotone"></span>
    <span class="iconify" data-icon="mdi:account-box-outline"></span>
  </p>
  <p> Inline:
    <span class="iconify-inline" data-icon="line-md:image-twotone"></span>
    <span class="iconify-inline" data-icon="mdi:account-box-outline"></span>
  </p>
  <script src="./lib/iconify.min.js"></script>
</body>
```

![](https://img.dingshaohua.com/book-fe/202411231457555.png)
官方文档更详细，点击[这里](https://docs.iconify.design/icon-components/svg-framework/inline.html)查看。

### 方法

使用`Iconify.xxx()`  
1、一般方法：此类的方法就1个
```javascript
const IconifyV = Iconify.getVersion(); // 获取当前 Iconify 框架版本号
console.log(IconifyV); // 2.0.4
```

2、获取 icon：方法有3个
```javascript
iconExists(name); // 检查icon是否存在，返回布尔值.
listIcons(); // 列出可用icons, 返回 string[]，可用值指的是存储在localstorage里的icon.
getIcon(name); // 返回一个 icon data, 一般json格式.
```

3、添加 icon：方法有2个
```javascript
addIcon(); // 添加一个icon.
addCollection(); // 添加icon集.
```
> 注意，此方式添加的加载的 icon 不会缓存到 storage 中，只有 Iconify api(网络) 图标才会被缓存。

4、渲染 icon: 方法有3个
```javascript
renderSVG(name, customisations?) // 返回 <svg> 元素.
renderHTML(name, customisations?) // 返回 <svg> 字符串.
renderIcon(name, customisations?) // 返回icon data
```

用于生成 SVG 或者 icon data,看一下返回值，大家就明白了
```html
<span class="iconify-inline" data-icon="line-md:image-twotone"></span>
<script src="./lib/iconify.min.js"></script>
<script>
  console.log(Iconify.renderSVG("line-md:image-twotone"));
  console.log(Iconify.renderHTML("line-md:image-twotone"));
  console.log(Iconify.renderIcon("line-md:image-twotone"));
</script>
```
![](https://img.dingshaohua.com/book-fe/202411231457556.png)

5、手动控制占位替换   
使用js后期创建的图标组件，并不会被iconify 读取和替换占位符。如下
```javascript
const node = document.createElement("a");
node.innerHTML = 'Home icon: <span class="iconify" data-icon="mdi:home"></span>';
console.log(node);
/**
 * 打印如下:
 * <a>
 *      Home icon: <span class="iconify" data-icon="mdi:home"></span>
 * </a>
 ** /
```

scan()   
它会扫描文档中的图标占位符并用图标替换占位符。  
此方法只执行一次。要想持续监听请用下边的方法 `observe()`。

```javascript
const node = document.createElement('a');
node.innerHTML = 'Home icon: <span class="iconify" data-icon="mdi:home"></span>';
Iconify.scan(node);
console.log(node);
/**
 * 打印如下:
 * <a>
 *      Home icon: <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" data-icon="mdi:home"><path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z" fill="currentColor"></path></svg>
 * </a>
 ** /
```

observe()    
持续监听文档中的图标存在占位符并用图标替换占位符

```javascript
const node = document.createElement("a");
setTimeout(() => {
  node.innerHTML =
    'Home icon: <span class="iconify" data-icon="mdi:home"></span>';
  console.log(node);
  /**
   * 打印如下:
   * <a>
   *      Home icon: <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" data-icon="mdi:home"><path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z" fill="currentColor"></path></svg>
   * </a>
   **/
}, 1000);
Iconify.observe(node); // 如果这里换成scan，则上边打印node 则是原始占位符，并不会被替换
```

停止/暂停/恢复 监听
```javascript
stopObserving(); // 停止监听文档中的图标替换操作
pauseObserver(); // 暂停监听文档中的图标替换操作
resumeObserver(); // 继续监听文档中的图标替换操作
```

6、辅助函数：有2个   
calculateSize()   
根据宽（高）+宽/高比例，帮你计算出高（宽），是不是觉得很弱智！
```javascript
/**
 * 计算宽或者高
 *
 * @param {string|number} 宽或高
 * @param {number}  Width/height的比例
 * @param {number} 精确度，默认两位，可以不传
 * @return 宽或高
 */
const res = Iconify.calculateSize(2, 3); // 比如宽是2，宽高的比例是3
console.log(res); // 6
```

replaceIDs()    
此方法会生成一个随机的 uuid。  
当基于renderIcon()或 getIcon 返回的数据渲染图标时，应使用它来确保每个图标内的元素具有唯一的ID。  
renderSVG()和 renderHTML()生成的图标不需要此函数。
很鸡肋，除非需要否则很少使用

```javascript
// 获取 icon data
const icon = Iconify.renderIcon("line-md:image-twotone");
// 创建 svg element
const svg = document.createElement("svg");
console.log(svg); // <svg></svg>
// 设置 svg内的 content
setTimeout(() => {
  svg.innerHTML = Iconify.replaceIDs(icon.body);
  console.log(svg); // <svg><g fill="none"><path d="M7 13l-4 3v3h18v-5l-5-4l-6 5l-3-2z" fill="currentColor" fill-opacity=".3" class="il-md-fill il-md-duration-0 il-md-delay-9"><path d="M3 14V5h18v14H3v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="il-md-length-70 il-md-duration-4 il-md-delay-0"><path d="M3 16l4-3l3 2l6-5l5 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="il-md-length-25 il-md-duration-2 il-md-delay-4"><circle cx="7.5" cy="9.5" r="1.5" fill="currentColor" class="il-md-fill il-md-delay-6"></circle></path></path></path></g></svg>
}, 1000);
```

7、Iconify api独占函数：有3个  
disableCache()       
使用在线版的icon，icon首次下载后会缓存到localstorage中。      
以后再刷新页面，也不会在去请求图片资源了。如何才能禁用缓存呢？
```javascript
// local|session|all
Iconify.disableCache('all'); // 实测这个无效，还是用下边的吧，反正效果一样
Iconify.enableCache('all', false);
```
> 这些函数只能用在在线版图标中，即online版的iconify lib中。   
通过 addIcon() 或 addCollection()注册的icon不可以使用。   
测试之前注意把本地存储清空，方便验证。

loadIcons()     
提前从 Iconify API 中检索图标将资源请求下来，并存储到缓存中，默认也就是localstorage中。   
当图片真的调用的时候，变不会再发起网络请求。   
```javascript
Iconify.loadIcons(['line-md:image-twotone'], (loaded, missing, pending, unsubscribe) => {
    console.log(loaded, missing, pending, unsubscribe);
    if (loaded.length) {
        console.log(`Icon 已经加载（即从网络请求到本地存储中）完毕，随时准备用作渲染.`);
    }
    if (missing.length) {
        console.log(`Icon 不存在.`);
    }
    if (pending.length) { // 当load多个Icons的时候会发生。
        console.log('请求中');
    }
})
```

8、Internal API functions    
有几个比较不常用的内部api，提供给更多控制的开发人员使用   
这里不在翻译和解读，想看的[点此](https://docs.iconify.design/icon-components/svg-framework/functions.html)查看原文档。

## React 
下载依赖
```shell
yarn add --dev @iconify/react
```
项目中引入并使用
```jsx
import { Icon } from '@iconify/react'; // 引入

function App() {
  return (
    <div className="App">
     <Icon icon="mdi-light:home" />   {/* 使用 */}
    </div>
  );
}

export default App;
```
组件会自动从 Iconify API检索mdi-light:home 的数据并渲染它。   
Iconify API 上有超过 100,000 个来自各种免费和开源图标集的图标，包括所有最流行的图标集。

其它使用如样式、方法等使用方式和`svg 框架`用法基本一直，直接参考即可，或者查看[官方原文档](https://docs.iconify.design/icon-components/react/)   


## Vue   
下载依赖
```shell
yarn add --dev @iconify/vue2
```
项目中引入并使用
```vue
<template>
  <div id="app">
    <Icon icon="mdi-light:home" />
  </div>
</template>

<script>
import { Icon } from '@iconify/vue2';
export default {
  name: 'App',
  components: { Icon }
}
</script>
```
更多参考[官方原文档](https://docs.iconify.design/icon-components/react/)   
另外vue3版本的组件和vue2是一致的，只不过依赖包不同
```shell
yarn add --dev @iconify/vue
```

## Vite
下载依赖
```shell
yarn add --dev @iconify/vue
```
项目中引入并使用
```vue
<script setup>
  // vite2+vue3
  import { Icon } from '@iconify/vue';
</script>

<template>
  <Icon icon="mdi-light:home" />
</template>
```
更多参考[官方原文档](https://docs.iconify.design/icon-components/react/)   

另外除了vue、react框架外，iconify还支持Svelte、Ember   
但是没用过，不予翻译，但是仔细看了官方文档，用法和vue、react一样