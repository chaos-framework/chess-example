import { Component, EffectGenerator } from "@chaos-framework/core";

import * as Chess from "../../Chess.js";
import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";
import ChessTeam from "../../Enums/Teams.js";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/std-lib";
import { ChessPiece } from "../../Util/Types.js";

// Allows a pawn to move two spaces forward on it's first move, also applying the en passant component if successful
export default class CanMoveTwoSpacesForwardOnFirstMovement extends Component<ChessPiece> {
  name = "Can Move Two Spaces Forward On First Movement";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  async *permitMovement(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    const moveCount =
      action.target.getProperty("Move Count")!.current.calculated;
    if (moveCount === 0) {
      // Make sure the target has a team
      if (target.team === undefined) {
        return;
      }
      // Make sure the movement is "forward"
      const teamName = target.team.name as ChessTeam;
      const forwardOneSquare = Chess.teamDirections[teamName];
      const forwardTwoSquares = forwardOneSquare.multiply(2);
      const delta = to.subtract(target.position);
      // Check that the movement is only two squares directly forward
      if (delta.equals(forwardTwoSquares)) {
        yield action.permit(MovementPermissionPriority.ALLOWED, {
          by: this,
        });
      }
    }
  }
}
