import {
  Action,
  ChangeTurnAction,
  Component,
  EffectGenerator,
  Team,
} from "@chaos-framework/core";

import Capture from "../../Actions/Capture.js";
import ChessMove from "../../Actions/ChessMove.js";
import Piece from "../../Enums/Piece.js";
import { OnPhase, Successful } from "@chaos-framework/std-lib";

// Stores some basic state for use with any third-party chess engines / AIs
export default class MoveCounter extends Component {
  name = "Move Counter";
  public = false;

  pawnMovementOrCaptureThisTurn = false;
  halfMoves = 0;
  fullMoves = 0;

  @OnPhase("updateState", "game")
  @Successful
  async *updateState(action: Action): EffectGenerator {
    if (
      action instanceof ChangeTurnAction &&
      action.target instanceof Team
    ) {
      if (action.target.name === "WHITE") {
        this.fullMoves += 1;
      }
      if (!this.pawnMovementOrCaptureThisTurn) {
        this.halfMoves += 1;
      } else {
        this.pawnMovementOrCaptureThisTurn = false;
      }
    }
    // Track anything that would reset the half move counter
    else if (
      (action instanceof ChessMove &&
        action.target.metadata.get("type") === Piece.PAWN) ||
      action instanceof Capture
    ) {
      this.pawnMovementOrCaptureThisTurn = true;
      this.halfMoves = 0;
    }
  }
}
