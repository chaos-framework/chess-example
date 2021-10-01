import { expect } from 'chai';
import 'mocha';

import { Entity, Chaos, Team, Vector } from '@chaos/core';

import Pawn from '../../src/Entities/Pieces/Pawn';
import Chessboard from '../../src/Worlds/Chessboard';
import King from '../../src/Entities/Pieces/King';

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
    pawn.move({ to: queeningSquare, metadata: { playerMovement: true } }).execute();
    Chaos.process();
    expect(pawn.published).to.be.false;
    const queen = board.getEntitiesAtCoordinates(queeningSquare.x, queeningSquare.y)[0];
    expect(queen).to.exist;
    expect(queen.team).to.equal(team);
  });

  it('Queens will put a king in check when they replace a pawn', () => {
    const king = King(new Team({ name: 'BLACK' }));
    king._publish(board, Chessboard.fromAlgebraic('e8')!);
    pawn.move({ to: queeningSquare, metadata: { playerMovement: true } }).execute();
    Chaos.process();
    expect(king.has('Checked')).to.be.true;
  });
});
