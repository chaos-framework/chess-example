import 'mocha';
import { expect } from 'chai';
import { Chaos, Entity, Team, Vector } from '@chaos-framework/core';

import CanOnlyMoveOnTurn from '../../../src/Components/PlayOrder/CanOnlyMoveOnTurn.js';
import ChessMove from '../../../src/Actions/ChessMove.js';

describe('Can only move on turn', () => {
  let piece: Entity;
  beforeEach(() => {
    Chaos.reset();
    piece = new Entity({ team: new Team({ name: 'WHITE' }) });
  });

  it("Stops a piece from moving when it's not the piece's team's turn", () => {
    const movement = new ChessMove(piece, new Vector(0,0));
    new CanOnlyMoveOnTurn().permit(movement);
    Chaos.setCurrentTurn(undefined);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });

  it("Does not stop a piece from moving on it's turn", () => {
    const movement = new ChessMove(piece, new Vector(0,0));
    movement.permit({ priority: 1 });
    Chaos.setCurrentTurn(piece.team);
    new CanOnlyMoveOnTurn().permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
  });
});
