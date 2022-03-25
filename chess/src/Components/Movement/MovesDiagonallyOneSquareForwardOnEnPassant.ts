import { Component, EffectGenerator } from "@chaos-framework/core";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

import * as Chess from "../../Chess.js";
import ChessMove from "../../Actions/ChessMove.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";
import ChessTeam from "../../Enums/Teams.js";
import EnPassant from "../Combat/EnPassant.js";
import { ChessPiece } from "../../Util/Types.js";

export default class MovesDiagonallyOneSquareForwardToEnPassant extends Component<ChessPiece> {
  name = "Moves Diagonally One Square To En Passant";

  @OnPhase("permit")
  @ForAction(ChessMove)
  @TargetsMe
  async *permitMovement(action: ChessMove): EffectGenerator {
    const { target, to } = action;
    const teamName = target.team.name as ChessTeam;
    // Make sure the movement is "forward"
    const delta = to.subtract(target.position);
    const forward = Chess.teamDirections[teamName]; // TODO make a child class of Team that has this info handy?
    // Check that the movement is only one square on the two forward diagonals
    if (
      delta.dot(forward) >= 0 &&
      Math.abs(delta.x) === 1 &&
      Math.abs(delta.y) === 1
    ) {
      for (const [, entity] of target.world.entities) {
        if (
          entity.team !== target.team &&
          (entity.components.get("En Passant") as EnPassant)?.location.equals(
            action.to
          )
        ) {
          yield action.permit(MovementPermissionPriority.ALLOWED, {
            by: this,
          });
          break;
        }
      }
    }
  }
}
