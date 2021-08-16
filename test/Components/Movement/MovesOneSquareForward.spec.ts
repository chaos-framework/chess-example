import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos/core';
import Chessboard from '../../../src/Worlds/Chessboard';
import MovesOneSquareForward from '../../../src/Components/Movement/MovesOneSquareForward';

describe('Pawn Movement -- Front Square', () => {
  let board: Chessboard
  let pawn: Entity;
  let movementComponent: MovesOneSquareForward;
  beforeEach(() => {
    board = new Chessboard();
    pawn = new Entity({ metadata: { team: 'WHITE' } });
    movementComponent = new MovesOneSquareForward();
    pawn._attach(movementComponent);
    pawn._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Allows movement forward one step', () => {
    const whiteMovement = pawn.move({ to: (Chessboard.fromAlgebraic('b3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(whiteMovement);
    whiteMovement.decidePermission();
    expect(whiteMovement.permitted).to.be.true;
    const blackMovement = pawn.move({ to: (Chessboard.fromAlgebraic('b1') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    pawn.metadata.set('team', 'BLACK');
    movementComponent.modify(blackMovement);
    blackMovement.decidePermission();
    expect(blackMovement.permitted).to.be.true;
  });

  it('Does not give permission for movement backwards', () => {
    const whiteMovement = pawn.move({ to: (Chessboard.fromAlgebraic('b1') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(whiteMovement);
    whiteMovement.decidePermission();
    expect(whiteMovement.permitted).to.be.false;
    const blackMovement = pawn.move({ to: (Chessboard.fromAlgebraic('b3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    pawn.metadata.set('team', 'BLACK');
    movementComponent.modify(blackMovement);
    blackMovement.decidePermission();
    expect(blackMovement.permitted).to.be.false;
  });

  it('Does not give permission for movement sideways', () => {
    const whiteMovement = pawn.move({ to: (Chessboard.fromAlgebraic('c3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(whiteMovement);
    whiteMovement.decidePermission();
    expect(whiteMovement.permitted).to.be.false;
  });

  // it('Does not permit sideways or to same team', () => {
  //   const sidewaysMovement = pawn.move({ to: (Chessboard.fromAlgebraic('a2') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
  //   movementComponent.modify(sidewaysMovement);
  //   sidewaysMovement.decidePermission();
  //   expect(sidewaysMovement.permitted).to.be.false;
  //   const noMovement = pawn.move({ to: pawn.position, metadata: { playerMovement: true } }).deniedByDefault();
  //   movementComponent.modify(noMovement);
  //   noMovement.decidePermission();
  //   expect(noMovement.permitted).to.be.false;
  // });

  // it('Denies diagonal movement without a piece to capture', () => {
  //   let diagonalMovement = pawn.move({ to: (Chessboard.fromAlgebraic('a3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
  //   movementComponent.modify(diagonalMovement);
  //   diagonalMovement.decidePermission();
  //   expect(diagonalMovement.permitted).to.be.false;
  //   diagonalMovement = pawn.move({ to: (Chessboard.fromAlgebraic('c3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
  //   movementComponent.modify(diagonalMovement);
  //   diagonalMovement.decidePermission();
  //   expect(diagonalMovement.permitted).to.be.false;
  // });

  // it('Allows diagonal movement with a piece to capture', () => {
  //   new Entity({ metadata: { color: 'BLACK' } })._publish(board, Chessboard.fromAlgebraic('a3') as Vector);
  //   let diagonalMovement = pawn.move({ to: (Chessboard.fromAlgebraic('a3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
  //   movementComponent.modify(diagonalMovement);
  //   diagonalMovement.decidePermission();
  //   expect(diagonalMovement.permitted).to.be.true;
  //   new Entity({ metadata: { color: 'BLACK' } })._publish(board, Chessboard.fromAlgebraic('c3') as Vector);
  //   diagonalMovement = pawn.move({ to: (Chessboard.fromAlgebraic('c3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
  //   movementComponent.modify(diagonalMovement);
  //   diagonalMovement.decidePermission();
  //   expect(diagonalMovement.permitted).to.be.true;
  // });
});
