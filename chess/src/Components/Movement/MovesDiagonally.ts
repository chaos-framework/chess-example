import { Action, Component } from '@chaos-framework/core';

import ChessMove from '../../Actions/ChessMove.js';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority.js';

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
