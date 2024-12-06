import holyTrinityImg from "../assets/img/docss/holy-trinity.webp"
import feFwLibImg from "../assets/img/docss/fe-fw-lib.png"
import feErgImg from "../assets/img/docss/fe-erg.png"

const dynamicNavbarCfg = {
  holyTrinity: {
    title: "前端三剑客",
    content: "html、css、js的爱恨情仇",
    icon: holyTrinityImg,
    children: [
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "HTML",
        position: "left",
        docsPluginId: "default",
      },
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "Css",
        position: "left",
        docsPluginId: "css-module",
      },
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "JavaScript",
        position: "left",
        docsPluginId: "js-module",
      },
      
    ],
  },
  feFwAndLib: {
    title: "前端框架与库",
    content: "让你事半功倍",
    icon: feFwLibImg,
    children: [
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "Vue",
        position: "left",
        docsPluginId: "vue-module",
      },
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "React",
        position: "left",
        docsPluginId: "react-module",
      },
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "微前端",
        position: "left",
        docsPluginId: "micro-module",
      }
    ],
  },
  feErg: {
    title: "前端工程化",
    content: "你总不能还在上古吧",
    icon: feErgImg,
    children: [
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "webpack",
        position: "left",
        docsPluginId: "tool-module",
      }
    ],
  },
  beAndServer: {
    title: "后端和运维",
    content: "前后端一起才能成大事",
    icon: holyTrinityImg,
    children: [
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "Node",
        position: "left",
        docsPluginId: "node-module",
      },
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "Linux",
        position: "left",
        docsPluginId: "linux-module",
      },
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "网络",
        position: "left",
        docsPluginId: "network-module",
      }
    ],
  },
  client: {
    title: "客户端开发",
    content: "电脑端或移动端App",
    icon: holyTrinityImg,
    children: [
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "Electron",
        position: "left",
        docsPluginId: "electron-module",
      },
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "安卓",
        position: "left",
        docsPluginId: "android-module",
      },
      {
        type: "docSidebar",
        sidebarId: "tutorialSidebar",
        label: "Flutter",
        position: "left",
        docsPluginId: "flutter-module",
      }
      
    ],
  },
};

export default dynamicNavbarCfg;