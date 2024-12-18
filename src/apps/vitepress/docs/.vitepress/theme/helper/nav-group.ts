import holyTrinityImg from "../assets/img/docss/holy-trinity.webp";
import feFwLibImg from "../assets/img/docss/fe-fw-lib.png";

const navGroup = {
  holyTrinity: {
    title: "前端三剑客",
    content: "html、css、js的爱恨情仇",
    icon: holyTrinityImg,
    nav: [
      { text: "Html", link: "/html" },
      { text: "Css", link: "/css" },
    ],
  },
  feFwAndLib: {
    title: "前端框架与库",
    content: "让你事半功倍",
    icon: feFwLibImg,
    nav: [
      { text: "Vue", link: "/vue" },
      { text: "Vuex", link: "/vuex" },
      { text: "Arco", link: "/arco" },
      { text: "formCreate", link: "/form-create" },
      { text: "声网", link: "/shengwang" }
    ],
  },
};

export default navGroup;
