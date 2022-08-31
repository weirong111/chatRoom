import {
  FC,
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import ChatInput from "../chatInput";
import LogOut from "../logout";
import { v4 as uuidv4 } from "uuid";
import "./index.scss";
import { reqSendMessage, reqGetAllMessages } from "../../pages/utils/xhr/index";
import classnames from "classnames";
import Context from "../../redux/store";
import { Button, message, Modal } from "antd";

// import "../../pages/utils/apadap/adatar";
interface IProps {
  currentChat: {
    _id: string;
    username: string;
    email: string;
    avatarImage: string;
  };
  currentUser: {
    _id: string;
    username: string;
    email: string;
    avatarImage: string;
  };
}

const ChatContainer: FC<IProps> = ({ currentChat, currentUser }) => {
  let localScreen: any;
  // const [{ isDragging }, drag] = useDrag(() => ({
  //   type: "lyric",
  //   collect: (mnoitor) => ({
  //     isDragging: !!mnoitor.isDragging(),
  //   }),
  //   end(target, mnoitor) {
  //     console.log(mnoitor.getClientOffset());
  //   },
  // }));
  //pc是实例
  const pc = useRef<RTCPeerConnection | null>(null);
  //本地流，打开摄像头后的本地流
  const localStream = useRef<MediaStream | null>(null);
  const { state } = useContext(Context);

  //socket对象
  const { socket } = state;
  //控制视频是否可见
  const [videoShow, setVideoShow] = useState(false);
  //本地video的实例
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const [from_id, setFrom_id] = useState("");
  const [to_id, setTo_id] = useState("");
  const [fromName, setFromName] = useState("");
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("");
  const [messages, setMessages] = useState(
    new Array<{
      fromSelf: boolean;
      message: string;
    }>()
  );
  const [flag, setFlag] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [arrivalMessage, setArrivalMessage] = useState(Object.create(null));

  const handleSendMsg = async (msg: string) => {
    const info = {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    };
    await reqSendMessage(info);
    socket.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };
  //接受方接受请求函数
  const onOk = async () => {
    setVisible(false);
    if (type === "video") setVideoShow(true);

    try {
      const temp = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: { exact: true },
        },
        video: type === "video" ? true : false,
      });
      localStream.current = temp;
      socket.emit("postAgree", {
        type: type,
        from: { _id: currentUser._id, username: currentUser.username },
        to: { _id: from_id, username: fromName },
        agree: true,
      });
      if (type === "video") {
        if (localVideoRef.current !== null) {
          localVideoRef.current.srcObject = localStream.current;
        }
      } else {
        if (localAudioRef.current !== null) {
          setFlag(true);
          localAudioRef.current.srcObject = localStream.current;
        }
      }
    } catch (error) {
      socket.emit("postAgree", {
        type,
        from: { _id: currentUser._id, username: currentUser.username },
        to: { _id: from_id, username: fromName },
        agree: false,
      });
      message.error("没有使用摄像头的权限，请开启", error as any);
      setVideoShow(false);
    }
  };
  //接收方拒绝函数
  const onCancel = () => {
    setVisible(false);
    socket.emit("postAgree", {
      type: type,
      from: { _id: currentUser._id, username: currentUser.username },
      to: { _id: from_id, username: fromName },
      agree: false,
    });
  };
  //发起方 点击通话按钮发起请求通话允许请求
  const sendVideo = useCallback(
    async (type: string) => {
      setType(type);
      setTo_id(currentChat._id);
      message.info(`您正在请求与${currentUser.username}进行通话`);
      socket.emit("requestVideo", {
        type: type,
        from: { _id: currentUser._id, username: currentUser.username },
        to: { _id: currentChat._id, username: currentChat.username },
      });
    },
    [
      currentChat._id,
      currentChat.username,
      currentUser._id,
      currentUser.username,
      socket,
    ]
  );

  // 发起方 点击按钮发起请求对方允许屏幕共享请求
  // const enjoyScreen = useCallback(() => {
  //   message.info(`您正在请求与${currentChat.username}进行屏幕共享`);
  //   setType("screen");
  //   socket.emit("requestVideo", {
  //     type: "screen",
  //     from: { _id: currentUser._id, username: currentUser.username },
  //     to: { _id: currentChat._id, username: currentChat.username },
  //   });
  // }, [
  //   currentChat._id,
  //   currentChat.username,
  //   currentUser._id,
  //   currentUser.username,
  //   socket,
  // ]);

  const handUp = () => {
    try {
      if (flag === true) setFlag(false);
      if (pc.current) {
        pc.current!.close();
        pc.current = null;
      }
      message.success("已结束通话");
      localStream.current!.getTracks().forEach((track: any) => track.stop());
      localStream.current = null;
    } catch (error) {
      console.log(error);
    }
    socket.emit("bye", {
      from: currentUser._id,
      to: { _id: from_id || to_id },
    });
    if (type === "video") setVideoShow(false);
  };

  //接收方 收到发起方的权限请求
  useEffect(() => {
    if (socket !== null) {
      socket.on("reqAgree", (data: any) => {
        setFromName(data.from.username);
        setType(data.type);
        setFrom_id(data.from._id);
        setVisible(true);
      });
    }
  }, [socket]);

  //发起方 接受到对方的回复允许请求还是不允许请求
  useEffect(() => {
    const createPeerConnection = (data: any) => {
      pc.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: "turn:124.222.27.209:3478",
            username: "test",
            credentialType: "password",
            credential: "123456",
          },
        ],
      });
      pc.current.onicecandidate = (e: any) => {
        console.log("onicecandidate");
        const message = {
          type: "candidate",
          candidate: null,
          sdpMid: 0,
          to: data.from,
          from: data.to,
          sdpMLineIndex: null,
        };
        if (e.candidate) {
          message.candidate = e.candidate.candidate;
          message.sdpMid = e.candidate.sdpMid;
          message.sdpMLineIndex = e.candidate.sdpMLineIndex;
        }
        socket.emit("candidate", message);
      };
      pc.current.ontrack = (e: any) => {
        if (data.type === "video") {
          if (remoteVideoRef.current !== null) {
            remoteVideoRef.current.srcObject = e.streams[0];
          }
        } else if (data.type === "voice") {
          setFlag(true);
          if (remoteAudioRef.current !== null) {
            remoteAudioRef.current.srcObject = e.streams[0];
          }
        }
      };
      if (localStream.current !== null) {
        localStream.current
          .getTracks()
          .forEach((track: any) =>
            pc.current!.addTrack(track, localStream.current as MediaStream)
          );
      }
    };
    const judgeAgree = async (data: any) => {
      console.log("getAgree", data);
      if (data.agree === false) {
        message.info(
          `对方拒绝与你进行${type === "screen" ? "屏幕共享" : "视频通话"}`
        );
        return;
      } else {
        if (data.type === "screen") {
          const handleSuccess = (stream: any) => {
            setVideoShow(false);
            if (localVideoRef.current !== null) {
              // 将stream赋给localScreen
              localScreen = stream;
              stream.getVideoTracks()[0].addEventListener("edd", () => {
                console.log("the user has ended sharing the screen");
              });

              socket.emit("ready", {
                type: "screen",
                from: { _id: data.to._id, name: data.to.username },
                to: { _id: data.from._id, name: data.from.username },
              });
            }
          };
          //同意后开启屏幕共享
          navigator.mediaDevices
            .getDisplayMedia({ video: true })
            .then(handleSuccess);
        } else if (data.type === "video") {
          console.log("getAgree");
          setVideoShow(true);
          setTo_id(data.from._id);
          // eslint-disable-next-line react-hooks/exhaustive-deps
          const temp = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: { exact: true },
            },
            video: true,
          });

          localStream.current = temp;
          if (localVideoRef.current !== null) {
            localVideoRef.current.srcObject = temp;
          }
          await createPeerConnection(data);
          const offerOptions = {
            //如果此值为true，即使本地端不会发送音频数据，也将向远程端点发送音频数据。
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          };
          const offer = await pc.current!.createOffer(offerOptions);
          socket.emit("offer", {
            type: "offer",
            sdp: offer.sdp,
            from: data.to,
            to: data.from,
          });
          await pc.current!.setLocalDescription(offer);
        } else if (data.type === "voice") {
          // setVideoShow(true);
          setTo_id(data.from._id);
          // eslint-disable-next-line react-hooks/exhaustive-deps
          const temp = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: { exact: true },
            },
            video: false,
          });

          localStream.current = temp;
          if (localAudioRef.current !== null) {
            localAudioRef.current.srcObject = temp;
          }
          await createPeerConnection(data);
          const offerOptions = {
            //如果此值为true，即使本地端不会发送音频数据，也将向远程端点发送音频数据。
            offerToReceiveAudio: true,
            offerToReceiveVideo: false,
          };
          const offer = await pc.current!.createOffer(offerOptions);
          socket.emit("offer", {
            type: "offer",
            kind: data.type,
            sdp: offer.sdp,
            from: data.to,
            to: data.from,
          });
          await pc.current!.setLocalDescription(offer);
        }
      }
    };

    if (socket !== null) {
      socket.on("getAgree", (data: any) => judgeAgree(data));
    }
  }, [socket, pc, localStream]);

  //发起方 接受到请求方的offer请求，并且创建answer答复
  useEffect(() => {
    const handleOffer = async (offer: any) => {
      if (pc.current) {
        console.error("existing peerconnection");
        return;
      }
      const createPeerConnection = (data: any) => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        pc.current = new RTCPeerConnection({
          iceServers: [
            {
              urls: "turn:124.222.27.209:3478",
              username: "test",
              credentialType: "password",
              credential: "123456",
            },
          ],
        });
        pc.current.onicecandidate = (e: any) => {
          console.log("onicecandidate");
          const message = {
            to: offer.from,
            from: offer.to,
            type: "candidate",
            candidate: null,
            sdpMid: null,
            sdpMLineIndex: null,
          };
          if (e.candidate) {
            message.candidate = e.candidate.candidate;
            message.sdpMid = e.candidate.sdpMid;
            message.sdpMLineIndex = e.candidate.sdpMLineIndex;
          }
          socket.emit("candidate", message);
        };
        pc.current.ontrack = (e: any) => {
          if (data.kind === "voice") {
            if (remoteAudioRef.current !== null) {
              remoteAudioRef.current.srcObject = e.streams[0];
            }
          } else {
            if (remoteVideoRef.current !== null)
              remoteVideoRef.current.srcObject = e.streams[0];
          }
        };

        localStream
          .current!.getTracks()
          .forEach((track: any) =>
            pc.current!.addTrack(track, localStream.current as MediaStream)
          );
        // pc.ontrack = (e: any) =>
        //   (remoteVideoRef.current.srcObject = e.streams[0]);
        // localStream
        //   .getTracks()
        //   .forEach((track: any) => pc.addTrack(track, localStream));
      };

      await createPeerConnection(offer);
      await pc.current!.setRemoteDescription({ type: "offer", sdp: offer.sdp });
      const offerOptions = {
        //如果此值为true，即使本地端不会发送音频数据，也将向远程端点发送音频数据。
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      };
      const answer = await pc.current!.createAnswer(offerOptions);
      socket.emit("answer", {
        from: offer.to,
        to: offer.from,
        type: "answer",
        sdp: answer.sdp,
      });
      await pc.current!.setLocalDescription(answer);
    };
    if (socket !== null) socket.on("offer", (data: any) => handleOffer(data));
  }, [localStream, pc, socket]);

  //从answer中创建远程会话
  useEffect(() => {
    if (socket !== null) socket.on("answer", (e: any) => handleAnswer(e));
    const handleAnswer = async (answer: any) => {
      console.log("answer", answer);
      if (!pc) {
        console.error("no peerconnection");
        return;
      }
      await pc.current!.setRemoteDescription({
        type: "answer",
        sdp: answer.sdp,
      });
    };
  }, [pc, socket]);
  useEffect(() => {
    const handleCandidate = async (data: any) => {
      console.log(data);
      if (!pc) {
        console.error("no peerconnection");
        return;
      }
      if (!data.candidate) {
      } else {
        const { candidate, sdpMid, sdpMLineIndex } = data;
        await pc.current!.addIceCandidate({
          candidate,
          sdpMLineIndex,
          sdpMid,
        });
      }
    };
    if (socket !== null) socket.on("candidate", (e: any) => handleCandidate(e));
  }, [pc, socket]);

  useEffect(() => {
    const handUp = () => {
      try {
        setFlag(false);
        if (pc.current) {
          pc.current!.close();
          // eslint-disable-next-line react-hooks/exhaustive-deps
          pc.current = null;
          localStream
            .current!.getTracks()
            .forEach((track: any) => track.stop());
          // eslint-disable-next-line react-hooks/exhaustive-deps
          localStream.current = null;
          message.info("对方已经挂断电话");
        }
      } catch (error) {
        console.log(error);
      }

      setVideoShow(false);
    };
    if (socket !== null) socket.on("bye", () => handUp());
  }, [localStream, pc, socket]);

  useEffect(() => {
    if (socket !== null) {
      socket.on("msg-recieve", (msg: string) => {
        console.log(msg);
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    const getAllmessage = async () => {
      if (currentChat._id) {
        const res = await reqGetAllMessages({
          from: currentUser._id,
          to: currentChat._id,
        });

        setMessages(res.data);
      }
    };

    getAllmessage();
  }, [currentChat._id, currentUser._id]);

  useEffect(() => {
    Object.keys(arrivalMessage).length &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  useEffect(() => {
    if (scrollRef.current !== null)
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div
        className={classnames({
          voice: true,
          notHidden: flag,
        })}
        onClick={() => handUp()}
      >
        <div>
          <audio ref={localAudioRef} autoPlay={true}></audio>
        </div>
        <div>
          <audio ref={remoteAudioRef} autoPlay={true}></audio>
        </div>
        <div>挂断电话</div>
      </div>
      <Modal
        title={"通话邀请"}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        okText="同意"
        cancelText="拒绝"
      >
        {fromName} 请求与你进行{type === "video" ? "视频通话" : "语音通话"}
      </Modal>
      <Modal
        closable={false}
        keyboard={false}
        footer={[
          <Button key="handup" onClick={handUp} type="primary" danger>
            挂断
          </Button>,
        ]}
        destroyOnClose={true}
        width={800}
        title={type === "video" ? "视频通话" : "语音通话"}
        visible={videoShow}
        okText="挂断"
      >
        <div className="twoVideo">
          <video
            autoPlay={true}
            muted={true}
            ref={localVideoRef}
            className={classnames({
              myvideo: true,
            })}
          />
          <video
            autoPlay={true}
            muted={true}
            ref={remoteVideoRef}
            className={classnames({
              otherVideo: true,
            })}
          />
        </div>
      </Modal>
      {currentChat._id !== "" && (
        <div className="chat-Container">
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <LogOut />
          </div>
          <div className="chat-messages">
            {messages.map((item) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    key={Math.random()}
                    className={classnames({
                      message: true,
                      sended: item.fromSelf,
                      recieved: !item.fromSelf,
                    })}
                  >
                    <div className="chatContainer_content">
                      <p>{item.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ChatInput sendVideo={sendVideo} handleSendMsg={handleSendMsg} />
        </div>
      )}
    </>
  );
};

export default ChatContainer;
