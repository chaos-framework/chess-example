import { Component, Action, Modifier, MoveAction, Entity } from '@chaos/core';

export default class Checked extends Component implements Modifier {
  modify(action: Action) {
    if(action instanceof MoveAction && action.tagged('playerMovement') && action.target.world !== undefined) {
      // Make sure we belong to a team
      if(!(this.parent instanceof Entity) || this.parent.world === undefined || this.parent.world !== action.target.world) {
        return;
      }
      // Get this piece's team
      const myTeam = this.parent.metadata.get('team');
      if(myTeam === undefined) {
        return;
      }
      const enemyTeam = action.target.metadata.get('team');
      if(enemyTeam !== undefined && enemyTeam !== myTeam) {
        // See if this enemy piece could potentially capture us next turn. We do this by asking
        // the enemy piece to "modify" a movement onto our own square, making sure to pass in "query"
        // as action metadata so that no component takes any concrete actions.
        const potentialCapture = action.target.move({ to: this.parent.position, metadata: { playerMovement: true, query: true }});
        action.target.modify(potentialCapture);
        if(potentialCapture.permitted) {
          // TODO put into check... how?
        }
      }
    }
  }
}
