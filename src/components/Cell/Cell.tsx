import React from 'react';
import { Player } from '../../types/game';
import { useTheme } from '../../context/ThemeContext';
import './Cell.css'

interface CellProps {
  index: number;
  cell: Player | null;
  isPlayerTurn: boolean;
  gameStatus: 'playing' | 'ended';
  playerSymbol: Player;
  onCellClick: (index: number) => void;
}

const Cell: React.FC<CellProps> = ({
  index,
  cell,
  isPlayerTurn,
  gameStatus,
  playerSymbol,
  onCellClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { theme } = useTheme();

  const getCellContent = () => {
    if (cell) {
      return <span className={`symbol ${cell.toLowerCase()}`} style={{ color: theme.primary }}>{cell}</span>;
    }
    if (isHovered && gameStatus === 'playing' && isPlayerTurn) {
      return <span className={`symbol ${playerSymbol.toLowerCase()} preview`}>{playerSymbol}</span>;
    }
    return '';
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onCellClick(index)}
      className='cell'
    >
      {getCellContent()}
    </div>
  );
};

export default Cell; 