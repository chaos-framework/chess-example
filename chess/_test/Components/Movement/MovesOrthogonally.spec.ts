import { expect } from 'chai';
import 'mocha';
import { Entity, Vector } from '@chaos-framework/core';

import Chessboard from '../../../src/Worlds/Chessboard.js';
import MovesOrthogonally from '../../../src/Components/Movement/MovesOrthogonally.js';
import ChessMove from '../../../src/Actions/ChessMove.js';

describe('Orthogonal Movement', () => {
  let board: Chessboard
  let piece: Entity;
  let movementComponent: MovesOrthogonally;
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity({ metadata: { team: 'WHITE' } });
    movementComponent = new MovesOrthogonally();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Allows orthogonal movement', () => {
    let movement = new ChessMove(piece, Chessboard.fromAlgebraic('b8')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = new ChessMove(piece, Chessboard.fromAlgebraic('b1')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = new ChessMove(piece, Chessboard.fromAlgebraic('a2')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = new ChessMove(piece, Chessboard.fromAlgebraic('f2')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
  });

  it('Does not explicitly permit non-orthogonal movement', () => {
    let movement = new ChessMove(piece, Chessboard.fromAlgebraic('c3')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
    movement = new ChessMove(piece, Chessboard.fromAlgebraic('a8')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });

});
