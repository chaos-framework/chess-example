import { expect } from 'chai';
import 'mocha';

import { Entity, Team, Vector } from '@chaos/core';
import Chessboard from '../../../src/Worlds/Chessboard';
import MovesDiagonallyOneSquareToCapture from '../../../src/Components/Movement/MovesDiagonallyOneSquareToCapture';

describe('Pawn Movement -- Diagonal Capture', () => {
  let board: Chessboard
  let pawn: Entity;
  let enemy: Entity;
  let movementComponent: MovesDiagonallyOneSquareToCapture;
  beforeEach(() => {
    board = new Chessboard();
    pawn = new Entity({ team: new Team({ name: 'WHITE' }) });
    movementComponent = new MovesDiagonallyOneSquareToCapture();
    pawn._attach(movementComponent);
    pawn._publish(board, (Chessboard.fromAlgebraic('c2') as Vector));
    enemy = new Entity({ team: new Team({ name: 'BLACK' }) });
    enemy._publish(board, (Chessboard.fromAlgebraic('b3') as Vector));
  });

  it('Allows diagonal movement one square forward if an enemy is present in that square', () => {
    const movement = pawn.move({ to: enemy.position, metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
  });

  it('Does not explicitly give permission for diagonal movement where no enemy is present', () => {
    const movement = pawn.move({ to: (Chessboard.fromAlgebraic('d3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });
});
