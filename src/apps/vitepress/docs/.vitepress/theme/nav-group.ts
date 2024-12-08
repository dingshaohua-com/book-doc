import holyTrinityImg from "./assets/img/docss/holy-trinity.webp";
import feFwLibImg from "./assets/img/docss/fe-fw-lib.png";
import feErgImg from "./assets/img/docss/fe-erg.png";

const navGroup= {
  holyTrinity: {
    title: "前端三剑客",
    content: "html、css、js的爱恨情仇",
    icon: holyTrinityImg,
    nav: [
      { text: "Html", link: "/vue/intro" },
      { text: "Css", link: "/vuex/intro" },
    ],
  },
  feFwAndLib: {
    title: "前端框架与库",
    content: "让你事半功倍",
    icon: feFwLibImg,
    nav: [
      { text: "Vue", link: "/vue1/intro" },
      { text: "Vuex", link: "/vuex/intro2" },
    ],
  },
  feErg: {
    title: "前端工程化",
    content: "你总不能还在上古吧",
    icon: feErgImg,
  },
  beAndServer: {
    title: "后端和运维",
    content: "前后端一起才能成大事",
    icon: holyTrinityImg,
  },
  client: {
    title: "客户端开发",
    content: "电脑端或移动端App",
    icon: holyTrinityImg,
  },
};

export default navGroup;
