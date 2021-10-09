import { Chaos, Component, CONNECTION, CONNECTION_RESPONSE, LogicalAction, Player, Team, Vector } from '@chaos/core';

import ChessBoard from './Worlds/Chessboard';
import ChessTeam from './Enums/Teams';
import Chessboard from './Worlds/Chessboard';
import OneMovePerTurn from './Components/PlayOrder/OneMovePerTurn';
import StandardStateTracker from './Components/Logical/StandardStateTracker';

Chaos.id = 'Chess';
Chaos.setPhases(
  ['modify', 'permit'],
  ['capture', 'check', 'react', 'updateState', 'output']
);

export let board: Chessboard;
export let turnOrderComponent: Component;
export let stateTrackingComponent: StandardStateTracker

export const teams = {
  WHITE: new Team({ name: 'WHITE' }),
  BLACK: new Team({ name: 'BLACK' }),
  RED: new Team({ name: 'RED' }),
  BLUE: new Team({ name: 'BLUE' }),
  GREEN: new Team({ name: 'GREEN' }),
  YELLOW: new Team({ name: 'YELLOW' })
}

export const teamDirections = {
  WHITE: new Vector(0, -1),
  BLACK: new Vector(0, 1),
  RED: new Vector(1, 0),
  BLUE: new Vector(-1, 0),
  GREEN: new Vector(0, -1),
  YELLOW: new Vector(0, 1)
}

export const totalCaptures = {
  WHITE: 0,
  BLACK: 0,
  RED: 0,
  BLUE: 0,
  GREEN: 0,
  YELLOW: 0
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
  totalCaptures.WHITE = 0;
  totalCaptures.BLACK = 0;
  totalCaptures.RED = 0;
  totalCaptures.BLUE = 0;
  totalCaptures.GREEN = 0;
  totalCaptures.YELLOW = 0;
  board.clear();
  board.setUpStandardGame(teams['WHITE'], teams['BLACK']);
  new LogicalAction('RESET').execute();
  Chaos.process();
  stateTrackingComponent = new StandardStateTracker();
  Chaos.attach(stateTrackingComponent);
}

export function exportToJSEngineStatelessFormat(): any {
  // this should not get called if not using standard white&black teams
  const currentTurn = (Chaos.currentTurn as Team).name === 'WHITE' ? 'white' : 'black';
  const state = stateTrackingComponent.getState();
  const pieces = board.exportToJSON();
  return {
    currentTurn,
    pieces,
    ...state,
  };
}
