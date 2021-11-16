import { expect } from 'chai';
import 'mocha';

import { Entity, Vector } from '@chaos-framework/core';

import Chessboard from '../../../src/Worlds/Chessboard';
import KnightMovement from '../../../src/Components/Movement/KnightMovement';
import ChessMove from '../../../src/Actions/ChessMove';

describe('Knight Movement', () => {
  let board: Chessboard
  let piece: Entity;
  let movementComponent: KnightMovement;
  beforeEach(() => {
    board = new Chessboard();
    piece = new Entity();
    movementComponent = new KnightMovement();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('d4') as Vector));
  });

  it('Allows a piece to move in any amount of 1 & 2 on each respective axis', () => {
    let movement = new ChessMove(piece, piece.position.add(new Vector(1, 2)));
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = new ChessMove(piece, piece.position.add(new Vector(-1, 2)));
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = new ChessMove(piece, piece.position.add(new Vector(1, -2)));
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = new ChessMove(piece, piece.position.add(new Vector(-1, -2)));
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = new ChessMove(piece, piece.position.add(new Vector(2, 1)));
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = new ChessMove(piece, piece.position.add(new Vector(-2, 1)));
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = new ChessMove(piece, piece.position.add(new Vector(2, -1)));
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
    movement = new ChessMove(piece, piece.position.add(new Vector(-2, -1)));
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
  });

});
