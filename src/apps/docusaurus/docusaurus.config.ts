import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const moduleConfigs = {
  css: "Css",
  js: "JavaScript",
  fe: "入门",
  tool: "前端工具",
  vue: "Vue",
  react: "React",
  micro: "微前端",
  exam: "面试",
  electron: "Electron",
  android: "安卓",
  flutter: "Flutter",
  arith: "算法",
  network: "网络",
  node: "Node",
  linux: "Linux",
  about: "关于我"


};
const generatePluginConfig = (module) => [
  "@docusaurus/plugin-content-docs",
  {
    id: `${module}-module`,
    path: `docs/${module}`,
    routeBasePath: module, // 使用模块名作为 routeBasePath
    sidebarPath: "./sidebars.ts",
  },
];

const config: Config = {
  title: "前端",
  tagline: "前端非常酷",
  favicon: "img/favicon.ico",
  url: "https://your-docusaurus-site.example.com",
  baseUrl: "/",
  

  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
  },

  presets: [
    [
      "classic",
      {
        docs: false,
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: "./src/css/custom.scss",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "default",
        sidebarPath: "./sidebars.ts",
        path: "docs/html",
        routeBasePath: "html",
      },
    ],
    ...Object.keys(moduleConfigs).map(generatePluginConfig),
    "docusaurus-plugin-sass",
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "前端",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg",
      }
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["java","dart"],
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
        {
          className: "code-error",
          line: "error-next",
          block: { start: "error-start", end: "error-end" },
        },
        {
          className: "code-sucess",
          line: "sucess-next",
          block: { start: "sucess-start", end: "sucess-end" },
        },
        {
          className: "code-warn",
          line: "warn-next",
          block: { start: "warn-start", end: "warn-end" },
        },
      ],
    },
  } satisfies Preset.ThemeConfig,

  themes: ["@docusaurus/theme-live-codeblock"],
};

export default config;
