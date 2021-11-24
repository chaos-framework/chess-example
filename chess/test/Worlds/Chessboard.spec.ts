import { expect } from 'chai';
import 'mocha';

import { Vector } from '@chaos-framework/core';

import Chessboard from '../../src/Worlds/Chessboard.js';
import Tile from '../../src/Enums/Tile.js';

describe('Chessboard', () => {
  const board = new Chessboard();
  it('Initializes properly', () => {
    // Board is checkerboard
    expect(board.getTile(0, 0)).to.equal(Tile.WHITE);
    expect(board.getTile(0, 1)).to.equal(Tile.BLACK);
    expect(board.getTile(0, 7)).to.equal(Tile.BLACK);
    expect(board.getTile(7, 0)).to.equal(Tile.BLACK);
    expect(board.getTile(7, 1)).to.equal(Tile.WHITE);
    expect(board.getTile(7, 7)).to.equal(Tile.WHITE);
  });

  describe('Algebraic notation', () => {
    describe('Vector from algebraic', () => {
      it('Returns undefined if we pass bad strings', () => {
        expect(Chessboard.fromAlgebraic('')).to.be.undefined;
        expect(Chessboard.fromAlgebraic('aa')).to.be.undefined;
        expect(Chessboard.fromAlgebraic('11')).to.be.undefined;
        expect(Chessboard.fromAlgebraic('a0')).to.be.undefined;
        expect(Chessboard.fromAlgebraic('z9')).to.be.undefined;
      });

      it('Translates correctly', () => {
        expect((Chessboard.fromAlgebraic('a8') as Vector).equals(new Vector(0, 0))).to.be.true;
        expect((Chessboard.fromAlgebraic('a7') as Vector).equals(new Vector(0, 1))).to.be.true;
        expect((Chessboard.fromAlgebraic('a1') as Vector).equals(new Vector(0, 7))).to.be.true;
        expect((Chessboard.fromAlgebraic('b8') as Vector).equals(new Vector(1, 0))).to.be.true;
        expect((Chessboard.fromAlgebraic('b7') as Vector).equals(new Vector(1, 1))).to.be.true;
        expect((Chessboard.fromAlgebraic('c1') as Vector).equals(new Vector(2, 7))).to.be.true;
        expect((Chessboard.fromAlgebraic('h8') as Vector).equals(new Vector(7, 0))).to.be.true;
        expect((Chessboard.fromAlgebraic('h1') as Vector).equals(new Vector(7, 7))).to.be.true;
      });
    });

    describe('Vector from algebraic', () => {
      it('Returns undefined if we pass bad vectors', () => {
        expect(Chessboard.toAlgebraic(new Vector(8, 8))).to.be.undefined;
        expect(Chessboard.toAlgebraic(new Vector(0, 8))).to.be.undefined;
        expect(Chessboard.toAlgebraic(new Vector(8, 0))).to.be.undefined;
        expect(Chessboard.toAlgebraic(new Vector(50, 50))).to.be.undefined;
        expect(Chessboard.toAlgebraic(new Vector(-1, -1))).to.be.undefined;
      });

      it('Translates correctly', () => {
        expect(Chessboard.toAlgebraic(new Vector(0, 0))).to.equal('a8');
        expect(Chessboard.toAlgebraic(new Vector(0, 1))).to.equal('a7');
        expect(Chessboard.toAlgebraic(new Vector(1, 1))).to.equal('b7');
        expect(Chessboard.toAlgebraic(new Vector(7, 7))).to.equal('h1');
      });
    });
  });
});
