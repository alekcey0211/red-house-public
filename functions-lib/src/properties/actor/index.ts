import { statePropFactory } from '../../papyrus/multiplayer/functions';
import { Ctx } from '../../types/ctx';
import { Mp } from '../../types/mp';
import { FunctionInfo } from '../../utils/functionInfo';
import * as attributes from './actorValues/attributes';
import * as skill from './actorValues/skill';

const updateNeighborIsDead = (ctx: Ctx) => {
	if (!ctx.refr) return;
	const ac = ctx.sp.Actor.from(ctx.refr);
	if (!ac) return;

	const isDead = ctx.value;
	if (isDead) {
		ac.endDeferredKill();
		ac.kill(null);
	} else {
		ac.startDeferredKill();
	}

	if (!isDead && ac.isDead()) {
		ctx.respawn();
	}
};

const updateOwnerIsDead = (ctx: Ctx) => {
	if (!ctx.refr) return;
	const ac = ctx.sp.Actor.from(ctx.refr);
	if (!ac) return;

	ac.startDeferredKill();

	const value = ctx.value;
	if (value === undefined) return;
	if (value !== ctx.state.value) {
		const die = !!value;
		ctx.state.value = value;

		if (!die) return ctx.sp.Debug.sendAnimationEvent(ac, 'GetUpBegin');

		const pos = [ac.getPositionX(), ac.getPositionY(), ac.getPositionZ()];

		// Everyone should stop combat with us
		for (let i = 0; i < 200; ++i) {
			const randomActor = ctx.sp.Game.findRandomActor(pos[0], pos[1], pos[2], 10000);
			if (!randomActor) continue;
			const tgt = randomActor.getCombatTarget();
			if (!tgt || tgt?.getFormID() !== 0x14) continue;
			randomActor.stopCombat();
		}

		ac.pushActorAway(ac, 0);
	}
};

const updateRace = (ctx: Ctx<{ lastRace: number }, number>) => {
	if (!ctx.refr || ctx.value === undefined || ctx.state.lastRace === ctx.value) return;
	const ac = ctx.sp.Actor.from(ctx.refr);
	if (!ac) return;
	const raceForm = ctx.sp.Game.getForm(ctx.value);
	if (!raceForm) return;
	const race = ctx.sp.Race.from(raceForm);
	if (!race) return;
	ac.setRace(race);
	ctx.state.lastRace = ctx.value;
};

export const register = (mp: Mp): void => {
	attributes.register(mp);
	skill.register(mp);

	statePropFactory(mp, 'isWeaponDrawn');
	statePropFactory(mp, 'isSprinting');
	statePropFactory(mp, 'CurrentCrosshairRef');
	statePropFactory(mp, 'isFlying');
	statePropFactory(mp, 'isBlocking');
	statePropFactory(mp, 'isFirstLoad');

	statePropFactory(mp, 'startZCoord');

	mp.makeProperty('isDead', {
		isVisibleByOwner: true,
		isVisibleByNeighbors: true,
		updateNeighbor: new FunctionInfo(updateNeighborIsDead).tryCatch(),
		updateOwner: new FunctionInfo(updateOwnerIsDead).tryCatch(),
	});

	mp.makeProperty('race', {
		isVisibleByOwner: true,
		isVisibleByNeighbors: true,
		updateNeighbor: new FunctionInfo(updateRace).tryCatch(),
		updateOwner: new FunctionInfo(updateRace).tryCatch(),
	});
};
