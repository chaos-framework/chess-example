import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos/core';

import Chess from '../../../src';
import Chessboard from '../../../src/Worlds/Chessboard';
import MovesDiagonally from '../../../src/Components/Movement/MovesDiagonally';

describe('Diagonal Movement', () => {
  let board: Chessboard
  let piece: Entity;
  let movementComponent: MovesDiagonally;
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity({ metadata: { team: 'WHITE' } });
    movementComponent = new MovesDiagonally();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Permits diagonal movement', () => {
    let diagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('a3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
    diagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('a1') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
    diagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('c3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
    diagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('f6') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
  });

  it('Does not permit non-diagonal movement', () => {
    let nonDiagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('c2') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(nonDiagonalMovement);
    nonDiagonalMovement.decidePermission();
    expect(nonDiagonalMovement.permitted).to.be.false;
    nonDiagonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('b8') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(nonDiagonalMovement);
    nonDiagonalMovement.decidePermission();
    expect(nonDiagonalMovement.permitted).to.be.false;
  });

});
