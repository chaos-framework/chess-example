import { Entity, GlyphCode347, Team } from '@chaos-framework/core';

import { generateCommonComponents } from './_common.js';
import MovesOneSquareForward from '../../Components/Movement/MovesOneSquareForward.js';
import MovesDiagonallyOneSquareToCapture from '../../Components/Movement/MovesDiagonallyOneSquareToCapture.js';
import MovesTwoSpacesForwardOnFirstMovement from '../../Components/Movement/MovesTwoSpacesForwardOnFirstMovement.js';
import Collides from '../../Components/Movement/Collides.js';
import Queens from '../../Components/Queens.js';
import Move from '../../Abilities/Move.js';
import Piece from '../../Enums/Piece.js';

const Pawn = (team: Team): Entity => {
  const name = `${team.name} Pawn`;
  const notation = team.name === 'WHITE' ? 'P' : 'p';
  const pawn = new Entity({
    name,
    team,
    active: true,
    metadata: {
      type: Piece.PAWN,
      moveCount: 0,
      notation
    },
    glyph: GlyphCode347[notation]
  });
  pawn._attachAll([
    ...generateCommonComponents(),
    new Collides,
    new MovesOneSquareForward,
    new MovesTwoSpacesForwardOnFirstMovement,
    new MovesDiagonallyOneSquareToCapture,
    new Queens
  ]);
  pawn._learn(new Move);
  return pawn;
}

export default Pawn;
