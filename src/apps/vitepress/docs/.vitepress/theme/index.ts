import DefaultTheme from "vitepress/theme";
import Home from "./home.vue";
import { watch } from 'vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
console.log(router.route);


watch(
  () => router.route.path,
  () => {
    console.log("监听路由变化");
   
  }
);

    // router.on('routeChange', (to, from) => {
    //   console.log('路由变化:', from.path, '->', to.path)

    // })
    // 使用 Vue Router 监听路由变化
    // router.beforeEach((to, from, next) => {
    //   console.log('路由变化：', from.fullPath, '->', to.fullPath)


    //   // 必须调用 next() 来继续导航
    //   next()
    // })

    
    // 动态修改站点数据（毕竟使用useData不生效），比如这里动态设置navbar
    siteData.value = {
      ...siteData.value,
      themeConfig:{
        ...siteData.value.themeConfig,
        nav:[
          { text: "Vue", link: "/vue/intro" },
          { text: "Vue", link: "/vuex/intro" },
        ]
      }
    }
    app.component("customHome", Home);
  },
};
