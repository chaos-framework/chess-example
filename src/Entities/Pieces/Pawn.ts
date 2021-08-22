import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import MovesOneSquareForward from '../../Components/Movement/MovesOneSquareForward';
import MovesDiagonallyOneSquareToCapture from '../../Components/Movement/MovesDiagonallyOneSquareToCapture';
import MovesTwoSpacesForwardOnFirstMovement from '../../Components/Movement/MovesTwoSpacesForwardOnFirstMovement';
import { generateCommonComponents } from './_common';
import Collides from '../../Components/Movement/Collides';

const buildPawn = (team: 'WHITE' | 'BLACK'): Entity => {
  const name = `${team === 'WHITE' ? "White" : "Black"} Pawn`;
  const pawn = new Entity({
    name,
    metadata: {
      type: Piece.PAWN,
      color: team,
      moveCount: 0
    }
  });
  pawn._attachAll([
    ...generateCommonComponents(),
    new Collides,
    new MovesOneSquareForward,
    new MovesTwoSpacesForwardOnFirstMovement,
    new MovesDiagonallyOneSquareToCapture,
  ]);
  pawn._learn(new Move);
  return pawn;
}

export default buildPawn;
