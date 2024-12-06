---
sidebar_position: 4
---

# rem

平时我们布局，多用 px（像素）绝对单位来做。

但是如果产品需要考虑到兼容性（如移动端或者 pc 大屏或其它场景等），就需要使用相对单位来进行布局，以便达到自适应的能力。

相对单位的布局的单位有很多，如百分比、vw、em、rem 还有小程序的 rpx 等等，咱们这里主要关注 rem。

## 基础原理

rem 是相对单位，它相当于文档根元素`<HTML>`的字体大小。

比如，我根元素设置了`font-size`为 100px，那么在页面中 1rem 就等于 100px。

```html
<style>
  html {
    font-size: 100px;
  }
  div {
    width: 1rem;
    height: 1rem;
    font-size: 0.2rem;
    background-color: pink;
  }
</style>
<div>你好</div>
```

一般情况下，浏览器的默认字体大小为 16px，您若不手动设置根元素的`font-size`，则 1rem 默认为 16px；  
如果在不设置根字体大小的情况下，仍然想保持 div 宽高为 100，我们可以做一个换算 100px/16px = 6.25rem。  
效果和上边相同，即使换算起来不太方便 不是好换算的数字，这也是为什么大家都喜欢设置根元素字体大小的原因。

```css
div {
  width: 1rem;
  height: 1rem;
  font-size: 0.2rem;
  background-color: pink;
}
```

## 与设计稿

通常情况下，我们开发页面往往是依据设计师提供的设计稿。  
而设计稿往往是基于某种尺寸规格设计的，比如基于不同分辨率的 pc、或者不同屏幕尺寸设备的移动端。

比如 我们有一个设计稿 是基于 iphone se 设计的，其分辨率自然就是 设备的尺寸 `375 x 667`。
假设 设计稿的内容很简单，就一个粉红色的方块，宽高尺寸均为 100px。

那我们便认为在 iphone se 这个粉红块的尺寸就是 100px。 如果我们使用 rem 布局，我们就可以这样换算成 rem 单位：100/16 = 6.25

```css
.pink-block {
  width: 6.25rem;
  height: 6.25rem;
  background-color: pink;
}
```

如果设备为 ipad air（分辨率为 `820 x 1180`），这个粉红色块的尺寸就需要作出调整，调整方案为根据设计图和当前设备的分辨率而等比放大 所以因该是 `820/375*100≈218.66px`。  

同样这里我们通过 rem 来做，通过对根字体的缩放 来影响整体的大小。   
根字体的缩放为 两者宽度比值*正常设计稿布局中根字体的大小（默认为 16）：`820/375*16≈34.98`。  
也就是说 如果判断当前设备 如果是 ipad air，则将 font-size 改为 34.98px 即可。

```css
html {
  font-size: 34.98px;
}
.pink-block {
  width: 6.25rem;
  height: 6.25rem;
  background-color: pink;
}
```

但是这里显然有点问题，如果我每次都要手改，多麻烦！  
而且我还不知道有多少设备不同的分辨率。  
综上，我们可以通过 js 监听设备尺寸变化 动态设置根 font-size。

```html
<style>
  div {
    width: 6.25rem;
    height: 6.25rem;
    background-color: pink;
    background-color: pink;
  }
</style>
<div>你好</div>
<script>
  // 基准大小(原设计图 符合与效果图尺寸布局时候的根font-size)
  const baseSize = 16;
  // 设计图宽度
  const designWidth = 375;
  // 以375px 底图为准开发页面，动态修改根元素字体的大小
  const setDomFontSize = () => {
    // 计算缩放倍数
    const scale = document.documentElement.clientWidth / designWidth;
    // 将其倍数计算到根font-size上
    const computFontSize = baseSize * scale + "px";
    document.documentElement.style.fontSize = computFontSize;
  };
  window.addEventListener("resize", setDomFontSize);
  setDomFontSize();
</script>
```

## 懒人思维
假设有一个插件，我编写代码的时候，就按照设计稿的绝对单位去写，然后这个插件自动帮我转换为合适的rem。  
这样编码岂不更舒适？！   

没错，是有这些插件 如postcss-plugin-px2rem、postcss-pxtorem、postcss-px2rem。  
因为需要改你的源码能力，所以这些插件均运行在webpack vite或者其他具有修改源码能力的项目中。


我们这里以vue cli创建的vue2项目为例，来使用插件 [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) （因为它的star最多）。  

安装依赖`yarn add --dev postcss-pxtorem`，并在项目根目录建立配置文件`postcss.config.js`，其内容如下
```js
module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 16, // 设计稿宽度的100分之1，通常是750或者375
      propList: ["*"], // 需要转换的属性，这里选择转换所有属性
    },
  },
};
```

建立动态设置根元素的文件，并导入到vue项目入口执行（postcss-pxtorem只是负责px转rem，它并不负责计算动态设置根字体大小）。

```js title="px-to-rem.js"
// px-to-rem.js
// 基准大小(原设计图 符合与效果图尺寸布局时候的根font-size)
const baseSize = 16;
// 设计图宽度
const designWidth = 375;
// 以375px 底图为准开发页面，动态修改根元素字体的大小
const setDomFontSize = () => {
  // 计算缩放倍数
  const scale = document.documentElement.clientWidth / designWidth;
  // 将其倍数计算到根font-size上
  const computFontSize = baseSize * scale + "px";
  document.documentElement.style.fontSize = computFontSize;
};
window.addEventListener("resize", setDomFontSize);

export default setDomFontSize;
```
```js title="main.js"
import Vue from 'vue'
import App from './App.vue'
import setDomFontSize from './utils/px-to-rem'

setDomFontSize();
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```


最后，你布局里正常些即可
```html
<template>
  <div class="pink-block"></div>
</template>
<style>
.pink-block {
  width: 100px;
  height: 100px;
  background-color: pink;
}
</style>

```
