import { Entity, Team } from '@chaos-framework/core';

import Piece from '../../Enums/Piece.js';
import Move from '../../Abilities/Move.js';
import { generateCommonComponents } from './_common.js';
import MovesDiagonally from '../../Components/Movement/MovesDiagonally.js';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally.js';
import Collides from '../../Components/Movement/Collides.js';

const Queen = (team: Team): Entity => {
  const name = `${team.name} Queen`;
  const queen = new Entity({ 
    name, 
    team,
    metadata: { 
      type: Piece.QUEEN,
      moveCount: 0,
      notation: team.name === 'WHITE' ? 'Q' : 'q'
    }
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
