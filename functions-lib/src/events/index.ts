import { getForm } from '../papyrus/game';
import { getBaseObjectIdById } from '../papyrus/objectReference';
import { actorValues } from '../properties/actor/actorValues/attributes';
import { skillList } from '../properties/actor/actorValues/skillList';
import { Mp, PapyrusObject } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';
import {
	onAnimationEvent,
	onCellChange,
	onCurrentCrosshairChange,
	onEffectStart,
	onEquip,
	onHit,
	onInput,
	onLoad,
	onUiMenuToggle,
} from './functions';
import * as empty from './empty';
import { getFlags } from '../papyrus/activeMagicEffect';
import { getServerOptions, getServerOptionsValue } from '../papyrus/game/server-options';
import { getEquipment } from '../papyrus/actor/equip';
import * as weapon from '../papyrus/weapon';
import * as position from '../papyrus/objectReference/position';
import { WeaponType } from '../papyrus/weapon/type';
import { getSelfId, getWeight } from '../papyrus/form';
import { float32, uint16, uint32 } from '../utils/helper';
import { Ctx } from '../types/ctx';
import { evalClient } from '../properties/eval';
import { getPerkEffectData } from '../papyrus/perk';
import { EffectFunctionType } from '../papyrus/perk/type';
import * as effectShader from '../papyrus/effectShader';
import * as potion from '../papyrus/potion';
import * as magicEffect from '../papyrus/magicEffect';
import { getObjectArray } from '../utils/papyrusArgs';

const getAttrFromRace = (mp: Mp, pcFormId: number): [number, number, number] => {
	const defaultReturn: [number, number, number] = [100, 100, 100];
	try {
		const selfId = mp.getIdFromDesc(mp.get(pcFormId, 'baseDesc'));
		const rec = mp.lookupEspmRecordById(selfId).record;
		if (!rec) return defaultReturn;

		const acbs = rec.fields.find((x) => x.type === 'ACBS')?.data;
		const magickaOffset = acbs ? uint16(acbs.buffer, 4) : 0;
		const staminaOffset = acbs ? uint16(acbs.buffer, 6) : 0;
		const level = acbs ? uint16(acbs.buffer, 8) : 0;
		const healthOffset = acbs ? uint16(acbs.buffer, 20) : 0;

		let raceId: number = 0;

		if (pcFormId >= 0xff000000) {
			try {
				const appearance = mp.get(pcFormId, 'appearance');
				raceId = appearance?.raceId ?? 0;
			} catch (error) {}
		}

		if (raceId === 0) {
			const rnam = rec.fields.find((x) => x.type === 'RNAM')?.data;
			if (!rnam) return defaultReturn;

			raceId = uint32(rnam.buffer, 0);
		}

		const espmRecord = mp.lookupEspmRecordById(raceId);
		const d = espmRecord.record?.fields.find((x) => x.type === 'DATA')?.data;
		if (d) {
			const health = float32(d.buffer, 36);
			const magicka = float32(d.buffer, 40);
			const stamina = float32(d.buffer, 44);
			return [health + healthOffset, magicka + magickaOffset, stamina + staminaOffset];
		}
		return defaultReturn;
	} catch (err) {
		console.log('[ERROR] getAttrFromRace', err);
		return defaultReturn;
	}
};

const initAVFromRace = (mp: Mp, pcFormId: number) => {
	if (mp.get(pcFormId, 'isDead') !== undefined) return;

	const baseId = getBaseObjectIdById(mp, null, [pcFormId]);

	if (!mp.get(pcFormId, 'spawnPointPosition')) {
		mp.set(pcFormId, 'spawnPointPosition', getServerOptionsValue(mp, ['SpawnPointPosition']));
		mp.set(pcFormId, 'spawnPointAngle', getServerOptionsValue(mp, ['SpawnPointAngle']));
		mp.set(pcFormId, 'spawnPointWorldOrCellDesc', getServerOptionsValue(mp, ['SpawnPointWorldOrCellDesc']));

		const timeById: { id: number; time: number }[] =
			getServerOptionsValue(mp, ['spawnTimeById'])?.map((x: string) => {
				const xParse = x.split(':');
				if (xParse.length != 2) return;
				return {
					id: +xParse[0],
					time: +xParse[1],
				};
			}) ?? [];
		const refTime = timeById.find((x) => x.id === pcFormId)?.time;
		const baseTime = timeById.find((x) => x.id === baseId)?.time;
		const time =
			refTime ?? baseTime ?? getServerOptionsValue(mp, [baseId === 7 ? 'SpawnTimeToRespawn' : 'SpawnTimeToRespawnNPC']);

		mp.set(pcFormId, 'spawnTimeToRespawn', time);
	}

	Object.keys(skillList).forEach((avName) => {
		mp.set(pcFormId, `av${avName}`, mp.get(pcFormId, `av${avName}`) ?? 1);
		mp.set(pcFormId, `av${avName}Exp`, mp.get(pcFormId, `av${avName}Exp`) ?? 0);
	});

	mp.set(pcFormId, `avspeedmult`, mp.get(pcFormId, `avspeedmult`) ?? 100);
	mp.set(pcFormId, `avweaponspeedmult`, mp.get(pcFormId, `avweaponspeedmult`) ?? 1);

	const [health, magicka, stamina] = getAttrFromRace(mp, pcFormId);
	const {
		AVhealrate: healrate,
		AVhealratemult: healratemult,
		AVstaminarate: staminarate,
		AVstaminaratemult: staminaratemult,
		AVmagickarate: magickarate,
		AVmagickaratemult: magickaratemult,
	} = getServerOptions(mp);

	actorValues.setDefaults(
		pcFormId,
		{ force: true },
		{
			health,
			magicka,
			stamina,
			healrate,
			healratemult,
			staminarate,
			staminaratemult,
			magickarate,
			magickaratemult,
		}
	);
};

const logExecuteTime = (startTime: number, eventName: string) => {
	if (Date.now() - startTime > 10) {
		console.log(`Event ${eventName}: `, Date.now() - startTime);
	}
};
export const throwOrInit = (mp: Mp, id: number) => {
	if (id < 0x5000000 && mp.get(id, 'worldOrCellDesc') !== '0') {
		mp.set(id, 'pos', [-99_999, -99_999, -99_999]);
		mp.set(id, 'isDead', true);
		try {
			actorValues.set(id, 'health', 'base', 0);
		} catch (err) {
			console.log('[ERROR] actorValues.set', err);
		}
		try {
			mp.set(id, 'isDisabled', true);
		} catch {}
		mp.set(id, 'worldOrCellDesc', '0');
	} else if (!mp.get(id, 'spawnPointPosition')) {
		try {
			initAVFromRace(mp, id);
		} catch (err) {
			console.log('[ERROR] initAVFromRace', err);
		}
	}
};

export const register = (mp: Mp): void => {
	mp.makeEventSource('_onLoadGame', new FunctionInfo(onLoad).body);

	mp['_onLoadGame'] = (pcFormId: number) => {
		const start = Date.now();
		console.log('_onLoadGame', pcFormId);
		if (!pcFormId) return console.log('Plz reconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };

		const func = (ctx: Ctx) => {
			ctx.sp.once('update', () => {
				const notify = (msg: string) => {
					const src: string[] = [];
					const countRegex = /(\d+)/;
					const countRemoveRegex = /[(].+[)]$/gm;
					const typeRemoveRegex = /^[+-]\s/gm;
					const getType = (msg: string) => {
						if (msg.startsWith('+')) return 'additem';
						if (msg.startsWith('-')) return 'deleteitem';
						return 'default';
					};
					const type = getType(msg);
					const match = msg.match(countRegex) ?? [];
					const count = +match[0];
					const message = msg.replace(countRemoveRegex, '').replace(typeRemoveRegex, '');

					const data = { message, type, count };
					src.push(`
          window.storage.dispatch({
            type: 'COMMAND',
            data: {
              commandType: 'INFOBAR_ADD_MESSAGE',
              alter: ['${JSON.stringify(data)}']
            }
          })
          `);
					ctx.sp.browser.executeJavaScript(src.join('\n'));
				};
				ctx.sp.Debug.notification = notify;
			});
		};
		evalClient(mp, pcFormId, new FunctionInfo(func).getText({}), true);

		mp.set(pcFormId, 'browserVisible', true);
		mp.set(pcFormId, 'browserModal', false);

		mp.callPapyrusFunction('global', 'GM_Main', '_OnLoadGame', null, [ac]);

		initAVFromRace(mp, pcFormId);
		const neighbors = mp.get(pcFormId, 'neighbors');
		neighbors
			.filter((n) => mp.get(n, 'type') === 'MpActor')
			.forEach((id) => {
				throwOrInit(mp, id);
			});

		logExecuteTime(start, '_onLoadGame');
	};

	mp['onActivate'] = (target: number, pcFormId: number) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		const casterRef: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		const targetRef: PapyrusObject = { type: 'form', desc: mp.getDescFromId(target) };

		try {
			if (mp.get(target, 'blockActivationState')) return false;
		} catch {}
		const actiovation1 = mp.callPapyrusFunction('global', 'GM_Main', '_onActivate', null, [targetRef, casterRef]);

		logExecuteTime(start, 'onActivate');

		if (!actiovation1) {
			return false;
		}

		return true;
	};

	mp.makeEventSource('_onCellChange', new FunctionInfo(onCellChange).body);

	mp['_onCellChange'] = (pcFormId: number, event: any) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		const prevCell: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.prevCell) };
		const currentCell: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.currentCell) };

		const neighbors = mp.get(pcFormId, 'neighbors');
		neighbors
			.filter((n) => mp.get(n, 'type') === 'MpActor')
			.forEach((id) => {
				throwOrInit(mp, id);
			});

		mp.set(pcFormId, 'cellDesc', currentCell.desc);
		mp.callPapyrusFunction('global', 'GM_Main', '_onCellChange', null, [ac, prevCell, currentCell]);

		logExecuteTime(start, '_onCellChange');
	};

	mp.makeEventSource('_onHit', new FunctionInfo(onHit).getText({ isHitStatic: false }));

	mp['_onHit'] = (pcFormId: number, event: any) => {
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

		let damageMod = getServerOptionsValue(mp, ['HitDamageMod']);

		const eq = getEquipment(mp, event.agressor);
		const eq1 = getEquipment(mp, event.target);
		const weap = eq?.inv.entries.filter((x) => x.type === 'WEAP');
		const arm = eq1?.inv.entries.filter((x) => x.type === 'ARMO');
		let isHammer = false;

		// TODO: нужно учитывать оружие в левой руке
		// * BUG: оружие в левой руке не учитывается в свойстве equipment
		if (weap && weap.length > 0 && !event.isBashAttack) {
			const f = getForm(mp, null, [weap[0].baseId]);
			if (f) {
				const baseDmg = weapon.getBaseDamage(mp, f);
				baseDmg && (damageMod = baseDmg * -1);
				const type = weapon.getWeaponType(mp, f);

				// определяю что оружие это булава
				if (type === WeaponType.BattleaxesANDWarhammers || type === WeaponType.Maces) isHammer = true;
			}
		}

		// класс брони противника
		if (arm && arm.length > 0) {
			arm.forEach((x) => {
				const start = Date.now();
				if (!x.baseArmor) return;
				// если оружение это булава, то броню уменьшаю на 25%
				if (isHammer) x.baseArmor * 0.75;

				// снижаю урон от кол-ва брони (12 брони снизит урон на 1.2% или 0.012)
				const percent = 1 - x.baseArmor / 1000;
				damageMod *= percent;
			});
		}

		if (event.isPowerAttack) {
			damageMod *= getServerOptionsValue(mp, ['isPowerAttackMult']);
			console.log('isPowerAttack');
		}
		if (event.isBashAttack) {
			damageMod *= getServerOptionsValue(mp, ['isBashAttackMult']);
			console.log('isBashAttack');
		}

		if (event.isHitBlocked) {
			damageMod *= 0.5;
		}

		const targetId = getSelfId(mp, agressor.desc);
		const rec = mp.lookupEspmRecordById(targetId).record;
		const prkr = rec?.fields.filter((x) => x.type === 'PRKR').map((x) => x.data);
		try {
			prkr?.forEach((p) => {
				const perkId = uint32(p.buffer, 0);
				const effectData = getPerkEffectData(mp, perkId);
				effectData?.forEach((eff) => {
					if (!eff) return;
					if (eff.effectType === 0x23 && eff.functionType === EffectFunctionType.MultiplyValue) {
						if (!eff.conditionFunction || !weap || weap.length === 0) return;
						const conditionResult = eff.conditionFunction(weap[0].baseId);
						if (!conditionResult) return;
						if (eff.effectValue) {
							damageMod *= eff.effectValue;
						}
					}
				});
			});
		} catch (error) {
			console.log('Perk effect ERROR', error);
		}

		const avName = 'health';

		const damage = actorValues.get(event.target, avName, 'damage');
		const newDamageModValue = damage + damageMod;
		actorValues.set(event.target, avName, 'damage', newDamageModValue);

		const wouldDie = actorValues.getMaximum(event.target, avName) + newDamageModValue <= 0;

		if (wouldDie && !mp.get(event.target, 'isDead')) {
			mp.onDeath && mp.onDeath(event.target);
		}

		mp.callPapyrusFunction('global', 'GM_Main', '_onHit', null, [
			target,
			agressor,
			event.isPowerAttack,
			event.isSneakAttack,
			event.isBashAttack,
			event.isHitBlocked,
		]);

		logExecuteTime(start, '_onHit');
	};

	mp['onDeath'] = (pcFormId: number) => {
		const start = Date.now();
		console.log(`${pcFormId.toString(16)} died`);
		mp.set(pcFormId, 'isDead', true);
		mp.callPapyrusFunction('global', 'GM_Main', '_onDeath', null, [{ type: 'form', desc: mp.getDescFromId(pcFormId) }]);
		logExecuteTime(start, 'onDeath');
	};

	mp.makeEventSource('_onHitStatic', new FunctionInfo(onHit).getText({ isHitStatic: true }));

	mp['_onHitStatic'] = (pcFormId: number, event: any) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		if (event.target === 0x14) {
			event.target = pcFormId;
		}
		if (event.agressor === 0x14) {
			event.agressor = pcFormId;
		}

		const target: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.target) };
		const agressor: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.agressor) };

		mp.callPapyrusFunction('global', 'GM_Main', '_onHitStatic', null, [
			target,
			agressor,
			event.isPowerAttack,
			event.isSneakAttack,
			event.isBashAttack,
			event.isHitBlocked,
		]);
		logExecuteTime(start, '_onHitStatic');
	};

	mp.makeEventSource('_onEquip', new FunctionInfo(onEquip).tryCatch());

	mp['_onEquip'] = (pcFormId: number, event: { actor: number; target: number; player: number }) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		if (event.actor === 0x14) {
			event.actor = pcFormId;
		}

		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.actor) };
		const target: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.target) };

		if (getServerOptionsValue(mp, ['enableALCHeffect'])) {
			const rec = mp.lookupEspmRecordById(event.target).record;
			if (rec && rec?.type === 'ALCH') {
				const mges = getObjectArray([potion.getMagicEffects(mp, target)], 0);
				mges.forEach((m) => {
					const id = mp.getIdFromDesc(m.desc);
					const f = getForm(mp, null, [id]);
					if (!f) return;
					const hitShader = magicEffect.getHitShader(mp, f);
					if (!hitShader) return;
					effectShader.play(mp, hitShader, [ac, 5]);
				});
			}
		}

		mp.callPapyrusFunction('global', 'GM_Main', '_onEquip', null, [ac, target]);
		logExecuteTime(start, '_onEquip');
	};

	mp['onUiEvent'] = (pcFormId: number, uiEvent: Record<string, unknown>) => {
		const start = Date.now();
		// Server sometimes pass 0, I think serverside hot reload breaks something
		if (!pcFormId) return console.log('Plz reconnect');

		switch (uiEvent.type) {
			case 'cef::chat:send': {
				const text = uiEvent.data;
				if (typeof text === 'string') {
					const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
					mp.callPapyrusFunction('global', 'GM_Main', '_OnChatInput', null, [ac, text]);
				}
			}
		}
		logExecuteTime(start, 'onUiEvent');
	};

	mp.makeEventSource('_onInput', new FunctionInfo(onInput).tryCatch());

	mp['_onInput'] = (pcFormId: number, keycodes: number[]) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		mp.callPapyrusFunction('global', 'GM_Main', '_OnInput', null, [ac, keycodes]);

		const keybindingBrowserSetVisible = getServerOptionsValue(mp, ['keybindingBrowserSetVisible']);
		const keybindingBrowserSetFocused = getServerOptionsValue(mp, ['keybindingBrowserSetFocused']);
		if (!mp.get(pcFormId, 'browserModal')) {
			if (keycodes.length === 1 && keycodes[0] === keybindingBrowserSetVisible) {
				mp.callPapyrusFunction('global', 'M', 'BrowserSetVisible', null, [
					ac,
					!mp.get(pcFormId, 'browserVisible') ?? true,
				]);
			}
			if (keycodes.length === 1 && keycodes[0] === keybindingBrowserSetFocused) {
				mp.callPapyrusFunction('global', 'M', 'BrowserSetFocused', null, [
					ac,
					!mp.get(pcFormId, 'browserFocused') ?? true,
				]);
			}
		}

		let command = '';
		if (keycodes.includes(56) && keycodes.includes(0x02)) {
			command = getServerOptionsValue(mp, ['command1']);
		} else if (keycodes.includes(56) && keycodes.includes(0x03)) {
			command = getServerOptionsValue(mp, ['command2']);
		} else if (keycodes.includes(56) && keycodes.includes(0x04)) {
			command = getServerOptionsValue(mp, ['command3']);
		} else if (keycodes.includes(56) && keycodes.includes(0x05)) {
			command = getServerOptionsValue(mp, ['command4']);
		} else if (keycodes.includes(56) && keycodes.includes(0x06)) {
			command = getServerOptionsValue(mp, ['command5']);
		} else if (keycodes.includes(56) && keycodes.includes(0x07)) {
			command = getServerOptionsValue(mp, ['command6']);
		} else if (keycodes.includes(56) && keycodes.includes(0x08)) {
			command = getServerOptionsValue(mp, ['command7']);
		} else if (keycodes.includes(56) && keycodes.includes(0x09)) {
			command = getServerOptionsValue(mp, ['command8']);
		} else if (keycodes.includes(56) && keycodes.includes(0x0a)) {
			command = getServerOptionsValue(mp, ['command9']);
		} else if (keycodes.includes(56) && keycodes.includes(0x0b)) {
			command = getServerOptionsValue(mp, ['command0']);
		}
		if (command) {
			mp.callPapyrusFunction('global', 'GM_Main', '_OnChatInput', null, [ac, command]);
		}

		if (keycodes.length === 1 && keycodes[0] === 0x04) {
		}
		logExecuteTime(start, '_onInput');
	};

	mp.makeEventSource('_onAnimationEvent', new FunctionInfo(onAnimationEvent).tryCatch());

	mp['_onAnimationEvent'] = (pcFormId: number, animationEvent: { current: string; previous: string }) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };

		const isFall = ['JumpFallDirectional', 'JumpFall'].includes(animationEvent.current);
		const isJump = ['JumpDirectionalStart', 'JumpStandingStart'].includes(animationEvent.current);
		const isJumpLand = animationEvent.current.startsWith('JumpLand');
		const isAttack = animationEvent.current.toLowerCase().startsWith('attack');
		const isAttackPower = animationEvent.current.toLowerCase().startsWith('attackPower');

		if (animationEvent.current === 'blockStart') {
			mp.set(pcFormId, 'isBlocking', true);
		} else if (animationEvent.current === 'blockStop') {
			mp.set(pcFormId, 'isBlocking', false);
		}

		const stamina = 'stamina';

		if (isAttack) {
			const eq = getEquipment(mp, pcFormId);
			const weap = eq?.inv.entries.filter((x) => x.type === 'WEAP');

			let weapWeight = null;
			if (weap && weap.length > 0) {
				const f = getForm(mp, null, [weap[0].baseId]);
				if (f) {
					weapWeight = getWeight(mp, f);
				}
			}

			let hitStaminaReduce = 0;
			hitStaminaReduce = weapWeight ?? getServerOptionsValue(mp, ['HitStaminaReduce']);

			if (isAttackPower) {
				const powerAttackStaminaReduce = weapWeight
					? weapWeight * 2
					: getServerOptionsValue(mp, ['isPowerAttackStaminaReduce']);
				hitStaminaReduce = powerAttackStaminaReduce - hitStaminaReduce;
			}

			if (hitStaminaReduce) {
				const damage = actorValues.get(pcFormId, stamina, 'damage');
				actorValues.set(pcFormId, stamina, 'damage', damage - hitStaminaReduce);
			}
		}

		if (isJump) {
			const damage = actorValues.get(pcFormId, stamina, 'damage');
			actorValues.set(pcFormId, stamina, 'damage', damage - 5);
		}

		if (isFall || isJump) {
			mp.set(pcFormId, 'startZCoord', position.getPositionZ(mp, ac));
		}

		if (isJumpLand) {
			const diff = mp.get(pcFormId, 'startZCoord') - position.getPositionZ(mp, ac);
			if (diff > 300) {
				const damage = actorValues.get(pcFormId, 'health', 'damage');
				actorValues.set(pcFormId, 'health', 'damage', damage - diff / 100);
			}
		}

		mp.set(pcFormId, 'lastAnimation', animationEvent.current);
		mp.callPapyrusFunction('global', 'GM_Main', '_onAnimationEvent', null, [
			ac,
			animationEvent.current,
			animationEvent.previous,
		]);
		logExecuteTime(start, '_onAnimationEvent');
	};

	mp.makeEventSource('_onUiMenuToggle', new FunctionInfo(onUiMenuToggle).tryCatch());

	mp['_onUiMenuToggle'] = (pcFormId: number, menuOpen: boolean) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');
		mp.set(pcFormId, 'uiOpened', menuOpen);
		mp.set(pcFormId, 'browserVisible', !menuOpen);
		logExecuteTime(start, '_onUiMenuToggle');
	};

	mp.makeEventSource('_onEffectStart', new FunctionInfo(onEffectStart).tryCatch());

	mp['_onEffectStart'] = (pcFormId: number, event: any) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		if (event.target === 0x14) {
			event.target = pcFormId;
		}
		if (event.caster === 0x14) {
			event.caster = pcFormId;
		}

		const caster: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.caster) };
		const target: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.target) };
		const effect: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.effect) };

		const isDetrimental = getFlags(mp, null, [event.effect]).includes(0x4);

		mp.callPapyrusFunction('global', 'GM_Main', '_onEffectStart', null, [
			caster,
			target,
			effect,
			event.mag * (isDetrimental ? -1 : 1),
		]);
		mp.callPapyrusFunction('global', 'GM_Main', '_onEffectStart2', null, [
			caster,
			target,
			event.effect,
			event.mag * (isDetrimental ? -1 : 1),
		]);
		logExecuteTime(start, '_onEffectStart');
	};

	mp.makeEventSource('_onCurrentCrosshairChange', new FunctionInfo(onCurrentCrosshairChange).tryCatch());

	mp['_onCurrentCrosshairChange'] = (pcFormId: number, event: any) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		const crosshairRefId = event.CrosshairRefId;

		const form = crosshairRefId && getForm(mp, null, [crosshairRefId]);
		mp.set(pcFormId, 'CurrentCrosshairRef', form ? crosshairRefId : null);
		mp.callPapyrusFunction('global', 'GM_Main', '_onCurrentCrosshairChange', null, [ac, form]);
		logExecuteTime(start, '_onCurrentCrosshairChange');
	};

	empty.register(mp);
};
