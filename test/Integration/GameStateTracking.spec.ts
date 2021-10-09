import { expect } from 'chai';
import 'mocha';

import { Chaos } from '@chaos/core';
import Chess from '../../src';

describe('Standard Game State Tracking', function() {
  beforeEach(() => {
    Chaos.reset();
    Chess.initialize();
    Chaos.process();
  });

  it('Tracks en passant status', function() {
    Chess.board.move('a2', 'a4')?.execute();
    Chaos.process();
    expect(Chess.stateTrackingComponent.getState().enPassant).to.equal('a3');
    Chess.board.move('a7', 'a6')?.execute();
    Chaos.process();
    expect(Chess.stateTrackingComponent.getState().enPassant).to.be.null;
  });

  it('Tracks check status from previous turn', function() {
    Chess.board.move('c1', 'd7')?.execute(true); // force an illegal move to have a bishop put the black king in check
    Chaos.process();
    expect(Chess.stateTrackingComponent.getState().check).to.equal(true);
    Chess.board.move('d8', 'd7')?.execute(); // capture the white bishop as the black queen
    Chaos.process();
    expect(Chess.stateTrackingComponent.getState().check).to.equal(false);
  });

  it.skip('Tracks castling status', function() {

  });

  it('Tracks half moves (moves since last pawn advance or capture', () => {
    const state = Chess.stateTrackingComponent.getState();
  });

  it('Tracks moves (in chess terminology, a move is when both players have taken their turn)', () => {
    const state = Chess.stateTrackingComponent.getState();
    expect(state.fullMove).to.equal(1); // Moves start at one, for some reason
    Chess.board.move('a2', 'a3')?.execute();
    Chaos.process();
    expect(state.fullMove).to.equal(1); // One player making a move is only a half move, so should still be one
    Chess.board.move('a7', 'a6')?.execute();
    Chaos.process();
    expect(state.fullMove).to.equal(2);
    Chess.board.move('a3', 'a4')?.execute();
    Chaos.process();
    Chess.board.move('a6', 'a5')?.execute();
    Chaos.process();
    expect(state.fullMove).to.equal(3);
    Chess.board.move('b2', 'b3')?.execute();
    Chaos.process();
    Chess.board.move('b7', 'b6')?.execute();
    Chaos.process();
    expect(state.fullMove).to.equal(4);
  });

  it.skip('Tracks checkmate', function() {

  });
});
