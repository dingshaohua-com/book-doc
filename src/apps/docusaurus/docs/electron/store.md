# 缓存与存储

默认情况下，你 app 的数据是保存在用户的主目录下的，在 macOS 上是 `~/Library/Application Support/`，在 Windows 上是 `%APPDATA%`，在 Linux 上是 `$XDG_CONFIG_HOME` 或者 `~/.config`。

## 浏览器缓存

electron 应用默认使用的是 Chromium 浏览器，所以它也会使用 Chromium 的缓存机制。
会将 index.html 中的静态资源缓存到本地，下次访问时会优先使用本地缓存。  
这就到导致 即便你 spa app web 做了 hash 也会无效。

可以这么解决

```js
const partition = String(+new Date())
export const createMainWindow = () => {
  const mainWinOtp = { // 创建主应用窗口
    ...
    webPreferences: {
      ...
      partition, // 解决缓存问题，此字段 相当于禁用缓存 无痕模式
    }
  };
  return mainWin;
};
```

可这样 又回导致 web 端所有的缓存在重启 app 的时候都会失效，这个时候就需要借助于 electron 的存储能力，比如 electron-store

## electron-store

是一款持久化存储的 electron 插件，用法也及其简单

```js
import Store from "electron-store";

const store = new Store();
export const setStore = (key, val) => {
  return store.set(key, val);
};

export const getStore = (key) => {
  return store.get(key);
};

export const rmStore = (key) => {
  return store.delete(key);
};

export const clearStore = () => {
  return store.clear();
};
```

需要注意的是 electron-store会将数据存在 用户的主目录下的，通过 `app.getPath("userData")` 可以获取到，如~/Library/Application Support/YourApp。

但是这会导致缓存的问题，比如我们程序都删除了，缓存依然在！   

等下次安装的时候，还是能读取到，这就会给用户造成困惑。

解决办法就是将 electron-store 数据的存储位置放在 app 根目录下，而非用户的主目录下 如 `app.getAppPath()`，但是在开启 ` "asar": false` 打包的时候，这个目录将获取不到，所以我们可以这么做：
```js
const getResourcesPath = () => {
  if (app.isPackaged) {
    return process.resourcesPath;
  } else {
    return path.join(app.getAppPath(), "src");
  }
};

new Store({cwd: getResourcesPath()})
```