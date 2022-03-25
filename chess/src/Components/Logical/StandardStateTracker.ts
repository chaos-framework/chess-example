import {
  Action,
  AttachComponentAction,
  ChangeTurnAction,
  Component,
  DetachComponentAction,
  EffectGenerator,
  Team,
} from "@chaos-framework/core";

import * as Chess from "../../Chess.js";
import Capture from "../../Actions/Capture.js";
import ChessMove from "../../Actions/ChessMove.js";
import Piece from "../../Enums/Piece.js";
import Chessboard from "../../Worlds/Chessboard.js";
import Checked from "../Combat/Checked.js";
import Checkmated from "../Combat/Checkmated.js";
import EnPassant from "../Combat/EnPassant.js";
import { OnPhase, Successful } from "@chaos-framework/stdlib";

// Stores some basic state for use with any third-party chess engines / AIs
export default class StandardStateTracker extends Component {
  name = "Standard Chess State Tracker";

  pawnMovementOrCaptureThisTurn = false;

  @OnPhase("updateState", "game")
  @Successful
  async *updateState(action: Action): EffectGenerator {
    // Track check being applied or removed
    if (
      action instanceof AttachComponentAction &&
      action.component instanceof Checked
    ) {
      Chess.state.check = true;
    } else if (
      action instanceof DetachComponentAction &&
      action.component instanceof Checked
    ) {
      Chess.state.check = false;
    }
    // Track checkmate
    else if (
      action instanceof AttachComponentAction &&
      action.component instanceof Checkmated
    ) {
      Chess.state.checkMate = true;
    }
    // Check en passant being applied or removed
    else if (
      action instanceof AttachComponentAction &&
      action.component instanceof EnPassant
    ) {
      Chess.state.enPassant = Chessboard.toAlgebraic(
        action.component.location
      ) as string;
    } else if (
      action instanceof DetachComponentAction &&
      action.component instanceof EnPassant
    ) {
      Chess.state.enPassant = null;
    }
    // Cache current turn (white or black) and count full moves and half moves
    else if (
      action instanceof ChangeTurnAction &&
      action.target instanceof Team
    ) {
      if (action.target.name === "WHITE") {
        Chess.state.fullMove += 1;
        Chess.state.turn = "white";
      } else {
        Chess.state.turn = "black";
      }
      if (!this.pawnMovementOrCaptureThisTurn) {
        Chess.state.halfMove += 1;
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
      Chess.state.halfMove = 0;
    }
  }
  // TODO castling
}
