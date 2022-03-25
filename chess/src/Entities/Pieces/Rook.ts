import { Entity, Team } from "@chaos-framework/core";

import { createBaseChessPiece } from "./_common.js";
import MovesOrthogonally from "../../Components/Movement/MovesOrthogonally.js";
import Collides from "../../Components/Movement/Collides.js";
import { ChessPiece } from "../../Util/Types.js";

function Rook(team: Team): ChessPiece {
  return createBaseChessPiece(
    "Rook",
    team,
    ["R", "r"],
    [new Collides(), new MovesOrthogonally()]
  );
}

export default Rook;
