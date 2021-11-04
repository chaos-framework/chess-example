import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos-framework/core';

import Chessboard from '../../../src/Worlds/Chessboard';
import MovesOrthogonally from '../../../src/Components/Movement/MovesOrthogonally';

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
    let orthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('b8') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(orthogonalMovement);
    orthogonalMovement.decidePermission();
    expect(orthogonalMovement.permitted).to.be.true;
    orthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('b1') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(orthogonalMovement);
    orthogonalMovement.decidePermission();
    expect(orthogonalMovement.permitted).to.be.true;
    orthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('a2') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(orthogonalMovement);
    orthogonalMovement.decidePermission();
    expect(orthogonalMovement.permitted).to.be.true;
    orthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('f2') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(orthogonalMovement);
    orthogonalMovement.decidePermission();
    expect(orthogonalMovement.permitted).to.be.true;
  });

  it('Does not explicitly permit non-orthogonal movement', () => {
    let nonOrthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('c3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(nonOrthogonalMovement);
    nonOrthogonalMovement.decidePermission();
    expect(nonOrthogonalMovement.permitted).to.be.false;
    nonOrthogonalMovement = piece.move({ to: (Chessboard.fromAlgebraic('a8') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(nonOrthogonalMovement);
    nonOrthogonalMovement.decidePermission();
    expect(nonOrthogonalMovement.permitted).to.be.false;
  });

});
