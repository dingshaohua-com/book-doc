---
sidebar_position: 1
---

HTTP协议是Hyper Text Transfer Protocol（超文本传输协议）的缩写，一般用户服务端和客户端之间的通讯，即请求 应答模型。
作为Web文档传输协议的HTTP，版本更新十分缓慢，目前只更新了4个版本。  
HTTP使用统一资源标识符（URI）来建立连接和传输数据。   
通过学习网络发展史我们了解到，http属于应用层协议，此层协议传递消息的数据统称为 报文（即站点一次性要发送的数据块）。  





URL统一资源定位符，它是URI一子集，是URI的具体实现。URL根据提供的是地址信息，不仅标识了资源，还能**定位**到此资源。   
与之对应的 还有一个URI的子集 URN-统一资源名称，它的作用是不论资源在何处，都能**保持有效**。   
总之都比较抽象。


## 请求报文
HTTP请求报文由3部分组成：请求行（Request Line）+请求头（Request Header）+请求体（Request Body）
![](https://img.dingshaohua.com/book-fe/202407012257.jpg)   

```
① 是请求方法，HTTP请求方法有8种：GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONS、TRACE,最常的两种GET和POST，如果是RESTful接口的话一般会用到GET、POST、DELETE、PUT。
② 为请求对应的URL地址，它和报文头的Host属性组成完整的请求URL
③ 是协议名称及版本号。
④ 是HTTP的报文头，报文头包含若干个属性，格式为“属性名:属性值”，服务端据此获取客户端的信息。
⑤ 是报文体，它将一个页面表单中的组件值通过param1=value1&param2=value2的键值对形式编码成一个格式化串，它承载多个请求参数的数据。不但报文体可以传递请求参数，请求URL也可以通过类似于“/user.html?id=123”的方式传递请求参数。
```

<!-- HTTP作为一种架设在TCP通信层之上的应用层协议。 -->
## 响应报文
HTTP响应报文也由3部分组成：响应行（Response Line）+响应头（Response Header）+响应体（Response Body）   
![](https://img.dingshaohua.com/book-fe/202407012258.jpg)  

```
①报文协议及版本；
②状态码及状态描述；
③响应报文头，也是由多个属性组成；
④响应报文体，即我们真正要的“干货”。
```

## 怎么查看报文
现代浏览器上都可以查看，点击网络，选择你需要看的那个请求，然后左侧就会出现相关的报文信息。   

需要注意的是，大部分浏览器都喜欢把报文行与报文头都放在 消息头/标头菜单栏的报文头里。而报文体确单独拎出去在顶部菜单`请求`和`响应`里。
![](https://img.dingshaohua.com/book-fe/202407012334.jpg)   

## 发展史

### HTTP/0.9
HTTP/0.9是最早的HTTP协议版本，它的设计初衷非常简单，主要用于在客户端和服务器之间传输HTML文件。这个版本的协议非常基础，没有太多的复杂功能。   

HTTP0.9中 尚还没有标头的概念，也只支持GET请求。

**请求报文**     
请求报文中，即没有请求标头，也没有协议版本号，因此非常简单，只包含GET请求行和请求的资源路径   
```
GET /index.html
```

**响应报文**       
服务器在接收到请求后，会读取对应的HTML文件返回给客户端。这个返回的数据块也可以看作是响应报文，尽管它没有明确的报文头和状态码等HTTP后续版本中常见的元素。


### HTTP/1.0
支持了多种请求类型
```
POST PUT ...
```

报文的 报文行 增加了协议版本号，会随着每个请求或响应自动发送，响应行还增加了状态码
```js title="请求行示例"
GET /page.html HTTP/1.0
```
```js title="响应行示例"
HTTP/1.0 200
```

出此之外，报文中引入了报文头（也叫标头，或者请求/响应头）的概念，通过它让HTTP协议一下就丰富了起来
```js title="请求头示例"
Content-Type: text/html  // 告诉服务器 发送过来的文件类型
User-Agent: NCSA_Mosaic/2.0 (Windows 3.1) // 告诉服务器请求者的设备信息
```
```js title="响应头示例"
Date: Tue, 15 Nov 1994 08:12:31 GMT // 告诉客户端 返回的时间
Server: apche 1.0 // 告诉客户端 当前服务器的设备信息
Content-Type: text/html  // 告诉客户端 返回的的文件类型
```  

最后，开始支持缓存技术和链接复用（长连接）技术，但是都不好用。

### HTTP/1.1
在 HTTP/1.0 发布的几个月后，HTTP1.1 标准发布，做了大量优化以及改进，这个版本才是最后大家用的最多，心里最正统的第一版。

* 增加了更好的缓存机制
* 连接复用的优化，即长链接
* 增加管线化技术


**长链接（keep-alive）**   
在HTTP1.0的时候需要手动开启，而在次版本则默认开启。   
在长链接下，相同的HOST的HTTP请求会被应用在一个TCP上，但是出于安全和服务器压力的考虑单个TCP只允许承载n个HTTP，比如chrome最多是6个，这取决于浏览器的限制。


**管线（pipelining）**   
也叫做流水线技术，指的是在长链接的基础上，同一个TCP中的HTTP会被一起发送，不需要等待服务器对前一个请求的响应。   
但在单个TCP连接上的HTTP请求和响应仍然是按照发送请求的顺序进行串行处理的。即一个请求的响应必须完全返回后，下一个请求才会开始在该连接上传输，这个叫做 `串行处理`中的`队头阻塞`（序列和阻塞机制）问题。  



### HTTP/2

* 压缩HTTP头部
* 采用体积更小的二进制报文替代之前的明文的文本报文
* 请求多路复用，改善串行为并行
* 服务端推送，改善“请求 - 应答”，服务也可主动发

**多路复用**   
为了`串行处理`中的`队头阻塞`问题，HTTP/2协议引入了的解决办法。     
多路复用指的是 是通过分帧并且给每个帧打上流的 ID 去避免依次响应的问题，对方接收到帧之后根据 ID 拼接出流，这样就可以做到乱序响应从而避免请求时的队首阻塞问题。


### HTTP/3
HTTP/3显著减少了连接建立的时间，因为它使用基于UDP的QUIC协议，而不是传统的TCP。   
QUIC在初次连接时仅需一次RTT（Round-Trip Time），重用现有连接则无需再执行握手，进一步降低了延迟。


<!-- 和服务器推送（Server Push），进一步提高了HTTP通信的效率和灵活性。HTTP/2默认使用持久连接，并且通过帧（Frame）和流（Stream）的概念来支持多路复用，从而避免了HTTP/1.1中的队头阻塞问题。 -->

## 其它知识
### URI和URL区别
URI用于唯一的标识互联网上的信息资源，不管用什么方法表示只要能**定位**一个资源它就是URI，比如：
```js
ftp://ftp.is.co.za/rfc/rfc1808.txt (also a URL because of the protocol)
http://www.ietf.org/rfc/rfc2396.txt (also a URL because of the protocol)
ldap://[2001:db8::7]/c=GB?objectClass?one (also a URL because of the protocol)
mailto:John.Doe@example.com (also a URL because of the protocol)
news:comp.infosystems.www.servers.unix (also a URL because of the protocol)
tel:+1-816-555-1212
telnet://192.0.2.16:80/ (also a URL because of the protocol)
urn:oasis:names:specification:docbook:dtd:xml:4.1.2
urn:isbn:0451450523 // 标识这是一本 标准书号(ISO)为0451450523的具体书籍
```