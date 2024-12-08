import holyTrinityImg from "./assets/img/docss/holy-trinity.webp";
import feFwLibImg from "./assets/img/docss/fe-fw-lib.png";
import feErgImg from "./assets/img/docss/fe-erg.png";

const navGroup= {
  holyTrinity: {
    title: "前端三剑客",
    content: "html、css、js的爱恨情仇",
    icon: holyTrinityImg,
    nav: [
      { text: "Html", link: "/html/intro" },
      { text: "Css", link: "/css/intro" },
    ],
  },
  feFwAndLib: {
    title: "前端框架与库",
    content: "让你事半功倍",
    icon: feFwLibImg,
    nav: [
      { text: "Vue", link: "/vue/intro" },
      { text: "Vuex", link: "/vuex/intro" },
    ],
  },
};

export default navGroup;
