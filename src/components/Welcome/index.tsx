import React, { FC } from "react";
import "./index.scss";

const Robot = require("../../asset/images/robot.gif");
const Welcome: FC<{
  currentUser: {
    _id: string;
    username: string;
    email: string;
    avatarImage: string;
  };
}> = ({ currentUser }) => {
  return (
    <div className="weicome">
      <img src={Robot} alt="Root" />
      <h1>
        Welcome , <span>{currentUser.username}</span>
      </h1>
      <h3>
        Please select a chat such as <span>weirong</span> to Start Messaging
      </h3>
    </div>
  );
};

export default React.memo(Welcome);
