import { Action, Component, MoveAction, Reacter, Vector } from '@chaos/core'
import Chessboard from '../Worlds/Chessboard';
const chessEngine = require('chess');

export default class Simulator extends Component implements Reacter {
  name = "Simulator";
  public = false;
  engine = chessEngine.createSimple();

  move(from?: Vector, to?: Vector) {
    if(from === undefined || to === undefined) {
      return;
    }
    const fromAlgebriac = Chessboard.toAlgebraic(from);
    const toAlgebriac = Chessboard.toAlgebraic(to);
    this.engine.move(fromAlgebriac, toAlgebriac);
    this.engine.game
  }

  react(action: Action) {
    if (action instanceof MoveAction && action.tagged('playerMovement')) {
      try {
        this.move(action.from, action.to);
      } catch (error) {
        console.log('FOOD MACHINE BROKE');
      }
    }
  }
}
