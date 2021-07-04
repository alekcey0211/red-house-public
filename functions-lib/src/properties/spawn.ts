import { statePropFactory } from '../papyrus/multiplayer/functions';
import { Mp } from '../types/mp';

export const register = (mp: Mp): void => {
  statePropFactory(mp, 'spawnPointPosition');
  statePropFactory(mp, 'spawnPointAngle');
  statePropFactory(mp, 'spawnPointWorldOrCellDesc');
  statePropFactory(mp, 'spawnTimeToRespawn');
};
