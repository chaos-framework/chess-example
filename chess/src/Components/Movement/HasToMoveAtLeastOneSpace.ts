import { Action, Component } from '@chaos-framework/core';

import ChessMove from '../../Actions/ChessMove.js';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority.js';

// Forces a piece to move off its current tile if moving at all
export default class HasToMoveAtLeastOneSpace extends Component {
  name = "Has to Move At Least One Space";

  permit(action: Action) {
    if (action instanceof ChessMove && action.target === this.parent) {
      const { target, to } = action;
      if (target.position.equals(to)) {
        action.deny({ 
          priority: MovementPermissionPriority.DISALLOWED,
          message: 'A piece must move at least one space.',
          by: this
        });
      }
    }
  }
}
