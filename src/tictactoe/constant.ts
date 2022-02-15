import { PieceType } from './types';

export const PIECE = {
  X: 'x' as PieceType,
  O: 'o' as PieceType,
  EMPTY: '-' as PieceType
};

export const OUTCOME = {
  UNRESOLVED: 1,
  X_WINS: 2,
  O_WINS: 3,
  DRAW: 4
};
