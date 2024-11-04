import { Board, Player } from '../types/game';
import { checkWinner } from './gameHelpers';

interface MinimaxConfig {
  maxDepth?: number;
  player: Player;
  opponent: Player;
}

interface MinimaxResult {
  score: number;
  move?: number;
}

export const evaluateBoard = (
  board: Board, 
  depth: number, 
  { player, opponent }: MinimaxConfig
): number | null => {
  const winner = checkWinner(board);
  
  if (winner?.winner === player) return 10 - depth;
  if (winner?.winner === opponent) return -10 + depth;
  if (board.every(cell => cell !== null)) return 0;
  return null;
};

export const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  config: MinimaxConfig
): number => {
  const { maxDepth = Infinity, player, opponent } = config;
  
  const evaluation = evaluateBoard(board, depth, config);
  if (evaluation !== null || depth >= maxDepth) return evaluation ?? 0;
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = player;
        bestScore = Math.max(bestScore, minimax(newBoard, depth + 1, false, config));
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = opponent;
        bestScore = Math.min(bestScore, minimax(newBoard, depth + 1, true, config));
      }
    }
    return bestScore;
  }
};

export const findBestMove = (
  board: Board,
  config: MinimaxConfig
): MinimaxResult => {
  const { player } = config;
  let bestScore = -Infinity;
  let bestMoves: number[] = [];
  
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const newBoard = [...board];
      newBoard[i] = player;
      const score = minimax(newBoard, 0, false, config);
      
      if (Math.abs(score - bestScore) < 0.1) {
        bestMoves.push(i);
      } else if (score > bestScore) {
        bestScore = score;
        bestMoves = [i];
      }
    }
  }
  
  return {
    score: bestScore,
    move: bestMoves[Math.floor(Math.random() * bestMoves.length)]
  };
}; 