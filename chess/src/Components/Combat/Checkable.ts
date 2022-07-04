import {
  Component,
  Action,
  MoveAction,
  Entity,
  PublishEntityAction,
  EffectGenerator,
} from "@chaos-framework/core";

import {
  isInCheck,
  movementWillResultInCheck,
} from "../../Util/CheckQueries.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";
import Checked from "./Checked.js";
import Chessboard from "../../Worlds/Chessboard.js";
import ChessMove from "../../Actions/ChessMove.js";
import {
  ForAction,
  OnPhase,
  Successful,
  TargetsMyTeam,
} from "@chaos-framework/std-lib";
import { ChessPiece } from "../../Util/Types.js";

// Stops friendly pieces from moving in a way that would check this piece, and applies Checked when done so by enemy
export default class Checkable extends Component<ChessPiece> {
  name = "Checkable";
  broadcast = true;

  // Don't allow any friendly movement that would cause a check
  @OnPhase("permit", "world")
  @ForAction(ChessMove)
  @TargetsMyTeam
  async *dontAllowSelfChecking(action: ChessMove): EffectGenerator {
    if (action.queryDepth <= 1) {
      if (
        this.parent!.team === action.target.team &&
        movementWillResultInCheck(
          action.target.world!,
          this.parent!,
          action.target,
          action.to,
          action.queryDepth
        )
      ) {
        yield action.deny(MovementPermissionPriority.DISALLOWED, {
          message: `Movement would put ${this.parent!.name} in check!`,
          by: this,
        });
      }
    }
  }

  // Get put into check by enemy movement when appropriate
  @OnPhase("check", "world")
  @ForAction(ChessMove)
  @Successful
  async *getChecked(action: ChessMove): EffectGenerator {
    const piece = this.parent!;
    if (action.target.team !== piece.team) {
      // See if the parent entity is put in check by this movement
      if (
        !piece.has("Checked") &&
        piece.world !== undefined &&
        isInCheck(piece.world as Chessboard, piece)
      ) {
        // Put in check
        const component = new Checked(action.target);
        action.followup(
          piece
            .attach({ component, caster: action.target })
            .withMessage(this.parent, "was", component, "by", action.target)
        );
      }
    }
  }
}
