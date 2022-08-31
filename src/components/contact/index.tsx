import React, { FC, useState, useEffect, useCallback, useContext } from "react";
import classnames from "classnames";
import "./index.scss";
import Context from "../../redux/store";

const logo = require("../../asset/images/logo.webp");
type IProps = {
  contacts: Array<{
    _id: string;
    username: string;
    email: string;
    avatarImage: string;
  }>;
  currentUser: {
    _id: string;
    username: string;
    email: string;
    avatarImage: string;
  };
  changeChat: (arg: {
    _id: string;
    username: string;
    email: string;
    avatarImage: string;
  }) => void;
  onLineUser: string[];
};

const Contact: FC<IProps> = ({
  contacts,
  currentUser,
  changeChat,
  onLineUser,
}) => {
  const [currentSelected, setCurrentSelected] = useState(-1);

  const changeCurrentChat = useCallback(
    (
      index: number,
      contact: {
        _id: string;
        username: string;
        email: string;
        avatarImage: string;
      }
    ) => {
      setCurrentSelected(index);
      changeChat(contact);
    },
    [changeChat]
  );

  const mapContacts = useCallback(() => {
    return contacts.map((contact, index) => {
      if (contact._id !== currentUser._id)
        return (
          <div
            onClick={() => changeCurrentChat(index, contact)}
            key={index}
            className={classnames({
              selected: index === currentSelected,
              contact: true,
            })}
          >
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                alt=""
              />
            </div>
            <div className="username">
              <h3>{contact.username}</h3>
            </div>
            <div className="circle">
              <div
                className={classnames({
                  online: onLineUser.indexOf(contact._id) !== -1,
                  offline: onLineUser.indexOf(contact._id) === -1,
                })}
              ></div>
            </div>
          </div>
        );
    });
  }, [
    changeCurrentChat,
    contacts,
    currentSelected,
    currentUser._id,
    onLineUser,
  ]);

  return (
    <div className="total_contact">
      <div className="brand">
        <img src={logo} alt="logo" />
        <h3>snappy</h3>
      </div>
      <div className="contacts">{mapContacts()}</div>

      <div className="current_user">
        <div className="avatar">
          <img
            alt=""
            src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
          />
        </div>
        <div className="username">
          <h2>{currentUser.username}</h2>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Contact);
