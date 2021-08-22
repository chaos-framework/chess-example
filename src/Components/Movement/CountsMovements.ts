import { Action, Component, Reacter, MoveAction } from '@chaos/core';

// Forces a piece to move off its current tile if moving at all
export default class CountsMovements extends Component implements Reacter {
  name = "Has to Move At Least One Space";

  react(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('playerMovement')) {
      const current = action.target.metadata.get('moveCount');
      if(current !== undefined && typeof current === 'number') {
        action.target.metadata.set('moveCount', current + 1);
      }
    }
  }
}
