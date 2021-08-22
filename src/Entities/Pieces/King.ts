import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import { generateCommonComponents } from './_common';
import MovesDiagonally from '../../Components/Movement/MovesDiagonally';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally';
import Collides from '../../Components/Movement/Collides';
import MovesOneSquareAnyDirection from '../../Components/Movement/MovesOneSquareAnyDirection';

const king = (team: 'WHITE' | 'BLACK'): Entity => {
  const name = `${team === 'WHITE' ? "White" : "Black"} King`;
  const king = new Entity({name, metadata: { 
    type: Piece.KING,
    color: team,
    moveCount: 0
  }});
  king._attachAll([
    ...generateCommonComponents(),
    new Collides,
    new MovesOneSquareAnyDirection
  ]);
  king._learn(new Move());
  return king;
}

export default king;
