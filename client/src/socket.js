import io from 'socket.io-client';

// Use the deployed server URL for socket connection
const socket = io('https://wordle-multiplayer.onrender.com');

export default socket;
