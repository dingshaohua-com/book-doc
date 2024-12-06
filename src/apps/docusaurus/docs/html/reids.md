# redis

## 服务端
安装EPEL仓库
```shell
yum install epel-release
```

安装Redis
```shell
yum install redis
```

设置开机启动
```shell
systemctl enable redis
```

启动redis
```shell
systemctl start redis
```

测试
```shell
redis-cli ping
```

如果需要自定义Redis配置，  可以复制默认配置文件  
编辑配置文件，保存退出后，重启Redis服务使配置生效
```shell
cp /etc/redis.conf /etc/redis.conf.orig
vim /etc/redis.conf
```

配置允许远程连接，编辑配置文件
```shell
bind 127.0.0.1 # 注释掉
protected-mode ye #改为 no
```

## ngin代理
Nginx 模块介绍
HTTP 模块： HTTP模块提供了处理HTTP请求的功能，包括反向代理、负载均衡、缓存、HTTP代理等。
例如：proxy模块用于反向代理和负载均衡，fastcgi模块用于处理FastCGI请求。

Stream 模块： Stream模块用于处理TCP和UDP流量，允许Nginx作为代理服务器处理非HTTP流量。
例如：stream模块用于配置TCP代理和负载均衡

```nginx
# redis.dingshaohua.com
upstream redis_backend {
  server 127.0.0.1:6379;
}
server {
    listen       80;
    server_name  redis.dingshaohua.com;
    rewrite ^(.*) https://$server_name$1 permanent;
}
server {
    listen       443 ssl;
    server_name  redis.dingshaohua.com;
    ssl_certificate /etc/letsencrypt/live/dingshaohua.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dingshaohua.com/privkey.pem;
 
    location / {
	  proxy_pass http://redis_backend;
	  proxy_set_header Host $host;
	  proxy_set_header X-Real-IP $remote_addr;
	  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```


## 客户端
[Tiny RDM](https://redis.tinycraft.cc/zh)
连接的默认端口为 6379

