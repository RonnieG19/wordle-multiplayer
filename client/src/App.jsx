import { useState, useEffect, useRef } from 'react';
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

  const inputRefs = useRef([]);

  useEffect(() => {
    socket.on('playersUpdate', (players) => {
      setPlayers(players);
    });

    socket.on('gameStarted', ({ secretWord }) => {
      setGameWord(secretWord);
      setIsGameStarted(true);
      setGuesses([]);
      setGameOver(false);
      setCurrentGuess('');
    });

    socket.on('gameOver', () => {
      setGameOver(true);
      alert('Game Over!');
    });

    return () => {
      socket.off('playersUpdate');
      socket.off('gameStarted');
      socket.off('gameOver');
    };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    socket.emit('joinGame', name.trim());
  };

  const handleStartGame = () => {
    socket.emit('startGame');
    setTime(Date.now());
  };

  const handleSubmitGuess = () => {
    if (currentGuess.length !== 5 || gameOver) return;
    if (guesses.length >= 6) return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    const currentTime = Date.now() - time;
    socket.emit('playerResult', { guesses: newGuesses.length, time: currentTime });

    setCurrentGuess('');

    if (newGuesses.length >= 6) {
      setGameOver(true);
    }
  };

  const handleSetRounds = () => {
    socket.emit('setRounds', rounds);
  };

  const handleLetterChange = (e, idx) => {
    const val = e.target.value.toUpperCase();
    if (!/^[A-Z]?$/.test(val)) return;

    const guessArray = currentGuess.split('');
    guessArray[idx] = val;
    const newGuess = guessArray.join('');
    setCurrentGuess(newGuess);

    if (val && idx < 4) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleLetterKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !e.target.value && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const getGuessColor = (guess, index) => {
    if (!gameWord) return '';
    if (guess[index] === gameWord[index]) return 'green';
    if (gameWord.includes(guess[index])) return 'yellow';
    return 'gray';
  };

  return (
    <div className="game-container">
      <h1>Wordle Multiplayer</h1>

      {!name ? (
        <form onSubmit={handleJoin}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
          <button type="submit">Join Game</button>
        </form>
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
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={currentGuess[index] || ''}
                  onChange={(e) => handleLetterChange(e, index)}
                  onKeyDown={(e) => handleLetterKeyDown(e, index)}
                  disabled={gameOver}
                  className="letter-input"
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