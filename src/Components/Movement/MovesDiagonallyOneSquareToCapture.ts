import { Action, Component, Modifier, MoveAction } from '@chaos/core';

import Chess from '../..';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';
import Teams from '../../Enums/Teams';

export default class MovesDiagonallyOneSquareToCapture extends Component implements Modifier {
  name = "Moves Diagonally One Square To Capture"

  modify(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('playerMovement')) {
      const { target, to } = action;
      // Make sure the target has a team
      if(target.team === undefined || target.world === undefined) {
        return;
      }
      const teamName = target.team.name as Teams;
      // Make sure the movement is "forward"
      const delta = to.subtract(target.position);
      const forward = Chess.teamDirections[teamName];
      // Check that the movement is only one square on the two forward diagonals
      if (delta.dot(forward) >= 0 && Math.abs(delta.x) === 1 && Math.abs(delta.y) === 1) {
        // Check that an enemy is in that location
        for (const entity of target.world.getEntitiesAtCoordinates(to.x, to.y)) {
          if(entity.team !== target.team) {
            action.permit({ priority: MovementPermissionPriority.ALLOWED, by: this });
            return;
          }
        }
      }
    }
  }
}
