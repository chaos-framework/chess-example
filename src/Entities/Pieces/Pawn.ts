import { Entity } from '@chaos/core';
import Move from '../../Abilities/Move';

import Piece from '../../Enums/Piece';

const buildPawn = (team: 'WHITE' | 'BLACK'): Entity => {
  const name = `${team === 'WHITE' ? "White" : "Black"} Pawn`;
  const pawn = new Entity({name, metadata: { 
    type: Piece.PAWN,
    color: team
  }});
  pawn._learn(new Move());
  return pawn;
}

export default buildPawn;
