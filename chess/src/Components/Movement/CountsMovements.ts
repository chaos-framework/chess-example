import { Component, EffectGenerator } from "@chaos-framework/core";
import {
  ForAction,
  OnPhase,
  Successful,
  TargetsMe,
} from "@chaos-framework/stdlib";

import ChessMove from "../../Actions/ChessMove.js";

// Forces a piece to move off its current tile if moving at all
export default class CountsMovements extends Component {
  name = "Counts Movements";

  @OnPhase("react")
  @ForAction(ChessMove)
  @TargetsMe
  @Successful
  *countMovement(action: ChessMove): EffectGenerator {
    yield action.react(
      action.target.getProperty("Move Count")!.current.adjust({ amount: 1 })
    );
  }
}
