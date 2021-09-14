import { Chaos, Entity, Vector, World } from '@chaos/core';

export function isInCheck(board: World, piece: Entity): boolean {
  const friendlyTeam = piece.metadata.get('team');
  if(friendlyTeam === undefined) {
    return false;
  }
  // Get all pieces on the board that do not belong to the friendly team
  const enemyPieces: Entity[] = [];
  for (const entityId of board.entities) {
    const entity = Chaos.getEntity(entityId);
    if (entity !== undefined) {
      const entityTeam = entity.metadata.get('team');
      if (entityTeam !== undefined && entityTeam !== friendlyTeam) {
        enemyPieces.push(entity);
      }
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
