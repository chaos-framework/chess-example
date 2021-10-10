import { Action, Component, Team } from '@chaos/core';
const jsChessEngine = require('js-chess-engine');

const { move, aiMove } = jsChessEngine

import Chess from '../..';

const difficultyNames = [
  'Dumb',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Master'
]

// When attached to a team will play moves in a standard chess game
// Relies on js-chess-engine
export default class StandardAI extends Component {
  name = "Standard AI";

  constructor(private difficulty = 2, public moveAutomatically = true) {
    super();
    if(difficulty < 0 || difficulty > 4) {
      this.difficulty = 2;
    }
    this.name = `${difficultyNames[this.difficulty]} AI`;
  }

  react(action: Action) {
    if(this.moveAutomatically) {
      // ...
    }
  }

  getAIMove(): [string, string] | undefined {
    try {
      const boardConfiguration = Chess.exportToJSEngineStatelessFormat();
      const result = aiMove(boardConfiguration, this.difficulty);
      if (result instanceof Object) {
        const keys = Object.keys(result);
        if (keys.length === 1) {
          const key = keys[0];
          return [key, result[key]]
        }
      }
      return undefined;
    } catch (e) {
      return undefined;
    }
  }
}
