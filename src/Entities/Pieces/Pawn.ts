import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import MovesOneSquareForward from '../../Components/Movement/MovesOneSquareForward';
import MovesDiagonallyOneSquareToCapture from '../../Components/Movement/MovesDiagonallyOneSquareToCapture';
import MovesTwoSpacesForwardOnFirstMovement from '../../Components/Movement/MovesTwoSpacesForwardOnFirstMovement';
import { generateCommonComponents } from './_common';
import Collides from '../../Components/Movement/Collides';
import Teams from '../../Enums/Teams';

const Pawn = (team: Teams): Entity => {
  const name = `${team} Pawn`;
  const pawn = new Entity({
    name,
    metadata: {
      type: Piece.PAWN,
      team,
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

export default Pawn;
