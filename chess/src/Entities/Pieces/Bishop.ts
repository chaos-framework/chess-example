import { Entity, Team } from "@chaos-framework/core";

import { createBaseChessPiece } from "./_common.js";
import Collides from "../../Components/Movement/Collides.js";
import MovesDiagonally from "../../Components/Movement/MovesDiagonally.js";

function Bishop(team: Team): Entity {
  return createBaseChessPiece(
    "Bishop",
    team,
    ["B", "b"],
    [new Collides(), new MovesDiagonally()]
  );
}

export default Bishop;
