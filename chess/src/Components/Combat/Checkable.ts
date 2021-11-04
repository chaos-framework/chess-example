import { Component, Action, MoveAction, Entity, PublishEntityAction, LogicalAction } from '@chaos-framework/core';

import { isInCheck, movementWillResultInCheck } from '../../Util/CheckQueries';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';
import Checked from './Checked';
import Chessboard from '../../Worlds/Chessboard';

// Stops friendly pieces from moving in a way that would check this piece, and applies Checked when done so by enemy
export default class Checkable extends Component {
  name = 'Checkable';

  // Don't allow any friendly movement that would cause a check
  permit(action: Action) {
    let queryDepth = action.metadata.get('queryDepth');
    if (typeof queryDepth !== 'number') {
      queryDepth = 0;
    }
    if (action instanceof MoveAction
      && action.tagged('playerMovement') && queryDepth <= 1
      && action.target.world !== undefined
      && this.parent instanceof Entity
      && this.parent.world === action.target.world) {
        if (this.parent.team === action.target.team && movementWillResultInCheck(action.target.world as Chessboard, this.parent, action.target, action.to, queryDepth)) {
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
        if (
          ((action instanceof MoveAction && action.tagged('playerMovement')) ||
          (action instanceof PublishEntityAction)) && action.applied
        ) {
          // See if the parent entity is put in check by this movement
          if (!piece.has('Checked') && piece.world !== undefined && isInCheck(piece.world as Chessboard , piece)) {
            // Put in check
            const by = action instanceof MoveAction ? action.target : action.entity;
            action.followup(piece.attach({ component: new Checked(by), caster: action.target }));
          }
        }
      }
    }
  }
}
