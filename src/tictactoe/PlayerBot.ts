import { Game } from './Game';
import { Player } from './Player';
import { OUTCOME, PIECE } from './constant';
import { BoardType, PieceType } from './types';

type MoveType = { i: number; j: number; value: number };

export class PlayerBot extends Player {
  placePiece(game: Game, props?: { x?: number; y?: number }): [number, number] {
    const { i, j } = this.getBestMove(game, this.getValue());
    return [i, j];
  }

  getBestMove(gameBoard: Game, piece: PieceType, depth: number = 1): MoveType {
    let bestMoves: MoveType[] = [];

    for (let i = 0; i < gameBoard.size; i++) {
      for (let j = 0; j < gameBoard.size; j++) {
        if (gameBoard.board[i][j] === PIECE.EMPTY) {
          let newBoard: Game = JSON.parse(JSON.stringify(gameBoard));
          Object.setPrototypeOf(newBoard, Game.prototype);
          newBoard.placePiece(i, j, piece);

          let outcome = newBoard.getGameStatus();
          if (outcome === OUTCOME.X_WINS) {
            return { i: i, j: j, value: -100000000 + depth };
          } else if (outcome === OUTCOME.O_WINS) {
            return { i: i, j: j, value: 100000000 - depth };
          } else if (outcome === OUTCOME.DRAW) {
            return { i: i, j: j, value: 0 };
          } else if (outcome === OUTCOME.UNRESOLVED) {
            if (depth < 2) {
              const oppMove = this.getBestMove(
                newBoard,
                piece === PIECE.X ? PIECE.O : PIECE.X,
                depth + 1
              );

              if (
                bestMoves.length === 0 ||
                oppMove?.value === bestMoves[0].value
              ) {
                bestMoves.push({ i: i, j: j, value: oppMove?.value });
              } else if (
                (piece === PIECE.X && oppMove?.value < bestMoves[0].value) ||
                (piece === PIECE.O && oppMove?.value > bestMoves[0].value)
              ) {
                bestMoves = [];
                bestMoves.push({ i: i, j: j, value: oppMove.value });
              }
            } else {
              let myMove = {
                i: i,
                j: j,
                value: this.calculateFitness(newBoard.board)
              };

              if (
                bestMoves.length === 0 ||
                myMove.value === bestMoves[0].value
              ) {
                bestMoves.push(myMove);
              } else if (
                (piece === PIECE.X && myMove.value < bestMoves[0].value) ||
                (piece === PIECE.O && myMove.value > bestMoves[0].value)
              ) {
                bestMoves = [];
                bestMoves.push(myMove);
              }
            }
          }
        }
      }
    }

    // pick random move if multiple are equal
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  calculateFitness(board: BoardType) {
    let fitness = 0;

    // rows
    for (let i = 0; i < board.length; i++) {
      let xCount = 0;
      let oCount = 0;

      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === PIECE.X) {
          xCount++;
        } else if (board[i][j] === PIECE.O) {
          oCount++;
        }
      }

      fitness += this.getValueOfLine(xCount, oCount);
    }

    // cols
    for (let j = 0; j < board.length; j++) {
      let xCount = 0;
      let oCount = 0;

      for (let i = 0; i < board.length; i++) {
        if (board[i][j] === PIECE.X) {
          xCount++;
        } else if (board[i][j] === PIECE.O) {
          oCount++;
        }
      }

      fitness += this.getValueOfLine(xCount, oCount);
    }

    // diags
    let xCount = 0;
    let oCount = 0;

    for (let i = 0; i < board.length; i++) {
      if (board[i][i] === PIECE.X) {
        xCount++;
      } else if (board[i][i] === PIECE.O) {
        oCount++;
      }
    }

    fitness += this.getValueOfLine(xCount, oCount);

    xCount = 0;
    oCount = 0;

    for (let i = 0; i < board.length; i++) {
      if (board[i][board.length - 1 - i] === PIECE.X) {
        xCount++;
      } else if (board[i][board.length - 1 - i] === PIECE.O) {
        oCount++;
      }
    }

    fitness += this.getValueOfLine(xCount, oCount);

    return fitness;
  }

  getValueOfLine(xCount: number, oCount: number) {
    if (xCount > 0 && oCount === 0) {
      return -Math.pow(xCount, 4);
    } else if (oCount > 0 && xCount === 0) {
      return Math.pow(oCount, 4);
    }

    return 0;
  }
}
