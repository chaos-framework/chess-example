import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos-framework/core';

import Chessboard from '../../../src/Worlds/Chessboard.js';
import MovesDiagonally from '../../../src/Components/Movement/MovesDiagonally.js';
import ChessMove from '../../../src/Actions/ChessMove.js';

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
    let diagonalMovement = new ChessMove(piece, Chessboard.fromAlgebraic('a3')!);
    movementComponent.permit(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
    diagonalMovement = new ChessMove(piece, Chessboard.fromAlgebraic('a1')!);
    movementComponent.permit(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
    diagonalMovement = new ChessMove(piece, Chessboard.fromAlgebraic('c3')!);
    movementComponent.permit(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
    diagonalMovement = new ChessMove(piece, Chessboard.fromAlgebraic('f6')!);
    movementComponent.permit(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
  });

  it('Does not explicitly permit non-diagonal movement', () => {
    let movement = new ChessMove(piece, Chessboard.fromAlgebraic('c2')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
    movement = new ChessMove(piece, Chessboard.fromAlgebraic('b8')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });

});
