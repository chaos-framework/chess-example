import { ChangeTurnAction, processRunner, Team } from "@chaos-framework/core";
import { expect } from "chai";
import "mocha";

import * as Chess from '../../Chess.js';
import Chessboard from "../../Worlds/Chessboard.js";
import StandardAI from "./StandardAI.js";

describe('Standard Chess AI for teams', function() {
  let board: Chessboard;
  let white: Team;
  let black: Team;
  let whiteAi: StandardAI;
  let blackAi: StandardAI;

  beforeEach(async function() {
    await processRunner(Chess.initialize());
    board = new Chessboard();
    white = new Team({ name: "WHITE" });
    whiteAi = new StandardAI(1, true);
    white.components.addComponent(whiteAi);
    black = new Team({ name: "BLACK" });
    blackAi = new StandardAI(1, false);
  });

  this.afterEach(async function() {
    await processRunner(Chess.reset());
  });

  it("It should make a move when it's turn starts if automaticMovement is true", async function () {
    const gen = whiteAi.playTurn(new ChangeTurnAction({ target: white }));
    const result = await gen.next();
    expect(result.value?.[0]).to.equal("FOLLOWUP");
    expect(result.value?.[1]?.constructor?.name).to.equal("ChessMove");
  });

  it("It should NOT make a move when another team's turn starts", async function () {
    const gen = whiteAi.playTurn(new ChangeTurnAction({ target: black }));
    const result = await gen.next();
    expect(result.done).to.be.true;
  });

  it("It should NOT make a move when it's turn starts if automaticMovement is false", async function () {
    const gen = blackAi.playTurn(new ChangeTurnAction({ target: black }));
    const result = await gen.next();
    expect(result.done).to.be.true;
  });
});
