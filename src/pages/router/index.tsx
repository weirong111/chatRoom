import SetAvatar from "../setAvatar/index";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouterError from "../Error";
import Home from "../home";
import Login from "../login";
import Register from "../register";
const BaseRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>

        <Route path="*" element={<RouterError />} />
      </Routes>
    </BrowserRouter>
  );
};

export default BaseRouter;
