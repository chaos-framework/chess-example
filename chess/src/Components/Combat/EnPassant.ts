import {
  ChangeTurnAction,
  Component,
  EffectGenerator,
  Scope,
  Vector,
} from "@chaos-framework/core";
import { ForAction, OnPhase } from "@chaos-framework/std-lib";
import { ChessPiece } from "../../Util/Types";

export default class EnPassant extends Component<ChessPiece> {
  name = "En Passant";
  description =
    "Vulnerable to capture from another pawn landing immediately behind this piece, but only for this enemy turn.";
  broadcast = true;

  constructor(public location: Vector) {
    super();
  }

  // Detach self when it's the parent's turn again
  @OnPhase("react", "game")
  @ForAction(ChangeTurnAction)
  async *detachAfterEnemyTurnEnds(action: ChangeTurnAction): EffectGenerator {
    if (action.target === this.parent!.team) {
      action.react(this.detach({ target: this.parent! }));
    }
  }
}
