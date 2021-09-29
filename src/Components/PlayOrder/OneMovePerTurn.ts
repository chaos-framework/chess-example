import { Component, Reacter, Action, MoveAction, Team, ChangeTurnAction, LogicalAction } from '@chaos/core'


// Changes the turn to the next team after each move
export default class OneMovePerTurn extends Component implements Reacter {
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
    if (action instanceof MoveAction && action.tagged('playerMovement') && action.target.team !== undefined) {
      const nextTeam = this.getTeamForNextTurn(action.target.team);
      if(nextTeam !== action.target.team) {
        action.followup(new ChangeTurnAction({ to: nextTeam }));
      }
      return;
    }
    // Change back to first team after game resets
    if (action instanceof LogicalAction && action.name === 'RESET') {
      const firstTeam = this.turnOrder[0];
      if(firstTeam !== undefined) {
        action.followup(new ChangeTurnAction({ to: firstTeam }));
      }
      return;
    }
  }

  // TODO serialize and unserialize state
}
