import { Ctx } from '../../../types/ctx';
import { FunctionInfo } from '../../../utils/functionInfo';
import { Attr } from './attributes';

export const updateAttributeCommon = (attrParam: Attr, isOwner: boolean = false) => {
  return new FunctionInfo((ctx: Ctx, attrParam: Attr, isOwner: boolean) => {
    const rateAV = (attr: Attr) => (attr === 'health' ? 'av_healrate' : `av_${attr}rate`);
    const multAV = (attr: Attr) => (attr === 'health' ? 'av_healratemult' : `av_${attr}ratemult`);
    const drainAV = (attr: Attr) => `av_mp_${attr}drain`;

    const av = attrParam;
    if (!ctx.refr || !ctx.get) return;
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;

    const base: number = ctx.value.base || 0;
    const perm: number = ctx.value.permanent || 0;
    const temp: number = ctx.value.temporary || 0;
    // ctx.sp.printConsole(base, perm, temp);
    const targetMax: number = base + perm + temp;

    const numChangesKey = `${av}NumChanges`;
    const numChanges = ctx.get(numChangesKey);
    if (ctx.state[numChangesKey] !== numChanges) {
      ctx.state[numChangesKey] = numChanges;
      ctx.state[`${av}RegenStart`] = +Date.now();
    }

    const realTargetDmg: number = ctx.value.damage || 0;
    let targetDmg = realTargetDmg;

    if (av === 'health' || ac.getFormID() == 0x14) {
      const multName = multAV(av);
      const rateName = rateAV(av);
      const drainName = drainAV(av);

      const additionalRegenMult = 1.0;
      const regenDuration = (+Date.now() - (ctx.state[`${av}RegenStart`] || 0)) / 1000;

      const healRateMult = ctx.get(multName);

      const healRateMultCurrent =
        (healRateMult?.base || 0) +
        (healRateMult?.permanent || 0) +
        (healRateMult?.temporary || 0) +
        (healRateMult?.damage || 0);

      const healRate = ctx.get(rateName);
      const healRateCurrent =
        (healRate?.base || 0) + (healRate?.permanent || 0) + (healRate?.temporary || 0) + (healRate?.damage || 0);

      const drain = ctx.get(drainName);
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
    // ctx.sp.printConsole(targetMax, targetDmg);
    if (ctx.get('isDead') && av === 'health') {
      targetPercentage = 0;
    }

    const deltaPercentage = targetPercentage - currentPercentage;

    const k = !targetPercentage || av === 'stamina' || av === 'magicka' ? 1 : 0.25;
    // ctx.sp.printConsole(av, k)

    if (deltaPercentage > 0) {
      ac.restoreActorValue(av, deltaPercentage * currentMax * k);
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
