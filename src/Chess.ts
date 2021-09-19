import { Chaos, CONNECTION, CONNECTION_RESPONSE, Entity, Player, Team, Vector } from '@chaos/core';

import ChessBoard from './Worlds/Chessboard';
import Simulator from './Components/Logical/Simulator';

Chaos.id = 'Chess';

export let board = new ChessBoard();
export let whiteTeam = new Team({ name: 'White' });
export let blackTeam = new Team({ name: 'Black' });
export let simulator = new Simulator();

export const totalCaptures = {
  'WHITE': 0,
  'BLACK': 0
}

export function initialize(options?: any) {
  Chaos.teams.set('White', whiteTeam);
  Chaos.teams.set('Black', blackTeam);
  reset();
}

export function reset() {
  totalCaptures.BLACK = 0;
  totalCaptures.WHITE = 0;
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
