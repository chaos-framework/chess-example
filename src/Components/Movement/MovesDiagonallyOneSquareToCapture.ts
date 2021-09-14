import { Action, Component, Modifier, MoveAction } from '@chaos/core';

import { getForwardDirection } from '../../Util/Movement';

import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

export default class MovesOneSquareForward extends Component implements Modifier {
  name = "Moves One Square Forward"

  modify(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('playerMovement')) {
      const { target, to } = action;
      const team = target.metadata.get('team');
      if(team === undefined || (team !== 'WHITE' && team !== 'BLACK')) {
        action.deny({ priority: 4, message: 'Cannot determine team of this piece.' });
        return;
      }
      // Make sure the movement is "forward"
      const delta = to.subtract(target.position);
      // Check that the movement is only one square on the two forward diagonals
      if (delta.y === getForwardDirection(team) && Math.abs(delta.y) === 1 && Math.abs(delta.x) === 1) {
        // Make sure it's only diagonal if capturing an enemy peice
        const board = target.world;
        if(board !== undefined) {
          const entityAtDestination = board.getEntitiesAtCoordinates(to.x, to.y)[0];
          if(entityAtDestination !== undefined && entityAtDestination.metadata.get('team') !== team) {
            action.permit({ priority: MovementPermissionPriority.ALLOWED });
          }
        }
      }
    }
  }
}
