import { expect } from 'chai';
import 'mocha';

import { Entity, Vector, MoveAction, Chaos, Team } from '@chaos-framework/core';

import Chessboard from '../../../src/Worlds/Chessboard';
import Captures from '../../../src/Components/Combat/Captures';
import ChessMove from '../../../src/Actions/ChessMove';
import Capture from '../../../src/Actions/Capture';

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
    let movement = new ChessMove(piece, enemy.position);
    movementComponent.capture(movement);
    expect(movement.reactions.length).to.be.greaterThan(0);
    const reaction = movement.reactions[0];
    expect(reaction instanceof Capture).to.be.true;
    expect((reaction as Capture).entity).to.equal(enemy);
  });
});
