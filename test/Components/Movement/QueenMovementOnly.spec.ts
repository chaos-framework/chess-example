import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos/core';

import Chess from '../../../src/Chess';
import Chessboard from '../../../src/Worlds/Chessboard';
import QueenMovementOnly from '../../../src/Components/Movement/QueenMovementOnly';

describe('Queen Movement', () => {
  let game: Chess;
  let board: Chessboard
  let piece: Entity;
  let movementComponent: QueenMovementOnly;
  before(() => {
    game = new Chess();
  })
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity({ tags: ['PAWN', 'WHITE'] });
    movementComponent = new QueenMovementOnly();
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

  it('Allows diagonal movement', () => {
    let diagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('a3') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
    diagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('a1') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
    diagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('c3') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
    diagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('f6') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
  });

  it('Denies other movements', () => {
    let disallowedMovement = piece.move({ to: (Chessboard.fromAlgebraic('a8') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(disallowedMovement);
    disallowedMovement.decidePermission();
    expect(disallowedMovement.permitted).to.be.false;
    disallowedMovement = piece.move({ to: (Chessboard.fromAlgebraic('f3') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(disallowedMovement);
    disallowedMovement.decidePermission();
    expect(disallowedMovement.permitted).to.be.false;
  });

});
