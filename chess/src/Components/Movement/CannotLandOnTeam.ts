import {
  Component,
  EffectGenerator,
  Entity,
  TerminalMessage,
} from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";

// Disallows movement if landing on your own piece
export default class CannotLandOnTeam extends Component<Entity> {
  name = "Cannot Land On Team";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  async *dontLandOnTeam(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    const entitiesAtLocation = target.world.getEntitiesAtCoordinates(
      to.x,
      to.y
    );
    for (const entity of entitiesAtLocation) {
      if (entity.team === target.team) {
        yield action.deny(MovementPermissionPriority.DISALLOWED, {
          message: new TerminalMessage("You cannot move onto your own piece."),
          by: this,
        });
      }
    }
  }
}
