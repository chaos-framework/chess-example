import { Entity, GlyphCode347, Team } from '@chaos-framework/core';

import Piece from '../../Enums/Piece.js';
import Move from '../../Abilities/Move.js';
import { generateCommonComponents } from './_common.js';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally.js';
import Collides from '../../Components/Movement/Collides.js';

const Rook = (team: Team): Entity => {
  const name = `${team.name} Rook`;
  const notation = team.name === 'WHITE' ? 'R' : 'r';
  const bishop = new Entity({
    name,
    team,
    active: true,
    metadata: {
      type: Piece.ROOK,
      moveCount: 0,
      notation
    },
    glyph: GlyphCode347[notation]
  });
  bishop._attachAll([
    ...generateCommonComponents(),
    new Collides,
    new MovesOrthogonally
  ]);
  bishop._learn(new Move());
  return bishop;
}

export default Rook;
