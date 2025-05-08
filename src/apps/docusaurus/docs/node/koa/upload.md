---
sidebar_position: 11
---

# 文件上传

## 上传配置

```js
// utils/time-helper.js

export const getTimeStr = () => {
  const now = new Date();
  const timeString = [
    now.getFullYear(),
    (now.getMonth() + 1).toString().padStart(2, "0"),
    now.getDate().toString().padStart(2, "0"),
    "_",
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
    now.getSeconds().toString().padStart(2, "0"),
    now.getMilliseconds().toString().padStart(3, "0"),
  ].join("");
  return timeString;
};
```


```js
// app.js
import Koa from "koa";
import mount from "koa-mount";
import { koaBody } from "koa-body";
import staticServer from "koa-static";
import { getTimeStr } from "./utils/time-helper.ts";

// 定义上传路径（最好不要配置到项目中，否则会跟随代码部署而被清空）
const uploadDir = path.join(os.tmpdir(), "common-api-uploads"); // 系统临时目录（跨平台兼容）
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = new Koa();
app.use(
  koaBody({
    multipart: true, // 开启文件上传能力
    formidable: {
      uploadDir, // 文件上传目录
      keepExtensions: true, // 保留文件扩展名
      maxFieldsSize: 2 * 1024 * 1024, // 字段大小限制为2MB
      onFileBegin: (name, file: any) => {
        const timeString = getTimeStr();
        const ext = path.extname(file.originalFilename);
        file.newFilename = timeString + ext;
        file.filepath = path.join(
          uploadDir,
          file.newFilename // 例如: 20230515_143045789.jpg
        );
      }, // 传入的文件自定义名称
    },
  })
);

// 定义访问路径，如传递完成后通过 http://localhost:3000/files/xxx.zip 访问刚才的资源
app.use(mount("/files", staticServer(uploadDir)));
```

## 定义路由

其实，`koa-body`在此之前已经帮保存文件好了，这不过这里定义是为了相应前端保存的文件信息

```js
// router.js
import Router from "@koa/router";

// 文件上传
router.post("/upload", async (ctx) => {
  const { file } = ctx.request.files;
  const { newFilename, filepath } = file; // 上传上来的文件名和路径
  console.log("上传成功：", filepath);
  ctx.body = `/files/${newFilename}`;
});
```

## 前端调用

```js
const uploadFile = async (fileToUpload: File) => {
  const formData = new FormData();
  formData.append("file", fileToUpload);

  const response = await axios.post('http://localhost:3000/upload', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (e) => {
      const percent = Math.round((e.loaded * 100) / (e.total || 1));
      console.log('上传进度：', percent);
    },
  });
  console.log('上传完成：', response);
};
```
