import { Ctx } from '../../../types/ctx';

export function avUpdate(ctx: Ctx<Record<string, number | undefined>, number | undefined>, avName: string): void {
	if (ctx.refr && ctx.value !== undefined && ctx.state[`last${avName}Value`] !== ctx.value) {
		const ac = ctx.sp.Actor.from(ctx.refr);
		if (!ac) return;

		ac.setActorValue(avName, ctx.value);

		ctx.state[`last${avName}Value`] = ctx.value;
	}
}

export function avUpdateDamage(ctx: Ctx<Record<string, number | undefined>, number | undefined>, avName: string): void {
	if (ctx.refr && ctx.value !== undefined && ctx.state[`last${avName}ValueDamage`] !== ctx.value) {
		const ac = ctx.sp.Actor.from(ctx.refr);
		if (!ac) return;

		ac.damageActorValue(avName, ctx.value);

		ctx.state[`last${avName}ValueDamage`] = ctx.value;
	}
}

export function avUpdateRestore(
	ctx: Ctx<Record<string, number | undefined>, number | undefined>,
	avName: string
): void {
	if (ctx.refr && ctx.value !== undefined && ctx.state[`last${avName}ValueRestore`] !== ctx.value) {
		const ac = ctx.sp.Actor.from(ctx.refr);
		if (!ac) return;

		ac.restoreActorValue(avName, ctx.value);

		ctx.state[`last${avName}ValueRestore`] = ctx.value;
	}
}

export function avUpdateExp(ctx: Ctx<Record<string, number | undefined>, number | undefined>, avName: string): void {
	if (ctx.refr && ctx.value !== undefined && ctx.state[`last${avName}ValueExp`] !== ctx.value) {
		const ac = ctx.sp.Actor.from(ctx.refr);
		if (!ac) return;

		const avInfo = ctx.sp.ActorValueInfo.getActorValueInfoByName(avName);
		if (!avInfo) return;

		// const prevlvl = ctx.state[`prev${avName}Value`] ?? 15;
		const lvl = ac.getActorValue(avName);
		// ctx.sp.printConsole(prevlvl, lvl);
		const nextExp = avInfo.getExperienceForLevel(lvl);
		const multiply = nextExp / 100;
		avInfo.setSkillExperience(ctx.value * multiply);

		ctx.state[`last${avName}ValueExp`] = ctx.value;
	}
}
