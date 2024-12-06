import dynamicNavbarCfg from "../data/navbars";
import useGlobalData from "@docusaurus/useGlobalData";

const useFirstDocspath = () => {
  const globalData = useGlobalData();
  const docsPlugins = globalData["docusaurus-plugin-content-docs"];

  const getFirstDocspath = (docType) => {
    const item = dynamicNavbarCfg[docType];
    const [{ docsPluginId }] = item.children;
    const firstDocs: any = docsPlugins[docsPluginId];
    const [nowVersion] = firstDocs.versions;
    const { path } = nowVersion.sidebars.tutorialSidebar.link;
    return path;
  };

  return { getFirstDocspath };
};

export default useFirstDocspath;