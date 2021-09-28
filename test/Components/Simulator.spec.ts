import { expect } from 'chai';
import 'mocha';

import { Entity, Vector, MoveAction, Chaos } from '@chaos/core';

import Simulator from '../../src/Components/Logical/Simulator';
import Chessboard from '../../src/Worlds/Chessboard';

describe('Simulating in third-party engine', () => {
  let simulator: Simulator; 
  beforeEach(() => {
    simulator = new Simulator();
  });

  it('Can move pieces within the simulator', () => {
    // Move a pawn forward two places
    simulator.move(Chessboard.fromAlgebraic('a2'), Chessboard.fromAlgebraic('a4'));
    expect(simulator.engine.game.board.getSquare('a4').piece).to.exist;
  });

  it('Will throw an error if a move is impossible by standard chess rules', () => {
    // Move a pawn forward two places
    let e;
    try {
      simulator.move(Chessboard.fromAlgebraic('a2'), Chessboard.fromAlgebraic('d7'));
    } catch (error) {
      e = error;
    }
    expect(e).to.exist;
  });

  it('Reacts to movements with the appropriate updates', () => {
    const target = new Entity({ name: 'White Pawn' });
    target.position = Chessboard.fromAlgebraic('a2')!;
    const movement = new MoveAction({ target, to: Chessboard.fromAlgebraic('a4')!, metadata: { playerMovement: true } });
    simulator.react(movement);
    expect(simulator.engine.game.board.getSquare('a4').piece).to.exist;
  });
});
