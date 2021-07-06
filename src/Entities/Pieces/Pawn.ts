import { Entity } from '@chaos/core';
import Move from '../../Abilities/Move';

import Piece from '../../Enums/Piece';

export const buildPawn = (team: 'white' | 'black'): Entity => {
  const name = `${team === 'white' ? "White" : "Black"} Pawn`;
  const pawn = new Entity({name});
  pawn.tag(Piece.PAWN);
  pawn._learn(new Move());
  return pawn;
}
