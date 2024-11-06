import { checkWinner } from '../utils/gameHelpers';
import { getComputerMove } from '../utils/gameLogic';
import { Board, Player, Difficulty, WinningLine } from '../types/game';

export const useGameLogic = (
  board: Board,
  setBoard: (board: Board) => void,
  playerSymbol: Player,
  setWinner: (winner: Player | 'draw' | null) => void,
  setWinningLine: (line: WinningLine) => void,
  setGameStatus: (status: 'selecting' | 'playing' | 'ended') => void,
  setIsPlayerTurn: (isPlayerTurn: boolean) => void,
  isPlayerTurn: boolean,
  difficulty: Difficulty,
  gameStatus: 'selecting' | 'playing' | 'ended'
) => {
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

  return { handleCellClick, makeComputerMove };
}; 