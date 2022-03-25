import { Entity, Team } from "@chaos-framework/core";

import { createBaseChessPiece } from "./_common.js";
import MovesOneSquareForward from "../../Components/Movement/MovesOneSquareForward.js";
import MovesDiagonallyOneSquareForwardToCapture from "../../Components/Movement/MovesDiagonallyOneSquareForwardToCapture.js";
import MovesTwoSpacesForwardOnFirstMovement from "../../Components/Movement/CanMoveTwoSpacesForwardOnFirstMovement.js";
import Collides from "../../Components/Movement/Collides.js";
import Queens from "../../Components/Queens.js";
import { ChessPiece } from "../../Util/Types.js";

function Pawn(team: Team): ChessPiece {
  return createBaseChessPiece(
    "Pawn",
    team,
    ["P", "p"],
    [
      new Collides(),
      new MovesOneSquareForward(),
      new MovesTwoSpacesForwardOnFirstMovement(),
      new MovesDiagonallyOneSquareForwardToCapture(),
      new Queens(),
    ]
  );
}

export default Pawn;
