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

  it.skip('Tracks checkmate', function() {

  });
});
