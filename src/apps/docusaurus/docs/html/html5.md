---
sidebar_position: 2
---
# html5

HTML5作为HTML的最新版本，不仅强化了网页结构与内容，还引入了丰富的多媒体功能，以及改进的用户体验。这些新特性不仅为开发人员提供了更多的工具和选项，也为用户带来了更加流畅和丰富的网络体验。

## 新增语义化标签
使得网页结构更加清晰，利于开发人员阅读维护 以及 SEO和无障碍访问。

### 布局语义化标签
`header`头部标签    页面或页面中某一个区块的页眉，通常是一些引导和导航信息   
`nav`导航标签    可以作为页面导航的链接组   
`article`内容标签    代表一个独立的、完整的相关内容块，可独立于页面其他内容使用   
`section`定义文档某个区域    页面中的一个内容区块，通常由内容及其标题组成   
`aside`侧边栏标签     非正文的内容，与页面的主要内容是分开的，被删除而不会影响到网页的内容   
`footer`尾部标签   页面或页面中某一区块的脚注   
![](https://img.dingshaohua.com/book-fe/202406230020.jpg)



### 其它语义化标签
`address` 标签定义文档或文章的作者/拥有者的联系信息，呈现文本通常为斜体   
`figure`定义一个可附加标题的内容元素（如图像、图表、照片、代码等）   
`figcaption`标签定义figure 元素的标题   
`details`创建一个可折叠的内容区域，与summary标签搭配使用   
`summary` 标签包含 details 元素的标题
`progress` 进度条
`time`日期或时间
`mark` 标记
`code` 代码块

```jsx live
function Demo() {
  return <>
    <address>山东曹县</address>
    <figure>
        <figcaption>图片1</figcaption>
        <img src="https://img.dingshaohua.com/book-fe/ex.jpg"/>
    </figure>
    <details>
        <summary>国家</summary>
        <div>中国</div>
        <div>俄罗斯</div>
    </details>
    <progress value="25" max="100"/>
    <p>
      <time dateTime="2020-02-14">情人节</time>，
      我在<time>9:00</time> <mark>赴约</mark>
    </p>
    <code> var i = 0; </code>



  </>
}
```

## 新增多媒体标签
在h5之前，网页中嵌入音频和视频内容，需依赖外部插件。   
`video` 用于嵌入视频文件。   
`audio` 用于嵌入音频文件。   


## 新增绘图标签
HTML4没有绘图能力，通常只能显示已有图片。     
`.canvas` 标签允许在网页上绘制图形和动画，提供了强大的图形处理能力。


## 表单控件升级
新增了多种表单输入类型，如 email、date、time、range、search 等。   
新的表单属性，如 autocomplete、autofocus、required 等，增强了表单的交互性和易用性。

## 新增标签的属性
`data-xx` 自定义属性, 建议自定的属性都用这种写法。     
`hidden`  语义化隐藏属性，作用和 `display: none`一样隐藏元素，不占位。   
`contenteditable` 规定元素内容是否可编辑。   
`spellcheck` 规定是否对元素内容进行拼写检查。
`draggable` 规定元素是否可拖拽。