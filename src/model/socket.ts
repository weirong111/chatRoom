import { io } from "socket.io-client";

const socket = io("ws://localhost:3002");

export default socket;
