import { Action, Component, Modifier, MoveAction } from '@chaos/core';

import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

export default class MovesOrthogonally extends Component implements Modifier {
  name = 'Moves Orthogonally';

  modify(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('playerMovement')) {
      const { target, to } = action;
      if (target.position.isOrthogonalTo(to)) {
        action.permit({ priority: MovementPermissionPriority.ALLOWED });
      }
    }
  }
}