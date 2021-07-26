import { Component, Action, Reacter, MoveAction, TerminalMessage, Entity, MessageAction } from '@chaos/core';
import Chess from "..";
import Chessboard from "../Worlds/Chessboard";

export default class Captures extends Component implements Reacter {
  react(action: Action) {
    if(action instanceof MoveAction && action.tagged('PLAYER_MOVEMENT')
    && action.target.world !== undefined) {
      // See if this moved onto enemy piece
      const { target, to } = action;
      const entity = action.target.world.getEntitiesAtCoordinates(to.x, to.y)[0];
      const enemyColor = target.metadata.get('color');
      if(enemyColor === 'WHITE' || enemyColor === 'BLACK') {
        if(entity !== undefined && entity.tagged(enemyColor)) {
          const newLocation = Chessboard.getCaptureSlot(enemyColor, Chess.totalCaptures[enemyColor]);
          action.followup(entity.move({ to: newLocation }));
          Chess.totalCaptures[enemyColor]++;
          action.followup(new MessageAction({ message: generateCaptureMessage(entity, target) }))
        }
      }
    }
  }
}

function generateCaptureMessage(captured: Entity, by: Entity): TerminalMessage {
  return new TerminalMessage(by, 'captured', captured);
}