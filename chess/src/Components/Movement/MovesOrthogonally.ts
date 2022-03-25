import { Component, EffectGenerator, Entity } from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";

export default class MovesOrthogonally extends Component<Entity> {
  name = "Moves Orthogonally";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  async *permitMovement(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    if (target.position.isOrthogonalTo(to)) {
      yield action.permit(MovementPermissionPriority.ALLOWED, {
        by: this,
      });
    }
  }
}
