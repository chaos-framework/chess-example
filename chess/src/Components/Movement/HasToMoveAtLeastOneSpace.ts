import {
  Component,
  EffectGenerator,
  Entity,
  TerminalMessage,
} from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/std-lib";

import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";

// Forces a piece to move off its current tile if moving at all
export default class HasToMoveAtLeastOneSpace extends Component<Entity> {
  name = "Has to Move At Least One Space";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  async *permitMovement(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    if (target.position.equals(to)) {
      yield action.deny(MovementPermissionPriority.DISALLOWED, {
        message: new TerminalMessage("A piece must move at least one space."),
        by: this,
      });
    }
  }
}
