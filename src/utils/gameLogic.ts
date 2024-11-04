import { Board, Player, Difficulty } from '../types/game';
import { getRandomMove } from './gameHelpers';
import { findBestMove } from './minimaxHelper';

const DIFFICULTY_SETTINGS = {
  hard: {
    MISTAKE_PROBABILITY: 0.15,
    MAX_DEPTH: 3
  },
  medium: {
    SMART_MOVE_PROBABILITY: 0.5
  }
} as const;

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

export const getImpossibleMove = (board: Board, player: Player): number => {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  const { move } = findBestMove(board, { player, opponent });
  return move ?? getRandomMove(board);
};

export const getHardMove = (board: Board, player: Player): number => {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  const { MISTAKE_PROBABILITY, MAX_DEPTH } = DIFFICULTY_SETTINGS.hard;
  
  if (Math.random() < MISTAKE_PROBABILITY) {
    return getRandomMove(board);
  }
  
  const { move } = findBestMove(board, { 
    player, 
    opponent, 
    maxDepth: MAX_DEPTH 
  });
  return move ?? getRandomMove(board);
};

export const getMediumMove = (board: Board, player: Player): number => {
  const { SMART_MOVE_PROBABILITY } = DIFFICULTY_SETTINGS.medium;
  return Math.random() > SMART_MOVE_PROBABILITY ? 
    getHardMove(board, player) : 
    getRandomMove(board);
};