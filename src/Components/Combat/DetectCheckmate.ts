import { Component, Action, AttachComponentAction, LogicalAction } from '@chaos/core';
import { isInCheckmate } from '../../Util/CheckQueries';
import Chessboard from '../../Worlds/Chessboard';
import Checked from './Checked';

export default class DetectCheckmate extends Component {

  updateState(action: Action) {
    if(
      action instanceof AttachComponentAction && 
      action.component instanceof Checked
    ) {
      // See if we're in checkmate
      if(isInCheckmate(action.target.world! as Chessboard, action.target, action.component.by)) {
        action.followup(new LogicalAction('CHECKMATE', { piece: action.target, by: action.component.by }));
      }
    }
  }
}
