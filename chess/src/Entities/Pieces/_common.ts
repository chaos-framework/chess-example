import {
  Component,
  Entity,
  GlyphCode347,
  GlyphCode347Key,
  Team,
} from "@chaos-framework/core";

import Captures from "../../Components/Combat/Captures.js";
import CannotLandOnTeam from "../../Components/Movement/CannotLandOnTeam.js";
import CountsMovements from "../../Components/Movement/CountsMovements.js";
import HasToMoveAtLeastOneSpace from "../../Components/Movement/HasToMoveAtLeastOneSpace.js";
import Move from "../../Abilities/Move.js";
import Piece from "../../Enums/Piece.js";
import { ChessPiece } from "../../Util/Types.js";

export function generateCommonComponents(): Component[] {
  return [
    new CannotLandOnTeam(),
    new Captures(),
    new HasToMoveAtLeastOneSpace(),
    new CountsMovements(),
  ];
}

export function createBaseChessPiece(
  pieceName: string,
  team: Team,
  notations: [GlyphCode347Key, GlyphCode347Key],
  additionalComponents: Component[]
): ChessPiece {
  const name = `${team.name} ${pieceName}`;
  const notation = team.name === "WHITE" ? notations[0] : notations[1];
  const piece = new Entity({
    name,
    team,
    active: true,
    metadata: {
      type: Piece.PAWN,
      notation
    },
    glyph: GlyphCode347[notation],
    permanentComponents: [...generateCommonComponents(), ...additionalComponents]
  }) as ChessPiece;
  piece._addProperty("Move Count");
  piece._addProperty("Captures");
  piece._attachAll([...generateCommonComponents(), ...additionalComponents]);
  piece._learn(new Move());
  return piece;
}
