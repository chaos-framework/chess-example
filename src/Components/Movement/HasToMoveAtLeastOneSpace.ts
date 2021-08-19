import { Action, Component, Modifier, MoveAction } from '@chaos/core';

import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

// Disallows movement if landing on your own piece
export default class CannotLandOnTeam extends Component implements Modifier {
  name = "Cannot Land On Team";

  modify(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('playerMovement')) {
      const { target, to } = action;
      if (target.position.equals(to)) {
        action.deny({ priority: MovementPermissionPriority.DISALLOWED, message: "A piece must move at least one space."})
      }
    }
  }
}
