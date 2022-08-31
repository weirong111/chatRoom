import React, { FC } from "react";
import { BiPowerOff } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import "./index.scss";
const LogOut: FC = () => {
  const nav = useNavigate();
  const handleClick = () => {
    localStorage.clear();
    nav("/");
  };
  return (
    <button onClick={handleClick} className="logout">
      <BiPowerOff />
    </button>
  );
};

export default LogOut;
