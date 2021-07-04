import { statePropFactory } from '../papyrus/multiplayer/functions';
import { Mp } from '../types/mp';

export const register = (mp: Mp): void => {
  statePropFactory(mp, 'keybinding_browserSetModal');
  statePropFactory(mp, 'keybinding_browserSetVisible');
  statePropFactory(mp, 'keybinding_browserSetFocused');
};
