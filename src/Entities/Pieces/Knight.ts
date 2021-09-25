import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import { generateCommonComponents } from './_common';
import KnightMovement from '../../Components/Movement/KnightMovement';
import Teams from '../../Enums/Teams';
import Chess from '../..';

const Knight = (teamName: Teams): Entity => {
  const name = `${teamName} Knight`;
  const team = Chess.teams[teamName];
  const knight = new Entity({name, metadata: { 
    type: Piece.KNIGHT,
    team: team.id,
    moveCount: 0
  }});
  knight._attachAll([
    ...generateCommonComponents(),
    new KnightMovement
  ]);
  knight._learn(new Move());
  return knight;
}

export default Knight;
