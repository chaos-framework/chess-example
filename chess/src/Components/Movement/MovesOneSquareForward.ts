import { Action, Component, MoveAction } from '@chaos-framework/core';

import * as Chess from'../../Chess.js';
import ChessMove from '../../Actions/ChessMove.js';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority.js';
import ChessTeam from '../../Enums/Teams.js';

export default class MovesOneSquareForward extends Component {
  name = "Moves One Square Forward"

  permit(action: Action) {
    if (action instanceof ChessMove && action.target === this.parent) {
      const { target, to } = action;
      // Make sure the target has a team
      if (target.team === undefined) {
        return;
      }
      const teamName = target.team.name as ChessTeam;
      // Make sure the movement is "forward"
      const delta = to.subtract(target.position);
      const forward = Chess.teamDirections[teamName];
      // Check that the movement is only one square directly "forward"
      if (delta.equals(forward)) {
        action.permit({ priority: MovementPermissionPriority.ALLOWED, by: this });
        return;
      }
    }
  }
}
