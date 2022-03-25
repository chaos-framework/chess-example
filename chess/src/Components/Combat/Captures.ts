import { Component, EffectGenerator, Entity } from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

import Capture from "../../Actions/Capture.js";
import ChessMove from "../../Actions/ChessMove.js";
import { ChessPiece } from "../../Util/Types.js";

// Captures when landing on an enemy piece
export default class Captures extends Component<ChessPiece> {
  name = "Captures";
  broadcast = true;

  @OnPhase("react")
  @ForAction(ChessMove)
  @TargetsMe
  async *capture(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    // Loop over all pieces in that location (note that this now includes the parent itself)
    for (const entity of target.world!.getEntitiesAtCoordinates(to.x, to.y)) {
      if (entity.team !== target.team && entity.team !== undefined) {
        yield action.react(new Capture(this.parent as ChessPiece, target));
      }
    }
  }
}
