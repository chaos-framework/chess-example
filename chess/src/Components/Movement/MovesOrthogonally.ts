import { Action, Component, MoveAction } from '@chaos-framework/core';

import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

export default class MovesOrthogonally extends Component {
  name = 'Moves Orthogonally';

  permit(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('playerMovement')) {
      const { target, to } = action;
      if (target.position.isOrthogonalTo(to)) {
        action.permit({ priority: MovementPermissionPriority.ALLOWED, by: this });
      }
    }
  }
}