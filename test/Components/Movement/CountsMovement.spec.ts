import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos/core';
import Chessboard from '../../../src/Worlds/Chessboard';
import CountsMovements from '../../../src/Components/Movement/CountsMovements';

describe('Counts Movements', () => {
  let board: Chessboard
  let piece: Entity;
  let movementComponent: CountsMovements;
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity();
    movementComponent = new CountsMovements();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Counts player movements', () => {
    piece.metadata.set('moveCount', 0);
    const movement = piece.move({ to: (Chessboard.fromAlgebraic('b3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.react(movement);
    expect(piece.metadata.get('moveCount')).to.equal(1);
    movementComponent.react(movement);
    expect(piece.metadata.get('moveCount')).to.equal(2);
    movementComponent.react(movement);
    expect(piece.metadata.get('moveCount')).to.equal(3);
  });

  it('Does not set moveCount on an entity that does not have it specified already', () => {
    const movement = piece.move({ to: (Chessboard.fromAlgebraic('b3') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.react(movement);
    expect(piece.metadata.get('moveCount')).to.be.undefined;
  });
});
