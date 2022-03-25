import "mocha";

import { Entity, Team, Vector } from "@chaos-framework/core";

import Chessboard from "../../Worlds/Chessboard.js";
import CannotLandOnTeam from "./CannotLandOnTeam.js";
import ChessMove from "../../Actions/ChessMove.js";
import { ChessPiece } from "../../Util/Types.js";

describe("Cannot land on friendly piece", () => {
  let piece: ChessPiece;
  let friendly: ChessPiece;
  let enemy: ChessPiece;
  let movementComponent: CannotLandOnTeam;
  beforeEach(() => {
    const board = new Chessboard();
    const friendlyTeam = new Team();
    friendlyTeam._publish();
    const enemyTeam = new Team();
    enemyTeam._publish();
    piece = new Entity({ team: friendlyTeam }) as ChessPiece;
    movementComponent = new CannotLandOnTeam();
    piece._attach(movementComponent);
    piece._publish(board, Chessboard.fromAlgebraic("a1") as Vector);
    friendly = new Entity({ team: friendlyTeam }) as ChessPiece;
    friendly._publish(board, Chessboard.fromAlgebraic("a2") as Vector);
    enemy = new Entity({ team: enemyTeam }) as ChessPiece;
    enemy._publish(board, Chessboard.fromAlgebraic("b2") as Vector);
  });

  it("Disallows landing on friendly piece", async function () {
    const movement = new ChessMove(piece, friendly.position);
    await movementComponent
      .dontLandOnTeam(movement)
      .should.eventually.yield(undefined);
  });

  // it("Does not disallow landing on enemy piece", async function () {
  //   let movement = new ChessMove(piece, enemy.position);
  //   movement.permit({ priority: 1 });
  //   movementComponent.permit(movement);
  //   movement.decidePermission();
  //   expect(movement.permitted).to.be.true;
  // });

  // it("Does not disallow landing on empty space", async function () {
  //   let movement = new ChessMove(piece, Chessboard.fromAlgebraic("b1")!);
  //   movement.permit({ priority: 1 });
  //   movementComponent.permit(movement);
  //   movement.decidePermission();
  //   expect(movement.permitted).to.be.true;
  // });
});
