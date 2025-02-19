
//@ts-nocheck
import hcjImg from "@site/static/img/about/hcj.png";
import vrImg from "@site/static/img/about/vue_react.png";
import tsImg from "@site/static/img/about/typescript.png";
import flowImg from "@site/static/img/about/flow.png";
import miniImg from "@site/static/img/about/mini.png";
import otherImg from "@site/static/img/about/other.png";


export const skill = [
    {
        title:'三剑客',
        icon: hcjImg,
        description:'熟练使用html、css和javaScript'
    },
    {
        id:'vr',
        title:'框架',
        icon: vrImg,
        description:'熟练使用vue和react 及其周边生态'
    },
    {
        id:'flow',
        title:'架构',
        icon: flowImg,
        description:'熟练搭建前端项目，封装基础工具，以及集成各种工具如：eslint、prettier、babel、rollup等。'
    }, {
        id: 'ts',
        title:'Ts',
        icon: tsImg,
        description:'熟练使用typeScript'
    }, {
        id:'otherFe',
        title:'其它前端技术',
        icon: miniImg,
        description:'熟练掌握小程序，混合应用开发如uniapp、cordova、taro，了解和使用了webRTC、jssip'
    },
    {   
        id:'other',
        title:'不重要技能',
        icon: otherImg,
        description:'为更好服务前端，学习了一些额外的技术，并已实际开发项目，不仅限于以下：java、springBoot、node、nestjs、mysql、redist、android、centos等。'
    }
]