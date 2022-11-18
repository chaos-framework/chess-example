import {
  ChangeTurnAction,
  Chaos,
  Component,
  CONNECTION,
  Entity,
  LogicalAction,
  Player,
  ProcessEffectGenerator,
  Team,
  Vector,
} from "@chaos-framework/core";

import Chessboard from "./Worlds/Chessboard.js";
import OneMovePerTurn from "./Components/PlayOrder/OneMovePerTurn.js";
import MoveCounter from "./Components/Logical/MoveCounter.js";
import Pawn from "./Entities/Pieces/Pawn.js";
import Bishop from "./Entities/Pieces/Bishop.js";
import Rook from "./Entities/Pieces/Rook.js";
import Knight from "./Entities/Pieces/Knight.js";
import Queen from "./Entities/Pieces/Queen.js";
import King from "./Entities/Pieces/King.js";
import StandardAI from "./Components/Logical/StandardAI.js";
import EnPassant from "./Components/Combat/EnPassant.js";
import Checked from "./Components/Combat/Checked.js";
import Checkmated from "./Components/Combat/Checkmated.js";

Chaos.setId("Chess");
// Chaos.setPhases(
//   ["modify", "permit"],
//   ["capture", "check", "react", "updateState", "ai", "output"]
// );

export let board: Chessboard;
export let turnOrderComponent: Component;
export let stateTrackingComponent: MoveCounter;

export let teams = {
  WHITE: new Team({ name: "WHITE" }),
  BLACK: new Team({ name: "BLACK" }),
  RED: new Team({ name: "RED" }),
  BLUE: new Team({ name: "BLUE" }),
  GREEN: new Team({ name: "GREEN" }),
  YELLOW: new Team({ name: "YELLOW" }),
};

export const teamDirections = Object.freeze({
  WHITE: new Vector(0, 1),
  BLACK: new Vector(0, -1),
  RED: new Vector(1, 0),
  BLUE: new Vector(-1, 0),
  GREEN: new Vector(0, 1),
  YELLOW: new Vector(0, -1),
});

export async function* initialize(options: any = {}): ProcessEffectGenerator {
  board = new Chessboard();
  board.publish();
  teams["WHITE"]._publish();
  teams["BLACK"]._publish();
  turnOrderComponent = new OneMovePerTurn([teams.WHITE, teams.BLACK]);
  Chaos.components.addComponent(turnOrderComponent);
  yield* reset();
  // Make it an AI match, if specified in the options
  if (options.aiOnly === true) {
    console.log("Initializing chess with AI players");
    const whiteAI = new StandardAI(2, true, 300);
    const blackAI = new StandardAI(2, true, 300);
    teams.WHITE.components.addComponent(whiteAI);
    teams.BLACK.components.addComponent(blackAI);
  }
  return true;
}

export async function shutdown() {}

export async function* play(): ProcessEffectGenerator {
  console.log("Starting game!");
  yield new LogicalAction("GAME_START", {
    firstTeam: teams["WHITE"],
  }).asEffect();
  yield new ChangeTurnAction({ target: teams.WHITE }).asEffect();
  return true;
}

export async function* onPlayerConnect(
  msg: CONNECTION
): ProcessEffectGenerator<Player> {
  const player = new Player({ username: msg.desiredUsername });
  player._joinTeam(teams["WHITE"]); // TODO make actions for this, test w/ visibility etc
  yield player.publish().asEffect();
  for (const [, entity] of Chaos.entities) {
    yield player.ownEntity({ entity: entity }).asEffect();
  }
  return player;
}

export async function* onPlayerDisconnect() {}

export async function* reset(): ProcessEffectGenerator {
  yield* board.clear();
  yield* board.setUpStandardGame();
  for (const [, component] of teams["WHITE"].components.all) {
    teams["WHITE"].components.removeComponent(component); // TODO won't broadcast
  }
  for (const [, component] of teams["BLACK"].components.all) {
    teams["BLACK"].components.removeComponent(component); // TODO won't broadcast
  }
  yield new ChangeTurnAction({ target: teams["WHITE"] }).asEffect();
  stateTrackingComponent = new MoveCounter();
  Chaos.attach(stateTrackingComponent);
  return true;
}

export function exportToJSEngineStatelessFormat(newTeamTurn?: Team): any {
  // this should only get called using standard white&black teams
  const currentTurn = newTeamTurn ?? Chaos.currentTurn as Team;
  const turn = currentTurn.name === "WHITE" ? "white" : "black";
  const pieces = board.exportToJSON();
  let enPassant: string | null = null;
  let check: boolean = false;
  let checkMate: boolean = false;
  for (const [, piece] of Chaos.entities) {
    const enPassantComponent = piece.components.get(EnPassant);
    if (enPassantComponent !== undefined) {
      enPassant = Chessboard.toAlgebraic(enPassantComponent.location)!;
    }
    const checkComponent = piece.components.get(Checked);
    if (checkComponent !== undefined) {
      check = true;
    }
    const checkMateComponent = piece.components.get(Checkmated);
    if (checkMateComponent !== undefined) {
      checkMate = true;
    }
  }
  const castling = {
    whiteLong: false,
    whiteShort: false,
    blackLong: false,
    blackShort: false,
  };
  return {
    turn,
    enPassant,
    castling,
    fullMove: Chaos.components.get(MoveCounter)!.fullMoves,
    halfMove: Chaos.components.get(MoveCounter)!.halfMoves,
    pieces,
    check,
    checkMate,
    isFinished: checkMate,
  };
}

export function createStandardPieceFromNotation(
  notation: string
): Entity | undefined {
  switch (notation) {
    case "P":
      return Pawn(teams.WHITE);
    case "p":
      return Pawn(teams.BLACK);
    case "B":
      return Bishop(teams.WHITE);
    case "b":
      return Bishop(teams.BLACK);
    case "R":
      return Rook(teams.WHITE);
    case "r":
      return Rook(teams.BLACK);
    case "N":
      return Knight(teams.WHITE);
    case "n":
      return Knight(teams.BLACK);
    case "Q":
      return Queen(teams.WHITE);
    case "q":
      return Queen(teams.BLACK);
    case "K":
      return King(teams.WHITE);
    case "k":
      return King(teams.BLACK);
  }
}
