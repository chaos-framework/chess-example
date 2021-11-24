import { Action, Component } from '@chaos-framework/core';

import ChessMove from '../../Actions/ChessMove.js';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority.js';

export default class MovesOneSquareAnyDirection extends Component {
  name = "Moves One Square in Any Direction"

  permit(action: Action) {
    if (action instanceof ChessMove && action.target === this.parent) {
      const { target, to } = action;
      const delta = to.subtract(target.position);
      if (Math.abs(delta.x) <= 1 && Math.abs(delta.y) <= 1) {
        action.permit({ priority: MovementPermissionPriority.ALLOWED, by: this });
      }
    }
  }
}
