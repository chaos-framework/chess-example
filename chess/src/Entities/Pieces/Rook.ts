import { Entity, Team } from "@chaos-framework/core";

import { createBaseChessPiece } from "./_common.js";
import MovesOrthogonally from "../../Components/Movement/MovesOrthogonally.js";
import Collides from "../../Components/Movement/Collides.js";

function Rook(team: Team): Entity {
  return createBaseChessPiece(
    "Rook",
    team,
    ["R", "r"],
    [new Collides(), new MovesOrthogonally()]
  );
}

export default Rook;
