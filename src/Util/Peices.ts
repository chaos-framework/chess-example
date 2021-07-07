import { Entity } from '@chaos/core';

export const getTeamFromTag = (entity: Entity): 'WHITE' | 'BLACK' | undefined => {
  if (entity.tagged('WHITE')) {
    return 'WHITE'
  } else if (entity.tagged('BLACK')) {
    return 'BLACK'
  } else {
    return undefined;
  }
}