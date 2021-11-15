import { Action, ChangeTurnAction, Chaos, Component, LogicalAction, Scope, Team } from '@chaos-framework/core';
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

  constructor(private difficulty = 2, public automaticMovement = false, public delay = 0) {
    super();
    if (difficulty < 0 || difficulty > 4) {
      this.difficulty = 2;
    }
    this.name = `${difficultyNames[this.difficulty]} AI`;
  }

  // Play moves for the attached team
  ai(action: Action) {
    const { automaticMovement, delay } = this;
    if (
      automaticMovement &&
      this.parent instanceof Team &&
      (action instanceof ChangeTurnAction && action.to === this.parent) ||
      (action instanceof LogicalAction && action.name === "GAME_START" && action.payload.firstTeam === this.parent)
    ) {
      const aiMove = this.getAIMove();
      if(aiMove === undefined) {
        console.error('AI could not find a move for this board.');
        return;
      }
      const moveAction = Chess.board.move(aiMove[0], aiMove[1]);
      if(moveAction === undefined) {
        console.error('AI could not find a move for this board.');
        return;
      }
      if(delay > 0) {
        setTimeout( () => {
            action.followup(moveAction);
            Chaos.process(); 
          }, delay)
      } else {
        action.followup(moveAction);
      }
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
