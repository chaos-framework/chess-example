import { Action, Component, MoveAction } from '@chaos/core';

import Chess from '../..';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';
import ChessTeam from '../../Enums/Teams';

export default class MovesOneSquareForward extends Component {
  name = "Moves One Square Forward"

  permit(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('playerMovement')) {
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
