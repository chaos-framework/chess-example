import { Action, Event} from '@chaos/core';

// Returns all events from array passed into constructor
export class SimpleEvent implements Event {
  index = 0;

  constructor(private actions: Action[]) { };

  getNextAction(previousAction?: Action): Action | undefined {
    if (this.actions.length > this.index) {
      return this.actions[this.index++];
    } else {
      return undefined;
    }
  }
}
