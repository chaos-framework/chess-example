import { Entity, Team } from '@chaos-framework/core';

import Piece from '../../Enums/Piece.js';
import Move from '../../Abilities/Move.js';
import { generateCommonComponents } from './_common.js';
import KnightMovement from '../../Components/Movement/KnightMovement.js';

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
