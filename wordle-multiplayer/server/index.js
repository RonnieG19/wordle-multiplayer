const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { generateWord } = require("./wordlist");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let players = [];
let currentWord = "";
let roundStartTime = null;
let currentRound = 0;
let totalRounds = 1;

function resetGame() {
  players = [];
  currentWord = "";
  roundStartTime = null;
  currentRound = 0;
  totalRounds = 1;
}

io.on("connection", (socket) => {
  socket.on("joinGame", (name) => {
    const isHost = players.length === 0;
    const player = {
      id: socket.id,
      name,
      guesses: 0,
      time: 0,
      solved: false,
      totalPoints: 0,
      isHost,
    };
    players.push(player);
    io.emit("playersUpdate", players);
  });

  socket.on("setRounds", (rounds) => {
    totalRounds = rounds;
    io.emit("roundsSet");
  });

  socket.on("startGame", () => {
    currentWord = generateWord();
    roundStartTime = Date.now();
    currentRound++;
    players = players.map(p => ({ ...p, guesses: 0, time: 0, solved: false }));
    io.emit("gameStarted", { secretWord: currentWord, startTime: roundStartTime });
    io.emit("playersUpdate", players);
  });

  socket.on("playerResult", ({ guesses, time }) => {
    players = players.map(p =>
      p.id === socket.id
        ? {
            ...p,
            guesses,
            time,
            solved: true,
            totalPoints: p.totalPoints + Math.max(0, 1000 - (guesses * 100 + time))
          }
        : p
    );
    io.emit("playersUpdate", players);
    if (players.every(p => p.solved)) {
      io.emit("gameOver", { final: currentRound === totalRounds });
    }
  });

  socket.on("resetGame", () => {
    resetGame();
    io.emit("gameReset");
  });

  socket.on("disconnect", () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit("playersUpdate", players);
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
