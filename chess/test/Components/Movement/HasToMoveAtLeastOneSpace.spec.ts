import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos-framework/core';
import Chessboard from '../../../src/Worlds/Chessboard';
import HasToMoveAtLeastOneSpace from '../../../src/Components/Movement/HasToMoveAtLeastOneSpace';

describe('Must move at least one space.', () => {
  let board: Chessboard
  let piece: Entity;
  let movementComponent: HasToMoveAtLeastOneSpace;
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity({ metadata: { team: 'WHITE' } });
    movementComponent = new HasToMoveAtLeastOneSpace();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Denies movement that is not to a different tile', () => {
    const movement = piece.move({ to: (Chessboard.fromAlgebraic('b2') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });

  it('Does not deny movement to a different tile', () => {
    const movement = piece.move({ to: (Chessboard.fromAlgebraic('g6') as Vector), metadata: { playerMovement: true } });
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
  });
});
