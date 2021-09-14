import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import { generateCommonComponents } from './_common';
import MovesDiagonally from '../../Components/Movement/MovesDiagonally';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally';
import Collides from '../../Components/Movement/Collides';

const Queen = (team: 'WHITE' | 'BLACK'): Entity => {
  const name = `${team === 'WHITE' ? "White" : "Black"} Queen`;
  const queen = new Entity({ name, metadata: { 
    type: Piece.QUEEN,
    team,
    moveCount: 0
  }});
  queen._attachAll([
    ...generateCommonComponents(),
    new Collides,
    new MovesDiagonally,
    new MovesOrthogonally
  ]);
  queen._learn(new Move());
  return queen;
}

export default Queen;
