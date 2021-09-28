import { Entity, Team } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import { generateCommonComponents } from './_common';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally';
import Collides from '../../Components/Movement/Collides';

const Rook = (team: Team): Entity => {
  const name = `${team.name} Rook`;
  const bishop = new Entity({
    name,
    team,
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
