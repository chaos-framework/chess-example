import { Component, Action, Modifier, Reacter, MoveAction, TerminalMessage, Entity } from '@chaos/core';

export default class GetsPutInCheck extends Component implements Modifier, Reacter {
  modify(action: Action) {
    // TODO make sure parent does not check itself with any movement
  }

  react(action: Action) {
    if(action instanceof MoveAction && action.tagged('playerMovement') && action.target.world !== undefined) {
      // Make sure we belong to a piece and weren't inadvertently attached to a world, player, etc..
      // Also make sure we're published to a chess board and it is the same as the piece that just moved
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
