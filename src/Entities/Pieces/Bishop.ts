import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import { generateCommonComponents } from './_common';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally';
import Collides from '../../Components/Movement/Collides';
import Teams from '../../Enums/Teams';
import Chess from '../..';

const Bishop = (teamName: Teams): Entity => {
  const name = `${teamName} Bishop`;
  const team = Chess.teams[teamName];
  const bishop = new Entity({name, metadata: { 
    type: Piece.ROOK,
    team: team.id,
    moveCount: 0
  }});
  bishop._attachAll([
    ...generateCommonComponents(),
    new Collides,
    new MovesOrthogonally
  ]);
  bishop._learn(new Move());
  return bishop;
}

export default Bishop;
