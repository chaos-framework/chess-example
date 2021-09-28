import { expect } from 'chai';
import 'mocha';

import { Entity, Team, Vector } from '@chaos/core';

import Chess from '../../../src';
import Chessboard from '../../../src/Worlds/Chessboard';
import CannotLandOnTeam from '../../../src/Components/Movement/CannotLandOnTeam';
import Teams from '../../../src/Enums/Teams';

describe('Cannot land on friendly piece', () => {
  let piece: Entity;
  let friendly: Entity;
  let enemy: Entity;
  let movementComponent: CannotLandOnTeam;
  beforeEach(() => {
    const board = new Chessboard();
    const friendlyTeam = new Team();
    friendlyTeam._publish();
    const enemyTeam = new Team();
    enemyTeam._publish();
    piece = new Entity({ team: friendlyTeam });
    movementComponent = new CannotLandOnTeam();
    piece._attach(movementComponent);
    piece._publish(board, (Chessboard.fromAlgebraic('a1') as Vector));
    friendly = new Entity({ team: friendlyTeam });
    friendly._publish(board, (Chessboard.fromAlgebraic('a2') as Vector));
    enemy = new Entity({ team: enemyTeam });
    enemy._publish(board, (Chessboard.fromAlgebraic('b2') as Vector));
  });

  it('Disallows landing on friendly piece', () => {
    let movement = piece.move({ to: friendly.position, metadata: { playerMovement: true } });
    movementComponent.modify(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });

  it('Does not disallow landing on enemy piece', () => {
    let movement = piece.move({ to: enemy.position, metadata: { playerMovement: true } });
    movementComponent.modify(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.true;
  });

  it('Does not disallow landing on empty space', () => {
    let movement = piece.move({ to: (Chessboard.fromAlgebraic('b1') as Vector), metadata: { playerMovement: true } }).deniedByDefault();
    movementComponent.modify(movement);
    movement.decidePermission();
    expect(movement.permitted).to.be.false;
  });
});
