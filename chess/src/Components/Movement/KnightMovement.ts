import {
  Action,
  Component,
  EffectGenerator,
  Entity,
} from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";

// Allows for knight 2-1 movement
export default class KnightMovement extends Component<Entity> {
  name = "Knight Movement";
  description = "Can move 1 tile in one axis and 2 in another.";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  async *permitMovement(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    const delta = to.subtract(target.position).absolute();
    if ((delta.x === 1 && delta.y === 2) || (delta.x === 2 && delta.y === 1)) {
      yield action.permit(MovementPermissionPriority.ALLOWED, {
        by: this,
      });
    }
  }
}
