import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';

import { generateCommonComponents } from './_common';
import Collides from '../../Components/Movement/Collides';
import MovesOneSquareAnyDirection from '../../Components/Movement/MovesOneSquareAnyDirection';
import Checkable from '../../Components/Checkable';

import Move from '../../Abilities/Move';

const King = (team: 'WHITE' | 'BLACK'): Entity => {
  const name = `${team === 'WHITE' ? "White" : "Black"} King`;
  const king = new Entity({name, metadata: { 
    type: Piece.KING,
    team,
    moveCount: 0
  }});
  king._attachAll([
    ...generateCommonComponents(),
    new Collides,
    new MovesOneSquareAnyDirection,
    new Checkable
  ]);
  king._learn(new Move());
  return king;
}

export default King;
