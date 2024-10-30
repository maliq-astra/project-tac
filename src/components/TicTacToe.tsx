import React, { useState } from 'react';
import './TicTacToe.css';
import { Player, Board, GameStatus, Difficulty } from '../types/game';
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

  return (
    <div className="game-container">
      {gameStatus === 'selecting' && (
        <div className="game-setup">
          <h2>Choose Your Symbol</h2>
          <div className="symbol-choice">
            <button 
              className={playerSymbol === 'X' ? 'selected' : ''} 
              onClick={() => setPlayerSymbol('X')}
            >X</button>
            <button 
              className={playerSymbol === 'O' ? 'selected' : ''} 
              onClick={() => setPlayerSymbol('O')}
            >O</button>
          </div>
          <h2>Select Difficulty</h2>
          <div className="difficulty-choice">
            <button 
              className={difficulty === 'easy' ? 'selected' : ''} 
              onClick={() => setDifficulty('easy')}
            >Easy</button>
            <button 
              className={difficulty === 'medium' ? 'selected' : ''} 
              onClick={() => setDifficulty('medium')}
            >Medium</button>
            <button 
              className={difficulty === 'hard' ? 'selected' : ''} 
              onClick={() => setDifficulty('hard')}
            >Hard</button>
            <button 
              className={difficulty === 'impossible' ? 'selected' : ''} 
              onClick={() => setDifficulty('impossible')}
            >Impossible</button>
          </div>
          <button className="start-button" onClick={() => setGameStatus('playing')}>
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
              {cell || (hoveredCell === index && !cell && gameStatus === 'playing' ? playerSymbol : '')}
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