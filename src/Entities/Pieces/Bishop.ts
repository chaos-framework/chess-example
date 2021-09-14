import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import { generateCommonComponents } from './_common';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally';
import Collides from '../../Components/Movement/Collides';

const Bishop = (team: 'WHITE' | 'BLACK'): Entity => {
  const name = `${team === 'WHITE' ? "White" : "Black"} Bishop`;
  const bishop = new Entity({name, metadata: { 
    type: Piece.ROOK,
    team,
    moveCount: 0
  }});
  bishop._attachAll([
    ...generateCommonComponents(),
    new Collides,
    new MovesOrthogonally
  ]);
  bishop._learn(new Move());
  return bishop;
}

export default Bishop;
