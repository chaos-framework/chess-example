import { Chaos, World, Vector, Team, MoveAction } from '@chaos/core';

import Pawn from '../Entities/Pieces/Pawn';
import Rook from '../Entities/Pieces/Rook';
import Knight from '../Entities/Pieces/Knight';
import Bishop from '../Entities/Pieces/Bishop';
import Queen from '../Entities/Pieces/Queen';
import King from '../Entities/Pieces/King';
import Tiles from '../Enums/Tile';
import ChessTeam from '../Enums/Teams';

const algebraicFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export default class Chessboard extends World {
  constructor() {
    super({ width: 13, height: 8, fill: Tiles.EMPTY });
    
    // Fill in white tiles
    this.baseLayer.drawSquare(Tiles.WHITE, new Vector(0, 0), 8);
    // Set every other tile inside the board to black
    for(let x = 0; x < 8; x++) {
      for(let y = 0; y < 8; y++) {
        if ((x + y) % 2 === 1) {
          this.baseLayer.setTile(x, y, Tiles.BLACK);
        }
      }
    }

    // Draw spaces for captured black pieces (onto white tiles) and vice versa
    this.baseLayer.drawSquare(Tiles.WHITE, Chessboard.whiteCaptureStart, 2, 8);
    this.baseLayer.drawSquare(Tiles.BLACK, Chessboard.blackCaptureStart, 2, 8);
  }

  static whiteCaptureStart = new Vector(9, 0);
  static blackCaptureStart = new Vector(11, 0);

  clear() {
    for (const [id, entity] of this.entities) {
      entity.unpublish().direct().execute();
    }
  }

  // Returns true if a piece has reached the far end of the board based on its "forward" direction
  isEdgeOfBoardForForwardDirection(position: Vector, forwardDirection: Vector): boolean {
    if(
      (forwardDirection.y === -1 && position.y === 0) ||
      (forwardDirection.y === 1 && position.y === 7) ||
      (forwardDirection.x === -1 && position.x === 0) ||
      (forwardDirection.x === 1 && position.y === 7)
      ) {
        return true;
    }
    return false;
  }

  move(from: Vector | string, to: Vector | string, playerMovement: boolean = true): MoveAction | undefined {
    let orig = from instanceof Vector ? from : Chessboard.fromAlgebraic(from);
    let dest = to instanceof Vector ? to : Chessboard.fromAlgebraic(to);
    if (orig === undefined || dest === undefined) {
      return undefined;
    }
    const piece = this.getEntitiesAtCoordinates(orig.x, orig.y)[0];
    if(piece === undefined) {
      return undefined;
    }
    return piece.move({ to: dest, metadata: { playerMovement } });
  }

  setUpStandardGame(whiteTeam: Team, blackTeam: Team) {
    // Set up white team
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('a2')! }).direct().execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('b2')! }).direct().execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('c2')! }).direct().execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('d2')! }).direct().execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('e2')! }).direct().execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('f2')! }).direct().execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('g2')! }).direct().execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('h2')! }).direct().execute();
    Rook(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('a1')! }).direct().execute();
    Knight(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('b1')! }).direct().execute();
    Bishop(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('c1')! }).direct().execute();
    Queen(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('d1')! }).direct().execute();
    King(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('e1')! }).direct().execute();
    Bishop(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('f1')! }).direct().execute();
    Knight(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('g1')! }).direct().execute();
    Rook(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('h1')! }).direct().execute();
    // Set up black team
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('a7')! }).direct().execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('b7')! }).direct().execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('c7')! }).direct().execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('d7')! }).direct().execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('e7')! }).direct().execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('f7')! }).direct().execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('g7')! }).direct().execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('h7')! }).direct().execute();
    Rook(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('a8')! }).direct().execute();
    Knight(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('b8')! }).direct().execute();
    Bishop(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('c8')! }).direct().execute();
    Queen(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('d8')! }).direct().execute();
    King(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('e8')! }).direct().execute();
    Bishop(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('f8')! }).direct().execute();
    Knight(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('g8')! }).direct().execute();
    Rook(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('h8')! }).direct().execute();
  }

  // Convert vector to algebraic, ie { 0 ,0 } to 'a8'
  static toAlgebraic(vector: Vector): string | undefined {
    if (!Chessboard.isInBounds(vector)) {
      return undefined;
    }
    const row = vector.y * -1 + 8;
    const column = algebraicFiles[vector.x];
    if (column === undefined) {
      return undefined;
    }
    return column + row.toString();
  }

  // Convert algebraic into a vector, ie 'a8' to { 0, 0 }
  static fromAlgebraic(algebraic: string): Vector | undefined {
    if (algebraic.length !== 2) {
      return undefined;
    }
    const letter = algebraic[0];
    const column = algebraicFiles.findIndex(val => val === letter);
    if (column === -1) {
      return undefined;
    }
    const row = (parseInt(algebraic[1], 10) -1) * -1 + 7;
    if (!(typeof row === 'number')) {
      return undefined;
    }
    const vector = new Vector(column, row);
    if (Chessboard.isInBounds(vector)) {
      return vector;
    } else {
      return undefined;
    }
  }

  static getCaptureSlot(team: ChessTeam, previouslyCaptured: number): Vector {
    const startingVector = team === 'WHITE' ? Chessboard.whiteCaptureStart : Chessboard.blackCaptureStart;
    return startingVector.add(new Vector(
      Math.floor(previouslyCaptured / 8),
      previouslyCaptured % 8
    ));
  }
  
  static isInBounds(position: Vector) {
    return position.x < 8 && position.y < 8;
  }

  exportToJSON(): any {
    let json: any = {};
    for(const [, entity] of this.entities) {
      const algebriac = Chessboard.toAlgebraic(entity.position);
      if(algebriac !== undefined) {
        json[algebriac.toUpperCase()] = entity.metadata.get('notation');
      }
    }
    return json;
  }

  serialize(): string {
    return "";
  }

  unserialize(data: string): Chessboard {
    return new Chessboard();
  }
}
