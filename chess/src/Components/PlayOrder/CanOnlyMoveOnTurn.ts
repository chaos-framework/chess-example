import { Component, Action, MoveAction, Team, Chaos } from '@chaos-framework/core'

import ChessMove from '../../Actions/ChessMove';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

// Only allows player movement during the team's turn
export default class CanOnlyMoveOnTurn extends Component {
  permit(action: Action) {
    if (action instanceof ChessMove && action.target.team === this.parent && Chaos.currentTurn !== action.target.team) {
      action.deny({ priority: MovementPermissionPriority.DISALLOWED, message: `It's not this team's turn!`, by: this });
    }
  }
}
