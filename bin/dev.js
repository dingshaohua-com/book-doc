import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

// 启动子项目
const appsDir = path.resolve("src", "apps");
const apps = fs.readdirSync(appsDir, { withFileTypes: true });
apps.forEach((app) => {
  const ignoreDir = [".DS_Store"];
  if (ignoreDir.includes(app.name)) return false;
  const appPath = path.resolve(app.parentPath, app.name);
  spawn("npm run", ["--prefix", appPath, "dev"], {
    stdio: "inherit",
    shell: true,
  });
});

// // 启动主项目
// const mainAppPath = path.resolve("src", "apps", "main-app");
// spawn("npm run", ["--prefix", mainAppPath, "dev"], {
//   stdio: "inherit",
//   shell: true,
// });
