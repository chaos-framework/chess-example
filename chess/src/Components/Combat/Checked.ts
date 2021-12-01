import { Component, Action, Entity, AttachComponentAction } from '@chaos-framework/core';

import { isInCheck, isInCheckmate, movementWillResultInCheck } from '../../Util/CheckQueries.js';
import MovementPermissionPriority from '../../Enums/MovementPermissionPriority.js';
import Checkmated from './Checkmated.js';
import ChessMove from '../../Actions/ChessMove.js';

export default class Checked extends Component {
  name = 'Checked';
  description = 'Can be put in check by an enemy piece.js';
  broadcast = true;

  constructor(public by: Entity) {
    super();
  }

  // Do not allow team movement that does not remove check
  permit(action: Action) {
    if (action instanceof ChessMove && action.target.world !== undefined) {
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
      if (movingTeam === myTeam && movementWillResultInCheck(action.target.world, this.parent, action.target, action.to)) {
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
      if(isInCheckmate(action.target.world!, action.target, this.by)) {
        const component = new Checkmated;
        action.react(new AttachComponentAction({ caster: this.by, target: action.target, component })
          .withMessage(this.parent as Entity, 'was', component));
      }
    }
    // Remove self if the piece is out of check
    if (action instanceof ChessMove &&
        this.parent instanceof Entity &&
        action.target.world !== undefined) {
      if (!isInCheck(action.target.world, this.parent)) {
        action.react(this.parent.detach({ component: this }));
      }
    }
  }
}
