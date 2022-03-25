import { Component, EffectGenerator } from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

import ChessMove from "../../Actions/ChessMove.js";
import EnPassant from "./EnPassant.js";
import Capture from "../../Actions/Capture.js";
import { ChessPiece } from "../../Util/Types.js";

export default class CapturesEnPassant extends Component<ChessPiece> {
  name = "Captures En Passant";

  @OnPhase("capture")
  @ForAction(ChessMove)
  @TargetsMe
  async *captureEnPassant(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    for (const [, entity] of target.world.entities) {
      if (entity.team !== target.team) {
        if (
          (entity.components.get("En Passant") as EnPassant)?.location.equals(
            to
          )
        ) {
          yield action.followup(
            new Capture(entity as ChessPiece, this.parent!)
          );
        }
      }
    }
  }
}
