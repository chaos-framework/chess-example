import { Component, Reacter, Action, MoveAction, Team, Chaos } from '@chaos/core'

import MovementPermissionPriority from '../../Enums/MovementPermissionPriority';

// Allows for one piece to move per turn
export default class OneMovePerTurn extends Component implements Reacter {
  react(action: Action) {
    if (action instanceof MoveAction && action.tagged('playerMovement')) {
      
    }
  }
}