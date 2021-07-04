import { Mp } from '../../../types/mp';
import { FunctionInfo } from '../../../utils/functionInfo';
import { avUpdate } from './functions';

export const register = (mp: Mp): void => {
  ['speedmult', 'weaponspeedmult'].forEach((avName) => {
    mp.makeProperty(`av${avName}`, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: true,
      updateOwner: new FunctionInfo(avUpdate).getText({ avName }),
      updateNeighbor: new FunctionInfo(avUpdate).getText({ avName }),
    });
  });
};
