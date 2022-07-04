import { Component, EffectGenerator } from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/std-lib";

import * as Chess from "../../Chess.js";
import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";
import ChessTeam from "../../Enums/Teams.js";
import EnPassant from "../Combat/EnPassant.js";
import { ChessPiece } from "../../Util/Types.js";

export default class MovesDiagonallyOneSquareForwardToCapture extends Component<ChessPiece> {
  name = "Moves Diagonally One Square To Capture";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  async *permitMovement(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    const teamName = target.team.name as ChessTeam;
    // Make sure the movement is "forward"
    const delta = to.subtract(target.position);
    const forward = Chess.teamDirections[teamName]; // TODO make a component / property on team that indicates this?
    // Check that the movement is only one square on the two forward diagonals
    if (
      delta.dot(forward) >= 0 &&
      Math.abs(delta.x) === 1 &&
      Math.abs(delta.y) === 1
    ) {
      for (const [, entity] of target.world.entities) {
        if (entity.team !== target.team) {
          // Check if enemy is in that location or has an active en passant in the spot we're moving to
          if (entity.position.equals(action.to))
            yield action.permit(MovementPermissionPriority.ALLOWED, {
              by: this,
            });
          break;
        }
      }
    }
  }
}
