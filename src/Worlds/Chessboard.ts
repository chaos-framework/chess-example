import { Chaos, World, Vector, Team } from '@chaos/core';

import Pawn from '../Entities/Pieces/Pawn';
import Rook from '../Entities/Pieces/Rook';
import Knight from '../Entities/Pieces/Knight';
import Bishop from '../Entities/Pieces/Bishop';
import Queen from '../Entities/Pieces/Queen';
import King from '../Entities/Pieces/King';
import Tiles from '../Enums/Tile';

const algebraicFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export default class Chessboard extends World {
  constructor() {
    super({ width: 13, height: 8, fill: Tiles.EMPTY });
    
    // Fill in white tiles
    this.baseLayer.drawSquare(Tiles.WHITE, new Vector(0, 0), 8);
    // Set every other tile inside the board to black
    for(let x = 0; x < 8; x++) {
      for(let y = 0; y < 8; y++) {
        if((x + y) % 2 === 1) {
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
      entity.unpublish().execute();
    }
  }

  setUpStandardGame(whiteTeam: Team, blackTeam: Team) {
    // Set up white team
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('a2')! }).execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('b2')! }).execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('c2')! }).execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('d2')! }).execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('e2')! }).execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('f2')! }).execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('g2')! }).execute();
    Pawn(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('h2')! }).execute();
    Rook(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('a1')! }).execute();
    Knight(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('b1')! }).execute();
    Bishop(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('c1')! }).execute();
    Queen(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('d1')! }).execute();
    King(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('e1')! }).execute();
    Bishop(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('f1')! }).execute();
    Knight(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('g1')! }).execute();
    Rook(whiteTeam).publish({ world: this, position: Chessboard.fromAlgebraic('h1')! }).execute();
    // Set up black team
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('a7')! }).execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('b7')! }).execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('c7')! }).execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('d7')! }).execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('e7')! }).execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('f7')! }).execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('g7')! }).execute();
    Pawn(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('h7')! }).execute();
    Rook(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('a8')! }).execute();
    Knight(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('b8')! }).execute();
    Bishop(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('c8')! }).execute();
    Queen(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('d8')! }).execute();
    King(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('e8')! }).execute();
    Bishop(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('f8')! }).execute();
    Knight(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('g8')! }).execute();
    Rook(blackTeam).publish({ world: this, position: Chessboard.fromAlgebraic('h8')! }).execute();
  }

  // Convert vector to algebraic, ie { 0 ,0 } to 'a8'
  static toAlgebraic(vector: Vector): string | undefined {
    if(!Chessboard.isInBounds(vector)) {
      return undefined;
    }
    const row = vector.y * -1 + 8;
    const column = algebraicFiles[vector.x];
    if(column === undefined) {
      return undefined;
    }
    return column + row.toString();
  }

  // Convert algebraic into a vector, ie 'a8' to { 0, 0 }
  static fromAlgebraic(algebraic: string): Vector | undefined {
    if(algebraic.length !== 2) {
      return undefined;
    }
    const letter = algebraic[0];
    const column = algebraicFiles.findIndex(val => val === letter);
    if(column === -1) {
      return undefined;
    }
    const row = (parseInt(algebraic[1], 10) -1) * -1 + 7;
    if(!(typeof row === 'number')) {
      return undefined;
    }
    const vector = new Vector(column, row);
    if(Chessboard.isInBounds(vector)) {
      return vector;
    } else {
      return undefined;
    }
  }

  static getCaptureSlot(team: 'WHITE' | 'BLACK', previouslyCaptured: number): Vector {
    const startingVector = team === 'WHITE' ? Chessboard.whiteCaptureStart : Chessboard.blackCaptureStart;
    return startingVector.add(new Vector(
      Math.floor(previouslyCaptured / 8),
      previouslyCaptured % 8
    ));
  }
  
  static isInBounds(position: Vector) {
    return position.x < 8 && position.y < 8;
  }

  serialize(): string {
    return "";
  }

  unserialize(data: string): Chessboard {
    return new Chessboard();
  }
}
