import { Component, EffectGenerator, Entity } from "@chaos-framework/core";
import {
  ForAction,
  OnPhase,
  Successful,
  TargetsMe,
} from "@chaos-framework/std-lib";

import ChessMove from "../../Actions/ChessMove.js";

// Forces a piece to move off its current tile if moving at all
export default class CountsMovements extends Component<Entity> {
  name = "Counts Movements";

  @OnPhase("react")
  @ForAction(ChessMove)
  @TargetsMe
  @Successful
  async *count(action: ChessMove): EffectGenerator {
    yield action.react(
      action.target.getProperty("Move Count").current.adjust({ amount: 1 })
    );
  }
}
