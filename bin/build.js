import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import fsExtra from "fs-extra/esm";

const projectRoot = path.resolve(process.cwd());
const rootDist = path.resolve(projectRoot, "dist");

// 获取都有哪些项目
const ignoreDir = [".DS_Store"];
const appsDir = path.resolve("src", "apps");
const apps = fs.readdirSync(appsDir, { withFileTypes: true }).filter(it=>!ignoreDir.includes(it.name));

// 开始打包
apps.forEach((app) => {
  if (ignoreDir.includes(app.name)) return false;
  const appPath = path.resolve(app.parentPath, app.name);
  spawnSync("npm run", ["--prefix", appPath, "build"], {
    stdio: "inherit",
    shell: true,
  });
  const appDist = path.resolve(appPath, "dist");
  const appDistNewPath = path.resolve(rootDist, app.name);
  fsExtra.moveSync(appDist, appDistNewPath, { overwrite: true });
});

// 打包主项目
// const mainAppPath = path.resolve("src", "apps", "main-app");
// spawnSync("npm run", ["--prefix", mainAppPath, "build"], {
//   stdio: "inherit",
//   shell: true,
// });
// const mainAppDist = path.resolve(mainAppPath, "dist");
// fsExtra.moveSync(mainAppDist, rootDist, { overwrite: true });

// 打包子项目
// const subAppsDir = path.resolve("src", "apps", "sub-app");
// const subApps = fs.readdirSync(subAppsDir, { withFileTypes: true });
// subApps.forEach((subApp) => {
//   const ignoreDir = [".DS_Store"];
//   if (ignoreDir.includes(subApp.name)) return false;
//   const subAppPath = path.resolve(subApp.parentPath, subApp.name);
//   spawnSync("npm run", ["--prefix", subAppPath, "build"], {
//     stdio: "inherit",
//     shell: true,
//   });
//   const subAppDist = path.resolve(subAppPath, "dist");
//   const newSubDistPath = path.resolve(rootDist, subApp.name);
//   fsExtra.moveSync(subAppDist, newSubDistPath, { overwrite: true });
// });