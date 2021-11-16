import { Action, Component, MoveAction } from '@chaos-framework/core';

import ChessMove from '../../Actions/ChessMove';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

export default class MovesDiagonally extends Component {
  name = 'Moves Diagonally';

  permit(action: Action) {
    if (action instanceof ChessMove && action.target === this.parent) {
      const { target, to } = action;
      if (target.position.isDiagonalTo(to)) {
        action.permit({ priority: MovementPermissionPriority.ALLOWED, by: this });
      }
    }
  }
}
