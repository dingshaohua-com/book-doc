import _ from "lodash";
import navGroupTemp from "./nav-group";

// 接受navGrouplink，返回对应的第一个sidebar（既第一篇文档）
export const getFirstSideBarLink = (navGrouplink, allSidebar, baseUrl) => {
  const sidebar = allSidebar[navGrouplink + "/"];
  let firstSidebar;
  const handler = (items) => {
    for (const it of items) {
      if (it.items) handler(it.items);
      else firstSidebar = it;
      break;
    }
  };
  handler(sidebar.items);
  let link;
  if (firstSidebar) {
    let base = baseUrl;
    base = base.slice(0, -1);
    link = base + navGrouplink + "/" + firstSidebar.link;
  }
  return link;
};

// 根据当前路由 获取 对应的顶部导航
export const getNavs = (router, baseUrl) => {
  let navGroup = _.cloneDeep(navGroupTemp);
  const { path } = router.route;
  const index = baseUrl === "/" ? 1 : 2;
  const navItemlink = "/" + path.split("/")[index];
  for (const key in navGroup) {
    const match = navGroup[key].nav?.find((it) => it.link === navItemlink);
    if (match) return navGroup[key].nav; // 返回找到的根键，例如 'holyTrinity'
  }
};
