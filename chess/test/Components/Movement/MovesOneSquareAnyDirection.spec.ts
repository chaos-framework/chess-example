import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos/core';

import Chess from '../../../src';
import Chessboard from '../../../src/Worlds/Chessboard';
import MovesOneSquareAnyDirection from '../../../src/Components/Movement/MovesOneSquareAnyDirection';

describe('Moves One Square in Any Direction', () => {
  let board: Chessboard
  let piece: Entity;
  let movementComponent: MovesOneSquareAnyDirection;
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity({ metadata: { team: 'WHITE' } });
    movementComponent = new MovesOneSquareAnyDirection();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Permits all movement one square away', () => {
    let movement = piece.move({ to: (Chessboard.fromAlgebraic('a1') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = piece.move({ to: (Chessboard.fromAlgebraic('b1') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = piece.move({ to: (Chessboard.fromAlgebraic('c1') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = piece.move({ to: (Chessboard.fromAlgebraic('c2') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = piece.move({ to: (Chessboard.fromAlgebraic('c3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = piece.move({ to: (Chessboard.fromAlgebraic('b3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = piece.move({ to: (Chessboard.fromAlgebraic('a3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = piece.move({ to: (Chessboard.fromAlgebraic('a2') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
  });

  it('Does not explicitely permit movement more than one square away', () => {
    let twoSquareMovement = piece.move({ to: (Chessboard.fromAlgebraic('d2') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(twoSquareMovement);
    twoSquareMovement.decidePermission();
    expect(twoSquareMovement.permitted).to.be.false;
    twoSquareMovement = piece.move({ to: (Chessboard.fromAlgebraic('b4') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.permit(twoSquareMovement);
    twoSquareMovement.decidePermission();
    expect(twoSquareMovement.permitted).to.be.false;
  });

});
