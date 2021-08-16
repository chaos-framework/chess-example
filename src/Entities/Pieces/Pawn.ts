import { Entity } from '@chaos/core';
import Move from '../../Abilities/Move';
import MovesOneSquareForward from '../../Components/Movement/MovesOneSquareForward';
import MovesDiagonallyOneSquareToCapture from '../../Components/Movement/MovesDiagonallyOneSquareToCapture';

import Piece from '../../Enums/Piece';

const buildPawn = (team: 'WHITE' | 'BLACK'): Entity => {
  const name = `${team === 'WHITE' ? "White" : "Black"} Pawn`;
  const pawn = new Entity({name, metadata: { 
    type: Piece.PAWN,
    color: team,
    hasMoved: false
  }});
  pawn._attach(new MovesOneSquareForward);
  pawn._attach(new MovesDiagonallyOneSquareToCapture);
  pawn._learn(new Move());
  return pawn;
}

export default buildPawn;
