import { Action, Component, MoveAction } from '@chaos-framework/core';

import * as Chess from '../../Chess';
import ChessMove from '../../Actions/ChessMove';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';
import ChessTeam from '../../Enums/Teams';
import Chessboard from '../../Worlds/Chessboard';
import EnPassant from '../Combat/EnPassant';

// Allows a pawn to move two spaces forward on it's first move, also applying the en passant component if successful
export default class MovesTwoSpacesForwardOnFirstMovement extends Component {
  name = "Can Move Two Spaces Forward On First Movement";

  permit(action: Action) {
    if (action instanceof ChessMove && action.target === this.parent && action.target.metadata.get('moveCount') === 0) {
      const { target, to } = action;
      // Make sure the target has a team
      if (target.team === undefined) {
        return;
      }
      // Make sure the movement is "forward"
      const teamName = target.team.name as ChessTeam;
      const forward = Chess.teamDirections[teamName]
      const forwardTwoSquares = forward.multiply(2);
      const delta = to.subtract(target.position);
      // Check that the movement is only two squares directly forward
      if (delta.equals(forwardTwoSquares)) {
        action.permit({ priority: MovementPermissionPriority.ALLOWED, by: this });
        // Tag the location that en passant can happen
        action.metadata.set('en_passant', Chessboard.toAlgebraic(action.target.position.add(forward)));
        return;
      }
    }
  }

  react(action: Action) {
    const parent = this.getParentEntity();
    if (parent !== undefined && action.target == parent && action.tagged('en_passant') && action.applied) {
      const location = Chessboard.fromAlgebraic(action.metadata.get('en_passant') as string || '');
      if (location !== undefined) {
        action.react(parent.attach({ component: new EnPassant(location) }));
      }
    }
  }

}
