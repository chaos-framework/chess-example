import { Component, Action, MoveAction, Team, ChangeTurnAction, LogicalAction } from '@chaos-framework/core'

import ChessMove from '../../Actions/ChessMove';

// Changes the turn to the next team after each move
export default class OneMovePerTurn extends Component {
  constructor(public turnOrder: Team[]) {
    super();
  }

  getTeamForNextTurn(previousTeam: Team): Team {
    let i = this.turnOrder.findIndex(team => previousTeam === team);
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

  react(action: Action) {
    // Change turns after one movement
    if (action instanceof ChessMove && action.target.team !== undefined && action.applied) {
      const nextTeam = this.getTeamForNextTurn(action.target.team);
      if (nextTeam !== action.target.team) {
        action.followup(new ChangeTurnAction({ to: nextTeam }));
      }
      return;
    }
  }

  // TODO serialize and unserialize state
}
