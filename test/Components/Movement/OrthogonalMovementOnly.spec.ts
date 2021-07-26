import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos/core';

import Chessboard from '../../../src/Worlds/Chessboard';
import OrthogonalMovementOnly from '../../../src/Components/Movement/OrthogonalMovementOnly';

describe('Orthogonal Movement', () => {
  let board: Chessboard
  let piece: Entity;
  let movementComponent: OrthogonalMovementOnly;
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity({ tags: ['ROOK', 'WHITE'] });
    movementComponent = new OrthogonalMovementOnly();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Allows orthogonal movement', () => {
    let orthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('b8') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(orthogonalMovement);
    orthogonalMovement.decidePermission();
    expect(orthogonalMovement.permitted).to.be.true;
    orthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('b1') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(orthogonalMovement);
    orthogonalMovement.decidePermission();
    expect(orthogonalMovement.permitted).to.be.true;
    orthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('a2') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(orthogonalMovement);
    orthogonalMovement.decidePermission();
    expect(orthogonalMovement.permitted).to.be.true;
    orthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('c2') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(orthogonalMovement);
    orthogonalMovement.decidePermission();
    expect(orthogonalMovement.permitted).to.be.true;
  });

  it('Denies non-orthogonal movement', () => {
    let nonOrthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('c3') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(nonOrthogonalMovement);
    nonOrthogonalMovement.decidePermission();
    expect(nonOrthogonalMovement.permitted).to.be.false;
    nonOrthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('a8') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(nonOrthogonalMovement);
    nonOrthogonalMovement.decidePermission();
    expect(nonOrthogonalMovement.permitted).to.be.false;
  });

});
