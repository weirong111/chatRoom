import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
} from "react";

import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { reqGetAllUsers } from "../utils/xhr";
import Contact from "../../components/contact";
import ChatContainer from "../../components/chatContainer";
import Context from "../../redux/store";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/xhr/ajax";
import "./index.scss";
const Home = () => {
  const { state, dispatch } = useContext(Context);
  const { socket } = state;

  const [contacts, setContacts] = useState(new Array<any>());
  const [onLineUser, setOnlineUser] = useState(new Array<string>());
  const [currentUser, setCurrentUser] = useState({
    _id: "",
    username: "",
    email: "",
    avatarImage: "",
  });
  const [currentChat, setCurrentChat] = useState({
    _id: "",
    username: "",
    email: "",
    avatarImage: "",
  });

  const nav = useNavigate();

  const handleChatChange = useCallback(
    (chat: {
      _id: string;
      username: string;
      email: string;
      avatarImage: string;
    }) => {
      setCurrentChat(chat);
    },
    []
  );

  useLayoutEffect(() => {
    const socket = io(BASE_URL);
    dispatch({ type: "setSocket", data: socket });
  }, [dispatch]);
  useEffect(() => {
    if (currentUser._id) {
      socket.emit("add-user", currentUser._id);
    }
  }, [currentUser._id, socket]);

  useEffect(() => {
    if (socket !== null) {
      socket.on("onlineUsers", (data: { online: string[] }) => {
        console.log(data);
        setOnlineUser(data.online);
      });
    }
  }, [socket]);

  useEffect(() => {
    const getCurrentUser = async () => {
      if (!localStorage.getItem("user")) {
        message.error("您还没有登录，请登录");
        nav("/");
        return;
      }
      setCurrentUser(await JSON.parse(localStorage.getItem("user") as string));
    };
    getCurrentUser();
  }, [nav]);
  useEffect(() => {
    const getAllusers = async () => {
      const res = await reqGetAllUsers(currentUser._id);
      setContacts(res.data);
    };
    getAllusers();
  }, [currentUser]);

  useEffect(() => {
    window.onbeforeunload = () => {
      if (socket) socket.close();
    };
  }, [socket]);

  return (
    <div>
      <div className="container">
        <div className="content">
          <Contact
            onLineUser={onLineUser}
            changeChat={handleChatChange}
            currentUser={currentUser}
            contacts={contacts}
          />
          {/* {isLoading && currentChat._id === "" ? (
          <Welcome currentUser={currentUser} />
        ) : ( */}
          <ChatContainer currentUser={currentUser} currentChat={currentChat} />
        </div>
      </div>
      <a className="beian" href="https://beian.miit.gov.cn/">
        闽ICP备2022001986号
      </a>
    </div>
  );
};

export default Home;
