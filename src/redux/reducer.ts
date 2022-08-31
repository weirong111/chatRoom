type Action = {
  type: string;
  [key: string]: any;
};
const reducer = (state: { [key: string]: any }, action: Action) => {
  switch (action.type) {
    case "setAvatar":
      return { ...state, avatar: action.data };
    case "setSocket":
      return { ...state, socket: action.data };
    default:
      return state;
  }
};
export default reducer;
