import { expect } from 'chai';
import 'mocha';

import { Entity, Vector, MoveAction, Chaos, Team, LogicalAction } from '@chaos-framework/core';

import Queens from '../../src/Components/Queens';
import Chessboard from '../../src/Worlds/Chessboard';

describe('Queens', () => {
  let pawn: Entity;
  let board: Chessboard;
  let component: Queens;
  beforeEach(() => {
    Chaos.reset;
    pawn = new Entity({ team: new Team({ name: 'WHITE' })});
    component = new Queens();
    pawn._attach(component);
    board = new Chessboard();
    pawn._publish(board, new Vector(0, 1));
  });

  it('Sends the "queen" logical message on reaching the proper edge of the board', () => {
    const movementAction = pawn.move({ to: new Vector(0, 0), metadata: { playerMovement: true } });
    movementAction.applied = true;
    component.react(movementAction);
    const followup = movementAction.followups[0];
    expect(followup instanceof LogicalAction && followup.name === 'queen' && followup.payload.piece === pawn).to.be.true;
  });
});
