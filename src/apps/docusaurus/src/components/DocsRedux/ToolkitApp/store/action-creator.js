import { createAction as createActionCreator } from "@reduxjs/toolkit";

 /**
  * 利用createActionCreator来定义一个actioCreator，用于 创建type为SET_MSG 的action,
  * @param payload为action中的状态属性
  * @return action
  */
export const setMsg = createActionCreator('SET_MSG');