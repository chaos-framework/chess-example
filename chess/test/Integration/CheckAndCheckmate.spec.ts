import { expect } from 'chai';
import 'mocha';

import { Entity, Chaos, Team, Vector, MoveAction } from '@chaos-framework/core';

import * as Chess from'../../src';
import Chessboard from '../../src/Worlds/Chessboard';
import Queen from '../../src/Entities/Pieces/Queen';
import King from '../../src/Entities/Pieces/King';
import Checked from '../../src/Components/Combat/Checked';
import ChessMove from '../../src/Actions/ChessMove';

describe('Checking', function() {
  beforeEach(function() { 
    Chaos.reset();
  });

  describe('Pieces are put in check properly', function() {
    let board: Chessboard;
    let checkableKing: Entity;
    let friendlyQueen: Entity;
    let enemyQueen: Entity;
    beforeEach(function() {
      board = new Chessboard();
      const whiteTeam = new Team({ name: 'WHITE' });
      const blackTeam = new Team({ name: 'BLACK' });
      checkableKing = King(whiteTeam);
      friendlyQueen = Queen(whiteTeam);
      enemyQueen = Queen(blackTeam);
    });
    
    it('Checkable pieces are put in check if an enemy piece can capture it with one more move', function() {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c2')!);
      // Move into attacking position
      new ChessMove(enemyQueen, Chessboard.fromAlgebraic('c1')!).execute(true);
      // Expect the king to be checked
      expect(checkableKing.has('Checked')).to.be.true;
    });

    it('Pieces in check can escape it by moving to safety', function() {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c1')!);
      checkableKing._attach(new Checked(enemyQueen));
      // Move the king out of check
      new ChessMove(checkableKing, Chessboard.fromAlgebraic('a2')!).execute(true);
      // Expect the king to no longer be checked
      expect(checkableKing.has('Checked')).to.be.false;
    });

    it('Pieces in check can be saved by friendly pieces moving in the way', function() {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c1')!);
      checkableKing._attach(new Checked(enemyQueen));
      // Move the king out of check
      new ChessMove(friendlyQueen, Chessboard.fromAlgebraic('b1')!).execute(true);
      Chaos.process();
      // Expect the king to no longer be checked
      expect(checkableKing.has('Checked')).to.be.false;
    });

    it('Checkable pieces cannot move themselves into check', function() {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a2')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c1')!);
      // Try to move the king into check
      const movement = new ChessMove(checkableKing, Chessboard.fromAlgebraic('a1')!);
      movement.execute(true);
      expect(movement.permitted).to.be.false;
    });

    it('Pieces cannot move in a way that puts a friendly piece into check', function() {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b1')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c1')!);
      // Try to move in a dangerous way
      const movement = new ChessMove(friendlyQueen, Chessboard.fromAlgebraic('b2')!);
      movement.execute();
      expect(movement.permitted).to.be.false;
    });

    it('Friendly pieces can only move in a way that would break the check', function() {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c1')!);
      checkableKing._attach(new Checked(enemyQueen));
      // Try to move in an unhelpful way
      const movement = new ChessMove(friendlyQueen, Chessboard.fromAlgebraic('b3')!);
      movement.execute();
      expect(movement.permitted).to.be.false;
    });
  });
});

describe('Pieces are put in checkmate properly', function() {
  it('Puts pieces into checkmate when appropriate', function() {
    const board = new Chessboard();
    board.setupCustomGame(`
      kp.....p
      .p......
      ........
      ........
      .Q......
      ........
      ........
      ........
    `);
    board.move('b4', 'b3')?.execute(); // random movement
    Chaos.process();
    expect(board.pieceAt('a8')?.components.has('Checkmated')).to.be.false;
    board.move('h8', 'h7')?.execute();            // black movement that won't stop upcoming check
    Chaos.process();
    board.move('b3', 'a3')?.execute(); // king should not be able to leave
    Chaos.process();
    expect(board.pieceAt('a8')?.components.has('Checkmated')).to.be.true;
  });
});
