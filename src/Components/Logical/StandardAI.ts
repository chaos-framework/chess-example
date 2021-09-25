import { Action, Component, Team } from '@chaos/core'

// When attached to a team will play moves in a standard chess game
export default class StandardAI extends Component {
  constructor(public team: Team) {
    super();
  }

  react(action: Action) {
    // See if there's an active simulator running
    // Chess.
  }
}