# 依赖下载慢

yarn安装electron的时候，经常会卡住，即便开了代理也不行，我们可配置源的方式来解决

2024 年底，最新可用配置：
```yml title=".yarnrc"
registry "https://registry.npmmirror.com"
sass_binary_site "https://npmmirror.com/mirrors/node-sass/"
phantomjs_cdnurl "http://cnpmjs.org/downloads"
electron_mirror "https://npmmirror.com/mirrors/electron/"
sqlite3_binary_host_mirror "https://foxgis.oss-cn-shanghai.aliyuncs.com/"
profiler_binary_host_mirror "https://npmmirror.com/mirrors/node-inspector/"
chromedriver_cdnurl "https://npmmirror.com/mirrors/chromedriver/"
```