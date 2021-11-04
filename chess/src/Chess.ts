import { ChangeTurnAction, Chaos, Component, CONNECTION, CONNECTION_RESPONSE, DetachComponentAction, Entity, LogicalAction, Player, Team, Vector } from '@chaos-framework/core';

import ChessBoard from './Worlds/Chessboard';
import Chessboard from './Worlds/Chessboard';
import OneMovePerTurn from './Components/PlayOrder/OneMovePerTurn';
import StandardStateTracker from './Components/Logical/StandardStateTracker';
import Pawn from './Entities/Pieces/Pawn';
import Bishop from './Entities/Pieces/Bishop';
import Rook from './Entities/Pieces/Rook';
import Knight from './Entities/Pieces/Knight';
import Queen from './Entities/Pieces/Queen';
import King from './Entities/Pieces/King';

Chaos.id = 'Chess';
Chaos.setPhases(
  ['modify', 'permit'],
  ['capture', 'check', 'react', 'updateState', 'ai', 'output']
);

export let board: Chessboard;
export let turnOrderComponent: Component;
export let stateTrackingComponent: StandardStateTracker;

export let teams = {
  WHITE: new Team({ name: 'WHITE' }),
  BLACK: new Team({ name: 'BLACK' }),
  RED: new Team({ name: 'RED' }),
  BLUE: new Team({ name: 'BLUE' }),
  GREEN: new Team({ name: 'GREEN' }),
  YELLOW: new Team({ name: 'YELLOW' })
};

export const teamDirections = Object.freeze({
  WHITE: new Vector(0, -1),
  BLACK: new Vector(0, 1),
  RED: new Vector(1, 0),
  BLUE: new Vector(-1, 0),
  GREEN: new Vector(0, -1),
  YELLOW: new Vector(0, 1)
});

export const totalCaptures = {
  WHITE: 0,
  BLACK: 0,
  RED: 0,
  BLUE: 0,
  GREEN: 0,
  YELLOW: 0
};

interface GameState { // redundant?
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

export let state: GameState = {
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

export function initialize(options?: any) {
  board = new ChessBoard();
  teams['WHITE']._publish();
  teams['BLACK']._publish();
  turnOrderComponent = new OneMovePerTurn([teams.WHITE, teams.BLACK]);
  Chaos.components.addComponent(turnOrderComponent);
  reset();
}

export function onPlayerConnect(msg: CONNECTION): CONNECTION_RESPONSE {
  const player = new Player({ username: msg.desiredUsername });
  player.publish().execute();
  return {
    connectedPlayerId: player.id,
    gameState: Chaos.serializeForScope(player)
  }
}

export function onPlayerDisconnect() {}

export function reset() {
  state = {
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
  totalCaptures.WHITE = 0;
  totalCaptures.BLACK = 0;
  board.clear();
  board.setUpStandardGame();
  new ChangeTurnAction({ to: teams['WHITE'] }).execute();
  for(const [,component] of teams['WHITE'].components.all) {
    teams['WHITE'].components.removeComponent(component); // TODO won't broadcast
  }
  for(const [,component] of teams['BLACK'].components.all) {
    teams['BLACK'].components.removeComponent(component); // TODO won't broadcast
  }
  Chaos.process();
  stateTrackingComponent = new StandardStateTracker();
  Chaos.attach(stateTrackingComponent);
}

export function exportToJSEngineStatelessFormat(): any {
  // this should not get called if not using standard white&black teams
  const currentTurn = (Chaos.currentTurn as Team).name === 'WHITE' ? 'white' : 'black';
  const pieces = board.exportToJSON();
  return {
    currentTurn,
    pieces,
    ...state,
  };
}

export function createStandardPieceFromNotation(notation: string): Entity | undefined {
  switch(notation) {
    case 'P':
      return Pawn(teams.WHITE);
    case 'p':
      return Pawn(teams.BLACK);
    case 'B':
      return Bishop(teams.WHITE);
    case 'b':
      return Bishop(teams.BLACK);
    case 'R':
      return Rook(teams.WHITE);
    case 'r':
      return Rook(teams.BLACK);
    case 'N':
      return Knight(teams.WHITE);
    case 'n':
      return Knight(teams.BLACK);
    case 'Q':
      return Queen(teams.WHITE);
    case 'q':
      return Queen(teams.BLACK);
    case 'K':
      return King(teams.WHITE);
    case 'k':
      return King(teams.BLACK);
  }
}