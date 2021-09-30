import { Action, Component, Modifier, MoveAction } from '@chaos/core';

import Chess from '../..';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';
import Teams from '../../Enums/Teams';
import Chessboard from '../../Worlds/Chessboard';

// Allows a pawn to move two spaces forward on it's first move, also applying the en passant component if successful
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
      const forward = Chess.teamDirections[teamName]
      const forwardTwoSquares = forward.multiply(2);
      const delta = to.subtract(target.position);
      // Check that the movement is only two squares directly forward
      if (delta.equals(forwardTwoSquares)) {
        action.permit({ priority: MovementPermissionPriority.ALLOWED });
        // Tag the location that en passant can happen
        action.metadata.set('en_passant', Chessboard.toAlgebraic(action.target.position.add(forward)));
        return;
      }
    }
  }

  // TODO add en_passant component and remove self if tagged moved_two_spaces

}
