import { Entity, Team } from '@chaos/core';

import Piece from '../../Enums/Piece';

import { generateCommonComponents } from './_common';
import Collides from '../../Components/Movement/Collides';
import MovesOneSquareAnyDirection from '../../Components/Movement/MovesOneSquareAnyDirection';
import Checkable from '../../Components/Combat/Checkable';

import Move from '../../Abilities/Move';

const King = (team: Team): Entity => {
  const name = `${team.name} King`;
  const king = new Entity({
    name,
    team, 
    metadata: { 
      type: Piece.KING,
      moveCount: 0,
      notation: team.name === 'WHITE' ? 'K' : 'k'
    }
  });
  king._attachAll([
    ...generateCommonComponents(),
    new MovesOneSquareAnyDirection,
    new Checkable
  ]);
  king._learn(new Move());
  return king;
}

export default King;
