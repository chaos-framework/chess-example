import {
  Component,
  Chaos,
  EffectGenerator,
  TerminalMessage,
  Team,
} from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";

// Only allows player movement during the team's turn
export default class CanOnlyMovePiecesOnTurn extends Component<Team> {
  name = "Can Only Move On Turn";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  async *onlyAllowMovementOnTurn(action: ChessMove): EffectGenerator {
    if (Chaos.currentTurn !== action.target.team) {
      action.deny(MovementPermissionPriority.NOT_TEAMS_TURN, {
        message: new TerminalMessage(`It's not this team's turn!`),
        by: this,
      });
    }
  }
}
