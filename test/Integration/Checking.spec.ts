import { expect } from 'chai';
import 'mocha';

import { Entity, Chaos, Team } from '@chaos/core';

import Chess from '../../src';
import Chessboard from '../../src/Worlds/Chessboard';
import Queen from '../../src/Entities/Pieces/Queen';
import King from '../../src/Entities/Pieces/King';
import Checked from '../../src/Components/Combat/Checked';

describe('Checking', () => {
  beforeEach(() => { 
    Chaos.reset();
  });

  describe('Pieces are put in check properly', () => {
    let board: Chessboard;
    let checkableKing: Entity;
    let friendlyQueen: Entity;
    let enemyQueen: Entity;
    beforeEach(() => {
      board = new Chessboard();
      const whiteTeam = new Team({ name: 'WHITE' });
      const blackTeam = new Team({ name: 'BLACK' });
      checkableKing = King(whiteTeam);
      friendlyQueen = Queen(whiteTeam);
      enemyQueen = Queen(blackTeam);
    });

    it('Checkable pieces are put in check if an enemy piece can capture it with one more move', () => {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c2')!);
      // Move into attacking position
      enemyQueen.move({ to: Chessboard.fromAlgebraic('c1')!, metadata: { playerMovement: true } }).execute(true);
      Chaos.process();
      // Expect the king to be checked
      expect(checkableKing.has('Checked')).to.be.true;
    });

    it('Pieces in check can escape it by moving to safety', () => {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c1')!);
      checkableKing._attach(new Checked(enemyQueen));
      // Move the king out of check
      checkableKing.move({ to: Chessboard.fromAlgebraic('a2')!, metadata: { playerMovement: true } }).execute(true);
      Chaos.process();
      // Expect the king to no longer be checked
      expect(checkableKing.has('Checked')).to.be.false;
    });

    it('Pieces in check can be saved by friendly pieces moving in the way', () => {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c1')!);
      checkableKing._attach(new Checked(enemyQueen));
      // Move the king out of check
      friendlyQueen.move({ to: Chessboard.fromAlgebraic('b1')!, metadata: { playerMovement: true } }).execute(true);
      Chaos.process();
      // Expect the king to no longer be checked
      expect(checkableKing.has('Checked')).to.be.false;
    });

    it('Checkable pieces cannot move themselves into check', () => {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a2')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c1')!);
      // Try to move the king into check
      const movement = checkableKing.move({ to: Chessboard.fromAlgebraic('a1')!, metadata: { playerMovement: true } });
      movement.execute();
      expect(movement.permitted).to.be.false;
    });

    it('Pieces cannot move in a way that puts a friendly piece into check', () => {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b1')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c1')!);
      // Try to move in a dangerous way
      const movement = friendlyQueen.move({ to: Chessboard.fromAlgebraic('b2')!, metadata: { playerMovement: true } });
      movement.execute();
      expect(movement.permitted).to.be.false;
    });

    it('Friendly pieces can only move in a way that would break the check', () => {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c1')!);
      checkableKing._attach(new Checked(enemyQueen));
      // Try to move in an unhelpful way
      const movement = friendlyQueen.move({ to: Chessboard.fromAlgebraic('b3')!, metadata: { playerMovement: true } });
      movement.execute();
      expect(movement.permitted).to.be.false;
    });
  });
});
