export interface reqLogin_Data {
  _id: string;
  username: string;
  email: string;
  isAvatarImageSet: boolean;
  avatarImage: string;
}

export type reqgetAllUsers_Data = Array<{
  email: string;
  username: string;
  avatarImage: string;
  _id: string;
}>;

export type reqSendMessageData = {};

export type reqGetAllMessages_Data = any[];
