import { Component, Action, Modifier, Reacter, MoveAction, Entity } from '@chaos/core';

import { isInCheck, movementWillResultInCheck } from '../Util/CheckQueries';
import MovementPermissionPriority from '../Enums/MovementPermissionPriority';
import Checked from './Checked';

// Stops friendly pieces from moving in a way that would check this piece, and applies Checked when done so by enemy
export default class Checkable extends Component implements Modifier, Reacter {
  name = 'Checkable';

  // Don't allow any friendly movement that would cause a check
  modify(action: Action) {
    if (action instanceof MoveAction
      && action.tagged('playerMovement')
      && action.target.world !== undefined
      && this.parent instanceof Entity
      && this.parent.world === action.target.world) {
      if (this.parent.team === action.target.team && movementWillResultInCheck(action.target.world, this.parent, action.target, action.to)) {
        action.deny({ priority: MovementPermissionPriority.DISALLOWED, message: `Movement would put ${this.parent.name} in check!`});
      }
    }
  }

  // Get put into check by enemy movement when appropriate
  react(action: Action) {
    if (action instanceof MoveAction
      && action.tagged('playerMovement')
      && !action.tagged('query') 
      && action.target.world !== undefined
      && this.parent instanceof Entity
      && this.parent.world === action.target.world) {
      // See if the parent entity is put in check by this movement
      if (!this.parent.has('Checked') && isInCheck(this.parent.world, this.parent)) {
        // Put in check
        action.followup(this.parent.attach({ component: new Checked, caster: action.target }));
      }
    }
  }
}
