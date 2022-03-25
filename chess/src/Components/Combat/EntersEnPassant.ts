import { Component, EffectGenerator } from "@chaos-framework/core";

import ChessMove from "../../Actions/ChessMove.js";
import Chessboard from "../../Worlds/Chessboard.js";
import EnPassant from "./EnPassant.js";
import {
  ForAction,
  OnPhase,
  Successful,
  TargetsMe,
} from "@chaos-framework/stdlib";
import { ChessPiece } from "../../Util/Types.js";

// Allows a pawn to move two spaces forward on it's first move, also applying the en passant component if successful
export default class VulnerableToEnPassant extends Component<ChessPiece> {
  name = "Vulnerable to En Passant";
  description =
    "Moving two spaces on the first turn will leave this piece vulnerable to en passant.";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  @Successful
  async *attachEnPassantComponent(action: ChessMove): EffectGenerator {
    const location = Chessboard.fromAlgebraic(
      (action.metadata.get("enPassantSpot") as string) || ""
    );
    if (location !== undefined) {
      action.react(this.parent!.attach({ component: new EnPassant(location) }));
    }
  }
}
