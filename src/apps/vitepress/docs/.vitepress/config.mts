import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar';

const vitePressOptions = defineConfig({
  title: "丁知识库",
  description: "A VitePress Site",
  base: "/vitepress",
  themeConfig: {
    // nav: [
    //   { text: 'Vue1', link: '/vitepress/vue/intro' },
    //   { text: 'Vuex2', link: '/vitepress/vuex/intro' }
    // ],

    sidebar: [
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' },
      //   ]
      // }
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  }
})


// const vitePressSidebarOptions = {
//   documentRootPath: '/docs',
//   collapsed: false,
//   useTitleFromFileHeading: true
// };

const vitePressSidebarOptions = [
  {
    documentRootPath: 'docs',
    scanStartPath: 'vue',
    basePath: '/vue/',
    resolvePath: '/vue/',
    useTitleFromFileHeading: true,
  },
  {
    documentRootPath: 'docs',
    scanStartPath: 'vuex',
    resolvePath: '/vuex/',
    useTitleFromFrontmatter: true
  }
]

export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions));