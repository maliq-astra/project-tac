import { Board, Player, Difficulty, WinResult } from '../types/game';

export const getComputerMove = (board: Board, player: Player, difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'impossible':
      return getImpossibleMove(board, player);
    case 'hard':
      return getHardMove(board, player);
    case 'medium':
      return getMediumMove(board, player);
    default:
      return getRandomMove(board);
  }
};

// Unbeatable AI for impossible mode
export const getImpossibleMove = (board: Board, player: Player): number => {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  
  function minimax(board: Board, depth: number, isMaximizing: boolean): number {
    const winner = checkWinner(board);
    
    if (winner?.winner === player) return 10 - depth;
    if (winner?.winner === opponent) return -10 + depth;
    if (board.every(cell => cell !== null)) return 0;
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          const newBoard = [...board];
          newBoard[i] = player;
          bestScore = Math.max(bestScore, minimax(newBoard, depth + 1, false));
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          const newBoard = [...board];
          newBoard[i] = opponent;
          bestScore = Math.min(bestScore, minimax(newBoard, depth + 1, true));
        }
      }
      return bestScore;
    }
  }
  
  let bestScore = -Infinity;
  let bestMove = 0;
  
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const newBoard = [...board];
      newBoard[i] = player;
      const score = minimax(newBoard, 0, false);
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  
  return bestMove;
};

// Challenging but beatable AI for hard mode
export const getHardMove = (board: Board, player: Player): number => {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  const MISTAKE_PROBABILITY = 0.15;
  const MAX_DEPTH = 3;
  
  if (Math.random() < MISTAKE_PROBABILITY) {
    return getRandomMove(board);
  }
  
  function minimax(board: Board, depth: number, isMaximizing: boolean): number {
    const winner = checkWinner(board);
    
    if (winner?.winner === player) return 10 - depth;
    if (winner?.winner === opponent) return -10 + depth;
    if (board.every(cell => cell !== null)) return 0;
    if (depth >= MAX_DEPTH) return 0;
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          const newBoard = [...board];
          newBoard[i] = player;
          bestScore = Math.max(bestScore, minimax(newBoard, depth + 1, false));
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          const newBoard = [...board];
          newBoard[i] = opponent;
          bestScore = Math.min(bestScore, minimax(newBoard, depth + 1, true));
        }
      }
      return bestScore;
    }
  }
  
  let bestScore = -Infinity;
  let bestMoves: number[] = [];
  
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const newBoard = [...board];
      newBoard[i] = player;
      const score = minimax(newBoard, 0, false);
      
      if (Math.abs(score - bestScore) < 0.1) {
        bestMoves.push(i);
      } else if (score > bestScore) {
        bestScore = score;
        bestMoves = [i];
      }
    }
  }
  
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
};

// Medium mode: Mix of smart and random moves
export const getMediumMove = (board: Board, player: Player): number => {
  return Math.random() > 0.5 ? 
    getHardMove(board, player) : 
    getRandomMove(board);
};

// Random moves for easy mode
export const getRandomMove = (board: Board): number => {
  const availableMoves = board
    .map((cell, index) => cell === null ? index : null)
    .filter((cell): cell is number => cell !== null);
  
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Helper function to check for winner
export const checkWinner = (board: Board): WinResult => {
  const lines: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        line: {
          type: i < 3 ? 'horizontal' : i < 6 ? 'vertical' : 'diagonal',
          index: i < 3 ? i : i < 6 ? i - 3 : i - 6
        }
      };
    }
  }
  return null;
};