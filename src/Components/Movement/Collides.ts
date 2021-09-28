import { Action, Component, Modifier, MoveAction } from '@chaos/core';

import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

// Disallows movement if a piece is BETWEEN the target and its destination
export default class Collides extends Component implements Modifier {
  name = "Collides";

  modify(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('playerMovement')) {
      const { target, to } = action;
      if (target.world === undefined) {
        return;
      }
      const lineIterator = target.position.getLineToIterable(to);
      // Pop the first space off (occupied by parent piece)
      lineIterator.next();
      // Iterate over rest
      for (const vector of lineIterator) {
        const entities = target.world.getEntitiesAtCoordinates(vector.x, vector.y);
        if(entities.length > 0 && lineIterator.next().value !== undefined) {
          action.deny({ priority: MovementPermissionPriority.DISALLOWED, message: 'Another piece is in the way!' });
          return;
        }
      }
      action.permit({ priority: MovementPermissionPriority.ALLOWED });
    }
  }
}
