import { expect } from 'chai';
import 'mocha';

import { Chaos } from '@chaos-framework/core';

import Chess from '../../src';
import StandardAI from '../../src/Components/Logical/StandardAI';

describe('AI', function() {
  let whiteAI: StandardAI;
  let blackAI: StandardAI;
  beforeEach(() => {
    Chaos.reset();
    Chess.initialize();
    Chaos.process();
  });

  it('Can find the next move in a standard chess game', function() {
    // Add the components, in this case setting automatic movement to false
    whiteAI = new StandardAI(2, false); // 2 is intermediate level
    blackAI = new StandardAI(2, false);
    Chess.teams['WHITE'].components.addComponent(whiteAI);
    Chess.teams['BLACK'].components.addComponent(blackAI);
    for (let i = 0; i < 3; i++) {
      let move = whiteAI.getAIMove();
      expect(move).to.not.be.undefined;
      Chess.board.move(move![0].toLowerCase(), move![1].toLowerCase())?.execute();
      Chaos.process();
      move = blackAI.getAIMove();
      expect(move).to.not.be.undefined;
      Chess.board.move(move![0].toLowerCase(), move![1].toLowerCase())?.execute();
      Chaos.process();
    }
  });

  it("Will react to it's team getting the turn by moving a piece when a move is available", function() {
    Chess.teams['BLACK'].components.addComponent(new StandardAI(2));
    Chess.board.move('c2', 'c4')?.execute();
    Chaos.process();
    const movedOnce = Array.from(Chess.board.entities.values()).find(e => 
      e.team?.name === 'BLACK' && e.metadata.get('moveCount') === 1 );
    expect(movedOnce).to.exist;
  });
});
