import { Component } from '@chaos-framework/core'

import Captures from '../../Components/Combat/Captures';
import CannotLandOnTeam from '../../Components/Movement/CannotLandOnTeam';
import CountsMovements from '../../Components/Movement/CountsMovements';
import HasToMoveAtLeastOneSpace from '../../Components/Movement/HasToMoveAtLeastOneSpace';

export function generateCommonComponents(): Component[] {
  return [
    new CannotLandOnTeam,
    new Captures,
    new HasToMoveAtLeastOneSpace,
    new CountsMovements
  ]
}
