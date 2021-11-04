import { Entity, Team } from '@chaos-framework/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import { generateCommonComponents } from './_common';
import MovesDiagonally from '../../Components/Movement/MovesDiagonally';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally';
import Collides from '../../Components/Movement/Collides';

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
