import { Chaos, CONNECTION, CONNECTION_RESPONSE, Player, Team } from '@chaos/core';

import ChessBoard from './Worlds/Chessboard';
import Simulator from './Components/Logical/Simulator';
import Teams from './Enums/Teams';

Chaos.id = 'Chess';

export let board = new ChessBoard();
export let simulator = new Simulator();
export let turnOrder = [Teams.WHITE, Teams.BLACK]

export let teams = {
  [Teams.WHITE]: new Team({ name: Teams.WHITE }),
  [Teams.BLACK]: new Team({ name: Teams.BLACK }),
  [Teams.RED]: new Team({ name: Teams.RED }),
  [Teams.BLUE]: new Team({ name: Teams.BLUE }),
  [Teams.GREEN]: new Team({ name: Teams.GREEN }),
  [Teams.YELLOW]: new Team({ name: Teams.YELLOW }),
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
  Chaos.teams.set('White', teams[Teams.WHITE]);
  Chaos.teams.set('Black', teams[Teams.WHITE]);
  board.setUpStandardGame();
  simulator = new Simulator();
}

export function reset() {
  totalCaptures[Teams.WHITE] = 0;
  totalCaptures[Teams.BLACK] = 0;
  totalCaptures[Teams.RED] = 0;
  totalCaptures[Teams.BLUE] = 0;
  totalCaptures[Teams.GREEN] = 0;
  totalCaptures[Teams.YELLOW] = 0;
  board.clear();
  board.setUpStandardGame();
  simulator = new Simulator();
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
