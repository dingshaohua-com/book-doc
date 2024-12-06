import { createStore } from "redux";

// state
const initialState = {
  msg: "张三",
};

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MSG":
      return { ...state, ...{ msg: action.payload } };
    default:
      return state;
  }
};

// store
export default createStore(reducer);