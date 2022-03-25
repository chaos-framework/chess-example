import {
  Entity,
  Component,
  EffectGenerator,
  TerminalMessage,
} from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";

// Disallows movement if a piece is BETWEEN the target and its destination
export default class Collides extends Component<Entity> {
  name = "Collides";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  async *collideWithTeam(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    const lineIterator = target.position.getLineToIterable(to);
    // Pop the first space off (occupied by parent piece)
    lineIterator.next();
    // Iterate over rest
    for (const vector of lineIterator) {
      const entities = target.world.getEntitiesAtCoordinates(
        vector.x,
        vector.y
      );
      if (entities.length > 0 && lineIterator.next().value !== undefined) {
        yield action.deny(MovementPermissionPriority.DISALLOWED, {
          message: new TerminalMessage("Another piece is in the way!"),
          by: this,
        });
        break;
      }
    }
  }
}
