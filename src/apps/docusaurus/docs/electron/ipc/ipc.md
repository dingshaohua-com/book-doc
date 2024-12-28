# 进程通信

## 早期
早期的electron 默认  渲染进程允许直接可以访问主进程，渲染进程有用完整的nodejs和Electron环境，这让它们间沟通变的异常容易。但同时也会让两者的界限变得模糊不清，并且容易导致安全问题。

这个默认指的是 将渲主进程的 nodeIntegration 默认值设置为 true，并且设置 contextIsolation 默认值为 false。


## 现在
后期 electron 默认关闭了渲染进程直接访问主进程的能力，转而发明了 IPC，利用它 进行通信。

同样的这个默认指的是 将主染进程的 nodeIntegration 默认值设置为 false， contextIsolation 默认值为 true。

