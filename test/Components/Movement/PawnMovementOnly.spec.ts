import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos/core';

import Chess from '../../../src/Chess';
import Chessboard from '../../../src/Worlds/Chessboard';
import PawnMovementOnly from '../../../src/Components/Movement/PawnMovementOnly';

describe('Pawn Movement', () => {
  let game: Chess;
  let board: Chessboard
  let pawn: Entity;
  let movementComponent: PawnMovementOnly;
  before(() => {
    game = new Chess();
  })
  beforeEach(() => {
    board = new Chessboard();
    pawn = new Entity({ tags: ['PAWN', 'WHITE'] });
    movementComponent = new PawnMovementOnly();
    pawn._attach(movementComponent);
    pawn._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Allows movement forward one step', () => {
    const whiteMovement = pawn.move({ to: (Chessboard.fromAlgebraic('b3') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(whiteMovement);
    whiteMovement.decidePermission();
    expect(whiteMovement.permitted).to.be.true;
    const blackMovement = pawn.move({ to: (Chessboard.fromAlgebraic('b1') as Vector), tags: ['PLAYER_MOVEMENT'] });
    pawn.untag('WHITE');
    pawn.tag('BLACK');
    movementComponent.modify(blackMovement);
    blackMovement.decidePermission();
    expect(blackMovement.permitted).to.be.true;
  });

  it('Denies movement backwards', () => {
    const whiteMovement = pawn.move({ to: (Chessboard.fromAlgebraic('b1') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(whiteMovement);
    whiteMovement.decidePermission();
    expect(whiteMovement.permitted).to.be.false;
    const blackMovement = pawn.move({ to: (Chessboard.fromAlgebraic('b3') as Vector), tags: ['PLAYER_MOVEMENT'] });
    pawn.untag('WHITE');
    pawn.tag('BLACK');
    movementComponent.modify(blackMovement);
    blackMovement.decidePermission();
    expect(blackMovement.permitted).to.be.false;
  });

  it('Denies movement more than one step forward', () => {
    const whiteMovement = pawn.move({ to: (Chessboard.fromAlgebraic('b5') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(whiteMovement);
    whiteMovement.decidePermission();
    expect(whiteMovement.permitted).to.be.false;
  });

  it('Denies movement sideways or to same current', () => {
    const sidewaysMovement = pawn.move({ to: (Chessboard.fromAlgebraic('a2') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(sidewaysMovement);
    sidewaysMovement.decidePermission();
    expect(sidewaysMovement.permitted).to.be.false;
    const noMovement = pawn.move({ to: pawn.position, tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(noMovement);
    noMovement.decidePermission();
    expect(noMovement.permitted).to.be.false;
  });

  it('Denies diagonal movement without a piece to capture', () => {
    let diagonalMovement = pawn.move({ to: (Chessboard.fromAlgebraic('a3') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.false;
    diagonalMovement = pawn.move({ to: (Chessboard.fromAlgebraic('c3') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.false;
  });

  it('Allows diagonal movement with a piece to capture', () => {
    new Entity({ tags: ['BLACK'] })._publish(board, Chessboard.fromAlgebraic('a3') as Vector);
    let diagonalMovement = pawn.move({ to: (Chessboard.fromAlgebraic('a3') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
    new Entity({ tags: ['BLACK'] })._publish(board, Chessboard.fromAlgebraic('c3') as Vector);
    diagonalMovement = pawn.move({ to: (Chessboard.fromAlgebraic('c3') as Vector), tags: ['PLAYER_MOVEMENT'] });
    movementComponent.modify(diagonalMovement);
    diagonalMovement.decidePermission();
    expect(diagonalMovement.permitted).to.be.true;
  });
});
