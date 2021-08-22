import { Component } from '@chaos/core'

import Captures from '../../Components/Captures';
import CannotLandOnTeam from '../../Components/Movement/CannotLandOnTeam';
import CountsMovements from '../../Components/Movement/CountsMovements';
import HasToMoveAtLeastOneSpace from '../../Components/Movement/HasToMoveAtLeastOneSpace';

export function generateCommonComponents(): Component[] {
  return [
    new CannotLandOnTeam,
    new Captures,
    new CountsMovements,
    new HasToMoveAtLeastOneSpace
  ]
}