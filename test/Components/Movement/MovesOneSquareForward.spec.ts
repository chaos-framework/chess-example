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
});
