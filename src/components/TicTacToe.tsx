import React, { useState } from 'react';
import './TicTacToe.css';
import DifficultyPicker from './DifficultyPicker';
import { Player, Board, GameStatus, Difficulty, difficultyThemes } from '../types/game';
import { checkWinner, getComputerMove } from '../utils/gameLogic';

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState<Player>('X');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('selecting');

  // Test sound URLs
  const moveSoundEffect = new Audio("https://www.soundjay.com/button/button-09.mp3");
  const winSoundEffect = new Audio("https://www.soundjay.com/button/button-35.mp3");

  const playSound = (sound: HTMLAudioElement): void => {
    if (!isMuted) {
      sound.currentTime = 0; // Reset sound to start
      sound.play().catch(error => console.log('Error playing sound:', error));
    }
  };

  const handleCellClick = (index: number): void => {
    if (board[index] || gameStatus !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    playSound(moveSoundEffect);
    
    const winner = checkWinner(newBoard);
    if (winner) {
      playSound(winSoundEffect);
      setTimeout(() => setGameStatus('ended'), 500);
    } else if (!newBoard.includes(null)) {
      setTimeout(() => setGameStatus('ended'), 500);
    } else {
      setTimeout(() => makeComputerMove(newBoard), 500);
    }
  };

  const makeComputerMove = (currentBoard: Board): void => {
    const computerSymbol: Player = playerSymbol === 'X' ? 'O' : 'X';
    const move = getComputerMove(currentBoard, computerSymbol, difficulty);

    const newBoard = [...currentBoard];
    newBoard[move] = computerSymbol;
    setBoard(newBoard);
    playSound(moveSoundEffect);

    const winner = checkWinner(newBoard);
    if (winner) {
      playSound(winSoundEffect);
      setTimeout(() => setGameStatus('ended'), 500);
    } else if (!newBoard.includes(null)) {
      setTimeout(() => setGameStatus('ended'), 500);
    }
  };

  const resetGame = (): void => {
    setBoard(Array(9).fill(null));
    setGameStatus('selecting');
  };

  // Add theme styles to the container
  const containerStyle = {
    backgroundColor: difficultyThemes[difficulty].background,
    transition: 'background-color 0.3s ease',
  };

  const theme = difficultyThemes[difficulty];

  const startButtonStyle = {
    backgroundColor: theme.primary,
    color: 'white',
  };

  const symbolButtonStyle = (isSelected: boolean) => ({
    backgroundColor: isSelected ? theme.primary : 'white',
    color: isSelected ? 'white' : theme.primary,
    borderColor: theme.primary,
    textShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
    transform: isSelected ? 'translateY(-2px)' : 'none',
    transition: 'all 0.3s ease',
  });

  const getCellContent = (cell: Player | null, index: number) => {
    if (cell) {
      return <span className={`symbol ${cell.toLowerCase()}`} style={{ color: theme.primary }}>{cell}</span>;
    }
    if (hoveredCell === index && gameStatus === 'playing') {
      return <span className={`symbol ${playerSymbol.toLowerCase()} preview`}>{playerSymbol}</span>;
    }
    return '';
  };

  return (
    <div className="game-container" style={containerStyle}>
      {gameStatus === 'selecting' && (
        <div className="game-setup">
          <h2>Choose Your Symbol</h2>
          <div className="symbol-choice">
            <button 
              style={symbolButtonStyle(playerSymbol === 'X')}
              onClick={() => setPlayerSymbol('X')}
            >X</button>
            <button 
              style={symbolButtonStyle(playerSymbol === 'O')}
              onClick={() => setPlayerSymbol('O')}
            >O</button>
          </div>
          
          <h2>Select Difficulty</h2>
          <DifficultyPicker 
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
          
          <button 
            className={`start-button ${difficulty}`}
            onClick={() => setGameStatus('playing')}
          >
            Start Game
          </button>
        </div>
      )}

      {(gameStatus === 'playing' || gameStatus === 'ended') && (
        <div className="game-board">
          {board.map((cell, index) => (
            <div
              key={index}
              className={`cell ${cell ? 'filled' : ''}`}
              onMouseEnter={() => setHoveredCell(index)}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => handleCellClick(index)}
            >
              {getCellContent(cell, index)}
            </div>
          ))}
        </div>
      )}

      {gameStatus === 'ended' && (
        <div className="game-over">
          <h2>Game Over</h2>
          <button className="reset-button" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}

      <button 
        className="mute-button"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
};

export default TicTacToe;