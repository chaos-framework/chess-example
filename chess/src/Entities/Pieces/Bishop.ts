import { Entity, Team } from '@chaos-framework/core';

import Move from '../../Abilities/Move.js';
import { generateCommonComponents } from './_common.js';
import Collides from '../../Components/Movement/Collides.js';
import MovesDiagonally from '../../Components/Movement/MovesDiagonally.js';

const Bishop = (team: Team): Entity => {
  const name = `${team.name} Bishop`;
  const bishop = new Entity({
    name,
    team,
    metadata: { 
      team: team.id,
      moveCount: 0,
      notation: team.name === 'WHITE' ? 'B' : 'b'
    }
  });
  bishop._attachAll([
    ...generateCommonComponents(),
    new Collides,
    new MovesDiagonally
  ]);
  bishop._learn(new Move());
  return bishop;
}

export default Bishop;
