import { Component, EffectGenerator, Entity } from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";

export default class MovesOneSquareAnyDirection extends Component<Entity> {
  name = "Moves One Square in Any Direction";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  async *permitMovement(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    const delta = to.subtract(target.position);
    if (Math.abs(delta.x) <= 1 && Math.abs(delta.y) <= 1) {
      yield action.permit(MovementPermissionPriority.ALLOWED, {
        by: this,
      });
    }
  }
}
