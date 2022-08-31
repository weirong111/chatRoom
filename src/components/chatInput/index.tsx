import React, { FC, useState } from "react";
import "./index.scss";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import { AiTwotoneVideoCamera, AiTwotonePhone } from "react-icons/ai";

type IProps = {
  handleSendMsg: (msg: string) => void;
  sendVideo: (type: string) => void;
};

const ChatInput: FC<IProps> = ({ handleSendMsg, sendVideo }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const handleEmojiClick = (event: any, emoji: { emoji: string }) => {
    let message = msg;
    message += emoji.emoji;
    setMsg(message);
  };
  const sendChat = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShowEmojiPicker(false);
    if (msg.length > 0) {
      handleSendMsg(msg);
    }
    setMsg("");
  };

  return (
    <div className="chatInput">
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && (
            <Picker onEmojiClick={handleEmojiClick} preload={true} />
          )}
        </div>
        <div className="video" onClick={() => sendVideo("video")}>
          <AiTwotoneVideoCamera />
        </div>
        <div className="telephone" onClick={() => sendVideo("voice")}>
          <AiTwotonePhone />
        </div>
      </div>
      <form className="input-container">
        <input
          type="text"
          placeholder="type your message here"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <button onClick={(event) => sendChat(event)} className="submit">
          <IoMdSend />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
