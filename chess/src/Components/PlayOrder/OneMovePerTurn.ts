import {
  Component,
  Action,
  Team,
  ChangeTurnAction,
  EffectGenerator,
} from "@chaos-framework/core";
import { ForAction, OnPhase, Successful } from "@chaos-framework/std-lib";

import ChessMove from "../../Actions/ChessMove.js";

// Changes the turn to the next team after each move
export default class OneMovePerTurn extends Component<Team> {
  name = "One Move Per Turn";

  constructor(public turnOrder: Team[]) {
    super();
  }

  @OnPhase("after")
  @ForAction(ChessMove)
  @Successful
  async *endTurnAfterMovement(action: ChessMove): EffectGenerator {
    // Change turns after one movement
    const nextTeam = this.getTeamForNextTurn(action.target.team);
    if (nextTeam !== action.target.team) {
      yield action.followup(new ChangeTurnAction({ target: nextTeam }));
    }
  }

  getTeamForNextTurn(previousTeam: Team): Team {
    let i = this.turnOrder.findIndex((team) => previousTeam === team);
    if (i === -1) {
      return previousTeam; // could not find the team -- finding the index returned a -1
    }
    i += 1;
    if (this.turnOrder.length === i) {
      return this.turnOrder[0];
    } else {
      return this.turnOrder[i];
    }
  }
}
