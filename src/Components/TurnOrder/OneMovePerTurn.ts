import { Component, Reacter, Action, MoveAction, Team } from '@chaos/core'

// Allows for one piece to move per turn
export default class OneMovePerTurn extends Component implements Reacter {
  react(action: Action) {
    if (action instanceof MoveAction && action.tagged('playerMovement')) {
      // See if our team owns the moving piece
    }
  }
}