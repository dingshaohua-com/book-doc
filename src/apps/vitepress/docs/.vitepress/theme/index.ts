import _ from "lodash";
import { watch } from "vue";
import Home from "./home.vue";
import DefaultTheme from "vitepress/theme";
import { getFirstSideBarLink, getNavs } from "./helper/utils";

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    watch(
      () => router.route.path,
      (val) => {
        // 获取基础nav
        const nav = getNavs(router, siteData.value.base);
        // 动态修改站点数据（毕竟使用useData不生效），比如这里动态设置navbar
        if (nav) {
          // 补充完整nav的link，并设置合适的active高亮
          nav.forEach((it) => {
            const res = getFirstSideBarLink(
              it.link,
              siteData.value.themeConfig.sidebar,
              ""
            );
            it.link = res;
            it.activeMatch = "/" + it.link.split("/")[1] + "/";
          });
          siteData.value = {
            ...siteData.value,
            themeConfig: {
              ...siteData.value.themeConfig,
              nav,
            },
          };
        }
      }
    );
    app.component("customHome", Home);
  },
};
