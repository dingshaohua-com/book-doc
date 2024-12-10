---
sidebar_position: 3
---

# Nginx

## root和alias

### root
以请求 http://example.com/foo/bar/hello.html 为例   
匹配到 `/foo`，`url的域名+port`替换为root指定的目录，即url中的`examp.com`被替换为了 `/home/hfy` ，所以实际访问的路径为 `/home/hfy/foo/bar/hello.html`
```shell
location /foo {
    root /home/hfy/;
}
```



为了更好理解，再来一个例子，请求的url不变，location配置更改为如下，则   
匹配到`/foo/bar`，`url的域名+port`替换为root指定的目录，即url中的`examp.com`被替换为了`/home/hfy`，所以实际访问的路径仍然为`/home/hfy/foo/bar/hello.html`。root在替换时不会替换匹配到的路径。   

```shell
location /foo/bar {
    root /home/hfy/;
}
```



### alias
以请求`http://example.com/foo/bar/hello.html`为例，location配置如下.   
匹配到`/foo`，url的`ip/域名+port+匹配到的路径`替换为alias指定的目录，即url中的`example.com/foo`被替换为了`/home/hfy`，所以实际访问的路径为`/home/hfy/bar/hello.html`
```shell
location /foo {
    alias /home/hfy/;
}
```


同样再来一个例子，请求的url不变，如果location配置更改为如下，则   
匹配到`/foo/bar`，url的`ip/域名+port+匹配到的路径`替换为alias指定的目录，即url中的`example.com/foo/bar`被替换为了`/home/hfy`，所以实际访问的路径为`/home/hfy/hello.html`。alias在替换时会替换匹配到的路径。
alias其余特性，最左匹配、index、location解析url工作流程、末尾’/'与root一致。
```shell
location /foo/bar {
    alias /home/hfy/;
}
```


[参考这里！](https://www.jb51.net/server/305770q8w.htm)

