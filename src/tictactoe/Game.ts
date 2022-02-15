import { OUTCOME, PIECE } from './constant';
import { BoardType, PieceType } from './types';

export class Game {
  size: number;
  board: BoardType;
  turnNumber: number;

  constructor(size: number) {
    this.size = size;

    this.board = this.initBoard();
    this.turnNumber = 1;
  }

  initBoard() {
    return Array.from({ length: this.size }, (_, x) =>
      Array.from({ length: this.size }, (_, y) => PIECE.EMPTY as PieceType)
    );
  }

  getBoard() {
    return this.board;
  }

  placePiece(x: number, y: number, value: PieceType) {
    if (this.board[x][y] !== PIECE.EMPTY) {
      return -1;
    }

    this.board[x][y] = value;
    this.turnNumber++;
  }

  getGameStatus() {
    row_check: for (let i = 0; i < this.size; i++) {
      if (this.board[i][0] === PIECE.EMPTY) {
        continue;
      }

      for (let j = 1; j < this.size; j++) {
        if (this.board[i][j] !== this.board[i][0]) {
          continue row_check;
        }
      }

      return this.board[i][0] === PIECE.X ? OUTCOME.X_WINS : OUTCOME.O_WINS;
    }

    col_check: for (let j = 0; j < this.size; j++) {
      if (this.board[0][j] === PIECE.EMPTY) {
        continue;
      }

      for (let i = 1; i < this.size; i++) {
        if (this.board[i][j] !== this.board[0][j]) {
          continue col_check;
        }
      }

      return this.board[0][j] === PIECE.X ? OUTCOME.X_WINS : OUTCOME.O_WINS;
    }

    if (this.board[0][0] !== PIECE.EMPTY) {
      let i;
      for (i = 1; i < this.size; i++) {
        if (this.board[i][i] !== this.board[0][0]) {
          break;
        }
      }

      if (i === this.size) {
        return this.board[0][0] === PIECE.X ? OUTCOME.X_WINS : OUTCOME.O_WINS;
      }
    }

    if (this.board[0][this.size - 1] !== PIECE.EMPTY) {
      let i;
      for (i = 1; i < this.size; i++) {
        if (this.board[i][this.size - 1 - i] !== this.board[0][this.size - 1]) {
          break;
        }
      }

      if (i === this.size) {
        return this.board[0][this.size - 1] === PIECE.X
          ? OUTCOME.X_WINS
          : OUTCOME.O_WINS;
      }
    }

    if (this.turnNumber > this.size * this.size) {
      return OUTCOME.DRAW;
    }

    return OUTCOME.UNRESOLVED;
  }
}
