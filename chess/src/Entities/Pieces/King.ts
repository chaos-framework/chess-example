import { Entity, Team } from '@chaos-framework/core';

import Piece from '../../Enums/Piece.js';
import { generateCommonComponents } from './_common.js';
import Collides from '../../Components/Movement/Collides.js';
import MovesOneSquareAnyDirection from '../../Components/Movement/MovesOneSquareAnyDirection.js';
import Checkable from '../../Components/Combat/Checkable.js';
import Move from '../../Abilities/Move.js';

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
    new Collides,
    new MovesOneSquareAnyDirection,
    new Checkable
  ]);
  king._learn(new Move());
  return king;
}

export default King;
