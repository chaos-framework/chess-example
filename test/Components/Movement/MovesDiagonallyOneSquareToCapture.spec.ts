import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos/core';
import Chessboard from '../../../src/Worlds/Chessboard';
import MovesDiagonallyOneSquareToCapture from '../../../src/Components/Movement/MovesDiagonallyOneSquareToCapture';

describe('Pawn Movement -- Diagonal Capture', () => {
  let board: Chessboard
  let pawn: Entity;
  let enemy: Entity;
  let movementComponent: MovesDiagonallyOneSquareToCapture;
  beforeEach(() => {
    board = new Chessboard();
    pawn = new Entity({ metadata: { team: 'BLACK' } });
    movementComponent = new MovesDiagonallyOneSquareToCapture();
    pawn._attach(movementComponent);
    pawn._publish(board, (Chessboard.fromAlgebraic('c3') as Vector));
    enemy = new Entity({ metadata: { team: 'WHITE'} });
    enemy._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Allows diagonal movement one square forward if an enemy is present in that square', () => {
    const movement = pawn.move({ to: (Chessboard.fromAlgebraic('b2') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
  });

  it('Does not explicitly give permission for diagonal movement where no enemy is present', () => {
    const movement = pawn.move({ to: (Chessboard.fromAlgebraic('a2') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });
});
