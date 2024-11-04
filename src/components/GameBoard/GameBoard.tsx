import React from 'react';
import './GameBoard.css';
import { Board, Player, WinningLine } from '../../types/game';
import { useTheme } from '../../context/ThemeContext';
import Cell from '../Cell/Cell';

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
  const { theme } = useTheme();

  return (
    <div className={`game-board ${winner === 'draw' ? 'draw' : ''}`}>
      {winningLine && (
        <div 
          className={`winning-line ${winningLine.type} line-${winningLine.index}`} 
          style={{ backgroundColor: theme.primary }} 
        />
      )}
      {board.map((cell, index) => (
        <Cell
          key={index}
          index={index}
          cell={cell}
          isPlayerTurn={isPlayerTurn}
          gameStatus={gameStatus}
          playerSymbol={playerSymbol}
          onCellClick={onCellClick}
        />
      ))}
    </div>
  );
};

export default GameBoard; 