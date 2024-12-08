import DefaultTheme from "vitepress/theme";
import Home from "./home.vue";
import { watch } from 'vue'
import navGroup from "./nav-group";

const getNavs = (currentRoute, siteBaseUrl) => {
  siteBaseUrl = siteBaseUrl.slice(0, -1);
  currentRoute = currentRoute.replace(/\.[^/.]+$/, "");
  for (const key in navGroup) {
    const match = navGroup[key].nav?.find(it => (siteBaseUrl + it.link) === currentRoute);
    if (match) return navGroup[key].nav; // 返回找到的根键，例如 'holyTrinity'
  }
  return null;
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    watch(
      () => router.route.path,
      (val) => {
        const nav = getNavs(val, siteData.value.base);
        console.log(nav);
        
        // 动态修改站点数据（毕竟使用useData不生效），比如这里动态设置navbar
        if (nav) {
          siteData.value = {
            ...siteData.value,
            themeConfig: {
              ...siteData.value.themeConfig,
              nav
            }
          }
        }
      }
    );
    app.component("customHome", Home);
  },
};
