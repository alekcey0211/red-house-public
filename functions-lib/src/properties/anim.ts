import { statePropFactory } from '../papyrus/multiplayer/functions';
import { Mp } from '../types/mp';

export const register = (mp: Mp): void => {
  statePropFactory(mp, 'lastAnimation');
};
