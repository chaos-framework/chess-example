import { Action, Component, Team } from '@chaos/core'
import Chess from '../..';

// When attached to a team will play moves in a standard chess game
export default class StandardAI extends Component {
  constructor(public team: Team) {
    super();
  }

  react(action: Action) {
    // Make sure there is an active simulator running
  }
}
