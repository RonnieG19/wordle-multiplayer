import { io } from "socket.io-client";
const socket = io("https://wordle-multiplayer.onrender.com"); // Change this to your Render backend URL for production
export default socket;
