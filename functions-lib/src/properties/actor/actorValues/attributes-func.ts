import { Ctx } from '../../../types/ctx';
import { FunctionInfo } from '../../../utils/functionInfo';
import { Attr, ModifierValue, Mult, Skill } from './attributes';

export const updateAttributeCommon = (attrParam: Attr, isOwner: boolean = false): string => {
	return new FunctionInfo((ctx: Ctx<any, ModifierValue>, attrParam: Attr, isOwner: boolean) => {
		const rateAV = (attr: Attr) => (attr === 'health' ? 'av_healrate' : `av_${attr}rate`);
		const multAV = (attr: Attr) => (attr === 'health' ? 'av_healratemult' : `av_${attr}ratemult`);
		const drainAV = (attr: Attr) => `av_mp_${attr}drain`;

		const av = attrParam;
		if (!ctx.refr || !ctx.get) return;
		const ac = ctx.sp.Actor.from(ctx.refr);
		if (!ac) return;
		if (!ctx.value) return;

		const base: number = ctx.value.base || 0;
		const perm: number = ctx.value.permanent || 0;
		const temp: number = ctx.value.temporary || 0;
		const targetMax: number = base + perm + temp;

		const numChangesKey = `${av}NumChanges`;
		const numChanges = ctx.get(numChangesKey);
		if (ctx.state[numChangesKey] !== numChanges) {
			ctx.state[numChangesKey] = numChanges;
			ctx.state[`${av}RegenStart`] = +Date.now();
		}

		const realTargetDmg: number = ctx.value.damage || 0;
		let targetDmg = realTargetDmg;

		if (av === 'health' || ac.getFormID() === 0x14) {
			const multName = multAV(av);
			const rateName = rateAV(av);
			const drainName = drainAV(av);

			const additionalRegenMult = 1.0;
			const regenDuration = (+Date.now() - (ctx.state[`${av}RegenStart`] || 0)) / 1000;

			const healRateMult = ctx.get<ModifierValue>(multName);

			const healRateMultCurrent =
				(healRateMult?.base || 0) +
				(healRateMult?.permanent || 0) +
				(healRateMult?.temporary || 0) +
				(healRateMult?.damage || 0);

			const healRate = ctx.get<ModifierValue>(rateName);
			const healRateCurrent =
				(healRate?.base || 0) + (healRate?.permanent || 0) + (healRate?.temporary || 0) + (healRate?.damage || 0);

			const drain = ctx.get<ModifierValue>(drainName);
			const drainCurrent =
				(drain?.base || 0) + (drain?.permanent || 0) + (drain?.temporary || 0) + (drain?.damage || 0);
			if (drainCurrent) {
				targetDmg += regenDuration * drainCurrent;
			} else {
				targetDmg +=
					regenDuration * additionalRegenMult * healRateCurrent * healRateMultCurrent * 0.01 * targetMax * 0.01;
			}

			if (targetDmg > 0) {
				targetDmg = 0;
			}
		}

		const currentPercentage = ac.getActorValuePercentage(av);
		const currentMax = ac.getBaseActorValue(av);

		let targetPercentage = (targetMax + targetDmg) / targetMax;
		if (ctx.get('isDead') && av === 'health') {
			targetPercentage = 0;
		}

		const deltaPercentage = targetPercentage - currentPercentage;

		let k = !targetPercentage || av === 'magicka' ? 1 : 0.25;

		if (av === 'stamina') {
			k = 0.0003;
		}

		if (deltaPercentage > 0) {
			ac.restoreActorValue(av, currentMax * deltaPercentage * k);
		} else if (deltaPercentage < 0) {
			ac.damageActorValue(av, deltaPercentage * currentMax * k);
		}

		if (isOwner) {
			ac.setActorValue(av, base);
		} else if (av === 'health') {
			ac.setActorValue(av, base * 100);
		}
	}).getText({ attrParam, isOwner });
};

export const updateAttributeSimple = (attrParam: Mult | Skill): string => {
	return new FunctionInfo((ctx: Ctx<any, ModifierValue>, attrParam: Mult | Skill) => {
		const av = attrParam;
		if (!ctx.refr || !ctx.get) return;
		const ac = ctx.sp.Actor.from(ctx.refr);
		if (!ac) return;
		if (!ctx.value) return;

		if (JSON.stringify(ctx.value) === JSON.stringify(ctx.state.lastAttributeSkillValues)) return;
		ctx.state[`last${av}Value`] = ctx.value;

		const base: number = ctx.value.base || 0;
		const perm: number = ctx.value.permanent || 0;
		const temp: number = ctx.value.temporary || 0;
		const targetMax: number = base + perm + temp;

		const targetDmg: number = ctx.value.damage || 0;

		const currentPercentage = ac.getActorValuePercentage(av);
		const currentMax = ac.getBaseActorValue(av);

		const targetPercentage = (targetMax + targetDmg) / targetMax;

		const deltaPercentage = targetPercentage - currentPercentage;

		if (deltaPercentage > 0) {
			ac.restoreActorValue(av, deltaPercentage * currentMax);
		} else if (deltaPercentage < 0) {
			ac.damageActorValue(av, deltaPercentage * currentMax);
		}

		ac.setActorValue(av, base);
	}).getText({ attrParam });
};
