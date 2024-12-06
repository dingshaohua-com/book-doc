import { useEffect, useState } from "react";
import dynamicNavbarCfg from "../data/navbars";
import { useLocation } from "@docusaurus/router";
import useGlobalData from "@docusaurus/useGlobalData";

// 参考 https://docusaurus.io/zh-CN/docs/next/docusaurus-core
const useDynamicNavbar = () => {
  const globalData = useGlobalData();
  const docsPlugins = globalData["docusaurus-plugin-content-docs"];
  const location = useLocation();
  const [navbars, setNavbars] = useState([]);

  // 查找当前 URL 对应的 pluginId
  const activePluginId = Object.keys(docsPlugins).find((pluginId) => {
    const pluginBasePath = docsPlugins[pluginId].path;
    return location.pathname.startsWith(pluginBasePath);
  });

  const findNavTypeByPluginId = () => {
    // 遍历 config 的每个根键
    for (const key in dynamicNavbarCfg) {
      // 在数组中查找匹配的 docsPluginId
      const match = dynamicNavbarCfg[key].children.find(
        (item) => item.docsPluginId === activePluginId
      );
      if (match) {
        return key; // 返回找到的根键，例如 'holyTrinity'
      }
    }
    return null; // 没有找到时返回 null
  };

  // 同步顶部导航
  const computeNav = () => {
    // activePluginId 必定为 dynamicNavbarCfg中的一员，所以根据这个查找出当前导航的分组类型
    const navType = findNavTypeByPluginId();
    // 根据自定义导航类型 获取当前导航栏列表（官方不支持动态导航，自己这么做的）
    const items = dynamicNavbarCfg[navType];
    // 更新顶部导航
    if (items) {
      setNavbars(items.children);
      // siteConfig.themeConfig.navbar.items = items;
    }
  };

  useEffect(() => {
    // 只会在浏览器控制台有输出；服务端渲染不会输出任何东西
    // 在切换文档实例实例的时候会执行，页面锚点不会执行
    computeNav();
  }, []);
  return { navbars };
};
export default useDynamicNavbar;
