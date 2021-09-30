import { Entity, Team } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import MovesOneSquareForward from '../../Components/Movement/MovesOneSquareForward';
import MovesDiagonallyOneSquareToCapture from '../../Components/Movement/MovesDiagonallyOneSquareToCapture';
import MovesTwoSpacesForwardOnFirstMovement from '../../Components/Movement/MovesTwoSpacesForwardOnFirstMovement';
import { generateCommonComponents } from './_common';
import Collides from '../../Components/Movement/Collides';

const Pawn = (team: Team): Entity => {
  const name = `${team.name} Pawn`;
  const pawn = new Entity({
    name,
    team,
    metadata: {
      type: Piece.PAWN,
      moveCount: 0,
      notation: team.name === 'WHITE' ? 'P' : 'p'
    },
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
