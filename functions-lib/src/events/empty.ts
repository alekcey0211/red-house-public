import { throwOrInit } from '.';
import { Mp } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';
import { sendPlayerPos } from './empty-functions';

export const register = (mp: Mp): void => {
  mp.makeEventSource('_empty01', new FunctionInfo(sendPlayerPos).body);

  if (mp.timer) {
    clearTimeout(mp.timer as number);
  }
  const interval = () => {
    mp.timer = setTimeout(() => {
      mp.get(0, 'onlinePlayers').forEach((id) => {
        const neighbors = mp.get(id, 'neighbors').filter((n) => mp.get(n, 'type') === 'MpActor');

        neighbors.forEach((n) => {
          throwOrInit(mp, n);
        });
      });
      interval();
    }, 200);
  };
  interval();
};
