import { Ctx } from '../types/ctx';
import { Mp } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';

const blockActivation = (ctx: Ctx<{ lastBlockActivationState: boolean }, boolean>) => {
  if (!ctx.refr) return;

  if (ctx.value === undefined || ctx.state.lastBlockActivationState === ctx.value) return;

  ctx.refr.blockActivation(ctx.value);
  ctx.state.lastBlockActivationState = ctx.value;
};

export const register = (mp: Mp): void => {
  mp.makeProperty('blockActivationState', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new FunctionInfo(blockActivation).tryCatch(),
    updateNeighbor: new FunctionInfo(blockActivation).tryCatch(),
  });
};
