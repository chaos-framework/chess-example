import { Action, Component, MoveAction } from '@chaos-framework/core';
import ChessMove from '../../Actions/ChessMove';

import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

// Disallows movement if landing on your own piece
export default class CannotLandOnTeam extends Component {
  name = "Cannot Land On Team";

  permit(action: Action) {
    if (action instanceof ChessMove && action.target === this.parent) {
      const { target, to } = action;
      if (target.world === undefined) {
        return;
      }
      const entitiesAtLocation = target.world.getEntitiesAtCoordinates(to.x, to.y);
      for (const entity of entitiesAtLocation) {
        if (entity.team === target.team) {
          action.deny({
            priority: MovementPermissionPriority.DISALLOWED,
            message: "You cannot move onto your own piece.",
            by: this
          });
        }
      }
    }
  }
}
