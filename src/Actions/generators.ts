import { Entity, LogicalAction } from "@chaos/core";
import actions from './types';

export const createCheckAction = (target: Entity, caster: Entity) => {
  return new LogicalAction(actions.CHECK, {}, { caster, target })
}

export const createCheckmateAction = (target: Entity, caster: Entity) => {
  return new LogicalAction(actions.CHECKMATE, {}, { caster, target })
}