import { useState } from 'react';
import { Board, Player, GameStatus, WinningLine } from '../types/game';

export const useGameState = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<GameStatus>('selecting');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);

  const resetGame = (): void => {
    setBoard(Array(9).fill(null));
    setGameStatus('selecting');
    setWinner(null);
    setWinningLine(null);
    setIsPlayerTurn(true);
  };

  return {
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
  };
}; 