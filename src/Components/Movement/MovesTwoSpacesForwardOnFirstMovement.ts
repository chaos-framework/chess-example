import { Action, Component, Modifier, MoveAction } from '@chaos/core';

import Chess from '../..';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';
import Teams from '../../Enums/Teams';

export default class MovesTwoSpacesForwardOnFirstMovement extends Component implements Modifier {
  name = "Can Move Two Spaces Forward On First Movement";

  modify(action: Action) {
    if (action instanceof MoveAction &&
        action.target === this.parent &&
        action.tagged('playerMovement') &&
        action.target.metadata.get('moveCount') === 0) {
      const { target, to } = action;
      // Make sure the target has a team
      if (target.team === undefined) {
        return;
      }
      // Make sure the movement is "forward"
      const teamName = target.team.name as Teams;
      const forwardTwoSquares = Chess.teamDirections[teamName].multiply(2);
      const delta = to.subtract(target.position);
      // Check that the movement is only two square directly forward
      if (delta.equals(forwardTwoSquares)) {
        action.permit({ priority: MovementPermissionPriority.ALLOWED });
        return;
      }
    }
  }

}
