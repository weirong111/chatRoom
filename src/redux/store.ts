import { createContext } from "react";
interface init {
  [key: string]: any;
}

const Context = createContext({} as init);

export default Context;
