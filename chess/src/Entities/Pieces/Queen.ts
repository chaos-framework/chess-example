import { Entity, GlyphCode347, Team } from '@chaos-framework/core';

import Piece from '../../Enums/Piece.js';
import Move from '../../Abilities/Move.js';
import { generateCommonComponents } from './_common.js';
import MovesDiagonally from '../../Components/Movement/MovesDiagonally.js';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally.js';
import Collides from '../../Components/Movement/Collides.js';

const Queen = (team: Team): Entity => {
  const name = `${team.name} Queen`;
  const notation = team.name === 'WHITE' ? 'Q' : 'q';
  const queen = new Entity({ 
    name, 
    team,
    active: true,
    metadata: { 
      type: Piece.QUEEN,
      moveCount: 0,
      notation,
    },
    glyph: GlyphCode347[notation]
  });
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
