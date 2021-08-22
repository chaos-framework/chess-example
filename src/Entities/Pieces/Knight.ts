import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import MovesOneSquareForward from '../../Components/Movement/MovesOneSquareForward';
import MovesDiagonallyOneSquareToCapture from '../../Components/Movement/MovesDiagonallyOneSquareToCapture';
import MovesTwoSpacesForwardOnFirstMovement from '../../Components/Movement/MovesTwoSpacesForwardOnFirstMovement';
import Captures from '../../Components/Captures';
import CannotLandOnTeam from '../../Components/Movement/CannotLandOnTeam';

const knight = (team: 'WHITE' | 'BLACK'): Entity => {
  const name = `${team === 'WHITE' ? "White" : "Black"} Pawn`;
  const pawn = new Entity({
    name,
    metadata: {
      type: Piece.PAWN,
      color: team,
      moveCount: 0
    }
  });
  pawn._attach(new MovesOneSquareForward());
  pawn._attach(new MovesTwoSpacesForwardOnFirstMovement())
  pawn._attach(new MovesDiagonallyOneSquareToCapture());
  // pawn._attach(new Collides()); -- redundant since only moves one square
  pawn._attach(new Captures());
  pawn._attach(new CannotLandOnTeam());
  pawn._learn(new Move());
  return pawn;
}

export default knight;
