import React, { useReducer } from "react";
import reducer from "./reducer";
import Context from "./store";

interface init {
  avatar: number;
  [key: string]: any;
}

export const initState: init = {
  avatar: 0,
  socket: null,
};

const ContextProvider = (props: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
