import { expect } from 'chai';
import 'mocha';

import { Entity, Chaos, Team, Vector } from '@chaos-framework/core';

import Pawn from '../../src/Entities/Pieces/Pawn.js';
import Chessboard from '../../src/Worlds/Chessboard.js';
import King from '../../src/Entities/Pieces/King.js';
import ChessMove from '../../src/Actions/ChessMove.js';

describe('Queening', () => {
  let board: Chessboard;
  let pawn: Entity;
  let team: Team;
  let queeningSquare: Vector;
  beforeEach(() => {
    Chaos.reset;
    board = new Chessboard();
    queeningSquare = Chessboard.fromAlgebraic('b8')!;
    team = new Team({ name: 'WHITE' });
    pawn = Pawn(team);
    pawn._publish(board, Chessboard.fromAlgebraic('b7')!);
  });

  it('Pawns are replaced with queens when they reach the edge of the board', () => {
    new ChessMove(pawn, queeningSquare).execute();
    expect(pawn.published).to.be.false;
    const queen = board.getEntitiesAtCoordinates(queeningSquare.x, queeningSquare.y)[0];
    expect(queen).to.exist;
    expect(queen.team).to.equal(team);
  });

  it('Queens will put a king in check when they replace a pawn', () => {
    const king = King(new Team({ name: 'BLACK' }));
    king._publish(board, Chessboard.fromAlgebraic('e8')!);
    new ChessMove(pawn, queeningSquare).execute();
    Chaos.processor.process();
    expect(king.has('Checked')).to.be.true;
  });
});
