import { Action, Component, Game, Modifier, MoveAction } from '@chaos/core';

// Disallows movement if a piece is BETWEEN the target and it's destination 
export default class Collides extends Component implements Modifier {
  name = "Collides";

  modify(action: Action) {
    if (action instanceof MoveAction && action.target === this.parent && action.tagged('PLAYER_MOVEMENT')) {
      const { target, to } = action;
      if (target.world === undefined) {
        action.deny({ message: 'Target not on the board.' });
        return;
      }
      const lineIterator = target.position.getLineToIterable(to);
      // Pop the first space off
      lineIterator.next();
      // Iterate over rest
      for (const vector of lineIterator) {
        const entities = target.world.getEntitiesAtCoordinates(vector.x, vector.y);
        if(entities.length > 0 && lineIterator.next().value !== undefined) {
          action.deny({ message: 'Another piece is in the way!' });
          return;
        }
      }
    }
  }
}
