import { Entity, GlyphCode347, Team } from '@chaos-framework/core';

import Piece from '../../Enums/Piece.js';
import { generateCommonComponents } from './_common.js';
import Collides from '../../Components/Movement/Collides.js';
import MovesOneSquareAnyDirection from '../../Components/Movement/MovesOneSquareAnyDirection.js';
import Checkable from '../../Components/Combat/Checkable.js';
import Move from '../../Abilities/Move.js';

const King = (team: Team): Entity => {
  const name = `${team.name} King`;
  const notation = team.name === 'WHITE' ? 'K' : 'k';
  const king = new Entity({
    name,
    team,
    active: true,
    metadata: { 
      type: Piece.KING,
      moveCount: 0,
      notation
    },
    glyph: GlyphCode347[notation]
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
