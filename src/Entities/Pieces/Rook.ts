import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import { generateCommonComponents } from './_common';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally';
import Collides from '../../Components/Movement/Collides';
import Chess from '../..';
import Teams from '../../Enums/Teams';

const Rook = (teamName: Teams): Entity => {
  const name = `${teamName} Rook`;
  const team = Chess.teams[teamName];
  const bishop = new Entity({
    name,
    team: team.id,
    metadata: {
      type: Piece.ROOK,
      moveCount: 0
    }
  });
  bishop._attachAll([
    ...generateCommonComponents(),
    new Collides,
    new MovesOrthogonally
  ]);
  bishop._learn(new Move());
  return bishop;
}

export default Rook;
