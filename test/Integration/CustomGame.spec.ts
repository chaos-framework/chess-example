import { expect } from 'chai';
import 'mocha';

import { Chaos } from '@chaos/core';
import Chessboard from '../../src/Worlds/Chessboard';

describe('Chessboard custom game setup from string', function() {
  this.beforeEach(function() {
    Chaos.reset();
  });

  it('Can set up a chessboard from a string layout notation', function() {
    const board = new Chessboard();
    board.setupCustomGame(`
      pPpPpPpP
      ........
      ........
      ........
      ........
      ........
      ........
      qqqqQBKR
    `);
    expect(board.pieceAt('a1')?.name).to.equal('BLACK Queen');
    expect(board.pieceAt('a8')?.name).to.equal('BLACK Pawn');
    expect(board.pieceAt('h1')?.name).to.equal('WHITE Rook');
    expect(board.pieceAt('h8')?.name).to.equal('WHITE Pawn');
    expect(board.pieceAt('e4')?.name).to.be.undefined;
  });
});