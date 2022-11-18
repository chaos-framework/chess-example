import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos-framework/core';

import Chessboard from '../../../src/Worlds/Chessboard.js';
import Collides from '../../../src/Components/Movement/Collides.js';
import ChessMove from '../../../src/Actions/ChessMove.js';
import { ChessPiece } from '../../Util/Types.js';

describe('Colliding with other pieces', () => {
  let board: Chessboard
  let piece: ChessPiece;
  let movementComponent: Collides;
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity({ metadata: { team: 'WHITE' }}) as ChessPiece;
    movementComponent = new Collides();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('b3') as Vector));
    new Entity({ metadata: { team: 'WHITE' }})._publish(board, (Chessboard.fromAlgebraic('c3') as Vector));
    new Entity({ metadata: { team: 'BLACK' }})._publish(board, (Chessboard.fromAlgebraic('d3') as Vector));
    new Entity({ metadata: { team: 'BLACK' }})._publish(board, (Chessboard.fromAlgebraic('e6') as Vector));
    new Entity({ metadata: { team: 'BLACK' }})._publish(board, (Chessboard.fromAlgebraic('a3') as Vector));
    new Entity({ metadata: { team: 'BLACK' }})._publish(board, (Chessboard.fromAlgebraic('b8') as Vector));
  });

  it('Does not deny a piece a move through open space', async function () {
    for (const position of ['b7', 'b1', 'a4']) {
      const movement = new ChessMove(piece, Chessboard.fromAlgebraic(position)!);
      const gen = movementComponent.collideWithTeam(movement);
      expect((await (await gen.next()).done)).to.be.true;
    }
  });

  it('Does not deny a piece from moving onto another piece at the end of a move through open space', async function () {
    for (const position of ['c3', 'a3', 'b8']) {
      const movement = new ChessMove(piece, Chessboard.fromAlgebraic(position)!);
      const gen = movementComponent.collideWithTeam(movement);
      expect((await (await gen.next()).done)).to.be.true;
    }
  });

  it('Stops a piece from moving through other pieces to get to destination', async function () {
    for (const position of ['d3', 'e3', 'f7']) {
      const movement = new ChessMove(piece, Chessboard.fromAlgebraic(position)!);
      const gen = movementComponent.collideWithTeam(movement);
      expect((await gen.next()).value?.[0]).to.equal("DENY");
    }
  });
});
