import { Chaos, CONNECTION, CONNECTION_RESPONSE, Player, Team, Vector } from '@chaos/core';

import ChessBoard from './Worlds/Chessboard';
import Pawn from './Entities/Pieces/Pawn';

Chaos.id = 'Chess';

export const board = new ChessBoard();
export const whiteTeam = new Team({ name: 'White' });
export const blackTeam = new Team({ name: 'Black' });

export const totalCaptures = {
  'WHITE': 0,
  'BLACK': 0
}

export function initialize(options?: any) {
  Chaos.teams.set('White', whiteTeam);
  Chaos.teams.set('Black', blackTeam);
  resetBoard();
};

export function reset() {
  totalCaptures.BLACK = 0;
  totalCaptures.WHITE = 0;
  resetBoard();
}

function resetBoard() {
  // TODO remove old pieces
  Pawn('WHITE').publish({ world: board, position: new Vector(0, 0) }).execute();
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
