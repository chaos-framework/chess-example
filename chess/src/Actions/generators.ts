import { Entity, LogicalAction } from "@chaos-framework/core";
import actions from './types';

export const createCheckAction = (target: Entity, caster: Entity) => {
  return new LogicalAction(actions.CHECK, {}, { caster, target })
}

export const createCheckmateAction = (target: Entity, caster: Entity) => {
  return new LogicalAction(actions.CHECKMATE, {}, { caster, target })
}

export const createResetAction = (target: Entity, caster: Entity) => {
  return new LogicalAction(actions.RESET, {}, { caster, target })
}
