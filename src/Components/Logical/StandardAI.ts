import { Action, Component, Team } from '@chaos/core'
import Chess from '../..';

export const AI_LEVELS = [0, 1, 2, 3, 4]

// When attached to a team will play moves in a standard chess game
// Relies on 
export default class StandardAI extends Component {
  name = "Standard AI";
  constructor(public team: Team, difficulty = 2) {
    super();
    this.name = "hi";
  }

  react(action: Action) {
    // Make sure we're tracking state
    
  }
}
