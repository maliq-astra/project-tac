export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];
export type GameStatus = 'selecting' | 'playing' | 'ended';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';