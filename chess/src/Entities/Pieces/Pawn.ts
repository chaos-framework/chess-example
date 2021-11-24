import { Entity, Team } from '@chaos-framework/core';

import { generateCommonComponents } from './_common.js';
import MovesOneSquareForward from '../../Components/Movement/MovesOneSquareForward.js';
import MovesDiagonallyOneSquareToCapture from '../../Components/Movement/MovesDiagonallyOneSquareToCapture.js';
import MovesTwoSpacesForwardOnFirstMovement from '../../Components/Movement/MovesTwoSpacesForwardOnFirstMovement.js';
import Collides from '../../Components/Movement/Collides.js';
import Queens from '../../Components/Queens.js';
import Move from '../../Abilities/Move.js';
import Piece from '../../Enums/Piece.js';

const Pawn = (team: Team): Entity => {
  const name = `${team.name} Pawn`;
  const pawn = new Entity({
    name,
    team,
    metadata: {
      type: Piece.PAWN,
      moveCount: 0,
      notation: team.name === 'WHITE' ? 'P' : 'p'
    }
  });
  pawn._attachAll([
    ...generateCommonComponents(),
    new Collides,
    new MovesOneSquareForward,
    new MovesTwoSpacesForwardOnFirstMovement,
    new MovesDiagonallyOneSquareToCapture,
    new Queens
  ]);
  pawn._learn(new Move);
  return pawn;
}

export default Pawn;
