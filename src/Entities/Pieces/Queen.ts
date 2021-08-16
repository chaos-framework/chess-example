import { Entity } from '@chaos/core';

import Piece from '../../Enums/Piece';
import Move from '../../Abilities/Move';
import MovesDiagonally from '../../Components/Movement/MovesDiagonally';
import MovesOrthogonally from '../../Components/Movement/MovesOrthogonally';

const queen = (team: 'WHITE' | 'BLACK'): Entity => {
  const name = `${team === 'WHITE' ? "White" : "Black"} Queen`;
  const queen = new Entity({name, metadata: { 
    type: Piece.QUEEN,
    color: team
  }});
  queen._attach(new MovesDiagonally());
  queen._attach(new MovesOrthogonally());
  queen._learn(new Move());
  return queen;
}

export default queen;
