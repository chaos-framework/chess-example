import { Action, AttachComponentAction, ChangeTurnAction, Component, DetachComponentAction, LogicalAction, MoveAction, Team } from '@chaos/core';
import Piece from '../../Enums/Piece';
import Chessboard from '../../Worlds/Chessboard';
import Checked from '../Combat/Checked';
import EnPassant from '../Combat/EnPassant';

export interface GameState {
  isFinished: boolean,
  turn: 'white' | 'black',
  check: boolean,
  checkMate: boolean,
  castling: {
      whiteLong: boolean,
      whiteShort: boolean,
      blackLong: boolean,
      blackShort: boolean    
  },
  enPassant: string | null,
  fullMove: number,
  halfMove: number
}

// Stores some basic state for use with any third-party chess engines / AIs
export default class StandardStateTracker extends Component {
  name = 'Standard Chess State Tracker';

  state: GameState = {
    isFinished: false,
    turn: 'white',
    check: false,
    checkMate: false,
    castling: {
        "whiteLong": false,
        "whiteShort": false,
        "blackLong": false,
        "blackShort": false
    },
    enPassant: null,
    fullMove: 1,
    halfMove: 0
  }

  pawnMovementOrCaptureThisTurn = false;

  getState(): GameState {
    return this.state;
  }

  updateState(action: Action) {
    // We only care about successful actions
    if(action.applied) {
      // Track check being applied or removed
      if (action instanceof AttachComponentAction && action.component instanceof Checked) {
        this.state.check = true;
      } else
      if (action instanceof DetachComponentAction && action.component instanceof Checked) {
        this.state.check = false;
      } else
      // Check en passant being applied or removed
      if (action instanceof AttachComponentAction && action.component instanceof EnPassant) {
        this.state.enPassant = Chessboard.toAlgebraic(action.component.location) as string;
      } else
      if (action instanceof DetachComponentAction && action.component instanceof EnPassant) {
        this.state.enPassant = null;
      } else
      // Cache current turn and count full moves and half moves
      if (action instanceof ChangeTurnAction) {
        if (action.to instanceof Team && action.to.name === 'WHITE') {
          this.state.fullMove += 1;
        }
        if (!this.pawnMovementOrCaptureThisTurn) {
          this.state.halfMove += 1;
        } else {
          this.pawnMovementOrCaptureThisTurn = false;
        }
      } else
      // Track anything that would reset the half move counter
      if((action instanceof MoveAction && action.target.metadata.get('type') === Piece.PAWN) ||
          action instanceof LogicalAction && action.name === 'CAPTURE') {
            this.pawnMovementOrCaptureThisTurn = true;
            this.state.halfMove = 0;
      }
    }
    // TODO castling
    // TODO checkmate
  }

}
