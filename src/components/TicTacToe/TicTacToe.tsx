import React, { useState, useMemo } from 'react';
import './TicTacToe.css';
import DifficultyPicker from '../DifficultyPicker/DifficultyPicker';
import { 
  Difficulty, 
} from '../../types/game';
import { useTheme } from '../../context/ThemeContext';
import GameBoard from '../GameBoard/GameBoard';
import { useGameState } from '../../hooks/useGameState';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useGameStyles } from '../../hooks/useGameStyles';
import FallingSymbols from '../FallingSymbols/FallingSymbols';

const TicTacToe: React.FC = () => {
  const { theme, setDifficultyTheme } = useTheme();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  
  const {
    board,
    setBoard,
    playerSymbol,
    setPlayerSymbol,
    gameStatus,
    setGameStatus,
    winner,
    setWinner,
    winningLine,
    setWinningLine,
    isPlayerTurn,
    setIsPlayerTurn,
    resetGame,
  } = useGameState();

  const { handleCellClick, makeComputerMove } = useGameLogic(
    board,
    setBoard,
    playerSymbol,
    setWinner,
    setWinningLine,
    setGameStatus,
    setIsPlayerTurn,
    isPlayerTurn,
    difficulty,
    gameStatus
  );

  const { containerStyle, symbolButtonStyle } = useGameStyles(theme);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setDifficultyTheme(newDifficulty);
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
            setDifficulty={handleDifficultyChange}
          />
          
          <button 
            className={`start-button ${difficulty}`}
            onClick={() => {
              setGameStatus('playing');
              if (playerSymbol === 'O') {
                setIsPlayerTurn(false);
                setTimeout(() => makeComputerMove(Array(9).fill(null)), 500);
              }
            }}
          >
            Start Game
          </button>
        </div>
      )}

      {(gameStatus === 'playing' || gameStatus === 'ended') && (
        <>
          <FallingSymbols winner={winner} theme={theme} />
          <GameBoard
            board={board}
            winningLine={winningLine}
            isPlayerTurn={isPlayerTurn}
            gameStatus={gameStatus}
            playerSymbol={playerSymbol}
            winner={winner}
            onCellClick={handleCellClick}
          />
        </>
      )}

      {gameStatus === 'ended' && (
        <div className="game-over">
          <h2>
            {winner === 'draw' 
              ? "It's a Draw!" 
              : winner === playerSymbol 
                ? `${winner} Wins!`
                : `${winner} Wins! 🤖`}
          </h2>
          <button 
            className="reset-button" 
            onClick={resetGame}
            style={{ backgroundColor: theme.primary }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;