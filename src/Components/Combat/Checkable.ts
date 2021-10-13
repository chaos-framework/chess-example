import { Component, Action, MoveAction, Entity, PublishEntityAction } from '@chaos/core';

import { isInCheck, movementWillResultInCheck } from '../../Util/CheckQueries';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';
import Checked from './Checked';
import Chessboard from '../../Worlds/Chessboard';

// Stops friendly pieces from moving in a way that would check this piece, and applies Checked when done so by enemy
export default class Checkable extends Component {
  name = 'Checkable';

  // Don't allow any friendly movement that would cause a check
  permit(action: Action) {
    if (action instanceof MoveAction
      && action.tagged('playerMovement') && !action.tagged('query')
      && action.target.world !== undefined
      && this.parent instanceof Entity
      && this.parent.world === action.target.world) {
      if (this.parent.team === action.target.team && movementWillResultInCheck(action.target.world as Chessboard, this.parent, action.target, action.to)) {
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
      const piece = action.getEntity();
      if (piece instanceof Entity && piece.world === this.parent.world && piece.team !== this.parent.team) {
        if (
          ((action instanceof MoveAction && action.tagged('playerMovement')) ||
          (action instanceof PublishEntityAction)) && action.applied
        ) {
          // See if the parent entity is put in check by this movement
          if (!this.parent.has('Checked') && this.parent.world !== undefined && isInCheck(this.parent.world as Chessboard , this.parent)) {
            // Put in check
            const by = action instanceof MoveAction ? action.target : action.entity;
            action.followup(this.parent.attach({ component: new Checked(by), caster: action.target }));
          }
        }
      }
    }
  }
}
