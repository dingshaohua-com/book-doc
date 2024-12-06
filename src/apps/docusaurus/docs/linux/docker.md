---
sidebar_position: 8
hide_title: true
sidebar_label: docker
---

> 镜像产生容器

查看本地镜像列表
```shell
docker images
```

安装（运行）镜像
```shell
# -d是后台启动， -p 8080:8080端口设置，jenkinsci/blueocean是容器id
# 如果容器id本地没有 回去网上临时下载
# 镜像安装（运行）成功会自动创建一个容器
docker run -d -p 8080:8080 jenkinsci/blueocean
```
查看已经启动的容器
```shell
docker ps
```

查看所有容器
```shell
docker ps -a
```

停止/删除容器
```shell
docker stop 容器id
docker rm 容器id
```

启动容器
```shell
docker start
```

进入容器
```shell
docker exec -it 容器id bash
```