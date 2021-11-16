import { expect } from 'chai';
import 'mocha';

import { Entity, Team, Vector } from '@chaos-framework/core';
import Chessboard from '../../../src/Worlds/Chessboard';
import MovesOneSquareForward from '../../../src/Components/Movement/MovesOneSquareForward';
import Teams from '../../../src/Enums/Teams';
import ChessMove from '../../../src/Actions/ChessMove';

describe('Pawn Movement -- Front Square', () => {
  let board: Chessboard;
  let pawn: Entity;
  let movementComponent: MovesOneSquareForward;
  beforeEach(() => {
    board = new Chessboard();
    pawn = new Entity({ team: new Team({ name: 'WHITE' }) });
    movementComponent = new MovesOneSquareForward();
    pawn._attach(movementComponent);
    pawn._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Allows movement forward one step', () => {
    let movement = new ChessMove(pawn, Chessboard.fromAlgebraic('b3')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
  });

  it('Does not give permission for movement backwards', () => {
    let movement = new ChessMove(pawn, Chessboard.fromAlgebraic('b1')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });

  it('Does not give permission for movement sideways', () => {
    let movement = new ChessMove(pawn, Chessboard.fromAlgebraic('c3')!);
    movementComponent.permit(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });
});
