export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];
export type GameStatus = 'selecting' | 'playing' | 'ended';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';
export type ThemeColors = {
  background: string;
  primary: string;
  shadow: string;
};

export const difficultyThemes: Record<Difficulty, ThemeColors> = {
  easy: {
    background: '#e8f5e9',
    primary: '#4CAF50',
    shadow: 'rgba(76, 175, 80, 0.2)',
  },
  medium: {
    background: '#e3f2fd',
    primary: '#2196F3',
    shadow: 'rgba(33, 150, 243, 0.2)',
  },
  hard: {
    background: '#fff3e0',
    primary: '#FF9800',
    shadow: 'rgba(255, 152, 0, 0.2)',
  },
  impossible: {
    background: '#fce4ec',
    primary: '#e91e63',
    shadow: 'rgba(233, 30, 99, 0.2)',
  },
};