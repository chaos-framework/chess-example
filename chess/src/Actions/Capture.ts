import { Action, ActionParameters, Entity, UnpublishEntityAction } from '@chaos-framework/core';

export default class Capture extends UnpublishEntityAction {
  constructor(public piece: Entity, public by: Entity, options: ActionParameters = {}) {
    super({ target: piece, caster: by, entity: piece, ...options});
  }
}