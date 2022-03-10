import { Action, Component, EffectGenerator } from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";

// Forces a piece to move off its current tile if moving at all
export default class HasToMoveAtLeastOneSpace extends Component {
  name = "Has to Move At Least One Space";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  *permit(action: ChessMove): EffectGenerator {
    if (action instanceof ChessMove && action.target === this.parent) {
      const { target, to } = action;
      if (target.position.equals(to)) {
        action.deny({
          priority: MovementPermissionPriority.DISALLOWED,
          message: "A piece must move at least one space.",
          by: this,
        });
      }
    }
  }
}
