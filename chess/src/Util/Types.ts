import { Entity, PublishedEntity, Team, Vector } from "@chaos-framework/core";
import Chessboard from "../Worlds/Chessboard";

export type ChessPiece = {
  world: Chessboard;
  team: Team;
  published: true;
  position: Vector;
} & Entity<['Move Count', 'Captures']>;

export type PieceName =
  | "PAWN"
  | "BISHOP"
  | "KNIGHT"
  | "ROOK"
  | "QUEEN"
  | "KING";

export type ChessNotation =
  | "p"
  | "n"
  | "b"
  | "r"
  | "k"
  | "q"
  | "P"
  | "N"
  | "B"
  | "R"
  | "K"
  | "Q";
