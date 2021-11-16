import { Action, Component, MoveAction } from '@chaos-framework/core';

import ChessMove from '../../Actions/ChessMove';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

export default class MovesOrthogonally extends Component {
  name = 'Moves Orthogonally';

  permit(action: Action) {
    if (action instanceof ChessMove && action.target === this.parent) {
      const { target, to } = action;
      if (target.position.isOrthogonalTo(to)) {
        action.permit({ priority: MovementPermissionPriority.ALLOWED, by: this });
      }
    }
  }
}