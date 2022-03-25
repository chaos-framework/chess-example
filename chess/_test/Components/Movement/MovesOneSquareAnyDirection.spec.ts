import { expect } from 'chai';
import 'mocha';
import { Entity, Vector } from '@chaos-framework/core';

import Chessboard from '../../../src/Worlds/Chessboard.js';
import MovesOneSquareAnyDirection from '../../../src/Components/Movement/MovesOneSquareAnyDirection.js';
import ChessMove from '../../../src/Actions/ChessMove.js';

describe('Moves One Square in Any Direction', () => {
  let board: Chessboard
  let piece: Entity;
  let movementComponent: MovesOneSquareAnyDirection;
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity({ metadata: { team: 'WHITE' } });
    movementComponent = new MovesOneSquareAnyDirection();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Permits all movement one square away', () => {
    const positions = ['a1', 'b1', 'c1', 'c2', 'c3', 'b3', 'a3', 'a2'];
    for(const position of positions) {
      let movement = new ChessMove(piece, Chessboard.fromAlgebraic(position)!);
      movementComponent.permit(movement);
      movement.decidePermission();
      expect(movement.permitted).to.be.true;
    }
  });

  it('Does not explicitely permit movement more than one square away', () => {
    let movement = new ChessMove(piece, Chessboard.fromAlgebraic('d2')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
    new ChessMove(piece, Chessboard.fromAlgebraic('b4')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });
});
