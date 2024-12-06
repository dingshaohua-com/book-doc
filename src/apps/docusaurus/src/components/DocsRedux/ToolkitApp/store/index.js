import { configureStore, createReducer } from "@reduxjs/toolkit";
import { setMsg } from './action-creator'

// state
const initialState = {
  msg: '张三'
};

// reducer
const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setMsg, (state, action) => {
      state.msg = action.payload;
    })
})

// store
export default configureStore({ reducer });