import { useState, useEffect } from 'react';
import socket from './socket';

function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameWord, setGameWord] = useState('');
  const [guesses, setGuesses] = useState(0);
  const [time, setTime] = useState(0);
  const [rounds, setRounds] = useState(1);

  useEffect(() => {
    socket.on('playersUpdate', (players) => {
      setPlayers(players);
    });

    socket.on('gameStarted', ({ secretWord }) => {
      setGameWord(secretWord);
      setIsGameStarted(true);
    });

    socket.on('gameOver', () => {
      alert('Game Over!');
    });

    return () => {
      socket.off('playersUpdate');
      socket.off('gameStarted');
      socket.off('gameOver');
    };
  }, []);

  const handleJoin = () => {
    socket.emit('joinGame', name);
  };

  const handleStartGame = () => {
    socket.emit('startGame');
  };

  const handleSubmitGuess = (guess) => {
    setGuesses(guesses + 1);
    const currentTime = Date.now() - startTime;
    socket.emit('playerResult', { guesses: guesses + 1, time: currentTime });
  };

  const handleSetRounds = (rounds) => {
    socket.emit('setRounds', rounds);
  };

  return (
    <div>
      <h1>Wordle Multiplayer</h1>
      {!name ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleJoin}>Join Game</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {name}!</h2>
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}

      <div>
        <h3>Players:</h3>
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              {player.name} - {player.totalPoints} points
            </li>
          ))}
        </ul>
      </div>

      {isGameStarted && (
        <div>
          <h3>Guess the Word</h3>
          <p>{gameWord}</p>
          <button onClick={() => handleSubmitGuess('your_guess')}>Submit Guess</button>
        </div>
      )}

      <div>
        <h3>Rounds</h3>
        <input
          type="number"
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
        />
        <button onClick={() => handleSetRounds(rounds)}>Set Rounds</button>
      </div>
    </div>
  );
}

export default App;
