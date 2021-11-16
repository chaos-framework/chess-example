import { expect } from 'chai';
import 'mocha';

import { Entity, Vector, Chaos, Team, LogicalAction } from '@chaos-framework/core';

import Queens from '../../src/Components/Queens';
import Chessboard from '../../src/Worlds/Chessboard';
import ChessMove from '../../src/Actions/ChessMove';

describe('Queens', () => {
  let pawn: Entity;
  let board: Chessboard;
  let component: Queens;
  beforeEach(() => {
    Chaos.reset();
    pawn = new Entity({ team: new Team({ name: 'WHITE' })});
    component = new Queens();
    pawn._attach(component);
    board = new Chessboard();
    pawn._publish(board, new Vector(0, 1));
  });

  it('Sends the "queen" logical message on reaching the proper edge of the board', () => {
    const movement = new ChessMove(pawn, new Vector(0,0));
    movement.applied = true;
    component.react(movement);
    const followup = movement.followups[0];
    expect(followup instanceof LogicalAction && followup.name === 'queen' && followup.payload.piece === pawn).to.be.true;
  });
});
