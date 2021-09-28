import 'mocha';
import { expect } from 'chai';

import { Chaos, Entity, Team, Vector } from '@chaos/core';

import CanOnlyMoveOnTurn from '../../../src/Components/TurnOrder/CanOnlyMoveOnTurn';
import Teams from '../../../src/Enums/Teams';

describe('Can only move on turn', () => {
  beforeEach(() => {
    Chaos.reset();
  })

  it("Stops a piece from moving when it's not the piece's team's turn", () => {
    const piece = new Entity({ metadata: { team: Teams.WHITE } });
    const movement = piece.move({ to: new Vector(0, 0) });
    new CanOnlyMoveOnTurn().modify(movement);
    Chaos.currentTurn = undefined;
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });

  it("Does not stop a piece from moving on it's turn", () => {
    const piece = new Entity({ metadata: { team: Teams.WHITE } });
    const movement = piece.move({ to: new Vector(0, 0) });
    new CanOnlyMoveOnTurn().modify(movement);
    Chaos.currentTurn = piece;
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
  });
});
