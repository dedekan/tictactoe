import { Game } from './Game';
import { PieceType } from './types';

export class Player {
  value: PieceType;

  constructor(value: PieceType) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  placePiece(game: Game, props?: { x?: number; y?: number }): [number, number] {
    return [props?.x ?? -1, props?.y ?? -1];
  }
}
