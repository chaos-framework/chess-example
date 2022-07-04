import {
  Component,
  Entity,
  AttachComponentAction,
  EffectGenerator,
} from "@chaos-framework/core";
import {
  ForAction,
  OnPhase,
  TargetsMe,
  TargetsMyTeam,
} from "@chaos-framework/std-lib";

import {
  isInCheck,
  isInCheckmate,
  movementWillResultInCheck,
} from "../../Util/CheckQueries.js";
import MovementPermissionPriority from "../../Enums/MovementPermissionPriority.js";
import Checkmated from "./Checkmated.js";
import ChessMove from "../../Actions/ChessMove.js";
import { ChessPiece } from "../../Util/Types.js";

export default class Checked extends Component<ChessPiece> {
  name = "Checked";
  description = "Can be put in check by an enemy piece.";
  broadcast = true;

  constructor(public by: ChessPiece) {
    super();
  }

  // When this gets attached it should also check for checkmate
  @OnPhase("check", "world")
  @ForAction(AttachComponentAction)
  @TargetsMe
  async *seeIfAlsoCheckmated(action: AttachComponentAction): EffectGenerator {
    // Check for checkmate when applied
    if (action.component === this) {
      // See if we're in checkmate
      if (isInCheckmate(this.parent!.world!, this.parent!, this.by)) {
        const component = new Checkmated();
        yield action.react(
          new AttachComponentAction({
            caster: this.by,
            target: action.target,
            component,
          }).withMessage(this.parent as Entity, "was", component)
        );
      }
    }
  }

  // Remove self if the piece is out of check
  @OnPhase("check", "world")
  @ForAction(ChessMove)
  async *removeWhenNoLongerInCheck(action: ChessMove): EffectGenerator {
    if (!isInCheck(action.target.world!, this.parent!)) {
      yield action.react(this.parent!.detach({ component: this }));
    }
  }

  // Do not allow team movement that does not remove check
  @OnPhase("permit", "world")
  @ForAction(ChessMove)
  @TargetsMyTeam
  async *onlyAllowTeamMovementThatRemovesCheck(
    action: ChessMove
  ): EffectGenerator {
    if (
      movementWillResultInCheck(
        action.target.world!,
        this.parent!,
        action.target,
        action.to
      )
    ) {
      yield action.deny(MovementPermissionPriority.DISALLOWED, {
        message: `Movement will not get ${this.parent!.name} out of check!`,
        by: this,
      });
    }
  }
}
