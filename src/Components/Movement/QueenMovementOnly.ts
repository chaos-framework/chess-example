import { Action, Component, Game, Modifier, MoveAction } from '@chaos/core';

// Disallows movements that a pawn shouldn't be able to make
export default class QueenMovementOnly extends Component implements Modifier {
  name = "Queen Movement Only"

  modify(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('PLAYER_MOVEMENT')) {
      const { target, to } = action;
      if(!target.position.isOrthogonalTo(to) && !target.position.isDiagonalTo(to)) {
        action.deny({ message: 'Can only move orthogonally or diagonally.'});
      }
    }
  }
}