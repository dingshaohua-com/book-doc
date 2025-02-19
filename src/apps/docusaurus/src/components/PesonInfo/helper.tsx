//@ts-nocheck
import hcjImg from "@site/static/img/about/hcj.png";
import vrImg from "@site/static/img/about/vue_react.png";
import tsImg from "@site/static/img/about/typescript.png";
import flowImg from "@site/static/img/about/flow.png";
import miniImg from "@site/static/img/about/mini.png";
import otherImg from "@site/static/img/about/other.png";
import React from "react";

export const skill = [
  {
    title: "三剑客",
    icon: hcjImg,
    description: "熟练使用html、css和javaScript",
  },
  ,
  {
    id: "ts",
    title: "Ts",
    icon: tsImg,
    description: "熟练使用typeScript",
  },
  {
    id: "vr",
    title: "框架",
    icon: vrImg,
    description: "熟练使用vue和react 及其周边生态",
  },
  {
    id: "flow",
    title: "架构",
    icon: flowImg,
    description: "搭建项目，封装工具，配置工程化插件",
  },
  {
    id: "otherFe",
    title: "大前端",
    icon: miniImg,
    description: "掌握小程序、flutter、cordova、taro、electron",
  },
  {
    id: "other",
    title: "后端",
    icon: otherImg,
    description: "会 java、node、mysql、redist、centos",
  },
];

export const works = [
  {
    key: (
      <a href="https://taro-ext.jd.com/plugin/view/630343427a7801f3c634664b" target="_blank">
        taro-swiper-week
      </a>
    ),
    desc: "小程序插件，证明我有小程序经验",
  },
  {
    key: (
      <a href="https://tiptap.dingshaohua.com" target="_blank">
        tiptap编辑器中文网
      </a>
    ),
    desc: (
      <span>
        证明我有编辑器开发工作的相关经验
      </span>
    ),
  },
  {
    key: (
      <a href="https://car.dingshaohua.com" target="_blank">
        车机助手
      </a>
    ),
    desc: "一款 electron app，证明我有做电脑端的经验",
  },
  {
    key: (
      <a href="https://github.com/dingshaohua-com/imusic" target="_blank">
        imusic
      </a>
    ),
    desc: (
      <span>
        证明我有flutter和koa的开发经验
      </span>
    ),
  },
  {
    key: (
      <> <a href="https://han96.com" target="_blank">
        个人博客
      </a>
        <a href="https://github.com/dingshaohua-com/blog-server" target="_blank">后端开发 </a></>

    ),
    desc: '基于springBoot，证明我有java开发经验。',
  },
  {}
];
