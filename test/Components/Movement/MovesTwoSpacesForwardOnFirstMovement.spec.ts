import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos/core';
import Chessboard from '../../../src/Worlds/Chessboard';
import MovesTwoSpacesForwardOnFirstMovement from '../../../src/Components/Movement/MovesTwoSpacesForwardOnFirstMovement';

describe('Pawn Movement -- Front Square', () => {
  let board: Chessboard
  let pawn: Entity;
  let movementComponent: MovesTwoSpacesForwardOnFirstMovement;
  beforeEach(() => {
    board = new Chessboard();
    pawn = new Entity({ metadata: { team: 'WHITE' } });
    movementComponent = new MovesTwoSpacesForwardOnFirstMovement();
    pawn._attach(movementComponent);
    pawn._publish(board, (Chessboard.fromAlgebraic('c3') as Vector));
  });

  it('Allows movement forward two spaces if moveCount is zero', () => {
    pawn.metadata.set('moveCount', 0);
    const movement = pawn.move({ to: (Chessboard.fromAlgebraic('c5') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
  });

  it('Does not give permission for movement backwards, even if moveCount is zero', () => {
    pawn.metadata.set('moveCount', 0);
    const movement = pawn.move({ to: (Chessboard.fromAlgebraic('c1') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });

  it('Does not explicitly allow movement forward two spaces if moveCount is greater than zero', () => {
    pawn.metadata.set('moveCount', 1);
    const whiteMovement = pawn.move({ to: (Chessboard.fromAlgebraic('c5') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(whiteMovement);
    whiteMovement.decidePermission();
    expect(whiteMovement.permitted).to.be.false;
  });

});
