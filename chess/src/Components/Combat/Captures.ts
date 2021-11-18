import { Component, Action, MoveAction, TerminalMessage, Entity, MessageAction, LogicalAction } from '@chaos-framework/core';
import * as Chess from"../..";
import Capture from '../../Actions/Capture';
import ChessMove from '../../Actions/ChessMove';
import ChessTeam from '../../Enums/Teams';

// Captures when landing on an enemy piece
export default class Captures extends Component {
  name = 'Captures';

  capture(action: Action) {
    if (
      action instanceof ChessMove && action.target === this.parent && action.target.world !== undefined)
    {
      const { target, to } = action;
      // Loop over all pieces in that location (note that this now includes the parent itself)
      for(const entity of action.target.world.getEntitiesAtCoordinates(to.x, to.y)) {
        if (entity.team !== target.team && entity.team !== undefined) {
          const enemyTeam = entity.team.name as ChessTeam;
          action.react(new Capture(entity, target));
          action.captured = entity;
          Chess.totalCaptures[enemyTeam]++;
        }
      }
    }
  }
}
