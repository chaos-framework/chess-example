import { Component, Action, Modifier, Reacter, MoveAction, Entity } from '@chaos/core';

import { isInCheck, movementWillResultInCheck } from '../Util/CheckQueries';
import MovementPermissionPriority from '../Enums/MovementPermissionPriority';
import Checked from './Checked';

// Stops friendly pieces from moving in a way that would check this piece, and applies Checked when done so by enemy
export default class Checkable extends Component implements Modifier, Reacter {
  name = 'Checkable';

  modify(action: Action) {
    if (action instanceof MoveAction
      && action.tagged('playerMovement')
      && action.target.world !== undefined
      && this.parent instanceof Entity
      && this.parent.world === action.target.world) {
      // Make sure neither parent entity nor friendly piece can put this piece in check
      const myTeam = this.parent.metadata.get('team');
      const moverTeam = action.target.metadata.get('team');
      if (myTeam === undefined || moverTeam === undefined) {
        return;
      }
      if (myTeam === moverTeam && movementWillResultInCheck(action.target.world, this.parent, action.target, action.to)) {
        action.deny({ priority: MovementPermissionPriority.DISALLOWED, message: `Movement would put ${this.parent.name} in check!`});
      }
    }
  }

  react(action: Action) {
    if (action instanceof MoveAction
      && action.tagged('playerMovement')
      && !action.tagged('query') 
      && action.target.world !== undefined
      && this.parent instanceof Entity) {
      // See if the parent entity is put in check by this movement
      if (movementWillResultInCheck(action.target.world, this.parent, action.target, action.to)) {
        // Put in check
        action.followup(this.parent.attach({ component: new Checked, caster: action.target }));
      }
    }
  }
}
