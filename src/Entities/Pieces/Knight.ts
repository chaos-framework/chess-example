import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import { generateCommonComponents } from './_common';
import KnightMovement from '../../Components/Movement/KnightMovement';

const knight = (team: 'WHITE' | 'BLACK'): Entity => {
  const name = `${team === 'WHITE' ? "White" : "Black"} Knight`;
  const knight = new Entity({name, metadata: { 
    type: Piece.KNIGHT,
    color: team,
    moveCount: 0
  }});
  knight._attachAll([
    ...generateCommonComponents(),
    new KnightMovement
  ]);
  knight._learn(new Move());
  return knight;
}

export default knight;
