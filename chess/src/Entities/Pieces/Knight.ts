import { Entity, Team } from "@chaos-framework/core";

import { createBaseChessPiece } from "./_common.js";
import KnightMovement from "../../Components/Movement/KnightMovement.js";
import { ChessPiece } from "../../Util/Types.js";

function Knight(team: Team): ChessPiece {
  return createBaseChessPiece(
    "Knight",
    team,
    ["N", "n"],
    [new KnightMovement()]
  );
}

export default Knight;
