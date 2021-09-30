import { Entity, Team } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import { generateCommonComponents } from './_common';
import KnightMovement from '../../Components/Movement/KnightMovement';

const Knight = (team: Team): Entity => {
  const name = `${team.name} Knight`;
  const knight = new Entity({
    name,
    team, 
    metadata: { 
      type: Piece.KNIGHT,
      moveCount: 0,
      notation: team.name === 'WHITE' ? 'N' : 'n'
    }
  });
  knight._attachAll([
    ...generateCommonComponents(),
    new KnightMovement
  ]);
  knight._learn(new Move());
  return knight;
}

export default Knight;
