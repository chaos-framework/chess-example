import { Action, ChangeTurnAction, Component, Scope, Team } from '@chaos-framework/core';
const jsChessEngine = require('js-chess-engine');

const { aiMove } = jsChessEngine

import * as Chess from'../..';

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

  scope: { [key: string]: Scope } = {
    ai: 'game'
  }

  constructor(private difficulty = 2, public moveAutomatically = true) {
    super();
    if (difficulty < 0 || difficulty > 4) {
      this.difficulty = 2;
    }
    this.name = `${difficultyNames[this.difficulty]} AI`;
  }

  // Play moves for the attached team
  ai(action: Action) {
    if (
      this.moveAutomatically &&
      action instanceof ChangeTurnAction &&
      this.parent !== undefined &&
      action.to === this.parent
    ) {
      const aiMove = this.getAIMove();
      if(aiMove === undefined) {
        console.log('AI could not find a move for this board.');
        return;
      }
      console.log(aiMove);
      const moveAction = Chess.board.move(aiMove[0], aiMove[1]);
      if(moveAction === undefined) {
        console.log('AI could not find a move for this board.');
        return;
      }
      action.followup(moveAction);
    }
  }

  getAIMove(): [string, string] | undefined {
    try {
      const boardConfiguration = Chess.exportToJSEngineStatelessFormat();
      if(boardConfiguration.checkMate === true) {
        return undefined;
      }
      const result = aiMove(boardConfiguration, this.difficulty);
      if (result instanceof Object) {
        const keys = Object.keys(result);
        if (keys.length === 1) {
          const key = keys[0];
          return [key.toLowerCase(), result[key].toLowerCase()]
        }
      }
      return undefined;
    } catch (e) {
      return undefined;
    }
  }
}
