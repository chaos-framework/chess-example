import { Action, AttachComponentAction, Component, DetachComponentAction, MoveAction, Reacter } from '@chaos/core';
import Checked from '../Checked';

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
export default class StandardStateTracker extends Component implements Reacter {
  state: GameState = {
    isFinished: false,
    check: false,
    checkMate: false,
    castling: {
        "whiteLong": true,
        "whiteShort": true,
        "blackLong": true,
        "blackShort": true    
    },
    enPassant: null,
  }

  react(action: Action) {
    // Track if we're in check or not
    if (action instanceof AttachComponentAction && action.component instanceof Checked && action.applied) {
      this.state.check = true;
    }
    if (action instanceof DetachComponentAction && action.component instanceof Checked && action.applied) {
      this.state.check = false;
    }
    // Track if en passant possible and, if so, which location the enemy pawn would move to
    if (action instanceof MoveAction && action.tagged('playerMovement') && action.tagged('en_passant') && action.applied) {
      this.state.enPassant = action.metadata.get('en_passant') as string;
    }
    // TODO castling
    // TODO checkmate
  }
}