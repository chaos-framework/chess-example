import { Entity, Team } from "@chaos-framework/core";

import { createBaseChessPiece } from "./_common.js";
import KnightMovement from "../../Components/Movement/KnightMovement.js";

function Knight(team: Team): Entity {
  return createBaseChessPiece(
    "Knight",
    team,
    ["N", "n"],
    [new KnightMovement()]
  );
}

export default Knight;
