import "./App.scss";
import BaseRouter from "./pages/router";
import ContextProvider from "./redux/context";
import "antd/dist/antd.css";

import React from "react";
function App() {
  // useEffect(() => {
  //   const socket = io("ws://localhost:4000");
  //   socket.on("chat message", (messages) => {
  //     message.success(messages as string);
  //   });
  // }, []);
  return (
    <ContextProvider>
      <div className="App">
        <BaseRouter />
      </div>
    </ContextProvider>
  );
}

export default App;
