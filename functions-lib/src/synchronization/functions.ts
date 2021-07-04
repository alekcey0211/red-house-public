import { State } from '.';
import { Ctx } from '../types/ctx';

export const stateChangeFactory = (ctx: Ctx, stateName: State, states: State[]) => {
  ctx.sp.on('update', () => {
    const ac = ctx.sp.Game.getPlayer();

    if (!ac) return;
    if (!states.includes(stateName)) return;

    const stateValue = ac[stateName]();
    if (ctx.state[stateName] !== stateValue) {
      if (ctx.state[stateName] !== undefined) {
        ctx.sendEvent(stateValue);
      }
      ctx.state[stateName] = stateValue;
    }
  });
};
