import { Action, AttachComponentAction, ChangeTurnAction, Component, DetachComponentAction, LogicalAction, MoveAction, Team } from '@chaos-framework/core';

import Chess from '../..';
import Piece from '../../Enums/Piece';
import Chessboard from '../../Worlds/Chessboard';
import Checked from '../Combat/Checked';
import Checkmated from '../Combat/Checkmated';
import EnPassant from '../Combat/EnPassant';

// Stores some basic state for use with any third-party chess engines / AIs
export default class StandardStateTracker extends Component {
  name = 'Standard Chess State Tracker';

  pawnMovementOrCaptureThisTurn = false;

  updateState(action: Action) {
    // We only care about successful actions
    if (action.applied) {
      // Track check being applied or removed
      if (action instanceof AttachComponentAction && action.component instanceof Checked) {
        Chess.state.check = true;
      } else
      if (action instanceof DetachComponentAction && action.component instanceof Checked) {
        Chess.state.check = false;
      } else
      // Track checkmate
      if (action instanceof AttachComponentAction && action.component instanceof Checkmated) {
        Chess.state.checkMate = true;
      } else
      // Check en passant being applied or removed
      if (action instanceof AttachComponentAction && action.component instanceof EnPassant) {
        Chess.state.enPassant = Chessboard.toAlgebraic(action.component.location) as string;
      } else
      if (action instanceof DetachComponentAction && action.component instanceof EnPassant) {
        Chess.state.enPassant = null;
      } else
      // Cache current turn (white or black) and count full moves and half moves
      if (action instanceof ChangeTurnAction && action.to instanceof Team) {
        if (action.to.name === 'WHITE') {
        Chess.state.fullMove += 1;
        Chess.state.turn = 'white';
        } else {
          Chess.state.turn = 'black';
        }
        if (!this.pawnMovementOrCaptureThisTurn) {
          Chess.state.halfMove += 1;
        } else {
          this.pawnMovementOrCaptureThisTurn = false;
        }
      } else
      // Track anything that would reset the half move counter
      if ((action instanceof MoveAction && action.target.metadata.get('type') === Piece.PAWN) ||
          action instanceof LogicalAction && action.name === 'CAPTURE') {
            this.pawnMovementOrCaptureThisTurn = true;
            Chess.state.halfMove = 0;
      }
    }
    // TODO castling
  }

}
