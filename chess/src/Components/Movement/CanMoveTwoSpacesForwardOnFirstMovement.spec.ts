import { expect } from "chai";
import "mocha";
import { Entity, Team, Vector } from "@chaos-framework/core";

import Chessboard from "../../Worlds/Chessboard.js";
import CanMoveTwoSpacesForwardOnFirstMovement from "./CanMoveTwoSpacesForwardOnFirstMovement.js";
import ChessMove from "../../Actions/ChessMove.js";
import { ChessPiece } from "../../Util/Types.js";

describe("Moving two spaces forward on first move", () => {
  let board: Chessboard;
  let pawn: ChessPiece;
  let movementComponent: CanMoveTwoSpacesForwardOnFirstMovement;
  beforeEach(() => {
    board = new Chessboard();
    pawn = new Entity({ team: new Team({ name: "WHITE" }) }) as ChessPiece;
    pawn._addProperty("Move Count", 0);
    movementComponent = new CanMoveTwoSpacesForwardOnFirstMovement();
    pawn._attach(movementComponent);
    pawn._publish(board, Chessboard.fromAlgebraic("c3") as Vector);
  });

  it("Permits movement forward two spaces if 'Move Count' property is zero", async function () {
    const gen = movementComponent.permitMovement(
      new ChessMove(pawn, Chessboard.fromAlgebraic("c5")!)
    );
    expect((await gen.next()).value?.[0]).to.equal("PERMIT");
  });

  it("Does not permit other forward movement, even if 'Move Count' property is zero", async function () {
    let gen = movementComponent.permitMovement(
      new ChessMove(pawn, Chessboard.fromAlgebraic("c4")!)
    );
    expect((await gen.next()).value).to.be.undefined;
    gen = movementComponent.permitMovement(
      new ChessMove(pawn, Chessboard.fromAlgebraic("b4")!)
    );
    expect((await gen.next()).value).to.be.undefined;
  });

  it("Does not permit movement backwards, even if 'Move Count' property is zero", async function () {
    const gen = movementComponent.permitMovement(
      new ChessMove(pawn, Chessboard.fromAlgebraic("c1")!)
    );
    expect((await gen.next()).value).to.be.undefined;
  });
});
