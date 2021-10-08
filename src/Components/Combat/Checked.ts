import { Component, Action, MoveAction, Entity } from '@chaos/core';

import { isInCheck, movementWillResultInCheck } from '../../Util/CheckQueries';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

export default class Checked extends Component {
  name = 'Checked';
  
  // Do not allow team movement that does not remove check
  permit(action: Action) {
    if (action instanceof MoveAction && action.tagged('playerMovement') && action.target.world !== undefined) {
      // Make sure we belong to a team
      if (!(this.parent instanceof Entity) || this.parent.world === undefined || this.parent.world !== action.target.world) {
        return;
      }
      // Get this piece's team
      const myTeam = this.parent.metadata.get('team');
      if (myTeam === undefined) {
        return;
      }
      const movingTeam = action.target.metadata.get('team');
      if (movingTeam === myTeam && movementWillResultInCheck(action.target.world, this.parent, action.target, action.to)) {
        // Only allow movement if this gets us out of check
        action.deny({
          priority: MovementPermissionPriority.DISALLOWED,
          message: `Movement will not get ${this.parent.name} out of check!`,
          by: this
        });
      }
    }
  }

  // Remove self if the piece is out of check
  combat(action: Action) {
    if (action instanceof MoveAction &&
        this.parent instanceof Entity &&
        action.target.world !== undefined) {
      if (!isInCheck(action.target.world, this.parent)) {
        action.followup(this.parent.detach({ component: this }));
      }
    }
  }
}
