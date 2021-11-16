import { serverOptionProvider } from '../..';
import { getRaceUnarmedDamage } from '../papyrus/race';
import { EspmLookupResult, Mp, PapyrusObject } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';
import { onHit } from './functions';
import { actorValues as av } from '../properties/actor/actorValues/attributes';
import * as p from '../modules';
import { logExecuteTime } from './shared';
import { HitEvent } from '../types/event';

const hitHandle = (mp: Mp, event: any, target: PapyrusObject, agressor: PapyrusObject) => {
	mp.modules.forEach((module) => {
		try {
			if (!module.onHit) return;
			const s = Date.now();
			module.onHit(
				new p.Actor(target),
				new p.Actor(agressor),
				event.isPowerAttack,
				event.isSneakAttack,
				event.isBashAttack,
				event.isHitBlocked
			);
			logExecuteTime(s, `${module.name}.onHit`);
		} catch (err) {
			console.error(`error in module ${module.name} onHit`, err);
		}
	});

	mp.callPapyrusFunction('global', 'GM_Main', '_onHit', null, [
		target,
		agressor,
		event.isPowerAttack,
		event.isSneakAttack,
		event.isBashAttack,
		event.isHitBlocked,
	]);
};

const hitSync = (
	mp: Mp,
	pcFormId: number,
	event: HitEvent,
	target: PapyrusObject,
	agressor: PapyrusObject,
	isDead: boolean
) => {
	const { HitDamageMod, isPowerAttackMult, isBashAttackMult } = serverOptionProvider.getServerOptions();

	const agressorId: number = mp.getIdFromDesc(agressor.desc);

	let damageMod: number = HitDamageMod;

	// TODO: нужно учитывать оружие в левой руке
	// * BUG: оружие в левой руке не учитывается в свойстве equipment

	const weaponType: 'hands' | 'hammer' | 'other' = mp.get(agressorId, 'weaponType') ?? 'hands';

	const isHammer: boolean = weaponType === 'hammer';

	// TODO: перенести на смену расы или вход в игру
	if (weaponType === 'hands') {
		// Руки
		const raceId = mp.get<number>(agressorId, 'race');

		if (raceId) {
			const espmRecord = mp.lookupEspmRecordById(raceId) as EspmLookupResult;
			const unarmedDamage = getRaceUnarmedDamage(espmRecord);

			if (unarmedDamage) damageMod = -unarmedDamage;
		}
	} else if (weaponType === 'hammer') {
		// Если молот
		const baseDmg: number = mp.get<number>(agressorId, 'weaponDamage') ?? 0;

		if (baseDmg) damageMod = baseDmg * -1;
	} else if (weaponType === 'other') {
		// Если обычное оружие как оружие
		const baseDmg: number = mp.get<number>(agressorId, 'weaponDamage') ?? 0;
		if (baseDmg) damageMod = baseDmg * -1;
	}

	const armorValue: number = mp.get<number>(mp.getIdFromDesc(target.desc), 'armorValue') ?? 0;

	const armorPercent: number = (armorValue / 180) * 0.8; // 180 макс
	let armorPercentForFormula: number = armorPercent > 0 ? armorPercent : 0;

	// Если молот или булава, то броня игнорится на 25%
	if (isHammer) armorPercentForFormula *= 0.75;

	// Снижение на проценты защиты
	damageMod *= 1 - armorPercentForFormula;

	if (event.isPowerAttack && isPowerAttackMult) {
		damageMod *= isPowerAttackMult;
	}

	if (event.isBashAttack && isBashAttackMult) {
		damageMod *= isBashAttackMult;
	}

	/*
	// Расчёт перков
	const calcPerks = false;

	// TODO: optimize
	if (calcPerks && (weaponType === 'other' || weaponType === 'hammer')) {
		const targetId = getSelfId(mp, agressor.desc);
		const rec = mp.lookupEspmRecordById(targetId).record;
		const prkr = rec?.fields.filter((x) => x.type === 'PRKR').map((x) => x.data);

		try {
			prkr?.forEach((prkrItem) => {
				const perkId = uint32(prkrItem.buffer, 0);
				const effectData = getPerkEffectData(mp, perkId);

				if (!effectData) return;

				effectData.forEach((eff) => {
					if (!eff || !eff.conditionFunction) return;

					// Mod Attack Damage 0x23
					if (eff.effectType !== 0x23 || eff.functionType !== EffectFunctionType.MultiplyValue || !eff.effectValue) {
						return;
					}

					const conditionResult = eff.conditionFunction(weapon.baseId);

					if (!conditionResult) return;

					damageMod *= eff.effectValue;
					// console.log('perk multiply', eff.effectValue);
				});
			});
		} catch (error) {
			console.log('Perk effect ERROR', error);
		}
	}

	*/
	// const isBlocking = mp.get(pcFormId, 'isBlocking') ?? false;

	if (event.isHitBlocked) {
		// Максимум блок в игре - 25%
		const shieldValue: number = mp.get<number>(event.target, 'shieldValue') ?? 0;
		const blockPercent = (shieldValue / 36) * 25; // Максимум щита - 36

		console.log(`[BP] ${blockPercent}`);

		damageMod *= 1 - blockPercent * 0.01;
	}

	damageMod = Number(damageMod.toFixed(3));

	console.log('[HIT]', damageMod);

	const avName = 'health';
	// const agressorDead = av.getCurrent(event.agressor, avName) <= 0;
	// if (damageMod < 0 && agressorDead) {
	//   console.log("Dead characters can't hit");
	//   return;
	// }

	const damage = av.get(event.target, avName, 'damage');
	const newDamageModValue = damage + damageMod;

	// TODO: optimize
	// av.set(event.target, avName, 'damage', newDamageModValue); 35ms
	av.set(event.target, avName, 'damage', newDamageModValue);

	// TODO: optimize
	// const wouldDie = av.getMaximum(event.target, avName) + newDamageModValue <= 0; 15ms
	const wouldDie = av.getMaximum(event.target, avName) + newDamageModValue <= 0;

	if (wouldDie && !isDead && mp.onDeath) mp.onDeath(event.target, agressorId);
};

export const register = (mp: Mp): void => {
	mp.makeEventSource('_onHit', new FunctionInfo(onHit).getText({ isHitStatic: false }));

	mp._onHit = (pcFormId: number, event: HitEvent) => {
		const start = Date.now();

		if (!pcFormId) return console.log('Plz reconnect');

		if (event.target === 0x14) {
			event.target = pcFormId;
		}
		if (event.agressor === 0x14) {
			event.agressor = pcFormId;
		}

		const target: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.target) };
		const agressor: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.agressor) };

		const isDead = mp.get<boolean>(event.target, 'isDead') ?? false;
		if (isDead) {
			hitHandle(mp, event, target, agressor);
			return logExecuteTime(start, '_onHit');
		}

		// Check safe zone
		if (!mp.get(event.target, 'isInSafeLocation') && !mp.get(event.agressor, 'isInSafeLocation')) {
			hitSync(mp, pcFormId, event, target, agressor, isDead);
		}

		hitHandle(mp, event, target, agressor);

		logExecuteTime(start, '_onHit');
	};
};
