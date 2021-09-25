import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import { generateCommonComponents } from './_common';
import MovesDiagonally from '../../Components/Movement/MovesDiagonally';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally';
import Collides from '../../Components/Movement/Collides';
import Chess from '../..';
import Teams from '../../Enums/Teams';

const Queen = (teamName: Teams): Entity => {
  const name = `${teamName} Queen`;
  const team = Chess.teams[teamName];
  const queen = new Entity({ name, metadata: { 
    type: Piece.QUEEN,
    team: team.id,
    moveCount: 0
  }});
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
