import { Action, ChangeTurnAction, Component, Entity, Scope, Vector } from '@chaos/core'

export default class EnPassant extends Component {
  name = 'En Passant';
  description = 'Vulnerable to capture from another pawn landing immediately behind this piece.';

  scope = {
    'react': 'game' as Scope
  }

  constructor(public location: Vector) {
    super();
  }

  // Detach self when it's the parent's turn again
  react(action: Action) {
    if (action instanceof ChangeTurnAction && this.parent instanceof Entity && action.to === this.parent.team) {
      action.react(this.detach({ target: this.parent }));
    }
  }
}
