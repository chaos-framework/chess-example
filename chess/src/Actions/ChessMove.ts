import {
  ActionParameters,
  Entity,
  MoveAction,
  TerminalMessage,
  Vector,
} from "@chaos-framework/core";
import { ChessPiece } from "../Util/Types.js";

import Chessboard from "../Worlds/Chessboard.js";

export default class ChessMove extends MoveAction {
  enPassant = false;
  attacking?: ChessPiece;
  captured?: ChessPiece;

  constructor(
    public target: ChessPiece,
    to: string | Vector,
    public queryDepth = 0,
    options: ActionParameters = {}
  ) {
    super({
      target,
      to:
        to instanceof Vector
          ? to
          : Chessboard.fromAlgebraic(to) || new Vector(0, 0),
      ...options,
    });
    this.addPermission(false);
  }

  generateMessage() {
    if (this.captured !== undefined) {
      this.terminalMessage = new TerminalMessage(
        this.target,
        "at",
        Chessboard.toAlgebraic(this.from),
        "captured",
        this.captured,
        "at",
        Chessboard.toAlgebraic(this.to) || "a strange place"
      );
    } else {
      this.terminalMessage = new TerminalMessage(
        this.target,
        "at",
        Chessboard.toAlgebraic(this.from) || "a strange place",
        "moved to",
        Chessboard.toAlgebraic(this.to) || "a strange place"
      );
    }
    super.generateMessage();
  }
}
