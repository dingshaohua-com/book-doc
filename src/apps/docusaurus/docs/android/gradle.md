---
hide_title: true
sidebar_position: 2
sidebar_label: gradle仓库
---

## Gradle是什么呢？
安卓中使用gradle来管理依赖 安装三方库    
相当于java之maven、node之npm，ios之cocoaPods。总有一个你懂的吧 
即三方包的仓库
  
而gradle的配置文件一般在个目录下`项目文件/build.gradle` 

同样的国内访问这个仓库，往往及其漫长 
还好阿里同样页代理了这个仓库

## 配置代理
默认情况下  gradle下载三方包 比较慢（当然如果你的已经很快的话  不需要看这节了）   
需要配置一个国内的镜像！

### 单个项目配置
单个项目配置，在build.gradle文件中，修改repositories配置，改为如下
```js
buildscript {
   ...
    repositories {
        maven { url 'http://maven.aliyun.com/nexus/content/groups/public/' }
        maven { url 'http://maven.aliyun.com/nexus/content/repositories/jcenter' }
        google()
    }
		...
}
allprojects {
    repositories {
        maven { url 'http://maven.aliyun.com/nexus/content/groups/public/' }
        maven { url 'http://maven.aliyun.com/nexus/content/repositories/jcenter' }
        google()
    }
}
```


### 全局配置
如果想一次更改所有的仓库地址，可以在 `C:/Users/用户名/.gradle/文件夹下`添加 `init.gradle` 文件
```js
allprojects{
    repositories {
        def REPOSITORY_URL = 'http://maven.aliyun.com/nexus/content/groups/public/'
        all { ArtifactRepository repo ->
            if(repo instanceof MavenArtifactRepository){
                def url = repo.url.toString()
                if (url.startsWith('https://repo1.maven.org/maven2') || url.startsWith('https://jcenter.bintray.com/')) {
                    remove repo
                }
            }
        }
        maven {
            url REPOSITORY_URL
        }
    }
}
```


## 添加依赖
比如我想添加一个`gson`依赖
```shell title='build.gradle'
dependencies {
    implementation 'com.google.code.gson:gson:2.10.1'
    ...
}
```


## 参考
https://www.jianshu.com/p/b038bd95444b?from=singlemessage    
https://help.aliyun.com/document_detail/102512.html