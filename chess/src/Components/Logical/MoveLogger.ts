import { Action, Component, MoveAction, TerminalMessage } from '@chaos-framework/core';
import Chessboard from '../../Worlds/Chessboard';

export default class MoveLogger extends Component {
  output(action: Action) {
    if(action instanceof MoveAction) {
      action.terminalMessage = new TerminalMessage(action.target, 'moves to', Chessboard.toAlgebraic(action.to));
    }
  }
}
