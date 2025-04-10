import React, { useState, useEffect } from "react";
import socket from "./socket";
import JoinScreen from "./JoinScreen";
import WaitingRoom from "./WaitingRoom";
import GameBoard from "./GameBoard";
import Leaderboard from "./Leaderboard";

export default function App() {
  const [joined, setJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [final, setFinal] = useState(false);
  const [roundsSet, setRoundsSet] = useState(false);
  const [secretWord, setSecretWord] = useState("");

  useEffect(() => {
    socket.on("gameStarted", ({ secretWord }) => {
      setSecretWord(secretWord);
      setGameStarted(true);
    });
    socket.on("gameOver", ({ final }) => setFinal(final));
    socket.on("gameReset", () => {
      setGameStarted(false);
      setFinal(false);
      setRoundsSet(false);
    });
    socket.on("roundsSet", () => setRoundsSet(true));
  }, []);

  const handleJoin = (name) => {
    socket.emit("joinGame", name);
    setJoined(true);
  };

  const handleSetRounds = (rounds) => {
    socket.emit("setRounds", rounds);
  };

  const handleStartGame = () => {
    socket.emit("startGame");
  };

  return (
    <div className="p-8 text-center">
      {!joined && <JoinScreen onJoin={handleJoin} setIsHost={setIsHost} />}
      {joined && !gameStarted && (
        <WaitingRoom
          isHost={isHost}
          onSetRounds={handleSetRounds}
          onStart={handleStartGame}
          roundsSet={roundsSet}
        />
      )}
      {joined && gameStarted && !final && <GameBoard secretWord={secretWord} />}
      {joined && final && (
        <Leaderboard socket={socket} final={true} isHost={isHost} />
      )}
    </div>
  );
}
