import React, { useState, useMemo } from 'react';
import './TicTacToe.css';
import DifficultyPicker from '../DifficultyPicker/DifficultyPicker';
import { 
  Player, 
  Board, 
  GameStatus, 
  Difficulty, 
  difficultyThemes,
  WinningLine 
} from '../../types/game';
import { checkWinner, getComputerMove } from '../../utils/gameLogic';
import { useTheme } from '../../context/ThemeContext';

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState<Player>('X');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('selecting');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const { theme, setDifficultyTheme } = useTheme();

  const handleCellClick = (index: number): void => {
    if (board[index] || !isPlayerTurn || gameStatus !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    setIsPlayerTurn(false);
    
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(playerSymbol);
      setWinningLine(result.line);
      setGameStatus('ended');
    } else if (!newBoard.includes(null)) {
      setWinner('draw');
      setGameStatus('ended');
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
    setIsPlayerTurn(true);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(computerSymbol);
      setWinningLine(result.line);
      setGameStatus('ended');
      setIsPlayerTurn(false);
    } else if (!newBoard.includes(null)) {
      setWinner('draw');
      setGameStatus('ended');
      setIsPlayerTurn(false);
    }
  };

  const resetGame = (): void => {
    setBoard(Array(9).fill(null));
    setGameStatus('selecting');
    setWinner(null);
    setWinningLine(null);
    setIsPlayerTurn(true);
  };

  // Add theme styles to the container
  const containerStyle = {
    backgroundColor: theme.background,
    transition: 'background-color 0.3s ease',
  };

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

  const renderFallingSymbols = useMemo(() => {
    if (!winner || winner === 'draw') return null;
    
    return (
      <div className="falling-symbols-container">
        <div className="falling-symbols">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="symbol-column"
              style={{
                left: `${i * 10}%`,
              }}
            >
              {[...Array(5)].map((_, j) => (
                <div
                  key={j}
                  className="falling-symbol"
                  style={{
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    top: `-${50 + Math.random() * 100}px`,
                    color: theme.primary,
                  }}
                >
                  {winner}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }, [winner]);

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
          {renderFallingSymbols}
          <div className={`game-board ${winner === 'draw' ? 'draw' : ''}`}>
            {winningLine && (
              <div className={`winning-line ${winningLine.type} line-${winningLine.index}`} 
                   style={{ backgroundColor: theme.primary }} 
              />
            )}
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