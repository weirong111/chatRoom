import React, { useState, useEffect, useCallback, FC } from "react";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import axios from "axios";
import classnames from "classnames";

import "./index.scss";
import Loading from "../../components/loading";
const SetAvatar: FC<{
  setSelectedAvatar: React.Dispatch<React.SetStateAction<number>>;
  selectedAvatar: number;
  avatar: string[];
  setAvatar: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ setSelectedAvatar, selectedAvatar, avatar, setAvatar }) => {
  const api = "https://api.multiavatar.com/45678945";

  const [isLoading, setLoading] = useState(true);

  const mapAvatar = useCallback(() => {
    return avatar.map((item, index) => {
      return (
        <div
          key={index}
          className={classnames({ select: index === selectedAvatar })}
        >
          <img
            className="avatar_image"
            onClick={() => setSelectedAvatar(index)}
            src={`data:image/svg+xml;base64,${item}`}
            alt=""
          />
        </div>
      );
    });
  }, [avatar, selectedAvatar, setSelectedAvatar]);
  useEffect(() => {
    const getRandomAvatar = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );

        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatar(data);
      setLoading(false);
    };
    getRandomAvatar();
  }, [setAvatar]);

  return (
    <div className="setAvatar">
      {isLoading ? (
        <Loading isLoading={isLoading} isPosition={false} />
      ) : (
        <div className="avatar">{mapAvatar()}</div>
      )}
    </div>
  );
};

export default SetAvatar;
// export default React.memo(SetAvatar, (prevProps, nextProps) => {
//   return (
//     prevProps.selectedAvatar === nextProps.selectedAvatar &&
//     prevProps.avatar.length === nextProps.avatar.length
//   );
// });
