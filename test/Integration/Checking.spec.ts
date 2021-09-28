import { expect } from 'chai';
import 'mocha';

import { Entity, Vector, MoveAction, Chaos } from '@chaos/core';

import Chess from '../../src';
import Chessboard from '../../src/Worlds/Chessboard';
import queen from '../../src/Entities/Pieces/Queen';
import King from '../../src/Entities/Pieces/King';
import Checked from '../../src/Components/Checked';
import Teams from '../../src/Enums/Teams';

describe('Checking', () => {
  beforeEach(() => { 
    Chess.reset();
  });

  describe('Pieces are put in check properly', () => {
    let board: Chessboard;
    let checkableKing: Entity;
    let friendlyQueen: Entity;
    let enemyQueen: Entity;
    beforeEach(() => {
      board = new Chessboard();
      checkableKing = King(Teams.WHITE);
      friendlyQueen = queen(Teams.WHITE);
      enemyQueen = queen(Teams.BLACK);
    });

    it('Checkable pieces are put in check if an enemy piece can capture it with one more move', () => {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c2')!);
      // Move into attacking position
      const movement = enemyQueen.move({ to: Chessboard.fromAlgebraic('c1')!, metadata: { playerMovement: true } }).execute(true);
      Chaos.process();
      // Expect the king to be checked
      expect(checkableKing.has('Checked')).to.be.true;
    });

    it('Pieces in check can escape it by moving to safety', () => {
      checkableKing._publish(board, Chessboard.fromAlgebraic('a1')!);
      friendlyQueen._publish(board, Chessboard.fromAlgebraic('b2')!);
      enemyQueen._publish(board, Chessboard.fromAlgebraic('c1')!);
      checkableKing._attach(new Checked);
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
      checkableKing._attach(new Checked);
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
      checkableKing._attach(new Checked);
      // Try to move in an unhelpful way
      const movement = friendlyQueen.move({ to: Chessboard.fromAlgebraic('b3')!, metadata: { playerMovement: true } });
      movement.execute();
      expect(movement.permitted).to.be.false;
    });
  });
});
