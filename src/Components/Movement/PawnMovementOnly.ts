import { Action, Component, Game, Modifier, MoveAction } from '@chaos/core';

import { getForwardDirection } from '../../Util/Movement';
import { getTeamFromTag } from '../../Util/Peices';

// Disallows movements that a pawn shouldn't be able to make
export default class PawnMovementOnly extends Component implements Modifier {
  name = "Pawn Movement Only"

  modify(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('PLAYER_MOVEMENT')) {
      const { target, to } = action;
      const team = getTeamFromTag(target);
      if(team === undefined) {
        action.deny({ message: 'Cannot determine team of this piece.' });
        return;
      }
      // Make sure the movement is "forward"
      const delta = to.subtract(target.position);
      // Check that the movement is one of three squares in "front" of the pawn
      if (delta.y !== getForwardDirection(team)) {
        action.deny({ message: 'Needs to move forward.' });
        return;
      }
      // Make sure not too far to side
      if (Math.abs(delta.x) > 1) {
        action.deny({ message: 'Too far to the side!' });
        return;
      }
      // Make sure it's only diagonal if capturing an enemy peice
      if (Math.abs(delta.x) === 1) {
        const board = target.world;
        if(board === undefined) {
          action.deny({ message: 'Piece is not published / not on a board.' });
          return;
        }
        const entityAtDestination = board.getEntitiesAtCoordinates(to.x, to.y)[0];
        if(entityAtDestination === undefined || getTeamFromTag(entityAtDestination) === team) {
          action.deny({ message: 'You can only move diagonally to capture an enemy piece.' })
          return;
        }
      }
    }
  }

}