import jsChessEngine from "js-chess-engine";
import {
  Action,
  ChangeTurnAction,
  Component,
  EffectGenerator,
  LogicalAction,
  Scope,
  Team,
} from "@chaos-framework/core";

const { aiMove } = jsChessEngine;

import * as Chess from "../../Chess.js";
import { ForAction, OnPhase, TargetsMe } from "@chaos-framework/stdlib";

const difficultyNames = [
  "Dumb",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Master",
];

// When attached to a team will play moves in a standard chess game
// Relies on js-chess-engine
export default class StandardAI extends Component<Team> {
  name = "Standard AI";

  scope: { [key: string]: Scope } = {
    ai: "game",
  };

  constructor(
    private difficulty = 2,
    public automaticMovement = false,
    public delay = 0
  ) {
    super();
    if (difficulty < 0 || difficulty > 4) {
      this.difficulty = 2;
    }
    this.name = `${difficultyNames[this.difficulty]} AI`;
  }

  // Play moves for the attached team
  @OnPhase("ai")
  @ForAction(ChangeTurnAction)
  @TargetsMe
  async *playTurn(action: Action): EffectGenerator {
    const { delay } = this;
    const aiMove = this.getAIMove();
    if (aiMove === undefined) {
      console.error("AI could not find a move for this board.");
      return;
    }
    const moveAction = Chess.board.move(aiMove[0], aiMove[1]);
    if (moveAction === undefined) {
      console.error("AI gave an invalid move for this board.");
      return;
    }
    if (delay > 0) {
      yield action.delay(delay);
    }
    yield action.followup(moveAction);
  }

  getAIMove(): [string, string] | undefined {
    try {
      const boardConfiguration = Chess.exportToJSEngineStatelessFormat();
      if (boardConfiguration.checkMate === true) {
        return undefined;
      }
      const result = aiMove(boardConfiguration, this.difficulty);
      if (result instanceof Object) {
        const keys = Object.keys(result);
        if (keys.length === 1) {
          const key = keys[0];
          return [key.toLowerCase(), result[key].toLowerCase()];
        }
      }
      return undefined;
    } catch (e) {
      return undefined;
    }
  }
}
