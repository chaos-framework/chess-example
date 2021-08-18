import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos/core';

import Chess from '../../../src';
import Chessboard from '../../../src/Worlds/Chessboard';
import CannotLandOnTeam from '../../../src/Components/Movement/CannotLandOnTeam';

describe('Cannot land on friendly piece', () => {
  let board: Chessboard
  let piece: Entity;
  let friendly: Entity;
  let movementComponent: CannotLandOnTeam;
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity({ metadata: { team: 'WHITE' } });
    movementComponent = new CannotLandOnTeam();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('a1') as Vector));
    friendly = new Entity({ metadata: { team: 'WHITE' } });
    piece._publish(board, (Chessboard.fromAlgebraic('a2') as Vector));
  });

  it('Disallows landing on friendly piece', () => {
    let movementOntoFriendly = piece.move({ to: (Chessboard.fromAlgebraic('a2') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(movementOntoFriendly);
    movementOntoFriendly.decidePermission();
    expect(movementOntoFriendly.permitted).to.be.false;
  });
});
