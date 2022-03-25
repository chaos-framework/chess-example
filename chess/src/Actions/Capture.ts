import {
  Action,
  ActionParameters,
  EffectGenerator,
  Entity,
  ProcessEffectGenerator,
  TerminalMessage,
  Vector,
} from "@chaos-framework/core";
import { ChessPiece } from "../Util/Types.js";

import Chessboard from "../Worlds/Chessboard.js";

export default class Capture extends Action<ChessPiece, ChessPiece> {
  target!: ChessPiece;
  caster!: ChessPiece;

  constructor(
    public captured: ChessPiece,
    public by: ChessPiece,
    options: Omit<ActionParameters, "caster" | "target"> = {}
  ) {
    super({
      target: captured,
      caster: by,
      ...options,
    });
    this.addPermission(false);
  }

  async *apply(): ProcessEffectGenerator {
    const unpublishAction = this.target.unpublish({ caster: this.caster });
    yield this.react(unpublishAction);
    if (unpublishAction.applied) {
      yield this.react(
        this.caster.properties.get("Captures")!.current.adjust({ amount: 1 })
      );
    } else {
      console.log("For some reason the capture couldn't unpublish the piece..");
    }
    return true;
  }

  generateMessage() {
    this.terminalMessage = new TerminalMessage(
      this.caster,
      "captured",
      this.target,
      "at",
      Chessboard.toAlgebraic(this.target.position)
    );
    super.generateMessage();
  }
}
