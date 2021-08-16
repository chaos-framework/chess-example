import { Action, Component, Modifier, MoveAction } from '@chaos/core';

import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

// Disallows movements that a pawn shouldn't be able to make
export default class MovesDiagonally extends Component implements Modifier {
  name = 'Moves Diagonally';

  modify(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('playerMovement')) {
      const { target, to } = action;
      if(target.position.isDiagonalTo(to)) {
        action.permit({ priority: MovementPermissionPriority.ALLOWED });
      }
    }
  }
}