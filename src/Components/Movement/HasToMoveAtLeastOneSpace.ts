import { Action, Component, MoveAction } from '@chaos/core';

import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

// Forces a piece to move off its current tile if moving at all
export default class HasToMoveAtLeastOneSpace extends Component {
  name = "Has to Move At Least One Space";

  permit(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('playerMovement')) {
      const { target, to } = action;
      if (target.position.equals(to)) {
        action.deny({ priority: MovementPermissionPriority.DISALLOWED, message: "A piece must move at least one space."});
      }
    }
  }
}
