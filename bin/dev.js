import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { checkbox } from '@inquirer/prompts';

// 获取都有哪些项目
const ignoreDir = [".DS_Store"];
const appsDir = path.resolve("src", "apps");
const apps = fs.readdirSync(appsDir, { withFileTypes: true }).filter(it=>!ignoreDir.includes(it.name));

// 根据用户选择，启动指定项目
const answer = await checkbox({
  message: '选择需要启动的项目？',
  instructions: "😍空格键多选，回车键确定启动💏",
  choices: apps.map(item=>({name: item.name, value: item.name}))
});

answer.forEach((appName) => {
  const app = apps.find(it=>it.name===appName) 
  if (ignoreDir.includes(app.name)) return false;
  const appPath = path.resolve(app.parentPath, app.name);
  spawn("npm run", ["--prefix", appPath, "dev"], {
    stdio: "inherit",
    shell: true,
  });
});
