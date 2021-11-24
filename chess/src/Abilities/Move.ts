import { Entity, Ability, Event, OptionalCastParameters, Vector } from '@chaos-framework/core';

import Chessboard from '../Worlds/Chessboard.js';
import { SimpleEvent } from '../Events/SimpleEvent.js';
import ChessMove from '../Actions/ChessMove.js';

export interface MoveParams {
  to: Vector
}

function isMoveParams(o: any): o is MoveParams {
  return o.to instanceof Vector;
}

export default class Move extends Ability {
  name = "Move";

  cast(caster: Entity, { using, target, params }: OptionalCastParameters): Event | string | undefined {
    // Check if the parameters contain the location we're moving to (this also casts to our interface)
    if (!isMoveParams(params)) {
      return "Invalid parameters."
    }
    if (target === undefined) {
      return "No piece selected as a target.";
    }
    const { to } = params;
    // Check that the move is in-bounds
    if (!Chessboard.isInBounds(to)) {
      return "Move would be out of bounds!";
    }
    return new SimpleEvent([
      new ChessMove(target, to, 0, { caster })
    ]);
  }

}
