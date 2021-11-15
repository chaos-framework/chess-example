import { expect } from 'chai';
import 'mocha';

import { Chaos } from '@chaos-framework/core';

import * as Chess from'../../src';
import StandardAI from '../../src/Components/Logical/StandardAI';
import { delay } from 'lodash';

describe('AI', function() {
  let whiteAI: StandardAI;
  let blackAI: StandardAI;
  beforeEach(() => {
    Chaos.reset();
    Chess.initialize();
    Chaos.process();
  });

  it('Can find the next move in a standard chess game', function() {
    this.timeout(4000);  // make sure test doesn't report warning for the AI taking some time to run
    // Add the components, in this case setting automatic movement to false
    whiteAI = new StandardAI(2); // 2 is intermediate level
    blackAI = new StandardAI(2);
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

  it("Can optionall react to its turn starting by moving a piece when a move is available", function() {
    this.timeout(4000);  // make sure test doesn't report warning for the AI taking some time to run
    Chess.teams['BLACK'].components.addComponent(new StandardAI(2, true));
    Chess.board.move('c2', 'c4')?.execute();
    const movedOnce = Array.from(Chess.board.entities.values()).find(e => 
      e.team?.name === 'BLACK' && e.metadata.get('moveCount') === 1 );
    expect(movedOnce).to.exist;
  });

  it("Can optionally delay taking its turn", async function() {
    this.timeout(1000);  // make sure test doesn't fail for waiting
    Chess.teams['BLACK'].components.addComponent(new StandardAI(2, true, 300));
    Chess.board.move('c2', 'c4')?.execute();
    let moved = Array.from(Chess.board.entities.values()).find(e => 
      e.team?.name === 'BLACK' && e.metadata.get('moveCount') === 1 );
    expect(moved).to.not.exist;
    await new Promise(resolve => setTimeout(resolve, 350));
    Chaos.process();
    moved = Array.from(Chess.board.entities.values()).find(e => 
      e.team?.name === 'BLACK' && e.metadata.get('moveCount') === 1 );
    expect(moved).to.exist;
    Chaos.process();
  });
});
