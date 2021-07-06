import { Game, Entity, Ability, Event, OptionalCastParameters, Vector, MoveAction } from '@chaos/core';

import Chessboard from '../Worlds/Chessboard';
import Piece from '../Enums/Piece';
import Tile from '../Enums/Tile';
import Chess from '..';
import { SimpleEvent } from '../Events/SimpleEvent';

export interface MoveParams {
  to: Vector
}

function isMoveParams(o: any): o is MoveParams {
  return o.to instanceof Vector;
}

// function getPieceType(entity: Entity): Piece {
//   if(entity.tagged(Piece.PAWN)) {
//     return Piece.PAWN;
//   } else if (entity.tagged(Piece.BISHOP)) {
//     return Piece.BISHOP;
//   } else if (entity.tagged(Piece.ROOK)) {
//     return Piece.ROOK;
//   } else if (entity.tagged(Piece.KNIGHT)) {
//     return Piece.KNIGHT;
//   } else if (entity.tagged(Piece.QUEEN)) {
//     return Piece.QUEEN;
//   } else {
//     return Piece.KING;
//   }
// }

// function getForwardDirection(team: 'white' | 'black') {
//   return 'white' ? -1 : 1;
// }

// function isValidMoveLocation(entity: Entity, to: Vector): boolean {
//   const type: Piece = getPieceType(entity);
//   const forwardDirection = getForwardDirection(entity.tagged('white') ? 'white' : 'black');
//   const { position } = entity;
//   switch(type) {
//     case Piece.PAWN:
//       if(to.y === position.y + forwardDirection) {
//         if(to.x >= position.x - 1 && to.x <= position.x + 1) {
//           return true;
//         }
//       }
//       break;
//     case Piece.BISHOP:
//       break;
//     case Piece.ROOK:
//       break;
//     case Piece.KNIGHT:
//       break;
//     case Piece.BISHOP:
//       break;
//   }
//   return false;
// }

export default class Move extends Ability {
  name = "Move";

  cast(caster: Entity, { using, target, params }: OptionalCastParameters): Event | string | undefined {
    // Check if the parameters contain the location we're moving to (this also casts to our interface)
    if(!isMoveParams(params)) {
      return "Invalid parameters."
    }
    if(target === undefined) {
      return "No piece selected as a target.";
    }
    const { to } = params;
    // Check that the move is in-bounds
    if(!Chessboard.isInBounds(to)) {
      return "Move would be out of bounds!";
    }
    return new SimpleEvent([
      target.move({ to, tags: ['MOVE'] })
    ]);
  }

}
