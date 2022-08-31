import ajax from "./ajax";
import {
  reqLogin_Data,
  reqSendMessageData,
  reqgetAllUsers_Data,
  reqGetAllMessages_Data,
} from "./res";
import {
  requestRegister,
  requestSendMessage,
  requestGetAllMessage,
} from "./req";
export const reqRegister = (request: requestRegister) =>
  ajax<{ username: String; email: string; avatarImage: string }>(
    "/api/auth/register",
    request,
    "POST"
  );

export const reqLogin = (username: string, password: string) =>
  ajax<reqLogin_Data>("/api/auth/login", { username, password }, "POST");

export const reqGetAllUsers = (_id: any) =>
  ajax<reqgetAllUsers_Data>(`/api/auth/getAllusers/${Number(_id)}`);

export const reqSendMessage = (info: requestSendMessage) =>
  ajax<reqSendMessageData>("/api/messages/addmsg", info, "POST");

export const reqGetAllMessages = (info: requestGetAllMessage) =>
  ajax<reqGetAllMessages_Data>("/api/messages/getmsg", info, "POST");
