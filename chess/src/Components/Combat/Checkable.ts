import { Component, Action, MoveAction, Entity, PublishEntityAction, LogicalAction } from '@chaos-framework/core';

import { isInCheck, movementWillResultInCheck } from '../../Util/CheckQueries';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';
import Checked from './Checked';
import Chessboard from '../../Worlds/Chessboard';
import ChessMove from '../../Actions/ChessMove';

// Stops friendly pieces from moving in a way that would check this piece, and applies Checked when done so by enemy
export default class Checkable extends Component {
  name = 'Checkable';

  // Don't allow any friendly movement that would cause a check
  permit(action: Action) {
    if (action instanceof ChessMove && action.target.world !== undefined
      && this.parent instanceof Entity
      && this.parent.world === action.target.world
      && action.queryDepth <= 1)
    {
      if (this.parent.team === action.target.team && movementWillResultInCheck(action.target.world, this.parent, action.target, action.to, action.queryDepth)) {
        action.deny({
          priority: MovementPermissionPriority.DISALLOWED,
          message: `Movement would put ${this.parent.name} in check!`,
          by: this
        });
      }
    }
  }

  // Get put into check by enemy movement when appropriate
  check(action: Action) {
    if (this.parent instanceof Entity) {
      const piece = this.parent;
      if (piece.world === piece.world && action.target?.team !== piece.team) {
        if ((action instanceof ChessMove || action instanceof PublishEntityAction) && action.applied) {
          // See if the parent entity is put in check by this movement
          if (!piece.has('Checked') && piece.world !== undefined && isInCheck(piece.world as Chessboard , piece)) {
            // Put in check
            const by = action instanceof MoveAction ? action.target : action.entity;
            const component = new Checked(by);
            action.followup(piece.attach({ component, caster: action.target })
              .withMessage(this.parent, 'was', component, 'by', by));
          }
        }
      }
    }
  }
}
