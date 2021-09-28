import { Chaos, Entity, Vector, World } from '@chaos/core';

export function isInCheck(board: World, piece: Entity): boolean {
  if(piece.team === undefined) {
    return false;
  }
  // Get all pieces on the board that do not belong to the friendly team
  const enemyPieces: Entity[] = [];
  for (const [id, entity] of board.entities) {
    if (entity.team !== piece.team) {
      enemyPieces.push(entity);
    }
  }
  // See if any are capable of moving onto this piece's position
  for(const enemy of enemyPieces) {
    // Note that the metadata "query: true" is so components don't take any actions on this fake action
    const potentialCapture = enemy.move({ to: piece.position, metadata: { playerMovement: true, query: true }});
    enemy.modify(potentialCapture);
    potentialCapture.decidePermission();
    if(potentialCapture.permitted) {
      return true;
    }
  }
  return false;
}

export function movementWillResultInCheck(board: World, checkablePiece: Entity, movingPiece: Entity, to: Vector) {
  // Temporarily move the piece to the location and test if the piece is in check
  const originalLocation = movingPiece.position;
  movingPiece._move(to);
  const inCheck = isInCheck(board, checkablePiece);
  movingPiece._move(originalLocation);
  return inCheck;
}
