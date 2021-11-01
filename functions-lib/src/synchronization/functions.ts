import { State } from '.';
import { Ctx } from '../types/ctx';

export const stateChangeFactory = (
	ctx: Ctx<Record<State, boolean>, boolean>,
	stateName: State,
	states: State[]
): void => {
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
