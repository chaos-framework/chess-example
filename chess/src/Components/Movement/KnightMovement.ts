import { Action, Component, EffectGenerator } from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";

// Allows for knight 2-1 movement
export default class KnightMovement extends Component {
  name = "Knight Movement";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  *permit(action: ChessMove): EffectGenerator {
    if (action instanceof ChessMove && action.target === this.parent) {
      const { target, to } = action;
      const delta = to.subtract(target.position).absolute();
      if (
        (delta.x === 1 && delta.y === 2) ||
        (delta.x === 2 && delta.y === 1)
      ) {
        action.permit({
          priority: MovementPermissionPriority.ALLOWED,
          by: this,
        });
      }
    }
  }
}
