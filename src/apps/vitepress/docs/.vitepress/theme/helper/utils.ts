import _ from 'lodash';

// 接受navGrouplink，返回对应的第一个sidebar（既第一篇文档）
export const getFirstSideBarLink = (navGrouplink, allSidebar, baseUrl) => {
    
    const sidebar = allSidebar[navGrouplink + '/'];
    let firstSidebar;
    const handler = (items) => {
        for (const it of items) {
            if (it.items) handler(it.items);
            else firstSidebar = it;
            break;
        }
    }
    handler(sidebar.items)

    let link;
    if (firstSidebar) {
        let base = baseUrl;
        base = base.slice(0, -1);
        link = base + navGrouplink + '/' + firstSidebar.link;
    }

    return link;
}