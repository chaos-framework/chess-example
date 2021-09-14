import { Component, Action, Reacter, MoveAction, TerminalMessage, Entity, MessageAction } from '@chaos/core';
import Chess from "..";
import Chessboard from "../Worlds/Chessboard";

// Gets captures when landing on an enemy piece
export default class Captures extends Component implements Reacter {
  name = 'Captures';
  
  react(action: Action) {
    if(action instanceof MoveAction && action.tagged('playerMovement')
      && action.target.world !== undefined) {
      // See if this moved onto enemy piece
      const { target, to } = action;
      const entity = action.target.world.getEntitiesAtCoordinates(to.x, to.y)[0];
      if(target !== undefined && entity !== undefined) {
        const enemyTeam = entity.metadata.get('team');
        if(enemyTeam !== undefined && (enemyTeam === 'WHITE' || enemyTeam === 'BLACK')) {
          if(entity.metadata.get('team') !== target.metadata.get('team')) {
            const newLocation = Chessboard.getCaptureSlot(enemyTeam, Chess.totalCaptures[enemyTeam]);
            action.followup(entity.move({ to: newLocation }));
            Chess.totalCaptures[enemyTeam]++;
            action.followup(new MessageAction({ message: generateCaptureMessage(entity, target) }));
          }
        }
      }
    }
  }
}

function generateCaptureMessage(captured: Entity, by: Entity): TerminalMessage {
  return new TerminalMessage(by, 'captured', captured);
}
