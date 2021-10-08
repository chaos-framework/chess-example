import { expect } from 'chai';
import 'mocha';

import { Entity, Vector, MoveAction, Chaos, Team } from '@chaos/core';

import Chessboard from '../../../src/Worlds/Chessboard';
import Captures from '../../../src/Components/Combat/Captures';

describe('Capturing', () => {
  let board: Chessboard
  let piece: Entity;
  let friendly: Entity;
  let enemy: Entity;
  let movementComponent: Captures;
  beforeEach(() => {
    Chaos.reset();
    board = new Chessboard();
    const whiteTeam = new Team({ name: 'WHITE' });
    const blackTeam = new Team({ name: 'BLACK' });
    piece = new Entity();
    piece._joinTeam(whiteTeam);
    movementComponent = new Captures();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('a1') as Vector));
    enemy = new Entity({ metadata: { team: 'BLACK' } });
    enemy._joinTeam(blackTeam);
    enemy._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
    friendly = new Entity({ metadata: { team: 'WHITE' } });
    friendly._publish(board, (Chessboard.fromAlgebraic('a2') as Vector));
  });

  it('Captures enemy pieces', () => {
    let movement = piece.move({ to: enemy.position, metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.combat(movement);
    expect(movement.followups.length).to.be.greaterThan(0);
    const followup = movement.followups[0];
    expect(followup instanceof MoveAction).to.be.true;
    expect((followup as MoveAction).to.equals(Chessboard.getCaptureSlot('BLACK', 0))).to.be.true;
  });
});
