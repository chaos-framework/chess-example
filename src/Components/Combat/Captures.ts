import { Component, Action, MoveAction, TerminalMessage, Entity, MessageAction } from '@chaos/core';
import Chess from "../..";
import ChessTeam from '../../Enums/Teams';
import Chessboard from "../../Worlds/Chessboard";

// Gets captures when landing on an enemy piece
export default class Captures extends Component {
  name = 'Captures';

  combat(action: Action) {
    if (
      action instanceof MoveAction &&
      action.tagged('playerMovement') && 
      action.target.world instanceof Chessboard)
    {
      const { target, to } = action;
      // Loop over all pieces in that location (note that this now includes the parent itself)
      for(const entity of action.target.world.getEntitiesAtCoordinates(to.x, to.y)) {
        if(entity.team !== target.team && entity.team !== undefined) {
          const enemyTeam = entity.team.name as ChessTeam;
          const captureSlot = Chessboard.getCaptureSlot(enemyTeam, Chess.totalCaptures[enemyTeam]);
          action.followup(entity.move({ to: captureSlot }));
          Chess.totalCaptures[enemyTeam]++;
          // action.followup(new MessageAction({ message: generateCaptureMessage(entity, target) }));
        }
      }
    }
  }
}

function generateCaptureMessage(captured: Entity, by: Entity): TerminalMessage {
  return new TerminalMessage(by, 'captured', captured);
}
