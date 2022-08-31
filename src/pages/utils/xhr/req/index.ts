export interface requestRegister {
  username: string;
  password: string;
  email: string;
  avatarImage: string;
}

export type requestSendMessage = {
  message: string;
  to: string;
  from: string;
};

export type requestGetAllMessage = {
  from: string;
  to: string;
};
