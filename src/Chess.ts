import { Game, CONNECTION, CONNECTION_RESPONSE, Player, Team, Vector } from '@chaos/core';

import ChessBoard from './Worlds/Chessboard';
import buildPawn from './Entities/Pieces/Pawn';

export default class Chess extends Game {
  name = 'Chess';

  board = new ChessBoard();
  whiteTeam = new Team({ name: 'White' });
  blackTeam = new Team({ name: 'Black' });

  constructor(options?: any) {
    super(options);
    this.teams.set('White', this.whiteTeam);
    this.teams.set('Black', this.blackTeam);
    this.resetBoard();
  };

  resetBoard() {
    // TODO remove old pieces
    buildPawn('WHITE').publish({ world: this.board, position: new Vector(0, 0) }).execute();
  }

  onPlayerConnect(msg: CONNECTION): CONNECTION_RESPONSE {
    const player = new Player({ username: msg.desiredUsername });
    player.publish().execute();
    return {
      connectedPlayerId: player.id,
      gameState: this.serializeForScope(player)
    }
  }

  onPlayerDisconnect() {}

}
