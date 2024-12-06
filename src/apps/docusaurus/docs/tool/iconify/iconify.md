---
hide_title: true
sidebar_position: 1
---

Iconify是 一个`图标库框架`,iconfont 字体图标的替代品，快速且易于使用。  

**图标丰富**   
___
Iconify是一个超 10w 多矢量图标的`图标库框架`。   
它是 iconfont 字体图标的替代品，快速且易于使用。  
Iconify 将 `svg 的像素保真呈现`与 `iconfont 的易用性`相结合，同时又比两者有更多资源和功能。  
您可在同一页上来使用 Font Awesome, Unicons, Dashicons 等许多其他图标库，极为方便。  
![](https://img.dingshaohua.com/book-fe/202411231457553.gif)

**加载迅速** 
___   
1. Iconnify 的 lib 包体积很小。  
2. iconify api 托管服务器遍布全球。访问者总是连接到最近的服务器，将加载时间减少到几分之一秒。
![](https://img.dingshaohua.com/book-fe/202411231457551.png)
3. 拥有缓存机制，图标作为浏览器缓存的外部资源加载，而不是嵌入到每个页面中。
4. 和其它 SVG 框架和iconfont加载整个资源方式不同，iconify是按需加载的，不用加载整个icon集。
![](https://img.dingshaohua.com/book-fe/202411231457552.gif)


**便于使用**   
___ 
语法类似于字形字体。写一个`span`或者`i`类型的占位符元素，Iconify 会用 SVG 替换它。    
您可以使用 CSS 更改图标尺寸和颜色，就像图标字体一样。 

拿原生的写法举例，只需要在页面引入该 lib 即可
```html
<script src="https://code.iconify.design/2/2.0.4/iconify.min.js"></script>
```

图标代码如下：

```html
<span class="iconify" data-icon="fa:home"></span>
<span class="iconify" data-icon="noto:bird"></span>
```

如果你不用原生的写法，Iconify 也支持像 React、 Vue、 Svelte、 Ember 的框架。    


**最新动态**   
___ 
2021 年 8 月 9 日：新的图标组件现在稳定了  
2021 年 8 月 7 日：图标集的新网站  
2021 年 7 月 20 日：Ember 组件可用  
2021 年 7 月 1 日：更新了 SVG 框架和图标组件  
2021 年 6 月 16 日：SVG 框架版本 2.0.2

**工作原理**   
___
✨ step1：查找占位符      
脚本会查找占位符，如下iconify.min.js 脚本会根据某些标识，   
如`class="iconify" data-icon="mdi:alert"`来查找 icon 的占位符元素。
```html
<p>This is a sample icon <span class="iconify" data-icon="fa:home"></span></p>
<div class="icon-on-left">
  <span class="iconify" data-icon="mdi:alert"></span>
</div>
```

✨ step2：提取icon标识   
查找到占位符之后，脚本会根据占位符属性`data-icon`提取出所需要加载的图标`mdi:alert`

✨ step3：下载图标   
拿到的icon标识，请求icon。   
脚本连接到 Iconify API 资源服务器， 并检索页面上找到的所有图标的 SVG 数据。  
Iconify API 托管在遍布全球的服务器网络上，因此数据可以在毫秒内从任何位置加载。
![](https://img.dingshaohua.com/book-fe/202411231457554.gif)

✨ step4：替换占位符
脚本会将下载到的 svg 替换占位符

```html
<p>
  This is a sample icon <svg class="iconify" data-icon="fa:home" ...>...</svg>
</p>
<div class="icon-on-left">
  <svg data-icon="mdi:alert" ...>...</svg>
</div>
```
