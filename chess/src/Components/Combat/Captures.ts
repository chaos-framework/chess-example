import { Component, Action, MoveAction, TerminalMessage, Entity, MessageAction, LogicalAction } from '@chaos-framework/core';
import Chess from "../..";
import ChessTeam from '../../Enums/Teams';
import Chessboard from "../../Worlds/Chessboard";

// Gets captures when landing on an enemy piece
export default class Captures extends Component {
  name = 'Captures';

  capture(action: Action) {
    if (
      action instanceof MoveAction &&
      action.tagged('playerMovement') && 
      action.target.world === this.getParentEntity()?.world &&
      action.target.world instanceof Chessboard)
    {
      const { target, to } = action;
      // Loop over all pieces in that location (note that this now includes the parent itself)
      for(const entity of action.target.world.getEntitiesAtCoordinates(to.x, to.y)) {
        if (entity.team !== target.team && entity.team !== undefined) {
          const enemyTeam = entity.team.name as ChessTeam;
          const captureSlot = Chessboard.getCaptureSlot(enemyTeam, Chess.totalCaptures[enemyTeam]);
          action.react(entity.move({ to: captureSlot }));
          Chess.totalCaptures[enemyTeam]++;
          action.followup(new LogicalAction('CAPTURE'));
        }
      }
    }
  }
}
