import { Entity, Team } from "@chaos-framework/core";
import { createBaseChessPiece } from "./_common.js";
import MovesDiagonally from "../../Components/Movement/MovesDiagonally.js";
import MovesOrthogonally from "../../Components/Movement/MovesOrthogonally.js";
import Collides from "../../Components/Movement/Collides.js";

function Queen(team: Team): Entity {
  return createBaseChessPiece(
    "Queen",
    team,
    ["Q", "q"],
    [new Collides(), new MovesDiagonally(), new MovesOrthogonally()]
  );
}

export default Queen;
