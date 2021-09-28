import { Chaos, CONNECTION, CONNECTION_RESPONSE, Player, Team, Vector } from '@chaos/core';

import ChessBoard from './Worlds/Chessboard';
import Teams from './Enums/Teams';
import Chessboard from './Worlds/Chessboard';

Chaos.id = 'Chess';

export let board: Chessboard;
export let turnOrder = [Teams.WHITE, Teams.BLACK];

export const teams = {
  [Teams.WHITE]: new Team({ name: Teams.WHITE }),
  [Teams.BLACK]: new Team({ name: Teams.BLACK }),
  [Teams.RED]: new Team({ name: Teams.RED }),
  [Teams.BLUE]: new Team({ name: Teams.BLUE }),
  [Teams.GREEN]: new Team({ name: Teams.GREEN }),
  [Teams.YELLOW]: new Team({ name: Teams.YELLOW }),
}

export let activeTeams = [
  teams[Teams.WHITE],
  teams[Teams.BLACK]
]

export const teamDirections = {
  [Teams.WHITE]: new Vector(0, -1),
  [Teams.BLACK]: new Vector(0, 1),
  [Teams.RED]: new Vector(1, 0),
  [Teams.BLUE]: new Vector(-1, 0),
  [Teams.GREEN]: new Vector(0, -1),
  [Teams.YELLOW]: new Vector(0, 1)
}

export const totalCaptures = {
  [Teams.WHITE]: 0,
  [Teams.BLACK]: 0,
  [Teams.RED]: 0,
  [Teams.BLUE]: 0,
  [Teams.GREEN]: 0,
  [Teams.YELLOW]: 0
}

export function initialize(options?: any) {
  board = new ChessBoard();
  teams[Teams.WHITE]._publish();
  teams[Teams.BLACK]._publish();
  reset();
}

export function reset() {
  totalCaptures[Teams.WHITE] = 0;
  totalCaptures[Teams.BLACK] = 0;
  totalCaptures[Teams.RED] = 0;
  totalCaptures[Teams.BLUE] = 0;
  totalCaptures[Teams.GREEN] = 0;
  totalCaptures[Teams.YELLOW] = 0;
  board.clear();
  board.setUpStandardGame(teams[Teams.WHITE], teams[Teams.BLACK]);
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
