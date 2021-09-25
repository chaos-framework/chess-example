import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import MovesOneSquareForward from '../../Components/Movement/MovesOneSquareForward';
import MovesDiagonallyOneSquareToCapture from '../../Components/Movement/MovesDiagonallyOneSquareToCapture';
import MovesTwoSpacesForwardOnFirstMovement from '../../Components/Movement/MovesTwoSpacesForwardOnFirstMovement';
import { generateCommonComponents } from './_common';
import Collides from '../../Components/Movement/Collides';
import Teams from '../../Enums/Teams';
import Chess from '../..';

const Pawn = (teamName: Teams): Entity => {
  const name = `${teamName} Pawn`;
  const team = Chess.teams[teamName];
  const pawn = new Entity({
    name,
    metadata: {
      type: Piece.PAWN,
      team: teamName,
      moveCount: 0
    },
    team: team.id
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
