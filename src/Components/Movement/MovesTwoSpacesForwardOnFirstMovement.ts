import { Action, Component, Modifier, MoveAction } from '@chaos/core';

import { getForwardDirection } from '../../Util/Movement';

import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

export default class MovesTwoSpacesForwardOnFirstMovement extends Component implements Modifier {
  name = "Moves One Square Forward"

  modify(action: Action) {
    if (action instanceof MoveAction &&
        action.target === this.parent &&
        action.tagged('playerMovement') &&
        action.target.metadata.get('moveCount') === 0) {
      const { target, to } = action;
      const team = target.metadata.get('team');
      if(team === undefined || (team !== 'WHITE' && team !== 'BLACK')) {
        action.deny({ message: 'Cannot determine team of this piece.' });
        return;
      }
      // Make sure the movement is "forward"
      const delta = to.subtract(target.position);
      // Check that the movement is only two square directly forward
      if (delta.y === getForwardDirection(team) * 2 && delta.x === 0) {
        action.permit({ priority: MovementPermissionPriority.ALLOWED });
        return;
      }
    }
  }

}