import React from 'react';
import './GameBoard.css';
import { Board, Player, WinningLine } from '../../types/game';
import { useTheme } from '../../context/ThemeContext';

interface GameBoardProps {
  board: Board;
  winningLine: WinningLine;
  isPlayerTurn: boolean;
  gameStatus: 'playing' | 'ended';
  playerSymbol: Player;
  winner: Player | 'draw' | null;
  onCellClick: (index: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  winningLine,
  isPlayerTurn,
  gameStatus,
  playerSymbol,
  winner,
  onCellClick,
}) => {
  const [hoveredCell, setHoveredCell] = React.useState<number | null>(null);
  const { theme } = useTheme();

  const getCellContent = (cell: Player | null, index: number) => {
    if (cell) {
      return <span className={`symbol ${cell.toLowerCase()}`} style={{ color: theme.primary }}>{cell}</span>;
    }
    if (hoveredCell === index && gameStatus === 'playing' && isPlayerTurn) {
      return <span className={`symbol ${playerSymbol.toLowerCase()} preview`}>{playerSymbol}</span>;
    }
    return '';
  };

  return (
    <div className={`game-board ${winner === 'draw' ? 'draw' : ''}`}>
      {winningLine && (
        <div 
          className={`winning-line ${winningLine.type} line-${winningLine.index}`} 
          style={{ backgroundColor: theme.primary }} 
        />
      )}
      {board.map((cell, index) => (
        <div
          key={index}
          className={`cell ${cell ? 'filled' : ''}`}
          onMouseEnter={() => setHoveredCell(index)}
          onMouseLeave={() => setHoveredCell(null)}
          onClick={() => onCellClick(index)}
        >
          {getCellContent(cell, index)}
        </div>
      ))}
    </div>
  );
};

export default GameBoard; 