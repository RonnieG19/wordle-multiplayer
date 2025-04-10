import { io } from "socket.io-client";
const socket = io("http://localhost:4000"); // Change this to your Render backend URL for production
export default socket;
