import io from 'socket.io-client';

// Use the deployed server URL for socket connection
const socket = io('https://wordle-multiplayer.onrender.com');
//const socket = io("http://localhost:4000");
export default socket;
