import { useState, useEffect } from 'react';
import socket from './socket';

function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameWord, setGameWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [time, setTime] = useState(0);
  const [rounds, setRounds] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.on('playersUpdate', (players) => {
      setPlayers(players);
    });

    socket.on('gameStarted', ({ secretWord }) => {
      setGameWord(secretWord);
      setIsGameStarted(true);
      setGuesses([]);
    });

    socket.on('gameOver', () => {
      console.log("Game Over Triggered!!!!!")
      setGameOver(true);
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

  const handleSubmitGuess = () => {
    if (currentGuess.length !== 5) return;
    setGuesses([...guesses, currentGuess]);
    const currentTime = Date.now() - time;
    socket.emit('playerResult', { guesses: guesses.length + 1, time: currentTime });
    setCurrentGuess('');
  };

  const handleSetRounds = () => {
    socket.emit('setRounds', rounds);
  };

  const getGuessColor = (guess, index) => {
    if (!gameWord) return '';
    if (guess[index] === gameWord[index]) return 'green'; // Correct letter and position
    if (gameWord.includes(guess[index])) return 'yellow'; // Correct letter, wrong position
    return 'gray'; // Incorrect letter
  };

  return (
    <div className="game-container">
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

      {isGameStarted && !gameOver && (
        <div>
          <h3>Guess the Word:</h3>
          <div className="grid">
            {Array(5)
              .fill('')
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  value={currentGuess[index] || ''}
                  maxLength={1}
                  onChange={(e) => setCurrentGuess(currentGuess.slice(0, index) + e.target.value + currentGuess.slice(index + 1))}
                  disabled={gameOver}
                />
              ))}
          </div>
          <button onClick={handleSubmitGuess}>Submit Guess</button>
        </div>
      )}

      <div>
        <h3>Rounds</h3>
        <input
          type="number"
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
        />
        <button onClick={handleSetRounds}>Set Rounds</button>
      </div>

      <div>
        <h3>Past Guesses:</h3>
        <div className="past-guesses">
          {guesses.map((guess, index) => (
            <div key={index} className="guess">
              {guess.split('').map((letter, i) => (
                <span key={i} className={`tile ${getGuessColor(guess, i)}`}>
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
