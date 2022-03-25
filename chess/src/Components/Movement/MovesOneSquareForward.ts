import { Component, EffectGenerator } from "@chaos-framework/core";
import { OnPhase, ForAction, TargetsMe } from "@chaos-framework/stdlib";

import * as Chess from "../../Chess.js";
import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";
import ChessTeam from "../../Enums/Teams.js";
import { ChessPiece } from "../../Util/Types.js";

export default class MovesOneSquareForward extends Component<ChessPiece> {
  name = "Moves One Square Forward";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  async *permitMovement(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    const teamName = target.team.name as ChessTeam;
    // Make sure the movement is "forward"
    const delta = to.subtract(target.position);
    const forward = Chess.teamDirections[teamName];
    // Check that the movement is only one square directly "forward"
    if (delta.equals(forward)) {
      yield action.permit(MovementPermissionPriority.ALLOWED, {
        by: this,
      });
    }
  }
}
