import { Action, Event, ProcessEffectGenerator } from "@chaos-framework/core";

// Returns all events from array passed into constructor
export class SimpleEvent implements Event {
  index = 0;

  constructor(private actions: Action[]) {}

  async *run(): ProcessEffectGenerator {
    for (const action of this.actions) {
      yield action.asEffect();
    }
    return true;
  }
}
