import { Action, AttachComponentAction, Component, DetachComponentAction, MoveAction } from '@chaos/core';
import Chessboard from '../../Worlds/Chessboard';
import Checked from '../Combat/Checked';
import EnPassant from '../Combat/EnPassant';

export interface GameState {
  isFinished: boolean,
  check: boolean,
  checkMate: boolean,
  castling: {
      whiteLong: boolean,
      whiteShort: boolean,
      blackLong: boolean,
      blackShort: boolean    
  },
  enPassant: string | null,
}

// Stores some basic state for use with any third-party chess engines / AIs
export default class StandardStateTracker extends Component {
  name = 'Standard Chess State Tracker';

  state: GameState = {
    isFinished: false,
    check: false,
    checkMate: false,
    castling: {
        "whiteLong": false,
        "whiteShort": false,
        "blackLong": false,
        "blackShort": false
    },
    enPassant: null,
  }

  getState(): GameState {
    return this.state;
  }

  updateState(action: Action) {
    // Track Check and EnPassant statuses
    if (action instanceof AttachComponentAction && action.applied) {
      if(action.component instanceof Checked) {
        this.state.check = true;
      } else if (action.component instanceof EnPassant) {
        this.state.enPassant = Chessboard.toAlgebraic(action.component.location) as string;
      }
      return;
    }
    if (action instanceof DetachComponentAction && action.applied) {
      if(action.component instanceof Checked) {
        this.state.check = false;
      } else if (action.component instanceof EnPassant) {
        this.state.enPassant = null;
      }
      return;
    }
    // TODO castling
    // TODO checkmate
  }
}
