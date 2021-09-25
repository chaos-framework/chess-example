import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';

import { generateCommonComponents } from './_common';
import Collides from '../../Components/Movement/Collides';
import MovesOneSquareAnyDirection from '../../Components/Movement/MovesOneSquareAnyDirection';
import Checkable from '../../Components/Checkable';

import Move from '../../Abilities/Move';
import Chess from '../..';
import Teams from '../../Enums/Teams';

const King = (teamName: Teams): Entity => {
  const name = `${teamName} King`;
  const team = Chess.teams[teamName];
  const king = new Entity({name, metadata: { 
    type: Piece.KING,
    team: team.id,
    moveCount: 0
  }});
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
