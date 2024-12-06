import React from "react";
import Navbar from "@theme-original/Navbar";
import type NavbarType from "@theme/Navbar";
import type { WrapperProps } from "@docusaurus/types";
import useDynamicNavbar from "@site/src/hooks/useDynamicNavbar";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

type Props = WrapperProps<typeof NavbarType>;

// Swizzle 能力
export default function NavbarWrapper(props: Props): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const { navbars } = useDynamicNavbar();
  // 动态更新顶部导航
  siteConfig.themeConfig.navbar.items = navbars;
  return (
    <>
      <Navbar {...props} />
    </>
  );
}
