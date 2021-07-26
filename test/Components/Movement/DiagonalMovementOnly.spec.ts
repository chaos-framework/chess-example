import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos/core';

import Chess from '../../../src/';
import Chessboard from '../../../src/Worlds/Chessboard';
import DiagonalMovementOnly from '../../../src/Components/Movement/DiagonalMovementOnly';

describe('Diagonal Movement', () => {
  let board: Chessboard
  let piece: Entity;
  let movementComponent: DiagonalMovementOnly;
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity({ tags: ['BISHOP', 'WHITE'] });
    movementComponent = new DiagonalMovementOnly();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
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

  it('Denies non-diagonal movement', () => {
    let nonDiagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('c2') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(nonDiagonalMovement);
    nonDiagonalMovement.decidePermission();
    expect(nonDiagonalMovement.permitted).to.be.false;
    nonDiagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('b8') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(nonDiagonalMovement);
    nonDiagonalMovement.decidePermission();
    expect(nonDiagonalMovement.permitted).to.be.false;
  });

});
