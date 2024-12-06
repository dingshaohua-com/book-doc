
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import { useLocation, useHistory } from "@docusaurus/router";
import useFirstDocspath from "../hooks/useFirstDocspath";
import navbars from "../data/navbars"
import style from "./index.module.scss"

export default function Home(): JSX.Element {
  const { getFirstDocspath } = useFirstDocspath();
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const router = useHistory();
  const goDynamicNavbar = (docType) => {
    console.log(111, docType);
    
    const firstDocspath = getFirstDocspath(docType);
    router.push(firstDocspath);
  };
  return (
    <div className={style.home}>
      <div className={style.other}></div>
      <div className={style.docss}>
        {Object.keys(navbars).map(item => (
          <div className={style.docs} key={item}>
            <img src={navbars[item].icon} />
            <div className={style.content}>{navbars[item].content}</div>
            <div className={style.title} onClick={()=>goDynamicNavbar(item)}>{navbars[item].title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
