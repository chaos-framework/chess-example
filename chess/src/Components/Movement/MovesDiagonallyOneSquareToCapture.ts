import { Action, Component, MoveAction } from '@chaos-framework/core';

import Chess from '../..';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';
import ChessTeam from '../../Enums/Teams';
import EnPassant from '../Combat/EnPassant';

export default class MovesDiagonallyOneSquareToCapture extends Component {
  name = "Moves Diagonally One Square To Capture"

  permit(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('playerMovement')) {
      const { target, to } = action;
      // Make sure the target has a team
      if (target.team === undefined || target.world === undefined) {
        return;
      }
      const teamName = target.team.name as ChessTeam;
      // Make sure the movement is "forward"
      const delta = to.subtract(target.position);
      const forward = Chess.teamDirections[teamName];
      // Check that the movement is only one square on the two forward diagonals
      if (delta.dot(forward) >= 0 && Math.abs(delta.x) === 1 && Math.abs(delta.y) === 1) {
        for (const [id, entity] of target.world.entities) {
          if (entity.team !== target.team) {
            // Check if enemy is in that location or has an active en passant in the spot we're moving to
            if (entity.position.equals(action.to) || (entity.components.get('En Passant') as EnPassant)?.location.equals(action.to))
            action.permit({ priority: MovementPermissionPriority.ALLOWED, by: this });
            return;
          }
        }
      }
    }
  }
}
