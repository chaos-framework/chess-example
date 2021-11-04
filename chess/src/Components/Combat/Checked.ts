import { Component, Action, MoveAction, Entity, AttachComponentAction, LogicalAction } from '@chaos-framework/core';

import { isInCheck, isInCheckmate, movementWillResultInCheck } from '../../Util/CheckQueries';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';
import Chessboard from '../../Worlds/Chessboard';
import Checkmated from './Checkmated';

export default class Checked extends Component {
  name = 'Checked';
  description = 'Can be put in check by an enemy piece';

  constructor(public by: Entity) {
    super();
  }

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
      if (movingTeam === myTeam && movementWillResultInCheck(action.target.world as Chessboard, this.parent, action.target, action.to)) {
        // Only allow movement if this gets us out of check
        action.deny({
          priority: MovementPermissionPriority.DISALLOWED,
          message: `Movement will not get ${this.parent.name} out of check!`,
          by: this
        });
      }
    }
  }

  check(action: Action) {
    // Check for checkmate when applied
    if (action instanceof AttachComponentAction && action.component === this) {
      // See if we're in checkmate
      if(isInCheckmate(action.target.world! as Chessboard, action.target, this.by)) {
        action.react(new AttachComponentAction({ caster: this.by, target: action.target, component: new Checkmated }));
      }
    }
    // Remove self if the piece is out of check
    if (action instanceof MoveAction &&
        this.parent instanceof Entity &&
        action.target.world !== undefined) {
      if (!isInCheck(action.target.world as Chessboard, this.parent)) {
        action.react(this.parent.detach({ component: this }));
      }
    }
  }
}
