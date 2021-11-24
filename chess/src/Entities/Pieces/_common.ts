import { Component } from '@chaos-framework/core'

import Captures from '../../Components/Combat/Captures.js';
import CannotLandOnTeam from '../../Components/Movement/CannotLandOnTeam.js';
import CountsMovements from '../../Components/Movement/CountsMovements.js';
import HasToMoveAtLeastOneSpace from '../../Components/Movement/HasToMoveAtLeastOneSpace.js';

export function generateCommonComponents(): Component[] {
  return [
    new CannotLandOnTeam,
    new Captures,
    new HasToMoveAtLeastOneSpace,
    new CountsMovements
  ]
}
