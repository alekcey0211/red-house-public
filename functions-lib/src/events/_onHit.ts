import { serverOptionProvider } from '../..';
import { getEquipment } from '../papyrus/actor/equip';
import { getSelfId } from '../papyrus/form';
import { getPerkEffectData } from '../papyrus/perk';
import { EffectFunctionType } from '../papyrus/perk/type';
import { getRaceUnarmedDamage } from '../papyrus/race';
import { WeaponType } from '../papyrus/weapon/type';
import { EspmLookupResult, Mp, PapyrusObject } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';
import { uint32 } from '../utils/helper';
import { onHit } from './functions';
import { actorValues as av } from '../properties/actor/actorValues/attributes';
import * as p from '../modules';
import { logExecuteTime } from './shared';
import { HitEvent } from '../types/event';

const hitHandle = (mp: Mp, event: any, target: PapyrusObject, agressor: PapyrusObject) => {
	mp.callPapyrusFunction('global', 'GM_Main', '_onHit', null, [
		target,
		agressor,
		event.isPowerAttack,
		event.isSneakAttack,
		event.isBashAttack,
		event.isHitBlocked,
	]);

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
};

const hitSync = (
	mp: Mp,
	pcFormId: number,
	event: any,
	target: PapyrusObject,
	agressor: PapyrusObject,
	isDead: boolean
) => {
	const { HitDamageMod, isPowerAttackMult, isBashAttackMult } = serverOptionProvider.getServerOptions();

	let damageMod: number = HitDamageMod;
	const raceId = mp.get<number>(pcFormId, 'race');
	if (raceId) {
		const espmRecord = mp.lookupEspmRecordById(raceId) as EspmLookupResult;
		const unarmedDamage = getRaceUnarmedDamage(espmRecord);
		if (unarmedDamage) damageMod = -unarmedDamage;
	}

	// TODO: optimize
	// getEquipment(mp, event.agressor); 13
	const eq = getEquipment(mp, event.agressor);
	const eq1 = getEquipment(mp, event.target);

	const weap = eq?.inv.entries.filter((x) => x.type === 'WEAP');
	const arm = eq1?.inv.entries.filter((x) => x.type === 'ARMO');
	let isHammer = false;

	// TODO: нужно учитывать оружие в левой руке
	// * BUG: оружие в левой руке не учитывается в свойстве equipment
	if (weap && weap.length > 0) {
		const baseDmg = weap[0].baseDamage;
		if (baseDmg) damageMod = baseDmg * -1;
		const type = weap[0].weaponType;
		if (type === WeaponType.BattleaxesANDWarhammers || type === WeaponType.Maces) isHammer = true;
	}

	// класс брони противника
	if (arm && arm.length > 0) {
		arm.forEach((x) => {
			if (!x.baseArmor) return;
			// если оружение это булава, то броню уменьшаю на 25%
			if (isHammer) x.baseArmor *= 0.75;

			// снижаю урон от кол-ва брони (12 брони снизит урон на 1.2% или 0.012)
			const percent = 1 - x.baseArmor / 1000;
			damageMod *= percent;
		});
	}

	if (event.isPowerAttack) {
		damageMod *= isPowerAttackMult;
	}
	if (event.isBashAttack) {
		damageMod *= isBashAttackMult;
	}
	const calcPerks = false;

	// TODO: optimize
	if (calcPerks) {
		const targetId = getSelfId(mp, agressor.desc);
		const rec = mp.lookupEspmRecordById(targetId).record;
		const prkr = rec?.fields.filter((x) => x.type === 'PRKR').map((x) => x.data);
		try {
			prkr?.forEach((prkrItem) => {
				const perkId = uint32(prkrItem.buffer, 0);
				const effectData = getPerkEffectData(mp, perkId);
				effectData?.forEach((eff) => {
					if (!eff) return;
					// Mod Attack Damage 0x23
					if (eff.effectType === 0x23 && eff.functionType === EffectFunctionType.MultiplyValue) {
						if (!eff.conditionFunction || !weap || weap.length === 0) return;
						const conditionResult = eff.conditionFunction(weap[0].baseId);
						if (!conditionResult) return;
						if (eff.effectValue) {
							damageMod *= eff.effectValue;
							// console.log('perk multiply', eff.effectValue);
						}
					}
				});
			});
		} catch (error) {
			console.log('Perk effect ERROR', error);
		}
	}

	// const isBlocking = mp.get(pcFormId, 'isBlocking') ?? false;
	if (event.isHitBlocked) {
		damageMod *= 0.5;
	}

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

	if (wouldDie && !isDead) {
		if (mp.onDeath) mp.onDeath(event.target, event.agressor);
	}
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
